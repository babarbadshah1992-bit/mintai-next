'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Ruler, Sparkles, Target, Weight } from 'lucide-react';

import {
  CalculatorLayout,
  CalculatorNumberInput,
  CalculatorRadioInput,
  CalculatorResultCard,
  Disclaimer,
  FAQAccordion,
  RelatedTools,
} from '@/components/calculator';

// -----------------------------------------------------------------------------
// Calculation logic
// -----------------------------------------------------------------------------

// Devine formula (most common for ideal weight)
function getIdealWeight(heightCm: number, gender: string): number {
  const heightInches = heightCm / 2.54;
  const baseHeight = 60; // 5 feet = 60 inches
  const excessInches = Math.max(heightInches - baseHeight, 0);
  let weightKg;
  if (gender === 'male') {
    weightKg = 50 + 2.3 * excessInches;
  } else {
    weightKg = 45.5 + 2.3 * excessInches;
  }
  return parseFloat(weightKg.toFixed(1));
}

// Healthy BMI range (18.5 – 24.9)
function getHealthyWeightRange(heightCm: number): { low: number; high: number } {
  const heightM = heightCm / 100;
  const low = 18.5 * heightM * heightM;
  const high = 24.9 * heightM * heightM;
  return {
    low: parseFloat(low.toFixed(1)),
    high: parseFloat(high.toFixed(1)),
  };
}

// -----------------------------------------------------------------------------
// Page Component
// -----------------------------------------------------------------------------
export default function IdealWeightCalculatorClient() {
  const [height, setHeight] = useState(170);
  const [gender, setGender] = useState('male');

  const idealWeight = useMemo(
    () => getIdealWeight(height, gender),
    [height, gender]
  );
  const healthyRange = useMemo(
    () => getHealthyWeightRange(height),
    [height]
  );

  const breadcrumb = [
    { label: 'Tools', href: '/tools' },
    { label: 'Ideal Weight Calculator', href: '/tools/ideal-weight' },
  ];

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
  ];

  const faqItems = [
    {
      question: 'What is ideal weight?',
      answer:
        'Ideal weight is an estimate of a healthy weight for a person based on height and gender. It is not a fixed number but a general guideline. The Devine formula is commonly used in medical settings.',
    },
    {
      question: 'How is ideal weight calculated?',
      answer:
        'We use the Devine formula: for men, 50 kg + 2.3 kg per inch over 5 feet; for women, 45.5 kg + 2.3 kg per inch over 5 feet. This formula was originally developed for drug dosing but is now widely used as a health reference.',
    },
    {
      question: 'What is the healthy weight range?',
      answer:
        'The healthy weight range is based on a BMI between 18.5 and 24.9. This range is associated with the lowest risk of weight‑related health problems.',
    },
    {
      question: 'Why does the ideal weight differ between men and women?',
      answer:
        'Men and women have different body compositions and muscle mass. The Devine formula accounts for this by using different base weights for each gender.',
    },
    {
      question: 'Is ideal weight the same as target weight?',
      answer:
        'Not necessarily. Ideal weight is a population‑based estimate. Your personal target weight may vary based on muscle mass, bone density, and overall health. Always consult a healthcare provider for personalised advice.',
    },
    {
      question: 'Can I use this if I am an athlete?',
      answer:
        'Athletes with high muscle mass may weigh more than the ideal weight yet be very healthy. This calculator is best used as a general reference, not a diagnostic tool.',
    },
  ];

  const relatedTools = [
    { label: 'BMI Calculator', href: '/tools/bmi', description: 'Body Mass Index' },
    { label: 'Body Fat Calculator', href: '/tools/body-fat', description: 'Body fat percentage' },
    { label: 'BMR Calculator', href: '/tools/bmr', description: 'Basal Metabolic Rate' },
    { label: 'Calories Calculator', href: '/tools/calories', description: 'Daily calorie needs' },
  ];

  return (
    <CalculatorLayout
      breadcrumb={breadcrumb}
      title="Ideal Weight Calculator"
      description="Estimate your ideal weight based on height and gender using the Devine formula."
      icon={<Target className="w-6 h-6 text-white" />}
    >
      <div className="relative">
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-purple-300/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-violet-300/20 rounded-full blur-3xl" />
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Inputs */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl border border-white/40 dark:border-gray-700/40 rounded-3xl shadow-2xl shadow-purple-100/30 dark:shadow-gray-900/60 p-6 sm:p-8 overflow-hidden"
          >
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-purple-400/10 to-violet-400/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-gradient-to-tr from-violet-400/10 to-purple-400/10 rounded-full blur-3xl pointer-events-none" />

            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 relative z-10">
              <span className="w-1.5 h-7 bg-gradient-to-b from-purple-500 to-violet-500 rounded-full" />
              Your Details
              <Sparkles className="w-4 h-4 text-purple-400 ml-2" />
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
              <CalculatorRadioInput
                name="gender"
                label="Gender"
                selectedValue={gender}
                onChange={setGender}
                options={genderOptions}
              />
            </div>
          </motion.div>

          {/* Right: Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl border border-white/40 dark:border-gray-700/40 rounded-3xl shadow-2xl shadow-purple-100/30 dark:shadow-gray-900/60 p-6 sm:p-8 overflow-hidden flex flex-col"
          >
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-violet-400/10 to-purple-400/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-gradient-to-tr from-purple-400/10 to-violet-400/10 rounded-full blur-3xl pointer-events-none" />

            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 relative z-10">
              <span className="w-1.5 h-7 bg-gradient-to-b from-violet-500 to-purple-500 rounded-full" />
              Your Ideal Weight
              <Sparkles className="w-4 h-4 text-violet-400 ml-2" />
            </h2>

            <div className="space-y-4 flex-1 relative z-10 mt-5">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-50/80 to-violet-50/80 dark:from-gray-700/40 dark:to-gray-600/20 border border-purple-200/50 dark:border-purple-800/30 shadow-inner">
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <Target size={14} className="text-purple-500" />
                  Ideal Weight (Devine)
                </p>
                <p className="text-4xl font-extrabold text-purple-600 dark:text-purple-400 tabular-nums">
                  {idealWeight} <span className="text-base font-normal text-gray-500">kg</span>
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-br from-violet-50/80 to-purple-50/80 dark:from-gray-700/40 dark:to-gray-600/20 border border-violet-200/50 dark:border-violet-800/30 shadow-inner">
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <Weight size={14} className="text-violet-500" />
                  Healthy Weight Range (BMI 18.5–24.9)
                </p>
                <p className="text-2xl font-extrabold text-violet-600 dark:text-violet-400 tabular-nums">
                  {healthyRange.low} – {healthyRange.high} <span className="text-base font-normal text-gray-500">kg</span>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/60 dark:bg-gray-800/60 border border-gray-200/50 dark:border-gray-700/50">
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  Your ideal weight is a population‑based estimate. The healthy range gives you a broader target. Always consult a healthcare professional for personalised advice.
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
            <span className="w-1 h-6 bg-gradient-to-b from-purple-500 to-violet-500 rounded-full" />
            Frequently Asked Questions
          </h3>
          <FAQAccordion items={faqItems} />
        </div>
        <div>
          <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
            <span className="w-1 h-5 bg-gradient-to-b from-violet-500 to-purple-500 rounded-full" />
            Related Tools
          </h4>
          <RelatedTools tools={relatedTools} />
        </div>
      </section>
    </CalculatorLayout>
  );
}