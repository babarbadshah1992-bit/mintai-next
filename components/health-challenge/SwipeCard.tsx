'use client';

import { useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { Question } from './types';

interface SwipeCardProps {
  question: Question;
  onSwipe: (direction: 'left' | 'right' | 'up') => void;
  index: number;
  total: number;
}

export default function SwipeCard({ question, onSwipe, index, total }: SwipeCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-300, 300], [-25, 25]);
  const scale = useTransform(x, [-300, 0, 300], [0.95, 1, 0.95]);
  const opacity = useTransform(x, [-300, -150, 0, 150, 300], [0.4, 0.8, 1, 0.8, 0.4]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100;
    const offsetX = info.offset.x;
    const offsetY = info.offset.y;

    if (Math.abs(offsetX) > threshold && Math.abs(offsetY) < threshold) {
      onSwipe(offsetX > 0 ? 'right' : 'left');
    } else if (offsetY < -threshold && Math.abs(offsetX) < threshold) {
      onSwipe('up');
    } else {
      x.set(0);
      y.set(0);
    }
  };

  useEffect(() => {
    return () => {
      x.stop();
      y.stop();
    };
  }, [x, y]);

  return (
    <motion.div
      style={{ x, y, rotate, scale, opacity }}
      drag
      dragConstraints={false}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      className="absolute inset-0 w-full h-full rounded-3xl bg-gradient-to-br from-white/90 to-white/60 dark:from-gray-800/90 dark:to-gray-700/60 backdrop-blur-xl border border-white/30 dark:border-gray-600/30 shadow-2xl p-8 flex flex-col items-center justify-center text-center cursor-grab active:cursor-grabbing"
      whileTap={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
    >
      <div className="text-7xl mb-6 drop-shadow-lg">{question.emoji}</div>
      <h3 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-3">
        {question.question}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base px-4 leading-relaxed">
        {question.description}
      </p>
      <div className="absolute bottom-5 left-0 right-0 text-xs text-gray-400 dark:text-gray-500 font-medium tracking-wider">
        {index + 1} / {total}
      </div>
      <div className="absolute top-5 right-5 flex gap-1 opacity-40">
        <span>⬅️</span>
        <span>⬆️</span>
        <span>➡️</span>
      </div>
    </motion.div>
  );
}