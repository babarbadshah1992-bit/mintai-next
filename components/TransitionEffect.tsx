"use client";

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface TransitionEffectProps {
  children: ReactNode;
}

const TransitionEffect = ({ children }: TransitionEffectProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 25,
        duration: 0.6,
      }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
};

export default TransitionEffect;