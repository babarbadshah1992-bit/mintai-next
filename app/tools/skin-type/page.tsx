'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Shield, Droplet, Sun, Wind, HelpCircle } from 'lucide-react';

import {
  CalculatorLayout,
  CalculatorRadioInput,
  CalculatorActions,
  Disclaimer,
  FAQAccordion,
  RelatedTools,
} from '@/components/calculator';

// -----------------------------------------------------------------------------
// Questionnaire logic
// -----------------------------------------------------------------------------
interface Question {
  id: string;
  text: string;
  icon?: React.ReactNode;
  options: { value: string; label: string }[];
}

// Mapping answers to skin types
const skinTypeMapping: Record<string, string> = {
  // Example mapping – you can adjust
  normal: 'Normal',
  dry: 'Dry',
  oily: 'Oily',
  combination: 'Combination',
  sensitive: 'Sensitive',
};

// Define questions
const questions: Question[] = [
  {
    id: 'q1',
    text: 'How does your skin feel after cleansing?',
    options: [
      { value: 'tight', label: 'Tight and dry' },
      { value: 'smooth', label: 'Smooth and comfortable' },
      { value: 'oily', label: 'Oily or greasy' },
      { value: 'mixed', label: 'T-zone oily, cheeks dry' },
    ],
  },
  {
    id: 'q2',
    text: 'How often do you experience redness or irritation?',
    options: [
      { value: 'rarely', label: 'Rarely / never' },
      { value: 'sometimes', label: 'Sometimes' },
      { value: 'often', label: 'Often' },
      { value: 'always', label: 'Always' },
    ],
  },
  {
    id: 'q3',
    text: 'How would you describe your pores?',
    options: [
      { value: 'small', label: 'Small and barely visible' },
      { value: 'medium', label: 'Medium / visible' },
      { value: 'large', label: 'Large and prominent' },
      { value: 'mixed', label: 'Large on nose, small elsewhere' },
    ],
  },
  {
    id: 'q4',
    text: 'How does your skin react to new products?',
    options: [
      { value: 'fine', label: 'No reaction' },
      { value: 'mild', label: 'Mild reaction (slight redness)' },
      { value: 'strong', label: 'Strong reaction (burning, stinging)' },
      { value: 'breakouts', label: 'Breaks out in pimples' },
    ],
  },
  {
    id: 'q5',
    text: 'How oily is your skin by mid-day?',
    options: [
      { value: 'none', label: 'Not oily at all' },
      { value: 'slightly', label: 'Slightly oily (T-zone)' },
      { value: 'moderately', label: 'Moderately oily' },
      { value: 'very', label: 'Very oily all over' },
    ],
  },
];

// Simple rule-based classification (for demo purposes)
function determineSkinType(answers: Record<string, string>): string {
  // This is a simplistic rule set – you can enhance it.
  const q1 = answers.q1;
  const q2 = answers.q2;
  const q3 = answers.q3;
  const q4 = answers.q4;
  const q5 = answers.q5;

  let score = { normal: 0, dry: 0, oily: 0, combination: 0, sensitive: 0 };

  // Q1
  if (q1 === 'tight') score.dry += 2;
  else if (q1 === 'smooth') score.normal += 2;
  else if (q1 === 'oily') score.oily += 2;
  else if (q1 === 'mixed') score.combination += 2;

  // Q2 – sensitivity
  if (q2 === 'often' || q2 === 'always') score.sensitive += 2;
  else if (q2 === 'sometimes') score.sensitive += 1;

  // Q3 – pores
  if (q3 === 'small') score.normal += 1;
  else if (q3 === 'large') score.oily += 1;
  else if (q3 === 'mixed') score.combination += 1;

  // Q4 – reaction
  if (q4 === 'strong') score.sensitive += 2;
  else if (q4 === 'mild') score.sensitive += 1;
  else if (q4 === 'breakouts') score.oily += 1;

  // Q5 – oiliness
  if (q5 === 'none') score.dry += 1;
  else if (q5 === 'slightly') score.combination += 1;
  else if (q5 === 'moderately') score.oily += 1;
  else if (q5 === 'very') score.oily += 2;

  // Find the max
  let maxType = 'normal';
  let maxScore = -1;
  for (const [type, val] of Object.entries(score)) {
    if (val > maxScore) {
      maxScore = val;
      maxType = type;
    }
  }
  return skinTypeMapping[maxType] || 'Normal';
}

const DEFAULTS: Record<string, string> = {
  q1: '',
  q2: '',
  q3: '',
  q4: '',
  q5: '',
};

// -----------------------------------------------------------------------------
// Page Component
// -----------------------------------------------------------------------------
export default function SkinTypeCalculatorClient() {
  const [answers, setAnswers] = useState<Record<string, string>>(DEFAULTS);
  const [copied, setCopied] = useState(false);

  // Check if all questions answered
  const allAnswered = Object.values(answers).every(v => v !== '');
  const skinType = allAnswered ? determineSkinType(answers) : null;

  const breadcrumb = [
    { label: 'Tools', href: '/tools' },
    { label: 'Skin Type Calculator', href: '/tools/skin-type' },
  ];

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleReset = () => {
    setAnswers(DEFAULTS);
    setCopied(false);
  };

  const handleCopy = () => {
    if (!skinType) return;
    const text = `My skin type is: ${skinType}. Take the quiz at MintAI!`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWebShare = () => {
    if (!skinType) return;
    const text = `My skin type is: ${skinType}.`;
    if (navigator.share) {
      navigator.share({ title: 'Skin Type Result', text }).catch(() => {});
    } else {
      handleCopy();
    }
  };

  const handleWhatsAppShare = () => {
    if (!skinType) return;
    const text = `🧴 My skin type is: ${skinType}. Find yours at MintAI!`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const faqItems = [
    {
      question: 'What are the main skin types?',
      answer:
        'The five main types are Normal, Dry, Oily, Combination, and Sensitive. Each has different characteristics and care needs.',
    },
    {
      question: 'How accurate is this test?',
      answer:
        'This is a self‑assessment tool. It provides a general indication, but consulting a dermatologist is recommended for a professional diagnosis.',
    },
    {
      question: 'Can my skin type change?',
      answer:
        'Yes, skin type can change due to age, hormones, climate, and skincare routine. Re‑evaluate periodically.',
    },
    {
      question: 'What is combination skin?',
      answer:
        'Combination skin is oily in the T‑zone (forehead, nose, chin) and dry or normal on the cheeks.',
    },
    {
      question: 'What is sensitive skin?',
      answer:
        'Sensitive skin reacts easily to products and environmental factors, often with redness, itching, or burning.',
    },
    {
      question: 'How do I care for my skin type?',
      answer:
        'Use products formulated for your specific type. For example, oily skin benefits from gel cleansers, while dry skin needs rich moisturizers.',
    },
  ];

  const relatedTools = [
    { label: 'Water Intake Calculator', href: '/tools/water', description: 'Hydration guide' },
    { label: 'BMI Calculator', href: '/tools/bmi', description: 'Body Mass Index' },
    { label: 'Calories Calculator', href: '/tools/calories', description: 'Daily calorie needs' },
    { label: 'Protein Calculator', href: '/tools/protein', description: 'Daily protein needs' },
  ];

  // Determine icon and color for result
  const getResultBadge = (type: string) => {
    const map: Record<string, { icon: React.ReactNode; color: string }> = {
      Normal: { icon: <Shield className="w-5 h-5" />, color: 'text-green-500' },
      Dry: { icon: <Droplet className="w-5 h-5" />, color: 'text-blue-500' },
      Oily: { icon: <Sun className="w-5 h-5" />, color: 'text-yellow-500' },
      Combination: { icon: <Wind className="w-5 h-5" />, color: 'text-purple-500' },
      Sensitive: { icon: <HelpCircle className="w-5 h-5" />, color: 'text-pink-500' },
    };
    return map[type] || { icon: <Shield className="w-5 h-5" />, color: 'text-gray-500' };
  };

  return (
    <CalculatorLayout
      breadcrumb={breadcrumb}
      title="Skin Type Calculator"
      description="Answer a few questions to discover your skin type and get personalized care tips."
      icon={<Shield className="w-6 h-6 text-white" />}
    >
      <div className="relative">
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-pink-300/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-rose-300/20 rounded-full blur-3xl" />
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Questions */}
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
              Skin Quiz
              <Sparkles className="w-4 h-4 text-pink-400 ml-2" />
            </h2>

            <div className="space-y-6 relative z-10 mt-5">
              {questions.map((q, index) => (
                <div key={q.id} className="border-b border-gray-200/60 dark:border-gray-700/60 pb-4 last:border-0">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <span className="text-pink-500 text-xs font-bold">Q{index + 1}</span>
                    {q.text}
                  </p>
                  <CalculatorRadioInput
                    name={q.id}
                    label=""
                    selectedValue={answers[q.id] || ''}
                    onChange={(val) => handleAnswerChange(q.id, val)}
                    options={q.options}
                  />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Result */}
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
              Your Skin Type
              <Sparkles className="w-4 h-4 text-rose-400 ml-2" />
            </h2>

            <div className="space-y-4 flex-1 relative z-10 mt-5">
              {!allAnswered ? (
                <div className="p-5 rounded-2xl bg-amber-50/80 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 text-amber-700 dark:text-amber-300 text-sm">
                  Please answer all questions to see your skin type.
                </div>
              ) : (
                <>
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-pink-50/80 to-rose-50/80 dark:from-gray-700/40 dark:to-gray-600/20 border border-pink-200/50 dark:border-pink-800/30 shadow-inner text-center">
                    <div className="flex justify-center mb-2">
                      {getResultBadge(skinType || '').icon}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Your skin type is</p>
                    <p className={`text-3xl font-extrabold ${getResultBadge(skinType || '').color}`}>
                      {skinType}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/60 dark:bg-gray-800/60 border border-gray-200/50 dark:border-gray-700/50 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    <p>
                      {skinType === 'Normal' && 'Your skin is well‑balanced. Maintain with gentle cleansers and moisturisers.'}
                      {skinType === 'Dry' && 'Your skin lacks moisture. Use hydrating serums and rich creams.'}
                      {skinType === 'Oily' && 'Your skin produces excess oil. Use oil‑free, non‑comedogenic products.'}
                      {skinType === 'Combination' && 'You have both oily and dry areas. Use targeted products for each zone.'}
                      {skinType === 'Sensitive' && 'Your skin reacts easily. Choose fragrance‑free, hypoallergenic products.'}
                    </p>
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