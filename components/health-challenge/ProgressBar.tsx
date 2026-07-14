'use client';

import { motion } from 'framer-motion';
import { progressVariants } from './animations';

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const progress = (current / total) * 100;
  return (
    <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
      <motion.div
        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
        variants={progressVariants}
        initial="initial"
        animate="animate"
        custom={progress}
      />
    </div>
  );
}