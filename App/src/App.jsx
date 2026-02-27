import { useState } from 'react';
import './styles/layout.css';
import archImage from './assets/Arch.png';
import WindowTitleBar from './WindowBar/WindowTitleBar';
import Dropdown from './components/Dropdown';
import PrayerCard from './components/PrayerCard';
import TimezoneSelector from './components/TimezoneSelector';
import { usePrayerLogic } from './hooks/usePrayerLogic';

function App() {
  const [selectedTimezone, setSelectedTimezone] = useState('Europe/London');

  const { displayTime, prayerTimes } =
    usePrayerLogic(selectedTimezone);

  return (
    <div className="container">
      <div className="pattern-overlay" />
      <WindowTitleBar />

      <Dropdown side="left" label="Dua">
        <li className="listitem"><div className="article">Dua Content 1</div></li>
      </Dropdown>

      <Dropdown side="right" label="Dhikr">
        <li className="listitem"><div className="article">Dhikr Content 1</div></li>
      </Dropdown>

      <div className="golden-border">
        <div className="arch-wrapper">
          <img src={archImage} alt="Arch" className="arch-image" />

          <div className="overlay-boxes">
            <div className="overlay-small">
              <h1>{displayTime}</h1>

              <TimezoneSelector
                selectedIana={selectedTimezone}
                onChange={setSelectedTimezone}
              />
            </div>

            <div className="overlay-large">
              <PrayerCard prayerTimes={prayerTimes} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;