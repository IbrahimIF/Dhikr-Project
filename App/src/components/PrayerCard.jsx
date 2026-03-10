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
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <button
          onClick={() => setCount(0)}
          title="Reset counter"
          style={{ opacity: 0.5, fontSize: '1rem', lineHeight: 1, background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default PrayerCard;