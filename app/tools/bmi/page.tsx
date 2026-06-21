'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Scale, Copy, Check, Ruler, Weight } from 'lucide-react';
import Link from 'next/link';

export default function BMICalculatorClient() {
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(70);
  const [copied, setCopied] = useState(false);

  const { bmi, category, advice, color } = useMemo(() => {
    if (height <= 0 || weight <= 0) return { bmi: 0, category: '', advice: '', color: 'gray' };
    const heightM = height / 100;
    const bmiValue = weight / (heightM * heightM);
    let category = '', advice = '', color = '';
    if (bmiValue < 18.5) {
      category = 'Underweight';
      advice = 'You may need to gain weight. Consult a dietitian for a healthy plan.';
      color = 'blue';
    } else if (bmiValue < 25) {
      category = 'Normal weight';
      advice = 'Great! Maintain your weight with a balanced diet and regular exercise.';
      color = 'green';
    } else if (bmiValue < 30) {
      category = 'Overweight';
      advice = 'Consider lifestyle changes to reach a healthier weight. Speak with a healthcare provider.';
      color = 'orange';
    } else {
      category = 'Obese';
      advice = 'Weight management is important. Please consult a doctor for personalized guidance.';
      color = 'red';
    }
    return { bmi: Math.round(bmiValue * 10) / 10, category, advice, color };
  }, [height, weight]);

  const handleCopy = () => {
    const text = `BMI: ${bmi} (${category})\n${advice}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const colorMap = {
    blue: 'from-blue-500 to-cyan-500',
    green: 'from-emerald-500 to-green-500',
    orange: 'from-orange-500 to-amber-500',
    red: 'from-rose-500 to-red-500',
    gray: 'from-gray-500 to-gray-400',
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50/30 via-white to-green-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1">
            <li><Link href="/tools" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Tools</Link></li>
            <li>/</li>
            <li className="text-gray-700 dark:text-gray-300 font-medium">BMI Calculator</li>
          </ol>
        </nav>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center gap-3 mb-2">
            <Scale className="w-8 h-8 text-blue-500" />
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              BMI Calculator
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Calculate your Body Mass Index and understand your weight category.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/30 dark:border-gray-700/30 rounded-3xl shadow-xl shadow-emerald-100/20 dark:shadow-gray-900/50 p-6 space-y-5"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
              Your Measurements
            </h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="height" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                  <Ruler size={16} className="text-blue-500" />
                  Height (cm)
                </label>
                <input
                  id="height"
                  type="number"
                  min="50"
                  max="300"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                  <Weight size={16} className="text-blue-500" />
                  Weight (kg)
                </label>
                <input
                  id="weight"
                  type="number"
                  min="10"
                  max="500"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/30 dark:border-gray-700/30 rounded-3xl shadow-xl shadow-emerald-100/20 dark:shadow-gray-900/50 p-6 flex flex-col"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
              <span className="w-1 h-6 bg-cyan-500 rounded-full"></span>
              Your BMI Result
            </h2>
            <div className="space-y-4 flex-1">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`p-4 rounded-2xl bg-gradient-to-br ${colorMap[color as keyof typeof colorMap]} bg-opacity-10 border border-white/20 dark:border-gray-600/30`}
              >
                <p className="text-sm text-gray-500 dark:text-gray-400">BMI Score</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{bmi}</p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`p-4 rounded-2xl bg-gradient-to-br ${colorMap[color as keyof typeof colorMap]} bg-opacity-10 border border-white/20 dark:border-gray-600/30`}
              >
                <p className="text-sm text-gray-500 dark:text-gray-400">Category</p>
                <p className="text-xl font-semibold text-emerald-700 dark:text-emerald-400">{category}</p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-700/30 border border-gray-100/50 dark:border-gray-600/30"
              >
                <p className="text-sm text-gray-500 dark:text-gray-400">Health Advice</p>
                <p className="text-sm text-gray-800 dark:text-gray-200">{advice}</p>
              </motion.div>
            </div>
            <button
              onClick={handleCopy}
              className="mt-6 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold transition-all shadow-lg shadow-blue-200/40 dark:shadow-blue-900/30 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
              BMI is a screening tool, not a diagnostic measure. Always consult a healthcare professional for a complete health assessment.
            </p>
          </div>
          <div className="mt-8 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-3xl border border-white/20 dark:border-gray-700/30 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-800 dark:text-gray-200">What is a healthy BMI range?</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">A BMI between 18.5 and 24.9 is considered normal weight.</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 dark:text-gray-200">Is BMI accurate for everyone?</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">BMI doesn't distinguish between muscle and fat; athletes may have higher BMI but low body fat.</p>
              </div>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link href="/tools/calories" className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline">Calories Calculator</Link>
            <Link href="/tools/bmr" className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline">BMR Calculator</Link>
            <Link href="/tools/protein" className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline">Protein Calculator</Link>
            <Link href="/tools/water" className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline">Water Intake Calculator</Link>
          </div>
        </section>
      </div>
    </main>
  );
}