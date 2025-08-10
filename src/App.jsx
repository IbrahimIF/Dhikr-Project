import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [currentTime, setCurrentTime] = useState(new Date());
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [activePrayer, setActivePrayer] = useState(null);

  const prayerColors = {
    fajr: '#111822',
    dhuhr: '#123933',
    asr: '#ab2421',
    maghrib: '#136dac',
    isha: '#d5e2ef'
  };

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
      const nowStr = currentTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  
      let newActivePrayer = null;
  
      if (nowStr >= prayerTimes.fajr && nowStr < prayerTimes.dhuhr) {
        newActivePrayer = 'fajr';
      } else if (nowStr >= prayerTimes.dhuhr && nowStr < prayerTimes.asr) {
        newActivePrayer = 'dhuhr';
      } else if (nowStr >= prayerTimes.asr && nowStr < prayerTimes.maghrib) {
        newActivePrayer = 'asr';
      } else if (nowStr >= prayerTimes.maghrib && nowStr < prayerTimes.isha) {
        newActivePrayer = 'maghrib';
      } else if (nowStr >= prayerTimes.isha && nowStr < prayerTimes.fajr) {
        newActivePrayer = 'isha';
      }
      setActivePrayer(newActivePrayer);
    }
  }, [currentTime, prayerTimes]);



  useEffect(() => {
    if (activePrayer) {
      document.body.style.backgroundColor = prayerColors[activePrayer];
    } 
  }, [activePrayer]);

  return (
    <>
      <div className="card">
        <h1>Current Time: {currentTime.toLocaleTimeString()}</h1>
        {prayerTimes ? (
        <ul>
          <li>Fajr: {prayerTimes.fajr}</li>
          <li>Dhuhr: {prayerTimes.dhuhr}</li>
          <li>Asr: {prayerTimes.asr}</li>
          <li>Maghrib: {prayerTimes.maghrib}</li>
          <li>Isha: {prayerTimes.isha}</li>
        </ul>
      ) : (
        <p>Loading prayer times...</p>
      )}
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
    </>
  )
}

export default App
