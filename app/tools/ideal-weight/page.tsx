'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Weight, Copy, Check, Ruler, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function IdealWeightCalculatorClient() {
  const [gender, setGender] = useState('male');
  const [height, setHeight] = useState(170);
  const [age, setAge] = useState(30);
  const [copied, setCopied] = useState(false);

  const results = useMemo(() => {
    // Devine formula (1974)
    const inches = height / 2.54;
    let idealWeight = 0;
    if (gender === 'male') {
      idealWeight = 50 + 2.3 * (inches - 60);
    } else {
      idealWeight = 45.5 + 2.3 * (inches - 60);
    }
    // BMI-based range (18.5–24.9)
    const heightM = height / 100;
    const lower = 18.5 * heightM * heightM;
    const upper = 24.9 * heightM * heightM;
    return {
      ideal: Math.round(idealWeight * 10) / 10,
      lower: Math.round(lower * 10) / 10,
      upper: Math.round(upper * 10) / 10,
    };
  }, [gender, height]);

  const handleCopy = () => {
    const text = `Ideal Weight: ${results.ideal} kg\nHealthy BMI range: ${results.lower} – ${results.upper} kg`;
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
            <li className="text-gray-700 dark:text-gray-300 font-medium">Ideal Weight Calculator</li>
          </ol>
        </nav>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 shadow-lg shadow-teal-200/40">
              <Weight className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Ideal Weight Calculator
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-8 ml-14">
            Find your ideal body weight based on height, gender, and frame size.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/30 dark:border-gray-700/30 rounded-3xl shadow-2xl shadow-emerald-100/20 dark:shadow-gray-900/50 p-6 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl -mr-10 -mt-10" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl -ml-10 -mb-10" />

            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2 relative z-10">
              <span className="w-1 h-6 bg-gradient-to-b from-teal-500 to-cyan-500 rounded-full"></span>
              Your Details
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
                        className="w-4 h-4 text-teal-600 focus:ring-teal-500"
                      />
                      <span className="text-gray-700 dark:text-gray-300 capitalize">{g}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label htmlFor="height" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                  <Ruler size={16} className="text-teal-500" />
                  Height (cm)
                </label>
                <input
                  id="height"
                  type="number"
                  min="100"
                  max="250"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all shadow-sm hover:shadow-md"
                />
              </div>
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                  <Calendar size={16} className="text-teal-500" />
                  Age (years)
                </label>
                <input
                  id="age"
                  type="number"
                  min="10"
                  max="100"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all shadow-sm hover:shadow-md"
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
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl -mr-10 -mt-10" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl -ml-10 -mb-10" />

            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2 relative z-10">
              <span className="w-1 h-6 bg-gradient-to-b from-cyan-500 to-teal-500 rounded-full"></span>
              Your Results
            </h2>
            <div className="space-y-4 flex-1 relative z-10 mt-4">
              <motion.div whileHover={{ scale: 1.02 }} className="p-4 rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-gray-700/40 dark:to-gray-700/20 border border-teal-100/50 dark:border-gray-600/30 shadow-inner">
                <p className="text-sm text-gray-500 dark:text-gray-400">Ideal Weight (Devine Formula)</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{results.ideal} <span className="text-base font-normal text-gray-500">kg</span></p>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border border-emerald-100/50 dark:border-emerald-800/30 shadow-inner">
                <p className="text-sm text-gray-500 dark:text-gray-400">Healthy BMI Weight Range</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{results.lower} – {results.upper} <span className="text-base font-normal text-gray-500">kg</span></p>
              </motion.div>
            </div>
            <button
              onClick={handleCopy}
              className="mt-6 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-semibold transition-all shadow-lg shadow-teal-200/40 dark:shadow-teal-900/30 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 hover:scale-[1.02] active:scale-[0.98]"
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
              {copied ? 'Copied!' : 'Copy Results'}
            </button>
          </motion.div>
        </div>

        <section className="mt-12 prose prose-emerald dark:prose-invert max-w-none">
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-3xl border border-white/20 dark:border-gray-700/30 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Medical Disclaimer</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">This is an estimate. Consult a doctor for personalized health advice.</p>
          </div>
          <div className="mt-8 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-3xl border border-white/20 dark:border-gray-700/30 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-800 dark:text-gray-200">What is the Devine formula?</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">It's a common method to estimate ideal weight based on height and gender.</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 dark:text-gray-200">Is BMI-based range more accurate?</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">Both have limitations. Use as a general guide, not a strict target.</p>
              </div>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link href="/tools/bmi" className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline">BMI Calculator</Link>
            <Link href="/tools/body-fat" className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline">Body Fat Calculator</Link>
            <Link href="/tools/skin-type" className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline">Skin Type Checker</Link>
          </div>
        </section>
      </div>
    </main>
  );
}