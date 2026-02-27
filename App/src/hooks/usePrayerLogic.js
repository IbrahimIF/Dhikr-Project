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
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [activePrayer, setActivePrayer] = useState(null);

  const previousPrayer = useRef(null);
  const hasMounted = useRef(false);

  // Fetch prayer times
  useEffect(() => {
    const fetchPrayerTimes = async () => {
      try {
        const response = await fetch(
          'https://www.londonprayertimes.com/api/times/?format=json&key=8fa3f321-6d24-4eee-b1b1-e5b518b8170c&24hours=true'
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPrayerTimes(data);
      } catch (error) {
        console.error('Error fetching prayer times:', error);
      }
    };

    fetchPrayerTimes();
  }, []);

  // Clock tick
  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  // Determine active prayer
  useEffect(() => {
    if (prayerTimes) {
      const nowStr = currentTime.getHours() * 60 + currentTime.getMinutes();

      let newActivePrayer = null;

      const fajr = toMinutes(prayerTimes.fajr);
      const dhuhr = toMinutes(prayerTimes.dhuhr);
      const asr = toMinutes(prayerTimes.asr);
      const magrib = toMinutes(prayerTimes.magrib);
      const isha = toMinutes(prayerTimes.isha);

      if (nowStr >= fajr && nowStr < dhuhr) {
        newActivePrayer = 'fajr';
      } else if (nowStr >= dhuhr && nowStr < asr) {
        newActivePrayer = 'dhuhr';
      } else if (nowStr >= asr && nowStr < magrib) {
        newActivePrayer = 'asr';
      } else if (nowStr >= magrib && nowStr < isha) {
        newActivePrayer = 'magrib';
      } else if (nowStr >= isha || nowStr < fajr) {
        newActivePrayer = 'isha';
      }

      setActivePrayer(newActivePrayer);
    }
  }, [currentTime, prayerTimes]);

  // Background color + adhan
  useEffect(() => {
    if (!activePrayer) return;

    const isLight = lightBackgrounds.has(activePrayer);
    document.body.classList.toggle('light-prayer', isLight);

    if (!hasMounted.current) {
      document.body.style.backgroundColor = prayerColors[activePrayer];
      document.documentElement.style.setProperty('--scroll-thumb-color', '#ffd900be');
      previousPrayer.current = activePrayer;
      hasMounted.current = true;
      return;
    }

    if (previousPrayer.current !== activePrayer) {
      document.body.style.backgroundColor = prayerColors[activePrayer];
      document.documentElement.style.setProperty('--scroll-thumb-color', '#ffd900be');

      const audio = new Audio(adhanSound);
      audio.play().catch(err => console.log('Audio blocked:', err));

      previousPrayer.current = activePrayer;
    }
  }, [activePrayer]);

  // Formatted time string in the selected timezone
  const displayTime = formatTimeInZone(currentTime, selectedTimezone);

  return { currentTime, displayTime, prayerTimes, activePrayer };
}