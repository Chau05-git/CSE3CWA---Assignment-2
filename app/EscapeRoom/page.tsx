"use client";

import { useState } from "react";
import Link from "next/link";
import "./esc-room.css";
import EscTimer from "./Time/EscTimer";
import SumChallenge from "./Challenge/SumChallenge";
import DataPortChallenge from "./Challenge/DataPortChallenge";
import DebugImageChallenge from "./Challenge/DebugImageChallenge"; // ✅ THÊM
import GameResult from "./GameResult/GameResult";

type GameState = "idle" | "playing" | "win" | "lose";

export default function EscapeRoomPage() {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [currentStage, setCurrentStage] = useState(1);
  const [timerKey, setTimerKey] = useState(0);

  const handleGameStart = () => {
    setGameState(prev => {
      if (prev === "idle") {
        setCurrentStage(1);
        return "playing";
      }
      return prev;
    });
  };

  const handleChallengeComplete = () => {
    if (currentStage === 3) { // ✅ Stage 3 = cuối cùng
      setGameState("win");
    } else {
      setCurrentStage(prev => prev + 1);
    }
  };

  const handleTimeExpire = () => {
    if (gameState === "playing") {
      setGameState("lose");
    }
  };

  const handlePlayAgain = () => {
    setGameState("idle");
    setCurrentStage(1);
    setTimerKey(prev => prev + 1);
  };

  return (
    <main className="escape-room-page">
      <div className="Headline">
        <p>🔒 Escape Room Challenge!</p>
      </div>

      {gameState !== "win" && gameState !== "lose" && (
        <EscTimer
          key={timerKey}
          initialSeconds={180} // ✅ 3 phút cho 3 stage
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

      {/* ✅ Stage 3: Click Debug Image */}
      {gameState === "playing" && currentStage === 3 && (
        <DebugImageChallenge onComplete={handleChallengeComplete} />
      )}

      {(gameState === "win" || gameState === "lose") && (
        <GameResult isWin={gameState === "win"} onPlayAgain={handlePlayAgain} />
      )}

      {gameState === "idle" && (
        <div className="returnHome">
          <Link href="/">
            ← Go back to Home
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
        }}>
          📍 Stage {currentStage} / 3 {/* ✅ Đổi thành /3 */}
        </div>
      )}
    </main>
  );
}