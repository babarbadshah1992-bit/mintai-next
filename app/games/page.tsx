"use client";

import { useState, useEffect } from "react";

// ---------- Types ----------
type GameType = "memory" | "math" | "word" | "reaction" | null;

// ---------- Main Component ----------
export default function GamesPage() {
  const [selectedGame, setSelectedGame] = useState<GameType>(null);
  const [gameResult, setGameResult] = useState<{ score: number; game: string } | null>(null);

  const backToMenu = () => {
    setSelectedGame(null);
    setGameResult(null);
  };

  const handleGameComplete = (gameName: string, score: number) => {
    setGameResult({ score, game: gameName });
    setSelectedGame(null);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
          🧠 Mind Gym
        </h1>
        <p className="text-gray-600 mt-2">Train your brain with science‑backed mini games</p>
      </div>

      {!selectedGame && !gameResult && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <GameCard
            title="🧩 Memory Match"
            desc="Flip & match pairs of cards"
            skill="Focus & Recall"
            onClick={() => setSelectedGame("memory")}
          />
          <GameCard
            title="➕ Quick Math"
            desc="Solve 10 equations fast"
            skill="Mental Speed"
            onClick={() => setSelectedGame("math")}
          />
          <GameCard
            title="📚 Word Unscramble"
            desc="Unjumble the letters"
            skill="Vocabulary & Logic"
            onClick={() => setSelectedGame("word")}
          />
          <GameCard
            title="⚡ Reaction Test"
            desc="Click when screen turns green"
            skill="Alertness & Reflex"
            onClick={() => setSelectedGame("reaction")}
          />
        </div>
      )}

      {selectedGame && (
        <div>
          <button onClick={backToMenu} className="mb-4 text-green-600 underline hover:text-green-800">
            ← Back to Games
          </button>
          {selectedGame === "memory" && <MemoryGame onComplete={(s) => handleGameComplete("Memory Match", s)} />}
          {selectedGame === "math" && <QuickMath onComplete={(s) => handleGameComplete("Quick Math", s)} />}
          {selectedGame === "word" && <WordUnscramble onComplete={(s) => handleGameComplete("Word Unscramble", s)} />}
          {selectedGame === "reaction" && <ReactionGame onComplete={(s) => handleGameComplete("Reaction Test", s)} />}
        </div>
      )}

      {gameResult && (
        <div className="mt-8 p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg text-center">
          <h2 className="text-2xl font-bold">🏆 Game Over</h2>
          <p className="text-xl mt-2">
            Your score in <span className="font-semibold">{gameResult.game}</span>:{" "}
            <span className="text-green-600 font-bold">{gameResult.score}</span>
          </p>
          {(gameResult.game === "Memory Match" && <HighScoreDisplay gameKey="memory_high" label="Memory Match" />) ||
            (gameResult.game === "Quick Math" && <HighScoreDisplay gameKey="math_high" label="Quick Math" />) ||
            (gameResult.game === "Word Unscramble" && <HighScoreDisplay gameKey="word_high" label="Word Unscramble" />) ||
            (gameResult.game === "Reaction Test" && <HighScoreDisplay gameKey="reaction_high" label="Reaction Test" />)}
          <button onClick={backToMenu} className="mt-4 bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600">
            Play Another Game
          </button>
        </div>
      )}
    </div>
  );
}

// ---------- Game Card Component ----------
function GameCard({ title, desc, skill, onClick }: { title: string; desc: string; skill: string; onClick: () => void }) {
  // Also show current high score from localStorage
  const getHighScore = () => {
    const key = {
      "🧩 Memory Match": "memory_high",
      "➕ Quick Math": "math_high",
      "📚 Word Unscramble": "word_high",
      "⚡ Reaction Test": "reaction_high",
    }[title];
    if (key) {
      const hs = localStorage.getItem(key);
      return hs ? `🏆 ${hs}` : null;
    }
    return null;
  };
  const highScoreText = getHighScore();

  return (
    <button
      onClick={onClick}
      className="group bg-white/70 backdrop-blur-sm p-5 rounded-2xl shadow-md hover:shadow-xl transition-all text-left w-full"
    >
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-gray-600 text-sm mt-1">{desc}</p>
      <div className="flex justify-between items-center mt-3">
        <span className="text-green-600 text-xs font-medium bg-green-50 px-2 py-1 rounded-full">🎯 {skill}</span>
        {highScoreText && <span className="text-xs text-amber-600">{highScoreText}</span>}
      </div>
    </button>
  );
}

// ---------- High Score Display Helper ----------
function HighScoreDisplay({ gameKey, label }: { gameKey: string; label: string }) {
  const [highScore, setHighScore] = useState<number | null>(null);
  useEffect(() => {
    const stored = localStorage.getItem(gameKey);
    if (stored) setHighScore(parseInt(stored));
  }, [gameKey]);
  if (!highScore) return null;
  return (
    <div className="mt-2 text-sm text-gray-500">
      🏆 Your best: <span className="font-semibold text-green-700">{highScore}</span>
    </div>
  );
}

// ---------- GAME: MEMORY MATCH ----------
function MemoryGame({ onComplete }: { onComplete: (score: number) => void }) {
  const emojis = ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼"];
  const [cards, setCards] = useState(() => {
    let deck = [...emojis, ...emojis];
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck.map((emoji, idx) => ({ id: idx, emoji, flipped: false, matched: false }));
  });
  const [firstIndex, setFirstIndex] = useState<number | null>(null);
  const [lock, setLock] = useState(false);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);

  useEffect(() => {
    if (matches === emojis.length) {
      const finalScore = Math.max(0, 100 - moves * 2);
      // Save high score
      const oldHigh = localStorage.getItem("memory_high");
      if (!oldHigh || finalScore > parseInt(oldHigh)) {
        localStorage.setItem("memory_high", finalScore.toString());
      }
      onComplete(finalScore);
    }
  }, [matches, moves, onComplete]);

  const handleCardClick = (index: number) => {
    if (lock) return;
    if (cards[index].flipped || cards[index].matched) return;
    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);
    setMoves((m) => m + 1);

    if (firstIndex === null) {
      setFirstIndex(index);
    } else {
      const firstCard = cards[firstIndex];
      const currentCard = cards[index];
      if (firstCard.emoji === currentCard.emoji) {
        newCards[firstIndex].matched = true;
        newCards[index].matched = true;
        setCards(newCards);
        setMatches((m) => m + 1);
        setFirstIndex(null);
      } else {
        setLock(true);
        setTimeout(() => {
          newCards[firstIndex].flipped = false;
          newCards[index].flipped = false;
          setCards(newCards);
          setFirstIndex(null);
          setLock(false);
        }, 700);
      }
    }
  };

  return (
    <div className="text-center">
      <p className="mb-3 text-lg font-semibold">Moves: {moves}</p>
      <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-md mx-auto">
        {cards.map((card, i) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(i)}
            className={`w-16 h-16 sm:w-20 sm:h-20 text-3xl sm:text-4xl rounded-2xl shadow flex items-center justify-center transition-all ${
              card.flipped || card.matched ? "bg-white" : "bg-green-200 hover:bg-green-300"
            }`}
          >
            {card.flipped || card.matched ? card.emoji : "❓"}
          </button>
        ))}
      </div>
    </div>
  );
}

// ---------- GAME: QUICK MATH ----------
function QuickMath({ onComplete }: { onComplete: (score: number) => void }) {
  const [question, setQuestion] = useState({ num1: 0, num2: 0, op: "+", answer: 0 });
  const [input, setInput] = useState("");
  const [count, setCount] = useState(0);
  const [correct, setCorrect] = useState(0);

  const generateQuestion = () => {
    const ops = ["+", "-"];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let num1 = Math.floor(Math.random() * 20) + 1;
    let num2 = Math.floor(Math.random() * 20) + 1;
    let ans = 0;
    if (op === "+") ans = num1 + num2;
    else {
      if (num1 < num2) [num1, num2] = [num2, num1];
      ans = num1 - num2;
    }
    setQuestion({ num1, num2, op, answer: ans });
  };

  useEffect(() => {
    generateQuestion();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userAns = parseInt(input);
    if (!isNaN(userAns) && userAns === question.answer) {
      setCorrect((c) => c + 1);
    }
    setCount((c) => c + 1);
    setInput("");
    generateQuestion();
  };

  useEffect(() => {
    if (count === 10) {
      const finalScore = correct * 10;
      const oldHigh = localStorage.getItem("math_high");
      if (!oldHigh || finalScore > parseInt(oldHigh)) {
        localStorage.setItem("math_high", finalScore.toString());
      }
      onComplete(finalScore);
    }
  }, [count, correct, onComplete]);

  if (count === 10) return <div className="text-center text-xl">🎉 Game Over! Your score: {correct * 10}</div>;
  return (
    <div className="text-center space-y-4">
      <p className="text-3xl font-mono">
        {question.num1} {question.op} {question.num2} = ?
      </p>
      <form onSubmit={handleSubmit} className="flex justify-center gap-2">
        <input
          type="number"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border p-2 rounded w-24 text-center"
          autoFocus
        />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg">
          Submit
        </button>
      </form>
      <p>
        Score: {correct * 10} / 100 | Questions: {count}/10
      </p>
    </div>
  );
}

// ---------- GAME: WORD UNSCRAMBLE (with words and answers) ----------
const wordList = [
  { word: "health", scramble: "htaelh" },
  { word: "beauty", scramble: "utaeby" },
  { word: "fitness", scramble: "stfien s" },
  { word: "wellness", scramble: "lsnwese" },
  { word: "relax", scramble: "lxear" },
];
function WordUnscramble({ onComplete }: { onComplete: (score: number) => void }) {
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const current = wordList[idx];
  if (!current) {
    const oldHigh = localStorage.getItem("word_high");
    if (!oldHigh || score > parseInt(oldHigh)) localStorage.setItem("word_high", score.toString());
    onComplete(score);
    return null;
  }
  const handleCheck = () => {
    if (input.toLowerCase().trim() === current.word) setScore((s) => s + 20);
    if (idx + 1 < wordList.length) {
      setIdx(idx + 1);
      setInput("");
    } else {
      const finalScore = score + (input.toLowerCase().trim() === current.word ? 20 : 0);
      const oldHigh = localStorage.getItem("word_high");
      if (!oldHigh || finalScore > parseInt(oldHigh)) localStorage.setItem("word_high", finalScore.toString());
      onComplete(finalScore);
    }
  };
  return (
    <div className="text-center space-y-4">
      <p className="text-2xl font-mono tracking-wider">🔀 {current.scramble}</p>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="border p-2 rounded w-48 text-center"
        placeholder="Type the word"
      />
      <button onClick={handleCheck} className="bg-green-500 text-white px-4 py-2 rounded-lg">
        Check
      </button>
      <p>
        Word {idx + 1}/{wordList.length}
      </p>
    </div>
  );
}

// ---------- GAME: REACTION TEST ----------
function ReactionGame({ onComplete }: { onComplete: (score: number) => void }) {
  const [state, setState] = useState<"waiting" | "ready" | "click">("waiting");
  const [startTime, setStartTime] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [lastReaction, setLastReaction] = useState(0);

  useEffect(() => {
    if (state === "ready") {
      const timeout = setTimeout(() => {
        setState("click");
        setStartTime(Date.now());
      }, Math.random() * 2000 + 1000);
      return () => clearTimeout(timeout);
    }
  }, [state]);

  const handleClick = () => {
    if (state === "waiting") {
      setState("ready");
    } else if (state === "click") {
      const rt = Date.now() - startTime;
      setLastReaction(rt);
      setTotalTime((t) => t + rt);
      setAttempts((a) => a + 1);
      if (attempts + 1 === 5) {
        const avgTime = totalTime / attempts;
        const finalScore = Math.floor(Math.max(0, Math.min(100, 100 - avgTime)));
        const oldHigh = localStorage.getItem("reaction_high");
        if (!oldHigh || finalScore > parseInt(oldHigh)) localStorage.setItem("reaction_high", finalScore.toString());
        onComplete(finalScore);
      } else {
        setState("waiting");
      }
    }
  };

  if (attempts === 5) return <div className="text-center">Game Over! Your score is ready.</div>;
  return (
    <div className="text-center space-y-4">
      <div
        onClick={handleClick}
        className={`w-56 h-56 sm:w-64 sm:h-64 mx-auto rounded-full flex items-center justify-center cursor-pointer transition shadow-lg ${
          state === "waiting" ? "bg-red-400" : state === "ready" ? "bg-yellow-400" : "bg-green-500"
        }`}
      >
        <span className="text-white font-bold text-xl">
          {state === "waiting" ? "Wait..." : state === "ready" ? "Ready?" : "CLICK!"}
        </span>
      </div>
      <p>
        Attempt: {attempts + 1} / 5
        {lastReaction > 0 && <span className="ml-2 text-sm text-gray-600"> (Last: {lastReaction} ms)</span>}
      </p>
    </div>
  );
}