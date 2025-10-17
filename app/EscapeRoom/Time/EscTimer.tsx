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

export default function EscTimer({
  initialSeconds,
  onExpire,
  autoStart = false,
  onStart,
  isPlaying = false,
}: Props) {
  const [remaining, setRemaining] = useState(initialSeconds);
  const [running, setRunning] = useState(autoStart);
  const intervalRef = useRef<number | null>(null);
  const hasFiredStart = useRef(false); // chặn gọi onStart nhiều lần trong 1 phiên

  // Tick mỗi giây khi running = true
  useEffect(() => {
    if (!running) return;
    intervalRef.current = window.setInterval(() => {
      setRemaining((s) => s - 1);
    }, 1000);

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [running]);

  // Hết giờ
  useEffect(() => {
    if (!running) return;
    if (remaining <= 0) {
      setRunning(false);
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      onExpire?.();
    }
  }, [remaining, running, onExpire]);

  const mm = String(Math.floor(Math.max(remaining, 0) / 60)).padStart(2, "0");
  const ss = String(Math.max(remaining, 0) % 60).padStart(2, "0");

  const start = () => {
    if (remaining <= 0) setRemaining(initialSeconds);
    setRunning(true);
    if (!hasFiredStart.current) {
      onStart?.(); // chỉ gọi khi bắt đầu phiên chơi từ idle
      hasFiredStart.current = true;
    }
  };

  const pause = () => {
    setRunning(false);
  };

  const reset = () => {
    setRunning(false);
    setRemaining(initialSeconds);
    hasFiredStart.current = false; // cho phép onStart chạy lại ở phiên mới
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  return (
    <div className={`Time_style ${isPlaying ? "playing" : ""}`}>
      <h3 className="timer-title">⏱️ Time Remaining</h3>
      <div className={`timer-display ${remaining < 60 ? "warning" : ""}`}>
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