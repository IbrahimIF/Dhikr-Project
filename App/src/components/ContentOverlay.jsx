import { useEffect } from "react";
import "../styles/content.css";

function ContentOverlay({ isOpen, onClose, content }) {
  if (!isOpen || !content) return null;

  return (
    <div className="content-overlay">
      <div className="content-card">
        <button className="overlay-close" onClick={onClose}>
          ✕
        </button>

        <div className="overlay-header">
          <h2>{content.title}</h2>
        </div>

        <div className="overlay-arabic">
          {content.arabic}
        </div>

        {content.translation && (
          <div className="overlay-section">
            <h4>Translation</h4>
            <p>{content.translation}</p>
          </div>
        )}

        {content.when_to_recite && (
          <div className="overlay-section">
            <h4>When to Recite</h4>
            <p>{content.when_to_recite}</p>
          </div>
        )}

        {content.benefit && (
          <div className="overlay-section">
            <h4>Benefit</h4>
            <p>{content.benefit}</p>
          </div>
        )}

        {content.reference && (
          <div className="overlay-section">
            <h4>Reference</h4>
            <p>{content.reference}</p>
          </div>
        )}

        {content.story && (
          <div className="overlay-section">
            <h4>Story</h4>
            <p>{content.story}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ContentOverlay;