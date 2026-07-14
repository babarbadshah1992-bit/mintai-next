'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import { Result } from './types';
import { scaleIn } from './animations';

interface ResultModalProps {
  result: Result;
  onRestart: () => void;
  onClose: () => void;
}

function Confetti() {
  const colors = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#9B59B6', '#FF9FF3'];
  const particles = Array.from({ length: 100 }, (_, i) => ({
    id: i,
    color: colors[Math.floor(Math.random() * colors.length)],
    x: Math.random() * window.innerWidth,
    y: -20 - Math.random() * 100,
    size: Math.random() * 10 + 4,
    duration: 2 + Math.random() * 3,
    delay: Math.random() * 0.8,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full shadow-lg"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
          }}
          initial={{ opacity: 1, scale: 1, rotate: 0 }}
          animate={{
            y: window.innerHeight + 100,
            opacity: 0,
            rotate: 360,
            scale: 0.3,
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}

export default function ResultModal({ result, onRestart, onClose }: ResultModalProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [displayScore, setDisplayScore] = useState(0);
  const count = useMotionValue(0);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(true), 400);

    // Animate count from 0 to final score
    const animation = animate(count, result.score, {
      duration: 1.8,
      ease: 'easeOut',
    });

    // Update displayScore whenever count changes
    const unsubscribe = count.on('change', (latest) => {
      setDisplayScore(Math.round(latest));
    });

    return () => {
      clearTimeout(timer);
      animation.stop();
      unsubscribe();
    };
  }, [count, result.score]);

  const ratingColor = {
    Excellent: 'text-emerald-400',
    Good: 'text-blue-400',
    Average: 'text-yellow-400',
    Poor: 'text-red-400',
  }[result.lifestyleRating];

  const ratingEmoji = {
    Excellent: '🌟',
    Good: '👍',
    Average: '💪',
    Poor: '💪',
  }[result.lifestyleRating];

  const shareWhatsApp = () => {
    const text = `My MintAI Health Score\nHealth Score: ${result.score}/100\nHealth Age: ${result.healthAge}\nLifestyle Rating: ${result.lifestyleRating}\nGenerated using MintAI\nhttps://mintai.in`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <>
      {showConfetti && <Confetti />}
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
      >
        <motion.div
          className="relative max-w-lg w-full max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-6 md:p-8 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600"
          variants={scaleIn}
          initial="hidden"
          animate="visible"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 transition"
          >
            ✕
          </button>

          {/* Score Circle */}
          <div className="text-center">
            <div className="relative inline-block">
              <svg className="w-36 h-36 md:w-44 md:h-44">
                <circle
                  className="text-gray-200 dark:text-gray-700"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r="62"
                  cx="72"
                  cy="72"
                />
                <motion.circle
                  className="text-emerald-500"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r="62"
                  cx="72"
                  cy="72"
                  initial={{ strokeDasharray: 2 * Math.PI * 62 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 62 * (1 - result.score / 100) }}
                  transition={{ duration: 1.8, ease: 'easeOut' }}
                  style={{
                    strokeDasharray: 2 * Math.PI * 62,
                    strokeLinecap: 'round',
                    transformOrigin: 'center',
                    transform: 'rotate(-90deg)',
                  }}
                />
                {/* ✅ Use plain text with state – no TypeScript error */}
                <text
                  x="50%"
                  y="50%"
                  dominantBaseline="central"
                  textAnchor="middle"
                  className="text-4xl md:text-5xl font-bold fill-gray-800 dark:fill-white"
                >
                  {displayScore}
                </text>
              </svg>
            </div>
            <div className="mt-3">
              <span className={`text-2xl md:text-3xl font-bold ${ratingColor}`}>
                {ratingEmoji} {result.lifestyleRating}
              </span>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Health Age: {result.healthAge} years
              </p>
            </div>
          </div>

          {/* Strengths & Risk Areas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800/50">
              <h4 className="font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                <span>✅</span> Strengths
              </h4>
              <ul className="mt-2 space-y-1 text-sm text-gray-700 dark:text-gray-300">
                {result.strengths.map((s, i) => <li key={i} className="flex items-center gap-1"><span className="text-emerald-500">•</span> {s}</li>)}
              </ul>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-2xl border border-red-200 dark:border-red-800/50">
              <h4 className="font-bold text-red-700 dark:text-red-300 flex items-center gap-2">
                <span>⚠️</span> Risk Areas
              </h4>
              <ul className="mt-2 space-y-1 text-sm text-gray-700 dark:text-gray-300">
                {result.riskAreas.map((r, i) => <li key={i} className="flex items-center gap-1"><span className="text-red-400">•</span> {r}</li>)}
              </ul>
            </div>
          </div>

          {/* AI Tips */}
          <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-200 dark:border-blue-800/50">
            <h4 className="font-bold text-blue-700 dark:text-blue-300 flex items-center gap-2">
              <span>💡</span> AI Tips
            </h4>
            <ul className="mt-2 space-y-2 text-sm text-gray-700 dark:text-gray-300 list-decimal list-inside">
              {result.tips.map((tip, i) => <li key={i}>{tip}</li>)}
            </ul>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              onClick={shareWhatsApp}
              className="flex-1 py-3 rounded-full bg-green-500 hover:bg-green-600 text-white font-semibold shadow-lg shadow-green-500/30 transition flex items-center justify-center gap-2"
            >
              <span>📱 Share on WhatsApp</span>
            </button>
            <button
              onClick={onRestart}
              className="flex-1 py-3 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold transition"
            >
              🔄 Restart
            </button>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}