"use client";
import Link from "next/link";
import "./GameResult.css";

type Props = {
  isWin: boolean;
  onPlayAgain: () => void;
};

export default function GameResult({ isWin, onPlayAgain }: Props) {
  return (
    <div className="result-overlay">
      <div className={`result-box ${isWin ? 'win' : 'lose'}`}>
        {isWin ? (
          <>
            <h1 className="result-title">🎉 Escaped!</h1>
            <p className="result-message">You successfully escaped the room!</p>
            <div className="result-actions">
              <Link href="/" className="btn btn-home">
                🏠 Back to Home
              </Link>
            </div>
          </>
        ) : (
          <>
            <h1 className="result-title">⏰ Time's Up!</h1>
            <p className="result-message">You didn't escape in time...</p>
            <div className="result-actions">
              <button onClick={onPlayAgain} className="btn btn-retry">
                🔄 Try Again
              </button>
              <Link href="/" className="btn btn-home">
                🏠 Back to Home
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}