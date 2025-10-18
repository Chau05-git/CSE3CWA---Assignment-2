"use client";

import { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import "./esc-room.css";
import EscTimer from "./Time/EscTimer";
import GameResult from "./GameResult/GameResult";

type GameState = "idle" | "playing" | "win" | "lose";

// Important: keep public behavior the same; only optimize and harden state updates.
type ChallengeProps = { onComplete: () => void };

// Lazy-load challenges to reduce initial bundle size (no behavior change)
const SumChallenge = dynamic<ChallengeProps>(() => import("./Challenge/SumChallenge"));
const DataPortChallenge = dynamic<ChallengeProps>(() => import("./Challenge/DataPortChallenge"));
const DebugImageChallenge = dynamic<ChallengeProps>(() => import("./Challenge/DebugImageChallenge"));

// Avoid magic numbers: single source of truth for stage count and labels
const STAGE_COUNT = 3 as const;
const STAGE_LABELS: Record<number, string> = {
  1: "Calculate Sum",
  2: "Port Data to localStorage",
  3: "Debug Image",
};

export default function EscapeRoomPage() {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [currentStage, setCurrentStage] = useState(1);
  const [timerKey, setTimerKey] = useState(0);

  const handleGameStart = useCallback(() => {
    // Important: use functional set to avoid stale closures
    setGameState((prev) => {
      if (prev === "idle") {
        setCurrentStage(1);
        return "playing";
      }
      return prev;
    });
  }, []);

  const handleChallengeComplete = useCallback(() => {
    // Important: single place to decide progression; uses STAGE_COUNT
    setCurrentStage((prev) => {
      if (prev === STAGE_COUNT) {
        setGameState("win");
        return prev; // keep at last stage; gameState will switch to win
      }
      return prev + 1;
    });
  }, []);

  const handleTimeExpire = useCallback(() => {
    // Important: functional update to ensure correctness if called rapidly
    setGameState((prev) => (prev === "playing" ? "lose" : prev));
  }, []);

  const handlePlayAgain = useCallback(() => {
    setGameState("idle");
    setCurrentStage(1);
    setTimerKey((prev) => prev + 1); // reset timer via key bump
  }, []);

  return (
    <main className="escape-room-page">
      <div className="Headline">
        <p>🔒 Escape Room Challenge!</p>
      </div>

      {gameState !== "win" && gameState !== "lose" && (
        <EscTimer
          key={timerKey}
          initialSeconds={180} 
          autoStart={false}
          onExpire={handleTimeExpire}
          onStart={handleGameStart}
          isPlaying={gameState === "playing"}
        />
      )}

      {/* Stage 1: Calculate Sum */}
      {gameState === "playing" && currentStage === 1 && (
        <SumChallenge onComplete={handleChallengeComplete} />
      )}

      {/* Stage 2: Port Data to localStorage */}
      {gameState === "playing" && currentStage === 2 && (
        <DataPortChallenge onComplete={handleChallengeComplete} />
      )}

      {/* Stage 3: Click Debug Image */}
      {gameState === "playing" && currentStage === 3 && (
        <DebugImageChallenge onComplete={handleChallengeComplete} />
      )}

      {(gameState === "win" || gameState === "lose") && (
        <GameResult isWin={gameState === "win"} onPlayAgain={handlePlayAgain} />
      )}

      {gameState === "idle" && (
        <div className="returnHome">
          <Link href="/">
            ← Give up Challenge
          </Link>
        </div>
      )}

      {/* Progress indicator */}
      {gameState === "playing" && (
        <div style={{
          position: "fixed",
          top: 20,
          left: 20,
          background: "rgba(255,255,255,0.9)",
          padding: "10px 18px",
          borderRadius: 8,
          fontWeight: "bold",
          color: "#1f2937",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          zIndex: 1100,
          fontSize: 16
        }} aria-live="polite">
          📍 Stage {currentStage} / {STAGE_COUNT}
          {STAGE_LABELS[currentStage] ? ` • ${STAGE_LABELS[currentStage]}` : ""}
        </div>
      )}
    </main>
  );
}