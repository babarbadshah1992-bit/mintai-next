'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Activity, Ruler, Weight, Sparkles, Scale } from 'lucide-react';

import {
  CalculatorLayout,
  CalculatorNumberInput,
  CalculatorResultCard,
  Disclaimer,
  FAQAccordion,
  RelatedTools,
} from '@/components/calculator';

// -----------------------------------------------------------------------------
// Calculation logic (unchanged)
// -----------------------------------------------------------------------------
function calculateBMI(weightKg: number, heightCm: number): number {
  if (heightCm <= 0 || weightKg <= 0) return 0;
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
}

function getBMICategory(bmi: number): { label: string; color: string } {
  if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-600 dark:text-blue-400' };
  if (bmi < 25) return { label: 'Normal weight', color: 'text-green-600 dark:text-green-400' };
  if (bmi < 30) return { label: 'Overweight', color: 'text-orange-600 dark:text-orange-400' };
  return { label: 'Obese', color: 'text-red-600 dark:text-red-400' };
}

const DEFAULTS = {
  height: 170,
  weight: 70,
};

// -----------------------------------------------------------------------------
// Page Component
// -----------------------------------------------------------------------------
export default function BMICalculatorClient() {
  const [height, setHeight] = useState(DEFAULTS.height);
  const [weight, setWeight] = useState(DEFAULTS.weight);

  const bmi = useMemo(() => calculateBMI(weight, height), [weight, height]);
  const category = getBMICategory(bmi);

  const breadcrumb = [
    { label: 'Tools', href: '/tools' },
    { label: 'BMI Calculator', href: '/tools/bmi' },
  ];

  const faqItems = [
    {
      question: 'What is BMI?',
      answer:
        'Body Mass Index (BMI) is a measure of body fat based on height and weight that applies to adult men and women.',
    },
    {
      question: 'How is BMI calculated?',
      answer:
        'BMI is calculated by dividing your weight in kilograms by your height in meters squared (kg/m²).',
    },
    {
      question: 'What does my BMI result mean?',
      answer:
        'Your BMI category indicates whether you are underweight, normal weight, overweight, or obese. It is a screening tool, not a diagnostic one.',
    },
    {
      question: 'Is BMI accurate for athletes?',
      answer:
        'BMI may overestimate body fat in athletes and people with high muscle mass. It is best used as a general guide.',
    },
    {
      question: 'What if my BMI is in the overweight range?',
      answer:
        'If your BMI is 25 or above, consider consulting a healthcare provider for a comprehensive health assessment.',
    },
    {
      question: 'How often should I check my BMI?',
      answer:
        'Checking BMI every few months or when your weight changes significantly can help track your health trends.',
    },
  ];

  const relatedTools = [
    { label: 'Calories Calculator', href: '/tools/calories', description: 'Daily calorie needs' },
    { label: 'BMR Calculator', href: '/tools/bmr', description: 'Basal Metabolic Rate' },
    { label: 'Protein Calculator', href: '/tools/protein', description: 'Daily protein needs' },
    { label: 'Water Intake', href: '/tools/water', description: 'Hydration guide' },
  ];

  return (
    <CalculatorLayout
      breadcrumb={breadcrumb}
      title="BMI Calculator"
      description="Calculate your Body Mass Index and understand your weight category."
      icon={<Scale className="w-6 h-6 text-white" />}
    >
      <div className="relative">
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-indigo-300/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-purple-300/20 rounded-full blur-3xl" />
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Inputs */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl border border-white/40 dark:border-gray-700/40 rounded-3xl shadow-2xl shadow-indigo-100/30 dark:shadow-gray-900/60 p-6 sm:p-8 overflow-hidden"
          >
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-gradient-to-tr from-purple-400/10 to-indigo-400/10 rounded-full blur-3xl pointer-events-none" />

            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 relative z-10">
              <span className="w-1.5 h-7 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full" />
              Your Measurements
              <Sparkles className="w-4 h-4 text-indigo-400 ml-2" />
            </h2>

            <div className="space-y-5 relative z-10 mt-5">
              <CalculatorNumberInput
                id="height"
                label="Height (cm)"
                value={height}
                onChange={setHeight}
                min={50}
                max={300}
                icon={<Ruler size={18} />}
              />
              <CalculatorNumberInput
                id="weight"
                label="Weight (kg)"
                value={weight}
                onChange={setWeight}
                min={10}
                max={500}
                icon={<Weight size={18} />}
              />
            </div>
          </motion.div>

          {/* Right: Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl border border-white/40 dark:border-gray-700/40 rounded-3xl shadow-2xl shadow-indigo-100/30 dark:shadow-gray-900/60 p-6 sm:p-8 overflow-hidden flex flex-col"
          >
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-purple-400/10 to-indigo-400/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-gradient-to-tr from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl pointer-events-none" />

            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 relative z-10">
              <span className="w-1.5 h-7 bg-gradient-to-b from-purple-500 to-indigo-500 rounded-full" />
              Your BMI Result
              <Sparkles className="w-4 h-4 text-purple-400 ml-2" />
            </h2>

            <div className="space-y-4 flex-1 relative z-10 mt-5">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50/80 to-purple-50/80 dark:from-gray-700/40 dark:to-gray-600/20 border border-indigo-200/50 dark:border-indigo-800/30 shadow-inner">
                <p className="text-sm text-gray-500 dark:text-gray-400">Your BMI</p>
                <p className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 tabular-nums">
                  {bmi.toFixed(1)}
                </p>
                <p className={`text-lg font-semibold mt-1 ${category.color}`}>
                  {category.label}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/60 dark:bg-gray-800/60 border border-gray-200/50 dark:border-gray-700/50">
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {bmi < 18.5 &&
                    'You are underweight. Consider a balanced diet to achieve a healthy weight.'}
                  {bmi >= 18.5 && bmi < 25 &&
                    'You are in the normal weight range. Maintain a healthy lifestyle.'}
                  {bmi >= 25 && bmi < 30 &&
                    'You are overweight. Consider a balanced diet and regular exercise.'}
                  {bmi >= 30 &&
                    'You are in the obese range. Please consult a healthcare professional for personalized guidance.'}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer sections */}
      <section className="mt-12 space-y-8">
        <Disclaimer />
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-2xl rounded-3xl border border-white/30 dark:border-gray-700/30 p-6 sm:p-8 shadow-xl">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <span className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full" />
            Frequently Asked Questions
          </h3>
          <FAQAccordion items={faqItems} />
        </div>
        <div>
          <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
            <span className="w-1 h-5 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
            Related Tools
          </h4>
          <RelatedTools tools={relatedTools} />
        </div>
      </section>
    </CalculatorLayout>
  );
}