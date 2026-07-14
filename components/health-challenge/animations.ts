import { Variants } from 'framer-motion';

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
};

export const scaleIn: Variants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 400, damping: 30 } },
};

export const cardExit: Variants = {
  exit: (direction: 'left' | 'right' | 'up') => ({
    x: direction === 'left' ? -300 : direction === 'right' ? 300 : 0,
    y: direction === 'up' ? -300 : 0,
    rotate: direction === 'left' ? -15 : direction === 'right' ? 15 : 0,
    opacity: 0,
    transition: { duration: 0.3, ease: 'easeInOut' },
  }),
};

export const progressVariants: Variants = {
  initial: { width: 0 },
  animate: (progress: number) => ({
    width: `${progress}%`,
    transition: { duration: 0.6, ease: 'easeInOut' },
  }),
};

export const confettiVariant: Variants = {
  initial: (i: number) => ({
    x: Math.random() * 200 - 100,
    y: -200 - Math.random() * 300,
    rotate: Math.random() * 360,
    scale: Math.random() * 0.5 + 0.5,
    opacity: 1,
  }),
  animate: (i: number) => ({
    y: window.innerHeight + 200,
    rotate: Math.random() * 720,
    opacity: 0,
    transition: {
      duration: 2.5 + Math.random() * 1.5,
      ease: 'easeOut',
      delay: Math.random() * 0.5,
    },
  }),
};