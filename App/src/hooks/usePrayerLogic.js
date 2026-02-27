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

export function usePrayerLogic(selectedTimezone = 'Europe/London') {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [displayTime, setDisplayTime] = useState('');
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [activePrayer, setActivePrayer] = useState(null);

  const previousPrayer = useRef(null);
  const hasMounted = useRef(false);

  /* ---- CLOCK ---- */
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

  /* ---- FETCH LONDON PRAYER TIMES (DEFAULT) ---- */
  useEffect(() => {
    const fetchLondonPrayerTimes = async () => {
      try {
        const response = await fetch(
          'https://www.londonprayertimes.com/api/times/?format=json&key=8fa3f321-6d24-4eee-b1b1-e5b518b8170c&24hours=true'
        );
        const data = await response.json();
        setPrayerTimes(data);
      } catch (error) {
        console.error('Error fetching prayer times:', error);
      }
    };

    fetchLondonPrayerTimes();
  }, []);

  /* ---- ACTIVE PRAYER LOGIC ---- */
  useEffect(() => {
    if (!prayerTimes) return;

    const now = new Date();
    const minutesNow =
      now.getHours() * 60 + now.getMinutes();

    const fajr = toMinutes(prayerTimes.fajr);
    const dhuhr = toMinutes(prayerTimes.dhuhr);
    const asr = toMinutes(prayerTimes.asr);
    const magrib = toMinutes(prayerTimes.magrib);
    const isha = toMinutes(prayerTimes.isha);

    let newActivePrayer = null;

    if (minutesNow >= fajr && minutesNow < dhuhr) newActivePrayer = 'fajr';
    else if (minutesNow >= dhuhr && minutesNow < asr) newActivePrayer = 'dhuhr';
    else if (minutesNow >= asr && minutesNow < magrib) newActivePrayer = 'asr';
    else if (minutesNow >= magrib && minutesNow < isha) newActivePrayer = 'magrib';
    else newActivePrayer = 'isha';

    setActivePrayer(newActivePrayer);
  }, [currentTime, prayerTimes]);

  /* ---- BACKGROUND + ADHAN ---- */
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