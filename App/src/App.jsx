import { useState } from 'react';
import './styles/prayer.css';
import './styles/layout.css';
import archImage from './assets/Arch.png';
import WindowTitleBar from './WindowBar/WindowTitleBar';
import Dropdown from './components/Dropdown';
import PrayerCard from './components/PrayerCard';
import TimezoneSelector from './components/TimezoneSelector';
import { usePrayerLogic } from './hooks/usePrayerLogic';

function App() {
  const [selectedTimezone, setSelectedTimezone] = useState('Europe/London');
  const { currentTime, prayerTimes } = usePrayerLogic(selectedTimezone);

  return (
    <div className="container">
      <div className="pattern-overlay" />
      <WindowTitleBar />

      <Dropdown side="left" label="Dua">
        <li className="listitem" role="listitem">
          <div className="article">Dua Content 1</div>
        </li>
        <li className="listitem" role="listitem">
          <div className="article">Dua Content 2</div>
        </li>
        <li className="listitem" role="listitem">
          <div className="article">More dua content here...</div>
        </li>
      </Dropdown>

      <Dropdown side="right" label="Dhikr">
        <li className="listitem" role="listitem">
          <div className="article">Dhikr Content 1</div>
        </li>
        <li className="listitem" role="listitem">
          <div className="article">Dhikr Content 2</div>
        </li>
        <li className="listitem" role="listitem">
          <div className="article">More dhikr content here...</div>
        </li>
      </Dropdown>

      <div className="golden-border">
        <div className="arch-wrapper">
          <img src={archImage} alt="Arch" className="arch-image" />
          <div className="overlay-boxes" aria-hidden="true">
            <div className="overlay-small">
              <h1>{currentTime.toLocaleTimeString()}</h1>
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