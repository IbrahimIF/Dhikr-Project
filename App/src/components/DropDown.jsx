import { useState } from 'react';
import '../styles/dropdown.css';

function Dropdown({ side, label, children }) {
  const [isOpen, setIsOpen] = useState(false);
  const id = `state-dropdown-${side}`;

  return (
    <div className={`dropup ${side}`}>
      <div className="dropdown minaret">
        <input
          hidden
          className="sr-only"
          name={id}
          id={id}
          type="checkbox"
          checked={isOpen}
          onChange={(e) => setIsOpen(e.target.checked)}
        />
        <label
          htmlFor={id}
          className="trigger"
          data-label={label}
        />

        <ul className="list" role="list">
          {children}
        </ul>
      </div>
    </div>
  );
}

export default Dropdown;