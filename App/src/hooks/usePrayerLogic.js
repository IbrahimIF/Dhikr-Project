import { useState, useEffect, useRef } from 'react';
import adhanSound from '../assets/Adhan.mp3';
import { toMinutes, formatTimeInZone } from '../utils/timeUtils';

const lightBackgrounds = new Set(['isha', 'asr']);

const prayerColors = {
  fajr: '#111822',
  dhuhr: '#123933',
  asr: '#ab2421',
  magrib: '#136dac',
  isha: '#d5e2ef'
};

function extractCityFromTimezone(tz) {
  const parts = tz.split('/');
  return parts[parts.length - 1].replaceAll('_', ' ');
}

export function usePrayerLogic(selectedTimezone = 'Europe/London') {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [displayTime, setDisplayTime] = useState('');
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [activePrayer, setActivePrayer] = useState(null);

  const previousPrayer = useRef(null);
  const hasMounted = useRef(false);

  /* ---------------- CLOCK ---------------- */

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now);
      setDisplayTime(formatTimeInZone(now, selectedTimezone));
    };

    updateClock();
    const timerId = setInterval(updateClock, 1000);
    return () => clearInterval(timerId);
  }, [selectedTimezone]);

  /* ---------------- FETCH PRAYER TIMES ---------------- */

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      try {
        if (selectedTimezone === 'Europe/London') {
          // Use East London API
          const response = await fetch(
            'https://www.londonprayertimes.com/api/times/?format=json&key=8fa3f321-6d24-4eee-b1b1-e5b518b8170c&24hours=true'
          );
          const data = await response.json();

          setPrayerTimes({
            fajr: data.fajr,
            dhuhr: data.dhuhr,
            asr: data.asr,
            magrib: data.magrib,
            isha: data.isha
          });

        } else {
          // Use Aladhan API (Global)
          const city = extractCityFromTimezone(selectedTimezone);

          const response = await fetch(
            `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=&method=2`
          );

          const data = await response.json();

          const timings = data.data.timings;

          setPrayerTimes({
            fajr: timings.Fajr,
            dhuhr: timings.Dhuhr,
            asr: timings.Asr,
            magrib: timings.Maghrib,
            isha: timings.Isha
          });
        }
      } catch (error) {
        console.error('Error fetching prayer times:', error);
      }
    };

    fetchPrayerTimes();
  }, [selectedTimezone]);

  /* ---------------- ACTIVE PRAYER ---------------- */

  useEffect(() => {
    if (!prayerTimes) return;

    const formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: selectedTimezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

    const parts = formatter.formatToParts(currentTime);

    const hour = parseInt(parts.find(p => p.type === 'hour').value, 10);
    const minute = parseInt(parts.find(p => p.type === 'minute').value, 10);

    const nowMinutes = hour * 60 + minute;

    const fajr = toMinutes(prayerTimes.fajr);
    const dhuhr = toMinutes(prayerTimes.dhuhr);
    const asr = toMinutes(prayerTimes.asr);
    const magrib = toMinutes(prayerTimes.magrib);
    const isha = toMinutes(prayerTimes.isha);

    let newActivePrayer = null;

    if (nowMinutes >= fajr && nowMinutes < dhuhr) newActivePrayer = 'fajr';
    else if (nowMinutes >= dhuhr && nowMinutes < asr) newActivePrayer = 'dhuhr';
    else if (nowMinutes >= asr && nowMinutes < magrib) newActivePrayer = 'asr';
    else if (nowMinutes >= magrib && nowMinutes < isha) newActivePrayer = 'magrib';
    else newActivePrayer = 'isha';

    setActivePrayer(newActivePrayer);

  }, [currentTime, prayerTimes, selectedTimezone]);

  /* ---------------- BACKGROUND + ADHAN ---------------- */

  useEffect(() => {
    if (!activePrayer) return;

    const isLight = lightBackgrounds.has(activePrayer);
    document.body.classList.toggle('light-prayer', isLight);

    if (!hasMounted.current) {
      document.body.style.backgroundColor = prayerColors[activePrayer];
      previousPrayer.current = activePrayer;
      hasMounted.current = true;
      return;
    }

    if (previousPrayer.current !== activePrayer) {
      document.body.style.backgroundColor = prayerColors[activePrayer];

      const audio = new Audio(adhanSound);
      audio.play().catch(() => {});

      previousPrayer.current = activePrayer;
    }

  }, [activePrayer]);

  return { displayTime, prayerTimes, activePrayer };
}