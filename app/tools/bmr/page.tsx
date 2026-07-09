'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Activity, Ruler, Weight, Calendar, Sparkles, Zap } from 'lucide-react';

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
// Calculation logic (Mifflin‑St Jeor)
// -----------------------------------------------------------------------------
function calculateBMR(age: number, gender: string, heightCm: number, weightKg: number): number {
  if (gender === 'male') return 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  return 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
}

const activityMap: Record<string, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  veryActive: 1.9,
};

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
export default function BMRCalculatorClient() {
  const [age, setAge] = useState(DEFAULTS.age);
  const [gender, setGender] = useState(DEFAULTS.gender);
  const [height, setHeight] = useState(DEFAULTS.height);
  const [weight, setWeight] = useState(DEFAULTS.weight);
  const [activity, setActivity] = useState(DEFAULTS.activity);

  const results = useMemo(() => {
    const bmr = calculateBMR(age, gender, height, weight);
    const tdee = Math.round(bmr * (activityMap[activity] || 1.55));
    return { bmr, tdee };
  }, [age, gender, height, weight, activity]);

  const breadcrumb = [
    { label: 'Tools', href: '/tools' },
    { label: 'BMR Calculator', href: '/tools/bmr' },
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
      question: 'What is BMR?',
      answer:
        'Basal Metabolic Rate (BMR) is the number of calories your body burns at complete rest. It represents the minimum energy needed to keep your body functioning.',
    },
    {
      question: 'How is BMR calculated?',
      answer:
        'The Mifflin‑St Jeor equation is used: for men, BMR = 10×weight(kg) + 6.25×height(cm) − 5×age(y) + 5; for women, BMR = 10×weight + 6.25×height − 5×age − 161.',
    },
    {
      question: 'What is the difference between BMR and TDEE?',
      answer:
        'TDEE (Total Daily Energy Expenditure) is your BMR multiplied by an activity factor. It represents your total daily calorie burn including physical activity.',
    },
    {
      question: 'Why is BMR important?',
      answer:
        'Knowing your BMR helps you plan your calorie intake for weight management, whether you want to lose, gain, or maintain weight.',
    },
    {
      question: 'How accurate is this calculator?',
      answer:
        'This calculator provides a good estimate, but individual variations can occur. For personalized advice, consult a healthcare professional.',
    },
    {
      question: 'What affects BMR?',
      answer:
        'Age, gender, muscle mass, genetics, and hormone levels all influence your BMR. It tends to decrease with age and increases with muscle mass.',
    },
  ];

  const relatedTools = [
    { label: 'Calories Calculator', href: '/tools/calories', description: 'Daily calorie needs' },
    { label: 'BMI Calculator', href: '/tools/bmi', description: 'Body Mass Index' },
    { label: 'Protein Calculator', href: '/tools/protein', description: 'Daily protein needs' },
    { label: 'Water Intake', href: '/tools/water', description: 'Hydration guide' },
  ];

  return (
    <CalculatorLayout
      breadcrumb={breadcrumb}
      title="BMR Calculator"
      description="Calculate your Basal Metabolic Rate and daily energy expenditure."
      icon={<Zap className="w-6 h-6 text-white" />}
    >
      <div className="relative">
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-cyan-300/20 rounded-full blur-3xl" />
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Inputs */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl border border-white/40 dark:border-gray-700/40 rounded-3xl shadow-2xl shadow-blue-100/30 dark:shadow-gray-900/60 p-6 sm:p-8 overflow-hidden"
          >
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-gradient-to-tr from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl pointer-events-none" />

            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 relative z-10">
              <span className="w-1.5 h-7 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full" />
              Your Details
              <Sparkles className="w-4 h-4 text-blue-400 ml-2" />
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
            className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl border border-white/40 dark:border-gray-700/40 rounded-3xl shadow-2xl shadow-blue-100/30 dark:shadow-gray-900/60 p-6 sm:p-8 overflow-hidden flex flex-col"
          >
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-gradient-to-tr from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl pointer-events-none" />

            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 relative z-10">
              <span className="w-1.5 h-7 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full" />
              Your Results
              <Sparkles className="w-4 h-4 text-cyan-400 ml-2" />
            </h2>

            <div className="space-y-4 flex-1 relative z-10 mt-5">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50/80 to-cyan-50/80 dark:from-gray-700/40 dark:to-gray-600/20 border border-blue-200/50 dark:border-blue-800/30 shadow-inner">
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <Zap size={14} className="text-blue-500" />
                  Basal Metabolic Rate (BMR)
                </p>
                <p className="text-3xl sm:text-4xl font-extrabold text-blue-600 dark:text-blue-400 tabular-nums">
                  {Math.round(results.bmr)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">kcal/day</p>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-50/80 to-blue-50/80 dark:from-gray-700/40 dark:to-gray-600/20 border border-cyan-200/50 dark:border-cyan-800/30 shadow-inner">
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <Activity size={14} className="text-cyan-500" />
                  Total Daily Energy Expenditure (TDEE)
                </p>
                <p className="text-3xl sm:text-4xl font-extrabold text-cyan-600 dark:text-cyan-400 tabular-nums">
                  {Math.round(results.tdee)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">kcal/day</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/60 dark:bg-gray-800/60 border border-gray-200/50 dark:border-gray-700/50">
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  Your BMR is the energy your body needs at rest. TDEE includes your activity level – use this to plan your daily calorie intake.
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
            <span className="w-1 h-6 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full" />
            Frequently Asked Questions
          </h3>
          <FAQAccordion items={faqItems} />
        </div>
        <div>
          <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
            <span className="w-1 h-5 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full" />
            Related Tools
          </h4>
          <RelatedTools tools={relatedTools} />
        </div>
      </section>
    </CalculatorLayout>
  );
}