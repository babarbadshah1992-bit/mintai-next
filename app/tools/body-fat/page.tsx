'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Activity, Ruler, Weight, Calendar, Sparkles, User } from 'lucide-react';

import {
  CalculatorLayout,
  CalculatorNumberInput,
  CalculatorSelectInput,
  CalculatorRadioInput,
  CalculatorResultCard,
  Disclaimer,
  FAQAccordion,
  RelatedTools,
} from '@/components/calculator';

// -----------------------------------------------------------------------------
// Calculation logic – Deurenberg formula
// -----------------------------------------------------------------------------
function calculateBodyFat(
  age: number,
  gender: string,
  heightCm: number,
  weightKg: number
): number {
  if (heightCm <= 0 || weightKg <= 0 || age < 1) return 0;
  const bmi = weightKg / ((heightCm / 100) ** 2);
  // Deurenberg formula: 1.20 * BMI + 0.23 * Age - 10.8 * gender - 5.4
  // gender: male = 1, female = 0
  const genderFactor = gender === 'male' ? 1 : 0;
  let bf = 1.20 * bmi + 0.23 * age - 10.8 * genderFactor - 5.4;
  // Clamp to reasonable range
  if (bf < 2) bf = 2;
  if (bf > 70) bf = 70;
  return parseFloat(bf.toFixed(1));
}

function getBodyFatCategory(bf: number, gender: string): string {
  if (gender === 'male') {
    if (bf < 6) return 'Essential fat';
    if (bf < 14) return 'Athletic';
    if (bf < 18) return 'Fitness';
    if (bf < 25) return 'Average';
    return 'Obese';
  } else {
    if (bf < 14) return 'Essential fat';
    if (bf < 21) return 'Athletic';
    if (bf < 25) return 'Fitness';
    if (bf < 32) return 'Average';
    return 'Obese';
  }
}

function getBodyFatColor(bf: number, gender: string): string {
  const category = getBodyFatCategory(bf, gender);
  switch (category) {
    case 'Essential fat': return 'text-purple-600 dark:text-purple-400';
    case 'Athletic': return 'text-blue-600 dark:text-blue-400';
    case 'Fitness': return 'text-green-600 dark:text-green-400';
    case 'Average': return 'text-orange-600 dark:text-orange-400';
    case 'Obese': return 'text-red-600 dark:text-red-400';
    default: return 'text-gray-600 dark:text-gray-400';
  }
}

const DEFAULTS = {
  age: 30,
  gender: 'male',
  height: 170,
  weight: 70,
};

// -----------------------------------------------------------------------------
// Page Component
// -----------------------------------------------------------------------------
export default function BodyFatCalculatorClient() {
  const [age, setAge] = useState(DEFAULTS.age);
  const [gender, setGender] = useState(DEFAULTS.gender);
  const [height, setHeight] = useState(DEFAULTS.height);
  const [weight, setWeight] = useState(DEFAULTS.weight);

  const bodyFat = useMemo(
    () => calculateBodyFat(age, gender, height, weight),
    [age, gender, height, weight]
  );

  const category = getBodyFatCategory(bodyFat, gender);
  const colorClass = getBodyFatColor(bodyFat, gender);

  const breadcrumb = [
    { label: 'Tools', href: '/tools' },
    { label: 'Body Fat Calculator', href: '/tools/body-fat' },
  ];

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
  ];

  const faqItems = [
    {
      question: 'What is body fat percentage?',
      answer:
        'Body fat percentage is the proportion of fat mass to total body weight. It is a better indicator of health than BMI alone.',
    },
    {
      question: 'How is body fat percentage calculated?',
      answer:
        'We use the Deurenberg formula, which estimates body fat based on BMI, age, and gender. It is a validated population‑based equation.',
    },
    {
      question: 'What is a healthy body fat percentage?',
      answer:
        'For men, 18‑24% is average; for women, 25‑31% is average. Athletes have lower percentages, while essential fat is the minimum required for health.',
    },
    {
      question: 'Why does age affect body fat?',
      answer:
        'As we age, muscle mass tends to decrease and fat mass tends to increase, so the formula accounts for age to give a more accurate estimate.',
    },
    {
      question: 'How accurate is this calculator?',
      answer:
        'The Deurenberg formula provides a reasonable estimate for populations, but individual variations (e.g., muscle mass, bone density) can affect accuracy. For precise measurement, consult a professional.',
    },
    {
      question: 'Can I use this if I am an athlete?',
      answer:
        'Athletes with high muscle mass may get overestimated body fat percentages. This tool is best used as a general guide, not a diagnostic tool.',
    },
  ];

  const relatedTools = [
    { label: 'BMI Calculator', href: '/tools/bmi', description: 'Body Mass Index' },
    { label: 'BMR Calculator', href: '/tools/bmr', description: 'Basal Metabolic Rate' },
    { label: 'Calories Calculator', href: '/tools/calories', description: 'Daily calorie needs' },
    { label: 'Protein Calculator', href: '/tools/protein', description: 'Daily protein needs' },
  ];

  return (
    <CalculatorLayout
      breadcrumb={breadcrumb}
      title="Body Fat Calculator"
      description="Estimate your body fat percentage using the Deurenberg formula."
      icon={<User className="w-6 h-6 text-white" />}
    >
      <div className="relative">
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-pink-300/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-rose-300/20 rounded-full blur-3xl" />
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Inputs */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl border border-white/40 dark:border-gray-700/40 rounded-3xl shadow-2xl shadow-pink-100/30 dark:shadow-gray-900/60 p-6 sm:p-8 overflow-hidden"
          >
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-pink-400/10 to-rose-400/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-gradient-to-tr from-rose-400/10 to-pink-400/10 rounded-full blur-3xl pointer-events-none" />

            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 relative z-10">
              <span className="w-1.5 h-7 bg-gradient-to-b from-pink-500 to-rose-500 rounded-full" />
              Your Measurements
              <Sparkles className="w-4 h-4 text-pink-400 ml-2" />
            </h2>

            <div className="space-y-5 relative z-10 mt-5">
              <CalculatorNumberInput
                id="age"
                label="Age (years)"
                value={age}
                onChange={setAge}
                min={1}
                max={120}
                icon={<Calendar size={18} />}
              />
              <CalculatorRadioInput
                name="gender"
                label="Gender"
                selectedValue={gender}
                onChange={setGender}
                options={genderOptions}
              />
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
            className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl border border-white/40 dark:border-gray-700/40 rounded-3xl shadow-2xl shadow-pink-100/30 dark:shadow-gray-900/60 p-6 sm:p-8 overflow-hidden flex flex-col"
          >
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-rose-400/10 to-pink-400/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-gradient-to-tr from-pink-400/10 to-rose-400/10 rounded-full blur-3xl pointer-events-none" />

            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 relative z-10">
              <span className="w-1.5 h-7 bg-gradient-to-b from-rose-500 to-pink-500 rounded-full" />
              Your Body Fat
              <Sparkles className="w-4 h-4 text-rose-400 ml-2" />
            </h2>

            <div className="space-y-4 flex-1 relative z-10 mt-5">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-pink-50/80 to-rose-50/80 dark:from-gray-700/40 dark:to-gray-600/20 border border-pink-200/50 dark:border-pink-800/30 shadow-inner">
                <p className="text-sm text-gray-500 dark:text-gray-400">Estimated Body Fat</p>
                <p className="text-4xl font-extrabold text-pink-600 dark:text-pink-400 tabular-nums">
                  {bodyFat}%
                </p>
                <p className={`text-lg font-semibold mt-1 ${colorClass}`}>
                  {category}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/60 dark:bg-gray-800/60 border border-gray-200/50 dark:border-gray-700/50">
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {category === 'Essential fat' &&
                    'Your body fat is at the essential level. This is the minimum needed for health, but may be too low for some.'}
                  {category === 'Athletic' &&
                    'You are in the athletic range, typical for fit individuals. Maintain a balanced lifestyle.'}
                  {category === 'Fitness' &&
                    'You are in the fitness range, which is healthy and sustainable.'}
                  {category === 'Average' &&
                    'You are in the average range. Consider physical activity and balanced nutrition to maintain or improve.'}
                  {category === 'Obese' &&
                    'Your body fat is in the obese range. Consult a healthcare professional for personalized advice.'}
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
            <span className="w-1 h-6 bg-gradient-to-b from-pink-500 to-rose-500 rounded-full" />
            Frequently Asked Questions
          </h3>
          <FAQAccordion items={faqItems} />
        </div>
        <div>
          <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
            <span className="w-1 h-5 bg-gradient-to-b from-rose-500 to-pink-500 rounded-full" />
            Related Tools
          </h4>
          <RelatedTools tools={relatedTools} />
        </div>
      </section>
    </CalculatorLayout>
  );
}