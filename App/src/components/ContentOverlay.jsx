import { useState, useEffect } from "react";
import "../styles/content.css";

function ContentOverlay({ isOpen, onClose, content, mode = "view", onSave }) {
  const [formData, setFormData] = useState({
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

  useEffect(() => {
    if (content) {
      setFormData(content);
    }
  }, [content]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (onSave) onSave(formData);
    onClose();
  };

  return (
    <div className="overlay-backdrop" onClick={onClose}>
      <div
        className="overlay-card"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="overlay-close" onClick={onClose}>
          ✕
        </button>

        {mode === "view" ? (
          <>
            <h2>{formData.title}</h2>

            <div className="overlay-section arabic">
              {formData.arabic}
            </div>

            {formData.translation && (
              <div className="overlay-section">
                <strong>Translation:</strong>
                <p>{formData.translation}</p>
              </div>
            )}

            {formData.when_to_recite && (
              <div className="overlay-section">
                <strong>When to Recite:</strong>
                <p>{formData.when_to_recite}</p>
              </div>
            )}

            {formData.benefit && (
              <div className="overlay-section">
                <strong>Benefit:</strong>
                <p>{formData.benefit}</p>
              </div>
            )}

            {formData.reference && (
              <div className="overlay-section">
                <strong>Reference:</strong>
                <p>{formData.reference}</p>
              </div>
            )}

            {formData.story && (
              <div className="overlay-section">
                <strong>Story:</strong>
                <p>{formData.story}</p>
              </div>
            )}
          </>
        ) : (
          <>
            <h2>{mode === "add" ? "Add New Content" : "Edit Content"}</h2>

            {Object.keys(formData).map((key) => (
              key !== "id" && (
                <textarea
                  key={key}
                  name={key}
                  placeholder={key.replace(/_/g, " ")}
                  value={formData[key] || ""}
                  onChange={handleChange}
                />
              )
            ))}

            <button className="overlay-save" onClick={handleSubmit}>
              Save
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ContentOverlay;