import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [currentTime, setCurrentTime] = useState(new Date());
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [activePrayer, setActivePrayer] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const prayerColors = {
    fajr: '#111822',
    dhuhr: '#123933',
    asr: '#ab2421',
    magrib: '#136dac',
    isha: '#d5e2ef'
  };

  function toMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  }

  useEffect(() => {
  const fetchPrayerTimes = async () => {
    try {
      const response = await fetch('https://www.londonprayertimes.com/api/times/?format=json&key=8fa3f321-6d24-4eee-b1b1-e5b518b8170c&24hours=true');
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
      
      // Set dark mode if current time is between Isha and Fajr
      if (nowStr >= isha || nowStr < fajr) {
        setIsDarkMode(true);
      } else {
        setIsDarkMode(false);
      }
    }
  }, [currentTime, prayerTimes]);



  useEffect(() => {
    if (activePrayer) {
      document.body.style.backgroundColor = prayerColors[activePrayer];
    } 
  }, [activePrayer]);

  return (
    <div className={`container ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="card">
        <h1>Current Time: {currentTime.toLocaleTimeString()}</h1>
        {prayerTimes ? (
        <ul>
          <li>Fajr: {prayerTimes.fajr}</li>
          <li>Dhuhr: {prayerTimes.dhuhr}</li>
          <li>Asr: {prayerTimes.asr}</li>
          <li>magrib: {prayerTimes.magrib}</li>
          <li>Isha: {prayerTimes.isha}</li>
        </ul>
      ) : (
        <p>Loading prayer times...</p>
      )}
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
    </div>
  )
}

export default App
