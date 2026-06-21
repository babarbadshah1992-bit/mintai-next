'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Footprints, Copy, Check, Calendar, Activity } from 'lucide-react';
import Link from 'next/link';

export default function DailyStepsCalculatorClient() {
  const [age, setAge] = useState(30);
  const [activity, setActivity] = useState('moderate');
  const [copied, setCopied] = useState(false);

  const steps = useMemo(() => {
    let base = 10000;
    if (age < 18) base = 12000;
    else if (age < 40) base = 10000;
    else if (age < 60) base = 8000;
    else base = 6000;
    const multipliers = { sedentary: 0.7, light: 0.85, moderate: 1, active: 1.15, veryActive: 1.3 };
    const mult = multipliers[activity as keyof typeof multipliers] || 1;
    return Math.round(base * mult);
  }, [age, activity]);

  const handleCopy = () => {
    const text = `Recommended daily steps: ${steps}`;
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
            <li className="text-gray-700 dark:text-gray-300 font-medium">Daily Steps Calculator</li>
          </ol>
        </nav>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg shadow-green-200/40">
              <Footprints className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
              Daily Steps Calculator
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-8 ml-14">
            Get your recommended daily step count based on age and activity level.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/30 dark:border-gray-700/30 rounded-3xl shadow-2xl shadow-emerald-100/20 dark:shadow-gray-900/50 p-6 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-400/10 rounded-full blur-2xl -mr-10 -mt-10" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -ml-10 -mb-10" />

            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2 relative z-10">
              <span className="w-1 h-6 bg-gradient-to-b from-green-400 to-emerald-500 rounded-full"></span>
              Your Details
            </h2>
            <div className="space-y-4 relative z-10 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                  <Calendar size={16} className="text-green-500" />
                  Age (years)
                </label>
                <input
                  type="number"
                  min="5"
                  max="100"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all shadow-sm hover:shadow-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                  <Activity size={16} className="text-green-500" />
                  Activity Level
                </label>
                <select
                  value={activity}
                  onChange={(e) => setActivity(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all shadow-sm hover:shadow-md"
                >
                  <option value="sedentary">Sedentary (desk job)</option>
                  <option value="light">Lightly active (walking)</option>
                  <option value="moderate">Moderately active (exercise 1-3 days)</option>
                  <option value="active">Active (exercise 4-6 days)</option>
                  <option value="veryActive">Very active (daily intense)</option>
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
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -mr-10 -mt-10" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-green-400/10 rounded-full blur-2xl -ml-10 -mb-10" />

            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2 relative z-10">
              <span className="w-1 h-6 bg-gradient-to-b from-emerald-500 to-green-400 rounded-full"></span>
              Your Result
            </h2>
            <div className="flex-1 flex items-center justify-center p-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-100/50 dark:border-green-800/30 shadow-inner relative z-10">
              <div className="text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">Recommended Steps Per Day</p>
                <p className="text-5xl font-bold text-green-600 dark:text-green-400">{steps.toLocaleString()}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">~ {Math.round(steps * 0.8 / 1000)} km</p>
              </div>
            </div>
            <button
              onClick={handleCopy}
              className="mt-6 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white font-semibold transition-all shadow-lg shadow-green-200/40 dark:shadow-green-900/30 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 hover:scale-[1.02] active:scale-[0.98]"
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
              {copied ? 'Copied!' : 'Copy Result'}
            </button>
          </motion.div>
        </div>

        <section className="mt-12 prose prose-emerald dark:prose-invert max-w-none">
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-3xl border border-white/20 dark:border-gray-700/30 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Disclaimer</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">This is a general recommendation. Consult a doctor for personalized advice.</p>
          </div>
        </section>
      </div>
    </main>
  );
}