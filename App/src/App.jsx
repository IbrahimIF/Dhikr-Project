import { useState, useEffect } from 'react';
import './styles/layout.css';
import archImage from './assets/Arch.png';
import WindowTitleBar from './WindowBar/WindowTitleBar';
import Dropdown from './components/DropDown';
import PrayerCard from './components/PrayerCard';
import TimezoneSelector from './components/TimezoneSelector';
import ContentOverlay from './components/ContentOverlay';
import { usePrayerLogic } from './hooks/usePrayerLogic';

function App() {
  const [selectedTimezone, setSelectedTimezone] = useState('Europe/London');
  const [selectedContent, setSelectedContent] = useState(null);
  const [overlayMode, setOverlayMode] = useState("view");

  const { displayTime, prayerTimes } = usePrayerLogic(selectedTimezone);

  const [duas, setDuas] = useState([]);
  const [dhikrs, setDhikrs] = useState([]);

  useEffect(() => {
    loadContent('dua', setDuas);
    loadContent('dhikr', setDhikrs);
  }, []);

  const loadContent = async (type, setter) => {
    const data = await window.api.getContentByType(type);
    setter(data);
  };

  return (
    <div className="container">
      <div className="pattern-overlay" />
      <WindowTitleBar />

      <ContentOverlay
        isOpen={!!selectedContent}
        content={selectedContent}
        mode={overlayMode}
        onClose={() => setSelectedContent(null)}
      />

            {/* ADD BUTTON */}

      <button
        className="add-content-btn"
        onClick={() => {

          setSelectedContent({
            type: "",
            title: "",
            when_to_recite: "",
            benefit: "",
            arabic: "",
            translation: "",
            reference: "",
            story: "",
            youtube_link: "",
            audio_path: ""
          });

          setOverlayMode("add");

        }}
      >
        + Add
      </button>

      <Dropdown side="left" label="Dua">
        {duas.map((d) => (
          <li key={d.id} className="listitem">
            <div 
              className="article"
              onClick={() => {
                setSelectedContent(d);
                setOverlayMode("view");
              }}
              >
              <div className="article-title">{d.title}</div>
              <div className="article-arabic">{d.arabic}</div>
            </div>
          </li>
        ))}
      </Dropdown>

      <Dropdown side="right" label="Dhikr">
        {dhikrs.map((d) => (
          <li key={d.id} className="listitem">
            <div 
              className="article"
              onClick={() => {
                setSelectedContent(d);
                setOverlayMode("view");
              }}
              > 
              <div className="article-title">{d.title}</div>
              <div className="article-arabic">{d.arabic}</div>
            </div>
          </li>
        ))}
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