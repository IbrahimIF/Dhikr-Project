import { useState } from 'react';
import '../styles/prayer.css';

function PrayerCard({ prayerTimes }) {
  const [count, setCount] = useState(0);

  return (
    <div className="card">
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
  );
}

export default PrayerCard;