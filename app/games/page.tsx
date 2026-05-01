"use client";

import { useState, useEffect, useCallback } from "react";

const herbs = ["🌿 Tulsi", "🌱 Ashwagandha", "🍃 Neem", "🍂 Triphala", "🍯 Honey", "🧅 Onion", "🥥 Coconut", "🌶️ Ginger"];

export default function SequenceGame() {
  const [sequence, setSequence] = useState<string[]>([]);
  const [playerInput, setPlayerInput] = useState<string[]>([]);
  const [gameState, setGameState] = useState<"start" | "show" | "input" | "gameover">("start");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("sequence_high");
    if (saved) setHighScore(parseInt(saved));
  }, []);

  const startNewRound = useCallback(() => {
    const newHerb = herbs[Math.floor(Math.random() * herbs.length)];
    setSequence(prev => [...prev, newHerb]);
    setPlayerInput([]);
    setCurrentIndex(0);
    setGameState("show");
    setMessage("");
    playSequence([...sequence, newHerb]);
  }, [sequence]);

  const playSequence = async (seq: string[]) => {
    for (let i = 0; i < seq.length; i++) {
      await new Promise(r => setTimeout(r, 600));
      setCurrentIndex(i);
      await new Promise(r => setTimeout(r, 300));
    }
    setCurrentIndex(-1);
    setGameState("input");
  };

  const handleHerbClick = (herb: string) => {
    if (gameState !== "input") return;
    const expected = sequence[playerInput.length];
    if (herb === expected) {
      const newInput = [...playerInput, herb];
      setPlayerInput(newInput);
      if (newInput.length === sequence.length) {
        // round won
        const newScore = score + 10;
        setScore(newScore);
        if (newScore > highScore) {
          setHighScore(newScore);
          localStorage.setItem("sequence_high", newScore.toString());
        }
        setMessage("✅ Correct! Next level...");
        setTimeout(() => startNewRound(), 1000);
      }
    } else {
      setGameState("gameover");
      setMessage(`❌ Game Over! You reached score ${score}`);
    }
  };

  const resetGame = () => {
    setSequence([]);
    setPlayerInput([]);
    setScore(0);
    setGameState("start");
    setMessage("");
  };

  return (
    <div className="max-w-2xl mx-auto p-6 text-center">
      <h1 className="text-3xl font-bold mb-2">🧠 Sequence Recall</h1>
      <p className="text-gray-600 mb-4">Watch the sequence, then tap in the same order</p>

      {gameState === "start" && (
        <button
          onClick={startNewRound}
          className="bg-green-500 text-white px-6 py-3 rounded-full text-xl font-semibold hover:bg-green-600"
        >
          Start Game
        </button>
      )}

      {(gameState === "show" || gameState === "input") && (
        <>
          <div className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl my-4 min-h-[120px] flex items-center justify-center">
            {gameState === "show" && currentIndex >= 0 && (
              <div className="text-4xl font-bold animate-pulse">
                {sequence[currentIndex]}
              </div>
            )}
            {gameState === "input" && (
              <div className="text-xl text-gray-500">
                Your turn: tap {sequence.length - playerInput.length} more
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            {herbs.map(herb => (
              <button
                key={herb}
                onClick={() => handleHerbClick(herb)}
                disabled={gameState !== "input"}
                className="bg-white/70 p-3 rounded-xl shadow hover:shadow-md transition disabled:opacity-50"
              >
                {herb}
              </button>
            ))}
          </div>
        </>
      )}

      {gameState === "gameover" && (
        <div>
          <p className="text-xl mb-4">{message}</p>
          <button
            onClick={resetGame}
            className="bg-green-500 text-white px-6 py-2 rounded-full"
          >
            Play Again
          </button>
        </div>
      )}

      <div className="mt-6 flex justify-between text-sm text-gray-600">
        <span>Score: {score}</span>
        <span>🏆 Best: {highScore}</span>
      </div>

      {message && !message.includes("Correct") && (
        <div className="mt-4 text-sm text-green-600">{message}</div>
      )}
    </div>
  );
}