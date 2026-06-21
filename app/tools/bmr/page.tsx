'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Heart, Copy, Check, Calendar, Ruler, Weight } from 'lucide-react';
import Link from 'next/link';

function calculateBMR(age: number, gender: string, heightCm: number, weightKg: number): number {
  if (gender === 'male') return 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  return 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
}

export default function BMRCalculatorClient() {
  const [age, setAge] = useState(30);
  const [gender, setGender] = useState('male');
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(70);
  const [copied, setCopied] = useState(false);

  const bmr = useMemo(() => calculateBMR(age, gender, height, weight), [age, gender, height, weight]);
  const dailyCalories = useMemo(() => Math.round(bmr * 1.2), [bmr]);

  const handleCopy = () => {
    const text = `BMR: ${Math.round(bmr)} kcal/day\nDaily calories (sedentary): ${dailyCalories} kcal/day`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50/30 via-white to-green-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1">
            <li><Link href="/tools" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Tools</Link></li>
            <li>/</li>
            <li className="text-gray-700 dark:text-gray-300 font-medium">BMR Calculator</li>
          </ol>
        </nav>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-8 h-8 text-rose-500" />
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
              BMR Calculator
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Basal Metabolic Rate – the calories you burn at rest. Know your daily energy needs.
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
              <span className="w-1 h-6 bg-rose-500 rounded-full"></span>
              Your Details
            </h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                  <Calendar size={16} className="text-rose-500" />
                  Age (years)
                </label>
                <input id="age" type="number" min="1" max="120" value={age} onChange={(e) => setAge(Number(e.target.value))} className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all" />
              </div>
              <div>
                <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Gender</span>
                <div className="flex gap-4">
                  {['male','female'].map(g => (
                    <label key={g} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="gender" value={g} checked={gender===g} onChange={(e) => setGender(e.target.value)} className="w-4 h-4 text-rose-600 focus:ring-rose-500" />
                      <span className="text-gray-700 dark:text-gray-300 capitalize">{g}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label htmlFor="height" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                  <Ruler size={16} className="text-rose-500" />
                  Height (cm)
                </label>
                <input id="height" type="number" min="50" max="300" value={height} onChange={(e) => setHeight(Number(e.target.value))} className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all" />
              </div>
              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                  <Weight size={16} className="text-rose-500" />
                  Weight (kg)
                </label>
                <input id="weight" type="number" min="10" max="500" value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all" />
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
              <span className="w-1 h-6 bg-pink-500 rounded-full"></span>
              Your Results
            </h2>
            <div className="space-y-4 flex-1">
              <motion.div whileHover={{ scale: 1.02 }} className="p-4 rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 border border-rose-100/50 dark:border-rose-800/30">
                <p className="text-sm text-gray-500 dark:text-gray-400">Basal Metabolic Rate (BMR)</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{Math.round(bmr)} <span className="text-base font-normal text-gray-500">kcal/day</span></p>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border border-emerald-100/50 dark:border-emerald-800/30">
                <p className="text-sm text-gray-500 dark:text-gray-400">Estimated Daily Calories (sedentary)</p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{dailyCalories} <span className="text-base font-normal text-gray-500">kcal/day</span></p>
              </motion.div>
            </div>
            <button onClick={handleCopy} className="mt-6 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold transition-all shadow-lg shadow-rose-200/40 dark:shadow-rose-900/30 focus:ring-2 focus:ring-rose-500 focus:ring-offset-2">
              {copied ? <Check size={18} /> : <Copy size={18} />}
              {copied ? 'Copied!' : 'Copy Results'}
            </button>
          </motion.div>
        </div>

        {/* Disclaimer & FAQ similar to above with rose/pink theme */}
        <section className="mt-12 prose prose-emerald dark:prose-invert max-w-none">
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-3xl border border-white/20 dark:border-gray-700/30 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Medical Disclaimer</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">BMR is an estimate. Actual calorie needs vary. Consult a professional for personalized advice.</p>
          </div>
          <div className="mt-8 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-3xl border border-white/20 dark:border-gray-700/30 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h3>
            <div className="space-y-4">
              <div><h4 className="font-medium text-gray-800 dark:text-gray-200">What influences BMR?</h4><p className="text-sm text-gray-600 dark:text-gray-300">Age, gender, muscle mass, and genetics all affect your BMR.</p></div>
              <div><h4 className="font-medium text-gray-800 dark:text-gray-200">How can I increase my BMR?</h4><p className="text-sm text-gray-600 dark:text-gray-300">Building muscle through resistance training can raise your BMR.</p></div>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link href="/tools/calories" className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline">Calories Calculator</Link>
            <Link href="/tools/bmi" className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline">BMI Calculator</Link>
            <Link href="/tools/protein" className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline">Protein Calculator</Link>
            <Link href="/tools/water" className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline">Water Intake Calculator</Link>
          </div>
        </section>
      </div>
    </main>
  );
}