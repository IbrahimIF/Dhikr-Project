import { useState } from 'react';
import { FiChevronDown } from "react-icons/fi";
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

        <label htmlFor={id} className="trigger">
          <span className="trigger-label">{label}</span>
          <FiChevronDown className="dropdown-chevron" />
        </label>

        <ul className="list" role="list">
          {children}
        </ul>
      </div>
    </div>
  );
}

export default Dropdown;
