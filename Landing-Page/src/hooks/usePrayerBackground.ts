import { useState, useEffect, useRef } from 'react';

export const prayerColors: Record<string, string> = {
  fajr: '#111822',
  dhuhr: '#123933',
  asr: '#ab2421',
  magrib: '#136dac',
  isha: '#d5e2ef',
};

const lightBackgrounds = new Set(['isha', 'asr']);

function toMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

interface PrayerTimes {
  fajr: string;
  dhuhr: string;
  asr: string;
  magrib: string;
  isha: string;
}

export function usePrayerBackground() {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activePrayer, setActivePrayer] = useState<string | null>(null);
  const hasMounted = useRef(false);
  const previousPrayer = useRef<string | null>(null);

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

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    if (prayerTimes) {
      const nowStr = currentTime.getHours() * 60 + currentTime.getMinutes();
      let newActivePrayer: string | null = null;

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

  useEffect(() => {
    if (!activePrayer) return;
    const isLight = lightBackgrounds.has(activePrayer);
    document.body.classList.toggle('light-prayer', isLight);
    document.body.classList.toggle('dark-text', isLight);

    if (!hasMounted.current) {
      document.body.style.backgroundColor = prayerColors[activePrayer];
      previousPrayer.current = activePrayer;
      hasMounted.current = true;
      return;
    }

    if (previousPrayer.current !== activePrayer) {
      document.body.style.backgroundColor = prayerColors[activePrayer];
      previousPrayer.current = activePrayer;
    }
  }, [activePrayer]);

  return { activePrayer, prayerTimes };
}
