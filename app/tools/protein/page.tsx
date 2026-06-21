'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Beef, Copy, Check, Weight } from 'lucide-react';
import Link from 'next/link';

export default function ProteinCalculatorClient() {
  const [weight, setWeight] = useState(70);
  const [goal, setGoal] = useState('maintain');
  const [copied, setCopied] = useState(false);

  const proteinIntake = useMemo(() => {
    const factors = { maintain: 0.8, muscle: 1.6, weightloss: 1.2 };
    return Math.round(weight * (factors[goal as keyof typeof factors] || 0.8));
  }, [weight, goal]);

  const handleCopy = () => {
    const text = `Daily protein intake: ${proteinIntake} g (${goal} goal)`;
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
            <li className="text-gray-700 dark:text-gray-300 font-medium">Protein Calculator</li>
          </ol>
        </nav>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center gap-3 mb-2">
            <Beef className="w-8 h-8 text-emerald-500" />
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Protein Calculator
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-8">Determine your daily protein needs based on your weight and fitness goal.</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/30 dark:border-gray-700/30 rounded-3xl shadow-xl shadow-emerald-100/20 dark:shadow-gray-900/50 p-6 space-y-5"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="w-1 h-6 bg-emerald-500 rounded-full"></span>
              Your Details
            </h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                  <Weight size={16} className="text-emerald-500" />
                  Weight (kg)
                </label>
                <input id="weight" type="number" min="10" max="500" value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all" />
              </div>
              <div>
                <label htmlFor="goal" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Goal</label>
                <select id="goal" value={goal} onChange={(e) => setGoal(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all">
                  <option value="maintain">Maintain weight (0.8 g/kg)</option>
                  <option value="muscle">Build muscle (1.6 g/kg)</option>
                  <option value="weightloss">Lose weight (1.2 g/kg)</option>
                </select>
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
              <span className="w-1 h-6 bg-teal-500 rounded-full"></span>
              Your Result
            </h2>
            <div className="flex-1 flex items-center justify-center p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-100/50 dark:border-emerald-800/30">
              <div className="text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">Daily Protein Intake</p>
                <p className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">{proteinIntake} <span className="text-xl font-normal text-gray-500">g</span></p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">(based on {goal} goal)</p>
              </div>
            </div>
            <button onClick={handleCopy} className="mt-6 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold transition-all shadow-lg shadow-emerald-200/40 dark:shadow-emerald-900/30 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
              {copied ? <Check size={18} /> : <Copy size={18} />}
              {copied ? 'Copied!' : 'Copy Result'}
            </button>
          </motion.div>
        </div>

        <section className="mt-12 prose prose-emerald dark:prose-invert max-w-none">
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-3xl border border-white/20 dark:border-gray-700/30 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Medical Disclaimer</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Protein needs vary based on activity level, health status, and individual factors. Consult a dietitian for personalized advice.</p>
          </div>
          <div className="mt-8 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-3xl border border-white/20 dark:border-gray-700/30 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h3>
            <div className="space-y-4">
              <div><h4 className="font-medium text-gray-800 dark:text-gray-200">How much protein do I need?</h4><p className="text-sm text-gray-600 dark:text-gray-300">The RDA is 0.8 g/kg for sedentary adults, but athletes may need up to 2.0 g/kg.</p></div>
              <div><h4 className="font-medium text-gray-800 dark:text-gray-200">Can I eat too much protein?</h4><p className="text-sm text-gray-600 dark:text-gray-300">Excessive protein may strain kidneys in susceptible individuals; moderation is key.</p></div>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link href="/tools/calories" className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline">Calories Calculator</Link>
            <Link href="/tools/bmi" className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline">BMI Calculator</Link>
            <Link href="/tools/bmr" className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline">BMR Calculator</Link>
            <Link href="/tools/water" className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline">Water Intake Calculator</Link>
          </div>
        </section>
      </div>
    </main>
  );
}