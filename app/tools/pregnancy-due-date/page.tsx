'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Baby, Copy, Check, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function PregnancyDueDateCalculatorClient() {
  const [lmp, setLmp] = useState('2026-06-01');
  const [copied, setCopied] = useState(false);

  const results = useMemo(() => {
    const lmpDate = new Date(lmp);
    if (isNaN(lmpDate.getTime())) return null;
    // Due date: LMP + 280 days (40 weeks)
    const dueDate = new Date(lmpDate);
    dueDate.setDate(dueDate.getDate() + 280);
    // Current gestational age
    const now = new Date();
    const diff = now.getTime() - lmpDate.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(days / 7);
    const remainingDays = days % 7;
    const totalWeeks = Math.floor(days / 7);
    const trimester = totalWeeks < 13 ? 'First' : totalWeeks < 27 ? 'Second' : 'Third';
    return {
      dueDate: dueDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      weeks: totalWeeks,
      days: remainingDays,
      trimester,
    };
  }, [lmp]);

  const handleCopy = () => {
    if (!results) return;
    const text = `Due Date: ${results.dueDate}\nCurrent: ${results.weeks} weeks ${results.days} days\nTrimester: ${results.trimester}`;
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
            <li className="text-gray-700 dark:text-gray-300 font-medium">Pregnancy Due Date</li>
          </ol>
        </nav>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 shadow-lg shadow-pink-200/40">
              <Baby className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-pink-500 to-rose-600 bg-clip-text text-transparent">
              Pregnancy Due Date Calculator
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-8 ml-14">
            Calculate your estimated due date and current gestational age.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/30 dark:border-gray-700/30 rounded-3xl shadow-2xl shadow-emerald-100/20 dark:shadow-gray-900/50 p-6 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-400/10 rounded-full blur-2xl -mr-10 -mt-10" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl -ml-10 -mb-10" />

            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2 relative z-10">
              <span className="w-1 h-6 bg-gradient-to-b from-pink-400 to-rose-500 rounded-full"></span>
              Your Information
            </h2>
            <div className="space-y-4 relative z-10 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                  <Calendar size={16} className="text-pink-500" />
                  First day of last menstrual period (LMP)
                </label>
                <input
                  type="date"
                  value={lmp}
                  onChange={(e) => setLmp(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all shadow-sm hover:shadow-md"
                />
                <p className="text-xs text-gray-500 mt-2">Or use estimated conception date (LMP + 14 days).</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/30 dark:border-gray-700/30 rounded-3xl shadow-2xl shadow-emerald-100/20 dark:shadow-gray-900/50 p-6 overflow-hidden flex flex-col"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl -mr-10 -mt-10" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-400/10 rounded-full blur-2xl -ml-10 -mb-10" />

            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2 relative z-10">
              <span className="w-1 h-6 bg-gradient-to-b from-rose-500 to-pink-400 rounded-full"></span>
              Your Results
            </h2>
            {results ? (
              <div className="space-y-4 flex-1 relative z-10 mt-4">
                <motion.div whileHover={{ scale: 1.02 }} className="p-4 rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 border border-pink-100/50 dark:border-pink-800/30 shadow-inner">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Estimated Due Date</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{results.dueDate}</p>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border border-emerald-100/50 dark:border-emerald-800/30 shadow-inner">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Current Gestational Age</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{results.weeks} weeks {results.days} days</p>
                  <p className="text-sm font-medium text-pink-600 dark:text-pink-400">{results.trimester} Trimester</p>
                </motion.div>
              </div>
            ) : (
              <p className="text-gray-500">Please enter a valid date.</p>
            )}
            <button
              onClick={handleCopy}
              disabled={!results}
              className="mt-6 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-pink-400 to-rose-500 hover:from-pink-500 hover:to-rose-600 text-white font-semibold transition-all shadow-lg shadow-pink-200/40 dark:shadow-pink-900/30 focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
              {copied ? 'Copied!' : 'Copy Results'}
            </button>
          </motion.div>
        </div>

        <section className="mt-12 prose prose-emerald dark:prose-invert max-w-none">
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-3xl border border-white/20 dark:border-gray-700/30 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Medical Disclaimer</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">This is an estimate. Always confirm with your healthcare provider.</p>
          </div>
          <div className="mt-8 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-3xl border border-white/20 dark:border-gray-700/30 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">FAQ</h3>
            <div className="space-y-4">
              <div><h4 className="font-medium text-gray-800 dark:text-gray-200">How is due date calculated?</h4><p className="text-sm text-gray-600 dark:text-gray-300">LMP + 280 days (40 weeks) is the standard method.</p></div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}