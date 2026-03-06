import { useState } from "react";
import "../styles/content.css";

function ContentOverlay({ isOpen, onClose, content, mode }) {

  if (!isOpen || !content) return null;

  const isAdd = mode === "add";

  const [formData, setFormData] = useState(content);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  async function handleSubmit() {

    if (!formData.title || !formData.arabic || !formData.type) {
      alert("Title, Arabic and Type are required");
      return;
    }

    await window.api.addContent(formData);

    onClose();

    window.location.reload(); // simple refresh for now
  }

  return (
    <div className="content-overlay">

      <div className="content-card">

        <button className="overlay-close" onClick={onClose}>
          ✕
        </button>

        <div className="overlay-header">

          <h2>
            {isAdd ? "Add New Dua / Dhikr" : content.title}
          </h2>

        </div>

        {isAdd ? (

          <div className="overlay-form">

            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <option value="">Select Type</option>
              <option value="dua">Dua</option>
              <option value="dhikr">Dhikr</option>
            </select>

            <input
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleChange}
            />

            <textarea
              name="arabic"
              placeholder="Arabic"
              value={formData.arabic}
              onChange={handleChange}
            />

            <textarea
              name="translation"
              placeholder="Translation"
              value={formData.translation}
              onChange={handleChange}
            />

            <input
              name="when_to_recite"
              placeholder="When to recite"
              value={formData.when_to_recite}
              onChange={handleChange}
            />

            <input
              name="benefit"
              placeholder="Benefit"
              value={formData.benefit}
              onChange={handleChange}
            />

            <input
              name="reference"
              placeholder="Reference"
              value={formData.reference}
              onChange={handleChange}
            />

            <textarea
              name="story"
              placeholder="Story / Context"
              value={formData.story}
              onChange={handleChange}
            />

            <input
              name="youtube_link"
              placeholder="YouTube Link"
              value={formData.youtube_link}
              onChange={handleChange}
            />

            <input
              name="audio_path"
              placeholder="Audio File Path"
              value={formData.audio_path}
              onChange={handleChange}
            />

            <button
              className="overlay-save"
              onClick={handleSubmit}
            >
              Save
            </button>

          </div>

        ) : (

          <>
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
          </>
        )}

      </div>
    </div>
  );
}

export default ContentOverlay;