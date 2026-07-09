'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Dumbbell, Weight, Sparkles, Target, Flame } from 'lucide-react';

import {
  CalculatorLayout,
  CalculatorNumberInput,
  CalculatorSelectInput,
  CalculatorResultCard,
  CalculatorActions,
  Disclaimer,
  FAQAccordion,
  RelatedTools,
} from '@/components/calculator';

// -----------------------------------------------------------------------------
// Calculation logic
// -----------------------------------------------------------------------------
const proteinMap: Record<string, { min: number; max: number; label: string }> = {
  sedentary: { min: 0.8, max: 0.8, label: 'Sedentary' },
  light: { min: 1.0, max: 1.2, label: 'Lightly active' },
  moderate: { min: 1.2, max: 1.5, label: 'Moderately active' },
  active: { min: 1.6, max: 2.0, label: 'Active' },
  athlete: { min: 2.0, max: 2.4, label: 'Athlete' },
};

function getProteinRange(weightKg: number, activity: string): { min: number; max: number } {
  const range = proteinMap[activity] || proteinMap.moderate;
  return {
    min: parseFloat((weightKg * range.min).toFixed(1)),
    max: parseFloat((weightKg * range.max).toFixed(1)),
  };
}

const DEFAULTS = {
  weight: 70,
  activity: 'moderate',
};

// -----------------------------------------------------------------------------
// Page Component
// -----------------------------------------------------------------------------
export default function ProteinCalculatorClient() {
  const [weight, setWeight] = useState(DEFAULTS.weight);
  const [activity, setActivity] = useState(DEFAULTS.activity);
  const [copied, setCopied] = useState(false);

  const protein = useMemo(
    () => getProteinRange(weight, activity),
    [weight, activity]
  );

  const breadcrumb = [
    { label: 'Tools', href: '/tools' },
    { label: 'Protein Calculator', href: '/tools/protein' },
  ];

  const activityOptions = [
    { value: 'sedentary', label: 'Sedentary (little or no exercise)' },
    { value: 'light', label: 'Lightly active (1-3 days/week)' },
    { value: 'moderate', label: 'Moderately active (3-5 days/week)' },
    { value: 'active', label: 'Active (6-7 days/week)' },
    { value: 'athlete', label: 'Athlete (intense daily training)' },
  ];

  const handleCopy = () => {
    const text =
      `Recommended daily protein intake: ${protein.min} – ${protein.max} g/day (based on ${weight} kg, ${activityOptions.find(o => o.value === activity)?.label})`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setWeight(DEFAULTS.weight);
    setActivity(DEFAULTS.activity);
  };

  const handleWhatsAppShare = () => {
    const text =
      `💪 My daily protein target: ${protein.min} – ${protein.max} g/day. Calculate yours at MintAI!`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleWebShare = () => {
    const text =
      `Recommended daily protein: ${protein.min} – ${protein.max} g/day.`;
    if (navigator.share) {
      navigator.share({ title: 'Protein Calculator Results', text }).catch(() => {});
    } else {
      handleCopy();
    }
  };

  const faqItems = [
    {
      question: 'How much protein do I need daily?',
      answer:
        'Protein needs vary based on activity level. Sedentary individuals need ~0.8g/kg, active people need 1.2–2.0g/kg, and athletes may need 2.0–2.4g/kg.',
    },
    {
      question: 'What is the best source of protein?',
      answer:
        'High‑quality sources include lean meats, fish, eggs, dairy, legumes, tofu, and quinoa. A balanced diet with varied sources is recommended.',
    },
    {
      question: 'Can I eat too much protein?',
      answer:
        'Excessive protein intake may strain kidneys in some individuals. It is best to stay within recommended ranges and consult a healthcare professional.',
    },
    {
      question: 'Why does activity level affect protein needs?',
      answer:
        'Physical activity increases muscle protein turnover. Active individuals need more protein to repair and build muscle tissue.',
    },
    {
      question: 'Is this calculator suitable for athletes?',
      answer:
        'Yes, we provide a range for athletes (2.0–2.4 g/kg). However, individual needs may vary based on sport, intensity, and goals.',
    },
    {
      question: 'How often should I adjust my protein intake?',
      answer:
        'Recalculate whenever your weight or activity level changes significantly. It is also good to review your diet periodically.',
    },
  ];

  const relatedTools = [
    { label: 'Calories Calculator', href: '/tools/calories', description: 'Daily calorie needs' },
    { label: 'BMI Calculator', href: '/tools/bmi', description: 'Body Mass Index' },
    { label: 'BMR Calculator', href: '/tools/bmr', description: 'Basal Metabolic Rate' },
    { label: 'Ideal Weight Calculator', href: '/tools/ideal-weight', description: 'Ideal weight' },
  ];

  return (
    <CalculatorLayout
      breadcrumb={breadcrumb}
      title="Protein Calculator"
      description="Estimate your daily protein intake based on weight and activity level."
      icon={<Dumbbell className="w-6 h-6 text-white" />}
    >
      <div className="relative">
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-indigo-300/20 rounded-full blur-3xl" />
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Inputs */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl border border-white/40 dark:border-gray-700/40 rounded-3xl shadow-2xl shadow-blue-100/30 dark:shadow-gray-900/60 p-6 sm:p-8 overflow-hidden"
          >
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-gradient-to-tr from-indigo-400/10 to-blue-400/10 rounded-full blur-3xl pointer-events-none" />

            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 relative z-10">
              <span className="w-1.5 h-7 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full" />
              Your Details
              <Sparkles className="w-4 h-4 text-blue-400 ml-2" />
            </h2>

            <div className="space-y-5 relative z-10 mt-5">
              <CalculatorNumberInput
                id="weight"
                label="Weight (kg)"
                value={weight}
                onChange={setWeight}
                min={10}
                max={500}
                icon={<Weight size={18} />}
              />
              <CalculatorSelectInput
                id="activity"
                label="Activity Level"
                value={activity}
                onChange={setActivity}
                options={activityOptions}
                icon={<Dumbbell size={18} />}
              />
            </div>
          </motion.div>

          {/* Right: Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl border border-white/40 dark:border-gray-700/40 rounded-3xl shadow-2xl shadow-blue-100/30 dark:shadow-gray-900/60 p-6 sm:p-8 overflow-hidden flex flex-col"
          >
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-indigo-400/10 to-blue-400/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-gradient-to-tr from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl pointer-events-none" />

            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 relative z-10">
              <span className="w-1.5 h-7 bg-gradient-to-b from-indigo-500 to-blue-500 rounded-full" />
              Your Protein Target
              <Sparkles className="w-4 h-4 text-indigo-400 ml-2" />
            </h2>

            <div className="space-y-4 flex-1 relative z-10 mt-5">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-gray-700/40 dark:to-gray-600/20 border border-blue-200/50 dark:border-blue-800/30 shadow-inner">
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <Target size={14} className="text-blue-500" />
                  Recommended Daily Protein
                </p>
                <p className="text-4xl font-extrabold text-blue-600 dark:text-blue-400 tabular-nums">
                  {protein.min} – {protein.max} <span className="text-base font-normal text-gray-500">g/day</span>
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Based on {weight} kg, {activityOptions.find(o => o.value === activity)?.label}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/60 dark:bg-gray-800/60 border border-gray-200/50 dark:border-gray-700/50">
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  This range supports muscle maintenance and overall health. For muscle gain, aim for the higher end; for weight loss, ensure adequate protein to preserve lean mass.
                </p>
              </div>
            </div>

            <CalculatorActions
              onCopy={handleCopy}
              copied={copied}
              onReset={handleReset}
              onWhatsAppShare={handleWhatsAppShare}
              onWebShare={handleWebShare}
            />
          </motion.div>
        </div>
      </div>

      {/* Footer sections */}
      <section className="mt-12 space-y-8">
        <Disclaimer />
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-2xl rounded-3xl border border-white/30 dark:border-gray-700/30 p-6 sm:p-8 shadow-xl">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <span className="w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full" />
            Frequently Asked Questions
          </h3>
          <FAQAccordion items={faqItems} />
        </div>
        <div>
          <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
            <span className="w-1 h-5 bg-gradient-to-b from-indigo-500 to-blue-500 rounded-full" />
            Related Tools
          </h4>
          <RelatedTools tools={relatedTools} />
        </div>
      </section>
    </CalculatorLayout>
  );
}