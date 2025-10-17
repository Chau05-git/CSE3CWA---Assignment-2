"use client";

import { useState } from "react";
import Link from "next/link";
import "./esc-room.css";
import EscTimer from "./Time/EscTimer";
import SumChallenge from "./Challenge/SumChallenge";
import DataPortChallenge from "./Challenge/DataPortChallenge"; // ✅ THÊM IMPORT
import GameResult from "./GameResult/GameResult";

type GameState = "idle" | "playing" | "win" | "lose";

export default function EscapeRoomPage() {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [currentStage, setCurrentStage] = useState(1); // ✅ THÊM stage tracking
  const [timerKey, setTimerKey] = useState(0);

  const handleGameStart = () => {
    setGameState("playing");
    setCurrentStage(1); // ✅ Bắt đầu từ stage 1
  };

  const handleChallengeComplete = () => {
    // ✅ THÊM logic chuyển stage
    if (currentStage === 2) {
      // Hoàn thành stage 2 = thắng
      setGameState("win");
    } else {
      // Chuyển sang stage 2
      setCurrentStage(2);
    }
  };

  const handleTimeExpire = () => {
    if (gameState === "playing") {
      setGameState("lose");
    }
  };

  const handlePlayAgain = () => {
    setGameState("idle");
    setCurrentStage(1); // ✅ Reset về stage 1
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
          initialSeconds={120} // ✅ 2 phút cho 2 stage
          autoStart={false}
          onExpire={handleTimeExpire}
          onStart={handleGameStart}
          isPlaying={gameState === "playing"}
        />
      )}

      {/* ✅ Stage 1: Calculate Sum */}
      {gameState === "playing" && currentStage === 1 && (
        <SumChallenge onComplete={handleChallengeComplete} />
      )}

      {/* ✅ Stage 2: Port Data to localStorage */}
      {gameState === "playing" && currentStage === 2 && (
        <DataPortChallenge onComplete={handleChallengeComplete} />
      )}

      {(gameState === "win" || gameState === "lose") && (
        <GameResult isWin={gameState === "win"} onPlayAgain={handlePlayAgain} />
      )}

      {gameState === "idle" && (
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <Link href="/" style={{ color: "#f2e424", fontSize: 18 }}>
            ← Go back to Home
          </Link>
        </div>
      )}

      {/* ✅ Progress indicator - hiện stage hiện tại */}
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
          📍 Stage {currentStage} / 2
        </div>
      )}
    </main>
  );
}