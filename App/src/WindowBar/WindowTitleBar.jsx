import { useEffect } from 'react';
import logoSrc from '../assets/logo.png';
import './windowTitleBar.css';

const titleBarThemes = {
  fajr:   { color: '#090f18', symbolColor: '#ffffff' },
  dhuhr:  { color: '#0b2924', symbolColor: '#ffffff' },
  asr:    { color: '#7d1b18', symbolColor: '#ffffff' },
  magrib: { color: '#0d527e', symbolColor: '#ffffff' },
  isha:   { color: '#8fafc5', symbolColor: '#1a2530' },
};

function WindowTitleBar({ activePrayer }) {
  useEffect(() => {
    if (!activePrayer || !window.api?.updateTitleBarColor) return;
    const theme = titleBarThemes[activePrayer] ?? titleBarThemes.fajr;
    window.api.updateTitleBarColor(theme.color, theme.symbolColor);
  }, [activePrayer]);

  return (
    <div className="window-titlebar">
      <img src={logoSrc} alt="Adhkar Daily" className="titlebar-logo" />
      <span className="titlebar-title">Adhkar Daily</span>
    </div>
  );
}

export default WindowTitleBar;
