'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Droplet, Weight, Activity, Sparkles, Target, Flame } from 'lucide-react';

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
const waterFactors: Record<string, { factor: number; label: string }> = {
  sedentary: { factor: 30, label: 'Sedentary' },
  light: { factor: 33, label: 'Lightly active' },
  moderate: { factor: 35, label: 'Moderately active' },
  active: { factor: 38, label: 'Active' },
  athlete: { factor: 42, label: 'Athlete' },
};

function getWaterIntake(weightKg: number, activity: string): {
  ml: number;
  liters: string;
  cups: number;
} {
  const factor = waterFactors[activity]?.factor || 35;
  const ml = Math.round(weightKg * factor);
  const liters = (ml / 1000).toFixed(1);
  const cups = Math.round(ml / 240);
  return { ml, liters, cups };
}

const DEFAULTS = {
  weight: 70,
  activity: 'moderate',
};

// -----------------------------------------------------------------------------
// Page Component
// -----------------------------------------------------------------------------
export default function WaterIntakeCalculatorClient() {
  const [weight, setWeight] = useState(DEFAULTS.weight);
  const [activity, setActivity] = useState(DEFAULTS.activity);
  const [copied, setCopied] = useState(false);

  const result = useMemo(
    () => getWaterIntake(weight, activity),
    [weight, activity]
  );

  const breadcrumb = [
    { label: 'Tools', href: '/tools' },
    { label: 'Water Intake Calculator', href: '/tools/water' },
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
      `Recommended daily water intake: ${result.ml} ml (~${result.liters} L, ${result.cups} cups) based on ${weight} kg and ${activityOptions.find(o => o.value === activity)?.label}`;
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
      `💧 My daily water target: ${result.ml} ml (${result.liters} L). Calculate yours at MintAI!`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleWebShare = () => {
    const text = `Recommended daily water intake: ${result.ml} ml (~${result.liters} L).`;
    if (navigator.share) {
      navigator.share({ title: 'Water Intake Calculator Results', text }).catch(() => {});
    } else {
      handleCopy();
    }
  };

  const faqItems = [
    {
      question: 'How much water should I drink daily?',
      answer:
        'A general recommendation is 30–40 ml per kg of body weight, adjusted for activity level. Active individuals and athletes need more to compensate for fluid loss.',
    },
    {
      question: 'What factors affect water needs?',
      answer:
        'Weight, activity level, climate, health conditions, and pregnancy all influence daily water requirements. This calculator provides a solid baseline.',
    },
    {
      question: 'Can I drink too much water?',
      answer:
        'Overhydration (hyponatremia) is rare but possible. Stick to recommended ranges and listen to your body. Consult a healthcare professional if you have concerns.',
    },
    {
      question: 'Does coffee or tea count toward my intake?',
      answer:
        'Caffeinated beverages do contribute to hydration, but they may have a mild diuretic effect. Water is still the best choice for optimal hydration.',
    },
    {
      question: 'How do I know if I am well hydrated?',
      answer:
        'Look for pale yellow urine, thirst is a late sign. Also, feeling energetic and having moist skin are good indicators.',
    },
    {
      question: 'Should I drink more when exercising?',
      answer:
        'Yes, you lose fluids through sweat. The calculator’s activity factor already accounts for that, but you may need extra during prolonged or intense exercise.',
    },
  ];

  const relatedTools = [
    { label: 'Calories Calculator', href: '/tools/calories', description: 'Daily calorie needs' },
    { label: 'Protein Calculator', href: '/tools/protein', description: 'Daily protein needs' },
    { label: 'BMI Calculator', href: '/tools/bmi', description: 'Body Mass Index' },
    { label: 'BMR Calculator', href: '/tools/bmr', description: 'Basal Metabolic Rate' },
  ];

  return (
    <CalculatorLayout
      breadcrumb={breadcrumb}
      title="Water Intake Calculator"
      description="Estimate your daily water needs based on weight and activity level."
      icon={<Droplet className="w-6 h-6 text-white" />}
    >
      <div className="relative">
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-cyan-300/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl" />
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Inputs */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl border border-white/40 dark:border-gray-700/40 rounded-3xl shadow-2xl shadow-cyan-100/30 dark:shadow-gray-900/60 p-6 sm:p-8 overflow-hidden"
          >
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-gradient-to-tr from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl pointer-events-none" />

            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 relative z-10">
              <span className="w-1.5 h-7 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full" />
              Your Details
              <Sparkles className="w-4 h-4 text-cyan-400 ml-2" />
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
                icon={<Activity size={18} />}
              />
            </div>
          </motion.div>

          {/* Right: Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl border border-white/40 dark:border-gray-700/40 rounded-3xl shadow-2xl shadow-cyan-100/30 dark:shadow-gray-900/60 p-6 sm:p-8 overflow-hidden flex flex-col"
          >
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-gradient-to-tr from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl pointer-events-none" />

            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 relative z-10">
              <span className="w-1.5 h-7 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full" />
              Your Hydration Goal
              <Sparkles className="w-4 h-4 text-blue-400 ml-2" />
            </h2>

            <div className="space-y-4 flex-1 relative z-10 mt-5">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-50/80 to-blue-50/80 dark:from-gray-700/40 dark:to-gray-600/20 border border-cyan-200/50 dark:border-cyan-800/30 shadow-inner">
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <Droplet size={14} className="text-cyan-500" />
                  Daily Water Intake
                </p>
                <p className="text-4xl font-extrabold text-cyan-600 dark:text-cyan-400 tabular-nums">
                  {result.ml} <span className="text-base font-normal text-gray-500">ml</span>
                </p>
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600 dark:text-gray-300">
                  <span>≈ {result.liters} L</span>
                  <span>≈ {result.cups} cups (240 ml)</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/60 dark:bg-gray-800/60 border border-gray-200/50 dark:border-gray-700/50">
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {activity === 'sedentary' && 'Stay hydrated – even with light activity, water supports metabolism and energy.'}
                  {activity === 'light' && 'Keep up the good work – staying hydrated boosts your daily performance.'}
                  {activity === 'moderate' && 'Great balance – proper hydration helps recovery and focus.'}
                  {activity === 'active' && 'You’re active – water is key to maintaining endurance and preventing cramps.'}
                  {activity === 'athlete' && 'High performance requires high hydration – this target supports your training.'}
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
            <span className="w-1 h-6 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full" />
            Frequently Asked Questions
          </h3>
          <FAQAccordion items={faqItems} />
        </div>
        <div>
          <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
            <span className="w-1 h-5 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full" />
            Related Tools
          </h4>
          <RelatedTools tools={relatedTools} />
        </div>
      </section>
    </CalculatorLayout>
  );
}