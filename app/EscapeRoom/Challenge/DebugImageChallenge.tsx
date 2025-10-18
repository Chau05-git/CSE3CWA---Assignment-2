"use client";
import { useCallback, useState } from "react";
import "./Challenge.css";

type Props = {
  onComplete: () => void;
};

// Hoist static data to avoid re-creating on each render
const images = [
  { id: "console", emoji: "🖥️", label: "Console", isCorrect: false },
  { id: "bug", emoji: "🐛", label: "Bug Icon", isCorrect: true }, // ✅ Correct answers
  { id: "play", emoji: "▶️", label: "Play Button", isCorrect: false },
  { id: "save", emoji: "💾", label: "Save Icon", isCorrect: false },
  { id: "terminal", emoji: "⌨️", label: "Terminal", isCorrect: false },
  { id: "breakpoint", emoji: "🔴", label: "Breakpoint", isCorrect: true }, // ✅ Correct answers
];

export default function DebugImageChallenge({ onComplete }: Props) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleImageClick = useCallback((imageId: string) => {
    const image = images.find((img) => img.id === imageId);
    setSelectedImage(imageId);

    if (image?.isCorrect) {
      setError("");
      setTimeout(() => {
        onComplete();
      }, 800);
    } else {
      setError(`❌ Wrong! "${image?.label}" is not used for debugging.`);
    }
  }, [onComplete]);

  return (
    <div className="challenge-overlay">
      <div className="challenge-container">
        <h2>🐛 Challenge 3: Debug Tool</h2>
        <p className="challenge-desc">
          Click the <strong>image that allows you to debug code</strong>
        </p>
        <p className="hint">
          💡 Hint: Debugging tools help you find and fix bugs in your code
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
            margin: "24px 0",
          }}
        >
          {images.map((img) => (
            <button
              key={img.id}
              onClick={() => handleImageClick(img.id)}
              className={`image-option ${
                selectedImage === img.id
                  ? img.isCorrect
                    ? "correct"
                    : "wrong"
                  : ""
              }`}
              style={{
                padding: 24,
                fontSize: 48,
                background:
                  selectedImage === img.id
                    ? img.isCorrect
                      ? "#065f46"
                      : "#991b1b"
                    : "#1e293b",
                border: "3px solid #334155",
                borderRadius: 12,
                cursor: "pointer",
                transition: "all 0.3s",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span>{img.emoji}</span>
              <span style={{ fontSize: 14, color: "#94a3b8" }}>
                {img.label}
              </span>
            </button>
          ))}
        </div>

        {error && (
          <div className="error-section">
            <div className="error-header">❌ Error:</div>
            <pre className="error-content">{error}</pre>
          </div>
        )}

        {selectedImage &&
          images.find((img) => img.id === selectedImage)?.isCorrect && (
            <div className="output-section">
              <div className="output-header">✅ Correct!</div>
              <pre className="output-content">
                Great job! You identified the debug tool correctly!
              </pre>
            </div>
          )}

        <div className="challenge-footer">
          <p>Choose wisely! Only one answer is correct.</p>
        </div>
      </div>
    </div>
  );
}