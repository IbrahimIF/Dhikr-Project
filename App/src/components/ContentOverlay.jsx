import { useState, useEffect } from "react";
import { FaYoutube } from "react-icons/fa";
import "../styles/content.css";

function ContentOverlay({ isOpen, onClose, content, mode, refreshContent }) {
  if (!isOpen || !content) return null;

  const isAdd = mode === "add";
  const isEdit = mode === "edit";

  const [formData, setFormData] = useState(content);

  // reset form if content changes
  useEffect(() => {
    setFormData(content);
  }, [content]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit() {
    if (!formData.title || !formData.arabic || !formData.type) {
      alert("Title, Arabic and Type are required");
      return;
    }

    if (isAdd) {
      await window.api.addContent(formData);
    } else if (isEdit) {
      await window.api.updateContent(formData);
    }

    await refreshContent();
    onClose();
  }

  return (
    <div className="content-overlay">
      <div className="content-card">

        <button className="overlay-close" onClick={onClose}>✕</button>

        <div className="overlay-header">
          <h2 className="overlay-title">
            {isAdd ? "Add New Dua / Dhikr" : formData.title}
          </h2>
        </div>

        {(isAdd || isEdit) ? (
          <div className="overlay-form">
            <select name="type" value={formData.type} onChange={handleChange}>
              <option value="">Select Type</option>
              <option value="dua">Dua</option>
              <option value="dhikr">Dhikr</option>
            </select>

            <input name="title" placeholder="Title" value={formData.title || ""} onChange={handleChange} />
            <textarea name="arabic" placeholder="Arabic" value={formData.arabic || ""} onChange={handleChange} />
            <input name="transliteration" placeholder="Transliteration" value={formData.transliteration || ""} onChange={handleChange} />
            <textarea name="translation" placeholder="Meaning / Translation" value={formData.translation || ""} onChange={handleChange} />
            <input name="context" placeholder="When to recite (optional)" value={formData.context || ""} onChange={handleChange} />
            <input name="benefit" placeholder="Benefit (optional)" value={formData.benefit || ""} onChange={handleChange} />
            <input name="reference" placeholder="Hadith / Source" value={formData.reference || ""} onChange={handleChange} />
            <textarea name="explanation" placeholder="Explanation / Story" value={formData.explanation || ""} onChange={handleChange} />
            <input name="youtube" placeholder="YouTube Link" value={formData.youtube || ""} onChange={handleChange} />

            <button className="overlay-save" onClick={handleSubmit}>
              {isAdd ? "Save" : "Update"}
            </button>
          </div>
        ) : (
          <>
            <div className="overlay-arabic">{formData.arabic}</div>
            {formData.translation && <div className="overlay-section"><h4>Translation</h4><p>{formData.translation}</p></div>}
            {formData.benefit && <div className="overlay-section"><h4>Benefit</h4><p>{formData.benefit}</p></div>}
            {formData.reference && <div className="overlay-section"><h4>Reference</h4><p>{formData.reference}</p></div>}
            {formData.story && <div className="overlay-section"><h4>Story</h4><p>{formData.story}</p></div>}
          </>
        )}

        {!isAdd && !isEdit && formData.youtube && (
          <button
            className="youtube-btn"
            onClick={() => window.open(formData.youtube, "_blank")}
            title="Watch on YouTube"
          >
            <FaYoutube size={24}/>
          </button>
        )}

      </div>
    </div>
  );
}

export default ContentOverlay;