"use client";
import { useEffect, useRef, useState } from "react";
import "./EscTimer_style.css";

type Props = {
  initialSeconds: number;
  onExpire?: () => void;
  autoStart?: boolean;
  onStart?: () => void;
  isPlaying?: boolean; 
};

export default function EscTimer({ initialSeconds, onExpire, autoStart = false, onStart, isPlaying = false }: Props) {
  const [remaining, setRemaining] = useState(initialSeconds);
  const [running, setRunning] = useState(autoStart);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    if (remaining <= 0) {
      setRunning(false);
      onExpire?.();
      return;
    }
    intervalRef.current = window.setInterval(() => {
      setRemaining((s) => s - 1);
    }, 1000);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [running, remaining, onExpire]);

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");

  const start = () => {
    if (remaining <= 0) setRemaining(initialSeconds);
    setRunning(true);
    onStart?.();
  };

  const pause = () => setRunning(false);

  const reset = () => {
    setRunning(false);
    setRemaining(initialSeconds);
  };

  return (
    <div className={`Time_style ${isPlaying ? 'playing' : ''}`}> 
      <h3 className="timer-title">⏱️ Time Remaining</h3>
      <div className={`timer-display ${remaining < 60 ? 'warning' : ''}`}>
        {mm}:{ss}
      </div>

      <div className="timer-controls">
        {!running ? (
          <button onClick={start} className="startButton">
            ▶️ Start
          </button>
        ) : (
          <button onClick={pause} className="pauseButton">
            ⏸️ Pause
          </button>
        )}
        <button onClick={reset} className="resetButton">
          🔄 Reset
        </button>
      </div>
    </div>
  );
}