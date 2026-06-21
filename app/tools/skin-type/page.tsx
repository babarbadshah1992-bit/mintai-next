'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Droplets, Copy, Check } from 'lucide-react';
import Link from 'next/link';

export default function SkinTypeCalculatorClient() {
  const [answers, setAnswers] = useState([0, 0, 0, 0, 0]);
  const [copied, setCopied] = useState(false);

  const questions = [
    "How does your skin feel 1 hour after washing?",
    "How oily is your T-zone (forehead, nose, chin)?",
    "How does your skin react to new products?",
    "How often do you experience dryness?",
    "How visible are your pores?"
  ];
  const options = [
    ["Tight and flaky", "Normal", "Slightly oily", "Very oily"],
    ["Not oily", "Slightly oily", "Oily", "Very oily"],
    ["Often irritated", "Sometimes", "Rarely", "Never"],
    ["Frequently", "Sometimes", "Rarely", "Never"],
    ["Very visible", "Visible", "Less visible", "Barely visible"],
  ];
  const scores = [0, 1, 2, 3];

  const handleAnswer = (qIndex: number, optIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[qIndex] = scores[optIndex];
    setAnswers(newAnswers);
  };

  const result = useMemo(() => {
    const total = answers.reduce((a, b) => a + b, 0);
    if (total < 4) return "Dry Skin";
    if (total < 7) return "Normal Skin";
    if (total < 11) return "Combination Skin";
    if (total < 14) return "Oily Skin";
    return "Sensitive Skin";
  }, [answers]);

  const handleCopy = () => {
    const text = `Your skin type: ${result}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50/30 via-white to-green-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1">
            <li><Link href="/tools" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Tools</Link></li>
            <li>/</li>
            <li className="text-gray-700 dark:text-gray-300 font-medium">Skin Type Checker</li>
          </ol>
        </nav>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-rose-400 to-pink-500 shadow-lg shadow-rose-200/40">
              <Droplets className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent">
              Skin Type Checker
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-8 ml-14">
            Answer a few questions to identify your skin type.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/30 dark:border-gray-700/30 rounded-3xl shadow-2xl shadow-emerald-100/20 dark:shadow-gray-900/50 p-6 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-400/10 rounded-full blur-2xl -mr-10 -mt-10" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl -ml-10 -mb-10" />

            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2 relative z-10">
              <span className="w-1 h-6 bg-gradient-to-b from-rose-400 to-pink-500 rounded-full"></span>
              Questionnaire
            </h2>
            <div className="space-y-6 relative z-10 mt-4">
              {questions.map((q, idx) => (
                <div key={idx}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{q}</label>
                  <div className="flex flex-wrap gap-2">
                    {options[idx].map((opt, oi) => (
                      <button
                        key={oi}
                        onClick={() => handleAnswer(idx, oi)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          answers[idx] === scores[oi]
                            ? 'bg-rose-500 text-white shadow-lg shadow-rose-200/40'
                            : 'bg-white/60 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 hover:bg-rose-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/30 dark:border-gray-700/30 rounded-3xl shadow-2xl shadow-emerald-100/20 dark:shadow-gray-900/50 p-6 overflow-hidden flex flex-col"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl -mr-10 -mt-10" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-rose-400/10 rounded-full blur-2xl -ml-10 -mb-10" />

            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2 relative z-10">
              <span className="w-1 h-6 bg-gradient-to-b from-pink-500 to-rose-400 rounded-full"></span>
              Your Skin Type
            </h2>
            <div className="flex-1 flex items-center justify-center p-6 rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 border border-rose-100/50 dark:border-rose-800/30 shadow-inner relative z-10">
              <div className="text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">Result</p>
                <p className="text-4xl font-bold text-rose-600 dark:text-rose-400">{result}</p>
              </div>
            </div>
            <button
              onClick={handleCopy}
              className="mt-6 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white font-semibold transition-all shadow-lg shadow-rose-200/40 dark:shadow-rose-900/30 focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 hover:scale-[1.02] active:scale-[0.98]"
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
              {copied ? 'Copied!' : 'Copy Result'}
            </button>
          </motion.div>
        </div>

        <section className="mt-12 prose prose-emerald dark:prose-invert max-w-none">
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-3xl border border-white/20 dark:border-gray-700/30 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Disclaimer</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">This is a basic assessment. For persistent skin issues, consult a dermatologist.</p>
          </div>
          <div className="mt-8 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-3xl border border-white/20 dark:border-gray-700/30 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">FAQ</h3>
            <div className="space-y-4">
              <div><h4 className="font-medium text-gray-800 dark:text-gray-200">Can skin type change?</h4><p className="text-sm text-gray-600 dark:text-gray-300">Yes, due to hormones, climate, or products.</p></div>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link href="/tools/bmi" className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline">BMI Calculator</Link>
            <Link href="/tools/body-fat" className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline">Body Fat</Link>
          </div>
        </section>
      </div>
    </main>
  );
}