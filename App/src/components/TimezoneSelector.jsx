import { useState } from 'react';
import { TIME_ZONES } from '../utils/timeUtils';
import '../styles/timezone.css';

function TimezoneSelector({ selectedIana, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const selected = TIME_ZONES.find(tz => tz.iana === selectedIana) || TIME_ZONES[0];

  function handleSelect(iana) {
    onChange(iana);
    setIsOpen(false);
  }

  return (
    <div className="tz-selector">
     <button
        className="tz-trigger"
        onClick={() => setIsOpen(prev => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="tz-label">{selected.label}</span>
        <span className={`tz-arrow ${isOpen ? 'tz-arrow--open' : ''}`}>
          ▾
        </span>
      </button>

      {isOpen && (
        <ul className="tz-list" role="listbox" aria-label="Select timezone">
          {TIME_ZONES.map(tz => (
            <li
              key={tz.iana + tz.label}
              role="option"
              aria-selected={tz.iana === selectedIana}
              className={`tz-option ${tz.iana === selectedIana ? 'tz-option--active' : ''}`}
              onClick={() => handleSelect(tz.iana)}
            >
              {tz.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TimezoneSelector;