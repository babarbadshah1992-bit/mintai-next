'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Sparkles, Clock, Baby, Heart } from 'lucide-react';

import {
  CalculatorLayout,
  CalculatorNumberInput,
  CalculatorActions,
  Disclaimer,
  FAQAccordion,
  RelatedTools,
} from '@/components/calculator';

// -----------------------------------------------------------------------------
// Calculation logic
// -----------------------------------------------------------------------------
function isValidDate(year: number, month: number, day: number): boolean {
  const d = new Date(year, month - 1, day);
  return d.getFullYear() === year && d.getMonth() === month - 1 && d.getDate() === day;
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function getPregnancyInfo(lmpDate: Date): {
  dueDate: Date;
  weeks: number;
  trimester: string;
} {
  const dueDate = addDays(lmpDate, 280);
  const now = new Date();
  const diffMs = now.getTime() - lmpDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const weeks = Math.min(Math.max(Math.floor(diffDays / 7), 0), 42);
  let trimester = '';
  if (weeks <= 13) trimester = 'First Trimester (1–13 weeks)';
  else if (weeks <= 27) trimester = 'Second Trimester (14–27 weeks)';
  else if (weeks <= 40) trimester = 'Third Trimester (28–40 weeks)';
  else trimester = 'Past due date';

  return { dueDate, weeks, trimester };
}

const DEFAULTS = {
  day: 1,
  month: 1,
  year: new Date().getFullYear(),
};

// -----------------------------------------------------------------------------
// Page Component
// -----------------------------------------------------------------------------
export default function PregnancyDueDateCalculatorClient() {
  const [day, setDay] = useState(DEFAULTS.day);
  const [month, setMonth] = useState(DEFAULTS.month);
  const [year, setYear] = useState(DEFAULTS.year);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (!isValidDate(year, month, day)) {
      return { error: 'Please enter a valid date.' };
    }
    const lmp = new Date(year, month - 1, day);
    // Validate it's not in the future
    if (lmp > new Date()) {
      return { error: 'LMP cannot be in the future.' };
    }
    const info = getPregnancyInfo(lmp);
    return {
      error: null,
      dueDate: info.dueDate,
      weeks: info.weeks,
      trimester: info.trimester,
    };
  }, [day, month, year]);

  const breadcrumb = [
    { label: 'Tools', href: '/tools' },
    { label: 'Pregnancy Due Date Calculator', href: '/tools/pregnancy-due-date' },
  ];

  const handleCopy = () => {
    if (result.error) return;
    const dueStr = result.dueDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const text = `Due Date: ${dueStr}\nCurrent Week: ${result.weeks}\nTrimester: ${result.trimester}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setDay(DEFAULTS.day);
    setMonth(DEFAULTS.month);
    setYear(DEFAULTS.year);
  };

  const handleWebShare = () => {
    if (result.error) return;
    const dueStr = result.dueDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const text = `My pregnancy due date: ${dueStr}`;
    if (navigator.share) {
      navigator.share({ title: 'Pregnancy Due Date', text }).catch(() => {});
    } else {
      handleCopy();
    }
  };

  const handleWhatsAppShare = () => {
    if (result.error) return;
    const dueStr = result.dueDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const text = `🤰 My pregnancy due date is ${dueStr}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const faqItems = [
    {
      question: 'How is the due date calculated?',
      answer:
        'The due date is estimated by adding 280 days (40 weeks) to the first day of your last menstrual period (LMP). This is known as Naegele’s rule.',
    },
    {
      question: 'What is the first day of LMP?',
      answer:
        'LMP stands for Last Menstrual Period. It is the first day of your last menstrual cycle, which is used as the starting point for calculating your due date.',
    },
    {
      question: 'Is the due date exact?',
      answer:
        'No, only about 5% of babies are born on their exact due date. It is an estimate; most babies are born between 37 and 42 weeks. This tool provides a reference point.',
    },
    {
      question: 'What are trimesters?',
      answer:
        'Pregnancy is divided into three trimesters: first (weeks 1–13), second (weeks 14–27), and third (weeks 28–40). Each stage has different developmental milestones.',
    },
    {
      question: 'What if I don’t remember my LMP?',
      answer:
        'If you are unsure of your LMP, you can ask your healthcare provider for an ultrasound that can give a more accurate estimate of gestational age.',
    },
    {
      question: 'Can I use this if I had IVF?',
      answer:
        'For IVF pregnancies, the due date is usually calculated based on the embryo transfer date, not LMP. Please consult your fertility specialist for a personalised due date.',
    },
  ];

  const relatedTools = [
    { label: 'BMI Calculator', href: '/tools/bmi', description: 'Body Mass Index' },
    { label: 'Calories Calculator', href: '/tools/calories', description: 'Daily calorie needs' },
    { label: 'Ideal Weight Calculator', href: '/tools/ideal-weight', description: 'Ideal weight' },
    { label: 'BMR Calculator', href: '/tools/bmr', description: 'Basal Metabolic Rate' },
  ];

  return (
    <CalculatorLayout
      breadcrumb={breadcrumb}
      title="Pregnancy Due Date Calculator"
      description="Estimate your baby's due date and track your pregnancy progress."
      icon={<Baby className="w-6 h-6 text-white" />}
    >
      <div className="relative">
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-pink-300/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-rose-300/20 rounded-full blur-3xl" />
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Inputs */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl border border-white/40 dark:border-gray-700/40 rounded-3xl shadow-2xl shadow-pink-100/30 dark:shadow-gray-900/60 p-6 sm:p-8 overflow-hidden"
          >
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-pink-400/10 to-rose-400/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-gradient-to-tr from-rose-400/10 to-pink-400/10 rounded-full blur-3xl pointer-events-none" />

            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 relative z-10">
              <span className="w-1.5 h-7 bg-gradient-to-b from-pink-500 to-rose-500 rounded-full" />
              Your Details
              <Sparkles className="w-4 h-4 text-pink-400 ml-2" />
            </h2>

            <div className="space-y-5 relative z-10 mt-5">
              <div className="grid grid-cols-3 gap-3">
                <CalculatorNumberInput
                  id="day"
                  label="Day"
                  value={day}
                  onChange={setDay}
                  min={1}
                  max={31}
                  icon={<Calendar size={16} />}
                />
                <CalculatorNumberInput
                  id="month"
                  label="Month"
                  value={month}
                  onChange={setMonth}
                  min={1}
                  max={12}
                  icon={<Calendar size={16} />}
                />
                <CalculatorNumberInput
                  id="year"
                  label="Year"
                  value={year}
                  onChange={setYear}
                  min={1900}
                  max={2100}
                  icon={<Calendar size={16} />}
                />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Enter the first day of your last menstrual period (LMP).
              </p>
            </div>
          </motion.div>

          {/* Right: Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl border border-white/40 dark:border-gray-700/40 rounded-3xl shadow-2xl shadow-pink-100/30 dark:shadow-gray-900/60 p-6 sm:p-8 overflow-hidden flex flex-col"
          >
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-rose-400/10 to-pink-400/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-gradient-to-tr from-pink-400/10 to-rose-400/10 rounded-full blur-3xl pointer-events-none" />

            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 relative z-10">
              <span className="w-1.5 h-7 bg-gradient-to-b from-rose-500 to-pink-500 rounded-full" />
              Your Pregnancy Info
              <Sparkles className="w-4 h-4 text-rose-400 ml-2" />
            </h2>

            <div className="space-y-4 flex-1 relative z-10 mt-5">
              {result.error ? (
                <div className="p-5 rounded-2xl bg-red-50/80 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30">
                  <p className="text-red-600 dark:text-red-400 font-medium">{result.error}</p>
                </div>
              ) : (
                <>
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-pink-50/80 to-rose-50/80 dark:from-gray-700/40 dark:to-gray-600/20 border border-pink-200/50 dark:border-pink-800/30 shadow-inner">
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                      <Calendar size={14} className="text-pink-500" />
                      Estimated Due Date
                    </p>
                    <p className="text-2xl font-extrabold text-pink-600 dark:text-pink-400">
                      {result.dueDate.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-white/60 dark:bg-gray-800/60 border border-gray-200/50 dark:border-gray-700/50">
                      <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <Clock size={14} className="text-rose-500" />
                        Weeks
                      </p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {result.weeks}
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/60 dark:bg-gray-800/60 border border-gray-200/50 dark:border-gray-700/50">
                      <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <Heart size={14} className="text-rose-500" />
                        Trimester
                      </p>
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 leading-tight">
                        {result.trimester}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>

            <CalculatorActions
              onCopy={handleCopy}
              copied={copied}
              onReset={handleReset}
              onWhatsAppShare={handleWhatsAppShare}
              onWebShare={handleWebShare}
            />
          </motion.div>
        </div>
      </div>

      {/* Footer sections */}
      <section className="mt-12 space-y-8">
        <Disclaimer />
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-2xl rounded-3xl border border-white/30 dark:border-gray-700/30 p-6 sm:p-8 shadow-xl">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <span className="w-1 h-6 bg-gradient-to-b from-pink-500 to-rose-500 rounded-full" />
            Frequently Asked Questions
          </h3>
          <FAQAccordion items={faqItems} />
        </div>
        <div>
          <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
            <span className="w-1 h-5 bg-gradient-to-b from-rose-500 to-pink-500 rounded-full" />
            Related Tools
          </h4>
          <RelatedTools tools={relatedTools} />
        </div>
      </section>
    </CalculatorLayout>
  );
}