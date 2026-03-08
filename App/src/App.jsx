import { useState, useEffect } from 'react';
import './styles/layout.css';
import { FaStar, FaRegStar } from "react-icons/fa";
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
  const [favorites, setFavorites] = useState([]);

  // Load favorites initially
  useEffect(() => {
    const fetchFavorites = async () => {
      const favs = await window.api.getFavorites();
      setFavorites(favs.map(f => f.id));
    };
    fetchFavorites();
  }, []);

  const toggleFavorite = async (id) => {
    await window.api.toggleFavorite(id);
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

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

      <Dropdown side="left" label="Dua">
        {duas.sort((a, b) => favorites.includes(b.id) - favorites.includes(a.id))
          .map(d => (
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

              {d.transliteration && (
                <div className="article-translit">{d.transliteration}</div>
              )}

              {d.meaning && (
                <div className="article-meaning">{d.meaning}</div>
              )}
              <button
                className="favorite-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(d.id);
                }}
              >
                {favorites.includes(d.id) ? (
                  <FaStar color="#ffd900" />
                ) : (
                  <FaRegStar color="#c5a059" />
                )}
              </button>
            </div>
          </li>
        ))}
      </Dropdown>

      <Dropdown side="right" label="Dhikr">
        {dhikrs.sort((a, b) => favorites.includes(b.id) - favorites.includes(a.id))
          .map(d => (
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

              {d.transliteration && (
                <div className="article-translit">{d.transliteration}</div>
              )}

              {d.meaning && (
                <div className="article-meaning">{d.meaning}</div>
              )}
              <button
                className="favorite-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(d.id);
                }}
              >
                {favorites.includes(d.id) ? (
                  <FaStar color="#ffd900" />
                ) : (
                  <FaRegStar color="#c5a059" />
                )}
              </button>
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
    </div>
  );
}

export default App;