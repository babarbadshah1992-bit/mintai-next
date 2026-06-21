'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Flame, Copy, Check, Activity, Ruler, Weight, Calendar } from 'lucide-react';
import Link from 'next/link';

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

export default function CaloriesCalculatorClient() {
  const [age, setAge] = useState(30);
  const [gender, setGender] = useState('male');
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(70);
  const [activity, setActivity] = useState('moderate');
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

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50/30 via-white to-green-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1">
            <li><Link href="/tools" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Tools</Link></li>
            <li>/</li>
            <li className="text-gray-700 dark:text-gray-300 font-medium">Calories Calculator</li>
          </ol>
        </nav>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg shadow-orange-200/40">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              Calories Calculator
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-8 ml-14">
            Estimate your daily calorie needs for maintenance, weight loss, or weight gain.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/30 dark:border-gray-700/30 rounded-3xl shadow-2xl shadow-emerald-100/20 dark:shadow-gray-900/50 p-6 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl -mr-10 -mt-10" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl -ml-10 -mb-10" />
            
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2 relative z-10">
              <span className="w-1 h-6 bg-gradient-to-b from-orange-500 to-amber-500 rounded-full"></span>
              Your Details
            </h2>

            <div className="space-y-4 relative z-10 mt-4">
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                  <Calendar size={16} className="text-orange-500" />
                  Age (years)
                </label>
                <input
                  id="age"
                  type="number"
                  min="1"
                  max="120"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all shadow-sm hover:shadow-md"
                />
              </div>

              <div>
                <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Gender</span>
                <div className="flex gap-4">
                  {['male', 'female'].map((g) => (
                    <label key={g} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value={g}
                        checked={gender === g}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="text-gray-700 dark:text-gray-300 capitalize">{g}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="height" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                  <Ruler size={16} className="text-orange-500" />
                  Height (cm)
                </label>
                <input
                  id="height"
                  type="number"
                  min="50"
                  max="300"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all shadow-sm hover:shadow-md"
                />
              </div>

              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                  <Weight size={16} className="text-orange-500" />
                  Weight (kg)
                </label>
                <input
                  id="weight"
                  type="number"
                  min="10"
                  max="500"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all shadow-sm hover:shadow-md"
                />
              </div>

              <div>
                <label htmlFor="activity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                  <Activity size={16} className="text-orange-500" />
                  Activity Level
                </label>
                <select
                  id="activity"
                  value={activity}
                  onChange={(e) => setActivity(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all shadow-sm hover:shadow-md"
                >
                  <option value="sedentary">Sedentary (little or no exercise)</option>
                  <option value="light">Lightly active (1-3 days/week)</option>
                  <option value="moderate">Moderately active (3-5 days/week)</option>
                  <option value="active">Active (6-7 days/week)</option>
                  <option value="veryActive">Very active (hard exercise daily)</option>
                </select>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/30 dark:border-gray-700/30 rounded-3xl shadow-2xl shadow-emerald-100/20 dark:shadow-gray-900/50 p-6 overflow-hidden flex flex-col"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl -mr-10 -mt-10" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl -ml-10 -mb-10" />

            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2 relative z-10">
              <span className="w-1 h-6 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full"></span>
              Your Results
            </h2>

            <div className="space-y-4 flex-1 relative z-10 mt-4">
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                className="p-4 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-700/40 dark:to-gray-700/20 border border-orange-100/50 dark:border-gray-600/30 shadow-inner"
              >
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Flame size={14} className="text-orange-500" /> Maintenance Calories
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {results.maintenance} <span className="text-base font-normal text-gray-500">kcal/day</span>
                </p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                className="p-4 rounded-2xl bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border border-red-100/50 dark:border-red-800/30 shadow-inner"
              >
                <p className="text-sm text-gray-500 dark:text-gray-400">Weight Loss (≈0.5 kg/week)</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {results.weightLoss} <span className="text-base font-normal text-gray-500">kcal/day</span>
                </p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                className="p-4 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-100/50 dark:border-green-800/30 shadow-inner"
              >
                <p className="text-sm text-gray-500 dark:text-gray-400">Weight Gain (≈0.5 kg/week)</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {results.weightGain} <span className="text-base font-normal text-gray-500">kcal/day</span>
                </p>
              </motion.div>
            </div>

            <button
              onClick={handleCopy}
              className="mt-6 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold transition-all shadow-lg shadow-orange-200/40 dark:shadow-orange-900/30 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 hover:scale-[1.02] active:scale-[0.98]"
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
              {copied ? 'Copied!' : 'Copy Results'}
            </button>
          </motion.div>
        </div>

        <section className="mt-12 prose prose-emerald dark:prose-invert max-w-none">
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-3xl border border-white/20 dark:border-gray-700/30 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Medical Disclaimer</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              This calculator provides estimates only and is not a substitute for professional medical advice.
              Always consult a healthcare provider for personalized dietary and health recommendations.
            </p>
          </div>
          <div className="mt-8 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-3xl border border-white/20 dark:border-gray-700/30 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-800 dark:text-gray-200">What is the Mifflin-St Jeor equation?</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  It's a widely used formula to estimate Basal Metabolic Rate (BMR) based on age, gender, height, and weight.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 dark:text-gray-200">Why are 500 kcal adjustments used?</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  A deficit or surplus of 500 kcal per day typically leads to about 0.5 kg (1 lb) of weight change per week, a safe and sustainable rate.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link href="/tools/bmi" className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline">BMI Calculator</Link>
            <Link href="/tools/bmr" className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline">BMR Calculator</Link>
            <Link href="/tools/protein" className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline">Protein Calculator</Link>
            <Link href="/tools/water" className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline">Water Intake Calculator</Link>
          </div>
        </section>
      </div>
    </main>
  );
}