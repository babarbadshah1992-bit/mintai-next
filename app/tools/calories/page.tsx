'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Flame, Activity, Ruler, Weight, Calendar, Sparkles } from 'lucide-react';

import {
  CalculatorLayout,
  CalculatorNumberInput,
  CalculatorSelectInput,
  CalculatorRadioInput,
  CalculatorResultCard,
  CalculatorActions,
  FAQAccordion,
  Disclaimer,
  RelatedTools,
} from '@/components/calculator';

// -----------------------------------------------------------------------------
// Calculation logic (unchanged)
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
export default function CaloriesCalculatorClient() {
  const [age, setAge] = useState(DEFAULTS.age);
  const [gender, setGender] = useState(DEFAULTS.gender);
  const [height, setHeight] = useState(DEFAULTS.height);
  const [weight, setWeight] = useState(DEFAULTS.weight);
  const [activity, setActivity] = useState(DEFAULTS.activity);
  const [copied, setCopied] = useState(false);

  const results = useMemo(() => {
    const bmr = calculateBMR(age, gender, height, weight);
    const multiplier = activityMap[activity] || 1.55;
    const maintenance = Math.round(bmr * multiplier);
    return {
      maintenance,
      weightLoss: Math.round(maintenance - 500),
      weightGain: Math.round(maintenance + 500),
    };
  }, [age, gender, height, weight, activity]);

  const handleCopy = () => {
    const text = `Maintenance: ${results.maintenance} kcal/day\nWeight Loss: ${results.weightLoss} kcal/day\nWeight Gain: ${results.weightGain} kcal/day`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setAge(DEFAULTS.age);
    setGender(DEFAULTS.gender);
    setHeight(DEFAULTS.height);
    setWeight(DEFAULTS.weight);
    setActivity(DEFAULTS.activity);
  };

  const handleWhatsAppShare = () => {
    const text = `My daily calorie needs:\n• Maintenance: ${results.maintenance} kcal/day\n• Weight Loss: ${results.weightLoss} kcal/day\n• Weight Gain: ${results.weightGain} kcal/day`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleWebShare = () => {
    if (navigator.share) {
      const text = `My daily calorie needs:\n• Maintenance: ${results.maintenance} kcal/day\n• Weight Loss: ${results.weightLoss} kcal/day\n• Weight Gain: ${results.weightGain} kcal/day`;
      navigator.share({ title: 'Calories Calculator Results', text }).catch(() => {});
    } else {
      handleCopy();
    }
  };

  // Static data
  const breadcrumb = [
    { label: 'Tools', href: '/tools' },
    { label: 'Calories Calculator', href: '/tools/calories' },
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
      question: 'What is the Mifflin‑St Jeor equation?',
      answer:
        'It is a widely used formula to estimate Basal Metabolic Rate (BMR) based on age, gender, height, and weight. It is considered one of the most accurate predictive equations.',
    },
    {
      question: 'Why are 500 kcal adjustments used?',
      answer:
        'A deficit or surplus of 500 kcal per day typically leads to about 0.5 kg (1 lb) of weight change per week, which is a safe and sustainable rate for most people.',
    },
    {
      question: 'How accurate is this calculator?',
      answer:
        'This calculator provides an estimate based on population averages. Individual metabolic rates can vary due to genetics, body composition, and other factors. For personalized advice, consult a healthcare professional.',
    },
    {
      question: 'Can I use this calculator for weight loss?',
      answer:
        'Yes, the weight loss result shows the daily calorie intake needed to lose about 0.5 kg per week. However, always combine with a balanced diet and regular exercise for best results.',
    },
    {
      question: 'What is the difference between BMR and maintenance calories?',
      answer:
        'BMR (Basal Metabolic Rate) is the number of calories your body burns at complete rest. Maintenance calories are BMR multiplied by an activity factor, representing total daily energy expenditure.',
    },
    {
      question: 'Is this calculator suitable for athletes?',
      answer:
        'Athletes may have higher caloric needs due to intense training. This calculator provides a general estimate, but sports nutritionists often recommend more tailored approaches using body composition and activity tracking.',
    },
    {
      question: 'How often should I recalculate my calorie needs?',
      answer:
        'It is advisable to recalculate whenever your weight, activity level, or goals change significantly. A monthly check‑in can help keep your nutrition plan aligned with your current status.',
    },
    {
      question: 'What if I have a medical condition?',
      answer:
        'If you have any medical condition (e.g., diabetes, thyroid issues), consult your doctor before making dietary changes. This calculator is not a substitute for professional medical advice.',
    },
  ];

  const relatedTools = [
    { label: 'BMI Calculator', href: '/tools/bmi', description: 'Body Mass Index' },
    { label: 'BMR Calculator', href: '/tools/bmr', description: 'Basal Metabolic Rate' },
    { label: 'Protein Calculator', href: '/tools/protein', description: 'Daily protein needs' },
    { label: 'Water Intake', href: '/tools/water', description: 'Hydration guide' },
  ];

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <CalculatorLayout
      breadcrumb={breadcrumb}
      title="Calories Calculator"
      description="Estimate your daily calorie needs for maintenance, weight loss, or weight gain."
      icon={<Flame className="w-6 h-6 text-white" />}
    >
      <div className="relative">
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-orange-300/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-amber-300/20 rounded-full blur-3xl" />
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Inputs */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl border border-white/40 dark:border-gray-700/40 rounded-3xl shadow-2xl shadow-emerald-100/30 dark:shadow-gray-900/60 p-6 sm:p-8 overflow-hidden"
          >
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-orange-400/10 to-amber-400/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-gradient-to-tr from-amber-400/10 to-orange-400/10 rounded-full blur-3xl pointer-events-none" />

            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 relative z-10">
              <span className="w-1.5 h-7 bg-gradient-to-b from-orange-500 to-amber-500 rounded-full" />
              Your Details
              <Sparkles className="w-4 h-4 text-orange-400 ml-2" />
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
            className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl border border-white/40 dark:border-gray-700/40 rounded-3xl shadow-2xl shadow-emerald-100/30 dark:shadow-gray-900/60 p-6 sm:p-8 overflow-hidden flex flex-col"
          >
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-amber-400/10 to-orange-400/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-gradient-to-tr from-orange-400/10 to-amber-400/10 rounded-full blur-3xl pointer-events-none" />

            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 relative z-10">
              <span className="w-1.5 h-7 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full" />
              Your Results
              <Sparkles className="w-4 h-4 text-amber-400 ml-2" />
            </h2>

            <div className="space-y-4 flex-1 relative z-10 mt-5">
              <CalculatorResultCard
                title="Maintenance Calories"
                value={results.maintenance}
                variant="maintenance"
                icon={<Flame className="w-4 h-4" />}
              />
              <CalculatorResultCard
                title="Weight Loss"
                value={results.weightLoss}
                variant="loss"
              />
              <CalculatorResultCard
                title="Weight Gain"
                value={results.weightGain}
                variant="gain"
              />
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
            <span className="w-1 h-6 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full" />
            Frequently Asked Questions
          </h3>
          <FAQAccordion items={faqItems} />
        </div>
        <div>
          <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
            <span className="w-1 h-5 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full" />
            Related Tools
          </h4>
          <RelatedTools tools={relatedTools} />
        </div>
      </section>
    </CalculatorLayout>
  );
}