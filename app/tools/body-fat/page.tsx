'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Ruler, Copy, Check, Weight } from 'lucide-react';
import Link from 'next/link';

export default function BodyFatCalculatorClient() {
  const [gender, setGender] = useState('male');
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(70);
  const [age, setAge] = useState(30);
  const [waist, setWaist] = useState(80);
  const [neck, setNeck] = useState(35);
  const [hip, setHip] = useState(95);
  const [copied, setCopied] = useState(false);

  const results = useMemo(() => {
    // Simple BMI-based estimate (not Navy method)
    const bmi = weight / ((height/100) ** 2);
    let bodyFat = 0;
    if (gender === 'male') {
      bodyFat = 1.20 * bmi + 0.23 * age - 16.2;
    } else {
      bodyFat = 1.20 * bmi + 0.23 * age - 5.4;
    }
    bodyFat = Math.max(3, Math.min(50, bodyFat));
    const category = bodyFat < 10 ? 'Essential Fat' : bodyFat < 20 ? 'Athletic' : bodyFat < 25 ? 'Fitness' : bodyFat < 30 ? 'Acceptable' : 'Overfat';
    return {
      bodyFat: Math.round(bodyFat * 10) / 10,
      category,
      bmi: Math.round(bmi * 10) / 10,
    };
  }, [gender, height, weight, age]);

  const handleCopy = () => {
    const text = `Body Fat: ${results.bodyFat}% (${results.category})\nBMI: ${results.bmi}`;
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
            <li className="text-gray-700 dark:text-gray-300 font-medium">Body Fat Calculator</li>
          </ol>
        </nav>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 shadow-lg shadow-violet-200/40">
              <Ruler className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              Body Fat Calculator
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-8 ml-14">
            Estimate your body fat percentage using simple measurements.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/30 dark:border-gray-700/30 rounded-3xl shadow-2xl shadow-emerald-100/20 dark:shadow-gray-900/50 p-6 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-2xl -mr-10 -mt-10" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl -ml-10 -mb-10" />

            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2 relative z-10">
              <span className="w-1 h-6 bg-gradient-to-b from-violet-500 to-purple-500 rounded-full"></span>
              Your Measurements
            </h2>
            <div className="space-y-4 relative z-10 mt-4">
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
                        className="w-4 h-4 text-violet-600 focus:ring-violet-500"
                      />
                      <span className="text-gray-700 dark:text-gray-300 capitalize">{g}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                  <Weight size={16} className="text-violet-500" />
                  Height (cm)
                </label>
                <input
                  type="number"
                  min="100"
                  max="250"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all shadow-sm hover:shadow-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                  <Weight size={16} className="text-violet-500" />
                  Weight (kg)
                </label>
                <input
                  type="number"
                  min="20"
                  max="300"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all shadow-sm hover:shadow-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                  <Ruler size={16} className="text-violet-500" />
                  Age (years)
                </label>
                <input
                  type="number"
                  min="10"
                  max="100"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all shadow-sm hover:shadow-md"
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/30 dark:border-gray-700/30 rounded-3xl shadow-2xl shadow-emerald-100/20 dark:shadow-gray-900/50 p-6 overflow-hidden flex flex-col"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl -mr-10 -mt-10" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-violet-500/10 rounded-full blur-2xl -ml-10 -mb-10" />

            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2 relative z-10">
              <span className="w-1 h-6 bg-gradient-to-b from-purple-500 to-violet-500 rounded-full"></span>
              Your Results
            </h2>
            <div className="space-y-4 flex-1 relative z-10 mt-4">
              <motion.div whileHover={{ scale: 1.02 }} className="p-4 rounded-2xl bg-gradient-to-br from-violet-50 to-purple-50 dark:from-gray-700/40 dark:to-gray-700/20 border border-violet-100/50 dark:border-gray-600/30 shadow-inner">
                <p className="text-sm text-gray-500 dark:text-gray-400">Body Fat Percentage</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{results.bodyFat}%</p>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">{results.category}</p>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border border-emerald-100/50 dark:border-emerald-800/30 shadow-inner">
                <p className="text-sm text-gray-500 dark:text-gray-400">BMI</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{results.bmi}</p>
              </motion.div>
            </div>
            <button
              onClick={handleCopy}
              className="mt-6 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white font-semibold transition-all shadow-lg shadow-violet-200/40 dark:shadow-violet-900/30 focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 hover:scale-[1.02] active:scale-[0.98]"
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
              {copied ? 'Copied!' : 'Copy Results'}
            </button>
          </motion.div>
        </div>

        <section className="mt-12 prose prose-emerald dark:prose-invert max-w-none">
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-3xl border border-white/20 dark:border-gray-700/30 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Medical Disclaimer</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">This is an estimate, not a substitute for professional body composition analysis.</p>
          </div>
          <div className="mt-8 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-3xl border border-white/20 dark:border-gray-700/30 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h3>
            <div className="space-y-4">
              <div><h4 className="font-medium text-gray-800 dark:text-gray-200">What's a healthy body fat percentage?</h4><p className="text-sm text-gray-600 dark:text-gray-300">Men: 10-20% (fitness), 21-24% (acceptable). Women: 18-28% (fitness), 29-34% (acceptable).</p></div>
              <div><h4 className="font-medium text-gray-800 dark:text-gray-200">Is this method accurate?</h4><p className="text-sm text-gray-600 dark:text-gray-300">This is a rough estimate. For precision, use calipers or DEXA scan.</p></div>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link href="/tools/bmi" className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline">BMI Calculator</Link>
            <Link href="/tools/ideal-weight" className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline">Ideal Weight</Link>
          </div>
        </section>
      </div>
    </main>
  );
}