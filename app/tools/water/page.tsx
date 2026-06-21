'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Droplet, Copy, Check, Weight } from 'lucide-react';
import Link from 'next/link';

export default function WaterCalculatorClient() {
  const [weight, setWeight] = useState(70);
  const [copied, setCopied] = useState(false);

  const waterLiters = useMemo(() => Math.round((weight * 0.035) * 10) / 10, [weight]);
  const waterGlasses = useMemo(() => Math.round(waterLiters / 0.25), [waterLiters]);

  const handleCopy = () => {
    const text = `Daily water intake: ${waterLiters} L (about ${waterGlasses} glasses)`;
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
            <li className="text-gray-700 dark:text-gray-300 font-medium">Water Intake Calculator</li>
          </ol>
        </nav>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center gap-3 mb-2">
            <Droplet className="w-8 h-8 text-sky-500" />
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">
              Water Intake Calculator
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-8">Estimate how much water you should drink daily to stay hydrated.</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/30 dark:border-gray-700/30 rounded-3xl shadow-xl shadow-emerald-100/20 dark:shadow-gray-900/50 p-6 space-y-5"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="w-1 h-6 bg-sky-500 rounded-full"></span>
              Your Details
            </h2>
            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                <Weight size={16} className="text-sky-500" />
                Weight (kg)
              </label>
              <input id="weight" type="number" min="10" max="500" value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/30 dark:border-gray-700/30 rounded-3xl shadow-xl shadow-emerald-100/20 dark:shadow-gray-900/50 p-6 flex flex-col"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
              <span className="w-1 h-6 bg-indigo-500 rounded-full"></span>
              Your Result
            </h2>
            <div className="flex-1 flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-br from-sky-50 to-indigo-50 dark:from-sky-900/20 dark:to-indigo-900/20 border border-sky-100/50 dark:border-sky-800/30 space-y-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">Daily Water Intake</p>
              <p className="text-4xl font-bold text-sky-600 dark:text-sky-400">{waterLiters} <span className="text-xl font-normal text-gray-500">L</span></p>
              <p className="text-sm text-gray-500 dark:text-gray-400">≈ {waterGlasses} glasses (250 ml each)</p>
            </div>
            <button onClick={handleCopy} className="mt-6 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white font-semibold transition-all shadow-lg shadow-sky-200/40 dark:shadow-sky-900/30 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2">
              {copied ? <Check size={18} /> : <Copy size={18} />}
              {copied ? 'Copied!' : 'Copy Result'}
            </button>
          </motion.div>
        </div>

        <section className="mt-12 prose prose-emerald dark:prose-invert max-w-none">
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-3xl border border-white/20 dark:border-gray-700/30 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Medical Disclaimer</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Water needs vary with activity, climate, and health. This is a general estimate; listen to your body and consult a professional if you have specific conditions.</p>
          </div>
          <div className="mt-8 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-3xl border border-white/20 dark:border-gray-700/30 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h3>
            <div className="space-y-4">
              <div><h4 className="font-medium text-gray-800 dark:text-gray-200">How much water should I drink per day?</h4><p className="text-sm text-gray-600 dark:text-gray-300">A common guideline is 30-40 ml per kg of body weight, but adjust based on activity and climate.</p></div>
              <div><h4 className="font-medium text-gray-800 dark:text-gray-200">Does coffee count as water intake?</h4><p className="text-sm text-gray-600 dark:text-gray-300">While caffeinated beverages contribute to hydration, water remains the best choice.</p></div>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link href="/tools/calories" className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline">Calories Calculator</Link>
            <Link href="/tools/bmi" className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline">BMI Calculator</Link>
            <Link href="/tools/bmr" className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline">BMR Calculator</Link>
            <Link href="/tools/protein" className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline">Protein Calculator</Link>
          </div>
        </section>
      </div>
    </main>
  );
}