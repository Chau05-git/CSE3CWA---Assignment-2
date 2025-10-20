"use client";
import { useState } from "react";
import Link from "next/link";
import "./GameResult.css";

type Props = {
  isWin: boolean;
  onPlayAgain: () => void;
  completionTime?: number; // time in seconds
  totalTime: number;
};

export default function GameResult({ isWin, onPlayAgain, completionTime, totalTime }: Props) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState("");

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);

    try {
      const response = await fetch('/api/game-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerName: playerName.trim() || 'Anonymous',
          status: isWin ? 'win' : 'lose',
          completionTime: isWin ? completionTime : null,
          totalTime,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSaveMessage(`✓ Result saved! ID: ${data.id}`);
      } else {
        setSaveMessage('✗ Failed to save result');
      }
    } catch (error) {
      console.error('Save error:', error);
      setSaveMessage('✗ Error saving result');
    } finally {
      setIsSaving(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="result-overlay">
      <div className={`result-box ${isWin ? 'win' : 'lose'}`}>
        {isWin ? (
          <>
            <h1 className="result-title">🎉 Escaped!</h1>
            <p className="result-message">You successfully escaped the room!</p>
            {completionTime !== undefined && (
              <p className="result-time">⏱️ Time: {formatTime(completionTime)}</p>
            )}
          </>
        ) : (
          <>
            <h1 className="result-title">⏰ Time's Up!</h1>
            <p className="result-message">You didn't escape in time...</p>
          </>
        )}

        <div className="save-section" style={{ margin: '20px 0', padding: '15px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
          <input
            type="text"
            placeholder="Enter your name (optional)"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '10px',
              borderRadius: '5px',
              border: '2px solid #ccc',
              fontSize: '16px',
            }}
          />
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="btn btn-save"
            style={{
              background: '#10b981',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '5px',
              border: 'none',
              cursor: isSaving ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              width: '100%',
              opacity: isSaving ? 0.6 : 1,
            }}
          >
            {isSaving ? '💾 Saving...' : '💾 Save Result'}
          </button>
          {saveMessage && (
            <p style={{
              marginTop: '10px',
              color: saveMessage.includes('✓') ? '#10b981' : '#ef4444',
              fontWeight: 'bold',
            }}>
              {saveMessage}
            </p>
          )}
        </div>

        <div className="result-actions">
          {!isWin && (
            <button onClick={onPlayAgain} className="btn btn-retry">
              🔄 Try Again
            </button>
          )}
          <Link href="/" className="btn btn-home">
            🏠 Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}