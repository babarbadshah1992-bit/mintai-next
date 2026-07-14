'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { Result } from './types';
import { scaleIn } from './animations';

interface ResultModalProps {
  result: Result;
  onRestart: () => void;
  onClose: () => void;
}

function Confetti() {
  const colors = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#9B59B6', '#FF9FF3'];
  const particles = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    color: colors[Math.floor(Math.random() * colors.length)],
    x: Math.random() * window.innerWidth,
    y: -20 - Math.random() * 100,
    size: Math.random() * 8 + 4,
    duration: 2 + Math.random() * 3,
    delay: Math.random() * 0.8,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
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
            scale: 0.5,
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
  const count = useMotionValue(0);
  // 👇 now returns a string MotionValue (so TypeScript is happy)
  const displayScore = useTransform(count, (v) => Math.round(v).toString());

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(true), 300);
    const animation = animate(count, result.score, {
      duration: 1.5,
      ease: 'easeOut',
    });
    return () => {
      clearTimeout(timer);
      animation.stop();
    };
  }, [count, result.score]);

  const ratingColor = {
    Excellent: 'text-green-500',
    Good: 'text-blue-500',
    Average: 'text-yellow-500',
    Poor: 'text-red-500',
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
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
      >
        <motion.div
          className="relative max-w-md w-full max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-6 space-y-4"
          variants={scaleIn}
          initial="hidden"
          animate="visible"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition"
          >
            ✕
          </button>

          <div className="text-center">
            <div className="relative inline-block">
              <svg className="w-32 h-32">
                <circle
                  className="text-gray-200 dark:text-gray-700"
                  strokeWidth="6"
                  stroke="currentColor"
                  fill="transparent"
                  r="56"
                  cx="64"
                  cy="64"
                />
                <motion.circle
                  className="text-blue-500"
                  strokeWidth="6"
                  stroke="currentColor"
                  fill="transparent"
                  r="56"
                  cx="64"
                  cy="64"
                  initial={{ strokeDasharray: 2 * Math.PI * 56 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 56 * (1 - result.score / 100) }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  style={{
                    strokeDasharray: 2 * Math.PI * 56,
                    strokeLinecap: 'round',
                    transformOrigin: 'center',
                    transform: 'rotate(-90deg)',
                  }}
                />
                {/* ✅ FIX: use motion.text and pass the MotionValue as children */}
                <motion.text
                  x="50%"
                  y="50%"
                  dominantBaseline="central"
                  textAnchor="middle"
                  className="text-3xl font-bold fill-gray-800 dark:fill-white"
                >
                  {displayScore}
                </motion.text>
              </svg>
            </div>
            <div className="mt-2">
              <span className={`text-xl font-bold ${ratingColor}`}>
                {result.lifestyleRating}
              </span>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Health Age: {result.healthAge} years
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded-xl">
              <h4 className="font-semibold text-green-700 dark:text-green-300">Strengths</h4>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300">
                {result.strengths.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
            <div className="bg-red-50 dark:bg-red-900/30 p-3 rounded-xl">
              <h4 className="font-semibold text-red-700 dark:text-red-300">Risk Areas</h4>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300">
                {result.riskAreas.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl">
            <h4 className="font-semibold text-blue-700 dark:text-blue-300">AI Tips</h4>
            <ul className="list-decimal list-inside text-gray-600 dark:text-gray-300 text-sm">
              {result.tips.map((tip, i) => <li key={i}>{tip}</li>)}
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={shareWhatsApp}
              className="flex-1 py-3 rounded-full bg-green-500 text-white font-semibold shadow-lg hover:bg-green-600 transition flex items-center justify-center gap-2"
            >
              <span>Share on WhatsApp</span>
            </button>
            <button
              onClick={onRestart}
              className="flex-1 py-3 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              Restart Challenge
            </button>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}