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
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);

  const cardRef = useRef<HTMLDivElement>(null);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 80;
    const offsetX = info.offset.x;
    const offsetY = info.offset.y;

    if (Math.abs(offsetX) > threshold && Math.abs(offsetY) < threshold) {
      // horizontal swipe
      if (offsetX > 0) {
        onSwipe('right');
      } else {
        onSwipe('left');
      }
    } else if (offsetY < -threshold && Math.abs(offsetX) < threshold) {
      // upward swipe
      onSwipe('up');
    } else {
      // reset position
      x.set(0);
      y.set(0);
    }
  };

  // Clean up motion values on unmount (no leaks)
  useEffect(() => {
    return () => {
      x.stop();
      y.stop();
    };
  }, [x, y]);

  return (
    <motion.div
      ref={cardRef}
      style={{ x, y, rotate, opacity }}
      drag // ✅ correct – boolean, not string
      dragConstraints={false} // ✅ allow free dragging in any direction
      dragElastic={0.8}       // ✅ gives the elastic feel
      onDragEnd={handleDragEnd}
      className="absolute inset-0 w-full h-full rounded-3xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border border-white/20 dark:border-gray-700/30 shadow-2xl p-6 flex flex-col items-center justify-center text-center cursor-grab active:cursor-grabbing"
      whileTap={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <div className="text-7xl mb-4">{question.emoji}</div>
      <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
        {question.question}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm px-2">
        {question.description}
      </p>
      <div className="absolute bottom-4 left-0 right-0 text-xs text-gray-400 dark:text-gray-500">
        {index + 1} / {total}
      </div>
    </motion.div>
  );
}