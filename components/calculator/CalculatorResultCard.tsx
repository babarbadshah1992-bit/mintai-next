import { ReactNode } from 'react';
import { motion } from 'framer-motion';

type Variant = 'maintenance' | 'loss' | 'gain';

interface CalculatorResultCardProps {
  title: string;
  value: number;
  unit?: string;
  variant: Variant;
  icon?: ReactNode;
}

const variantStyles: Record<Variant, string> = {
  maintenance:
    'bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-700/40 dark:to-gray-700/20 border-orange-100/50 dark:border-gray-600/30',
  loss: 'bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-red-100/50 dark:border-red-800/30',
  gain: 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-100/50 dark:border-green-800/30',
};

const textColor: Record<Variant, string> = {
  maintenance: 'text-gray-900 dark:text-white',
  loss: 'text-red-600 dark:text-red-400',
  gain: 'text-green-600 dark:text-green-400',
};

export default function CalculatorResultCard({
  title,
  value,
  unit = 'kcal/day',
  variant,
  icon,
}: CalculatorResultCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={`p-4 rounded-2xl border shadow-inner ${variantStyles[variant]}`}
    >
      <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
        {icon && <span>{icon}</span>}
        {title}
      </p>
      <p className={`text-2xl font-bold ${textColor[variant]}`}>
        {value} <span className="text-base font-normal text-gray-500">{unit}</span>
      </p>
    </motion.div>
  );
}