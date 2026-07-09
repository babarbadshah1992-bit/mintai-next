'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Activity, Ruler, Weight, Calendar, Sparkles, Footprints, Flame } from 'lucide-react';

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
// Calculation logic
// -----------------------------------------------------------------------------
function getStepGoal(activity: string): number {
  switch (activity) {
    case 'sedentary': return 3000;
    case 'light': return 5000;
    case 'moderate': return 7500;
    case 'active': return 10000;
    case 'veryActive': return 15000;
    default: return 7500;
  }
}

function getStrideLength(gender: string, heightCm: number): number {
  // Stride length in cm: 0.413 * height for men, 0.395 * height for women
  const factor = gender === 'male' ? 0.413 : 0.395;
  return heightCm * factor;
}

function getCaloriesPerStep(weightKg: number, strideCm: number): number {
  // Estimate: 0.0005 * weight * stride? Actually simple: ~0.04 per kg per step? Let's use a common estimate: 0.04 * weight (kg) per 1000 steps? 
  // Actually, a common estimate is 0.04 kcal per step per kg? That's too high. Use: 0.0005 * weight (kg) * stride (cm) / 100? Let's simplify.
  // Use MET: walking 3 mph ~ 3.5 METs. Steps per km ~ 1300. Calorie per step = 3.5 * 3.5 * weight / 200? Too complicated.
  // Simpler: average 0.05 kcal per step per kg? Actually, walking burns ~ 0.5 kcal per kg per km, and ~1300 steps per km, so 0.5/1300 ~ 0.00038 per kg per step.
  // So per step per kg: 0.00038. Then per step for weight: weight * 0.00038.
  return weightKg * 0.00038;
}

const DEFAULTS = {
  age: 30,
  gender: 'male',
  height: 170,
  weight: 70,
  activity: 'moderate',
};

// -----------------------------------------------------------------------------
// Page Component
// -----------------------------------------------------------------------------
export default function DailyStepCalculatorClient() {
  const [age, setAge] = useState(DEFAULTS.age);
  const [gender, setGender] = useState(DEFAULTS.gender);
  const [height, setHeight] = useState(DEFAULTS.height);
  const [weight, setWeight] = useState(DEFAULTS.weight);
  const [activity, setActivity] = useState(DEFAULTS.activity);

  const results = useMemo(() => {
    const steps = getStepGoal(activity);
    const stride = getStrideLength(gender, height);
    const calPerStep = getCaloriesPerStep(weight, stride);
    const calories = Math.round(steps * calPerStep);
    const distanceKm = (steps * stride) / 100000; // cm to km
    return { steps, calories, distanceKm: distanceKm.toFixed(2) };
  }, [activity, gender, height, weight]);

  const breadcrumb = [
    { label: 'Tools', href: '/tools' },
    { label: 'Daily Step Calculator', href: '/tools/daily-step' },
  ];

  const activityOptions = [
    { value: 'sedentary', label: 'Sedentary (little or no exercise)' },
    { value: 'light', label: 'Lightly active (1-3 days/week)' },
    { value: 'moderate', label: 'Moderately active (3-5 days/week)' },
    { value: 'active', label: 'Active (6-7 days/week)' },
    { value: 'veryActive', label: 'Very active (hard exercise daily)' },
  ];

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
  ];

  const faqItems = [
    {
      question: 'Why are 10,000 steps recommended?',
      answer:
        'The 10,000 steps goal originated from Japan in the 1960s and has been widely adopted as a target for daily physical activity. It roughly equates to 8 km (5 miles) and burns about 300-500 calories.',
    },
    {
      question: 'How does stride length affect steps?',
      answer:
        'Stride length determines how far you walk per step. Taller people generally have longer strides, so they cover more distance with fewer steps. We use your height and gender to estimate stride length.',
    },
    {
      question: 'How accurate is the calorie estimate?',
      answer:
        'Calorie burn depends on weight, walking speed, terrain, and individual metabolism. Our estimate provides a general guide. For more precise tracking, consider using a fitness tracker.',
    },
    {
      question: 'What is a healthy step goal for me?',
      answer:
        'The CDC recommends at least 150 minutes of moderate-intensity activity per week, which translates to roughly 7,000-10,000 steps per day. Start with a goal that fits your current fitness level and gradually increase.',
    },
    {
      question: 'Can I use this for running?',
      answer:
        'This calculator is designed for walking. Running steps are longer and burn more calories. For running, you might want to adjust the step count or use a different calculator.',
    },
    {
      question: 'Why does weight matter for calorie burn?',
      answer:
        'Heavier individuals burn more calories per step because they require more energy to move their body mass. That is why we include weight in the calorie estimation.',
    },
  ];

  const relatedTools = [
    { label: 'Calories Calculator', href: '/tools/calories', description: 'Daily calorie needs' },
    { label: 'BMI Calculator', href: '/tools/bmi', description: 'Body Mass Index' },
    { label: 'BMR Calculator', href: '/tools/bmr', description: 'Basal Metabolic Rate' },
    { label: 'Body Fat Calculator', href: '/tools/body-fat', description: 'Body fat percentage' },
  ];

  return (
    <CalculatorLayout
      breadcrumb={breadcrumb}
      title="Daily Step Calculator"
      description="Estimate your recommended daily steps and calories burned based on activity level."
      icon={<Footprints className="w-6 h-6 text-white" />}
    >
      <div className="relative">
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-green-300/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-emerald-300/20 rounded-full blur-3xl" />
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Inputs */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl border border-white/40 dark:border-gray-700/40 rounded-3xl shadow-2xl shadow-green-100/30 dark:shadow-gray-900/60 p-6 sm:p-8 overflow-hidden"
          >
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-green-400/10 to-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-gradient-to-tr from-emerald-400/10 to-green-400/10 rounded-full blur-3xl pointer-events-none" />

            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 relative z-10">
              <span className="w-1.5 h-7 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full" />
              Your Details
              <Sparkles className="w-4 h-4 text-green-400 ml-2" />
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
            className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl border border-white/40 dark:border-gray-700/40 rounded-3xl shadow-2xl shadow-green-100/30 dark:shadow-gray-900/60 p-6 sm:p-8 overflow-hidden flex flex-col"
          >
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-emerald-400/10 to-green-400/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-gradient-to-tr from-green-400/10 to-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 relative z-10">
              <span className="w-1.5 h-7 bg-gradient-to-b from-emerald-500 to-green-500 rounded-full" />
              Your Step Goals
              <Sparkles className="w-4 h-4 text-emerald-400 ml-2" />
            </h2>

            <div className="space-y-4 flex-1 relative z-10 mt-5">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-green-50/80 to-emerald-50/80 dark:from-gray-700/40 dark:to-gray-600/20 border border-green-200/50 dark:border-green-800/30 shadow-inner">
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <Footprints size={14} className="text-green-500" />
                  Recommended Daily Steps
                </p>
                <p className="text-3xl sm:text-4xl font-extrabold text-green-600 dark:text-green-400 tabular-nums">
                  {results.steps.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">steps/day</p>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50/80 to-green-50/80 dark:from-gray-700/40 dark:to-gray-600/20 border border-emerald-200/50 dark:border-emerald-800/30 shadow-inner">
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <Flame size={14} className="text-emerald-500" />
                  Estimated Calories Burned
                </p>
                <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">
                  {results.calories} <span className="text-sm font-normal text-gray-500">kcal</span>
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">per day</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/60 dark:bg-gray-800/60 border border-gray-200/50 dark:border-gray-700/50">
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  Distance walked: <strong>~{results.distanceKm} km</strong> (based on your stride length).
                  Start with this goal and gradually increase for better health benefits.
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
            <span className="w-1 h-6 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full" />
            Frequently Asked Questions
          </h3>
          <FAQAccordion items={faqItems} />
        </div>
        <div>
          <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
            <span className="w-1 h-5 bg-gradient-to-b from-emerald-500 to-green-500 rounded-full" />
            Related Tools
          </h4>
          <RelatedTools tools={relatedTools} />
        </div>
      </section>
    </CalculatorLayout>
  );
}