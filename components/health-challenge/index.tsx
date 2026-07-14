'use client';

import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { questions } from './questions';
import { Answer, Result } from './types';
import SwipeCard from './SwipeCard';
import ProgressBar from './ProgressBar';
import ResultModal from './ResultModal';
import { fadeInUp } from './animations';

const SCORE_PER_QUESTION = 100 / questions.length;

export default function HealthSwipeChallenge() {
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [result, setResult] = useState<Result | null>(null);

  const totalQuestions = questions.length;
  const isComplete = currentIndex === totalQuestions;

  const computeResult = useCallback(() => {
    let score = 0;
    const strengths: string[] = [];
    const riskAreas: string[] = [];
    const tips: string[] = [];

    questions.forEach((q, idx) => {
      const answer = answers[idx];
      if (answer === 'skip') return;
      const healthy = (answer === 'yes') === q.positive;
      if (healthy) {
        score += SCORE_PER_QUESTION;
        strengths.push(q.category);
      } else {
        riskAreas.push(q.category);
      }
    });

    let rating: Result['lifestyleRating'] = 'Poor';
    if (score >= 80) rating = 'Excellent';
    else if (score >= 60) rating = 'Good';
    else if (score >= 40) rating = 'Average';
    else rating = 'Poor';

    const healthAge = Math.max(18, Math.round(30 + (50 - score) * 0.15));

    const tipMap: Record<string, string> = {
      sleep: 'Establish a consistent sleep schedule and avoid screens before bed.',
      water: 'Carry a water bottle and set hourly reminders to drink.',
      walking: 'Take the stairs and schedule short walks after meals.',
      exercise: 'Try 20‑minute home workouts or join a local gym.',
      smoking: 'Consider nicotine replacement therapy and seek support.',
      alcohol: 'Limit intake to special occasions; try non‑alcoholic alternatives.',
      stress: 'Practice mindfulness, deep breathing, or yoga daily.',
      vegetables: 'Add a serving of vegetables to every meal.',
      fruits: 'Keep fresh fruit visible and replace sugary snacks with fruit.',
      sugar: 'Read labels and gradually reduce added sugar in drinks and foods.',
      fastfood: 'Plan weekly meals and cook at home to avoid fast food.',
      weight: 'Consult a dietitian and focus on balanced nutrition.',
      energy: 'Prioritise sleep, hydration, and regular meals.',
      screentime: 'Set screen‑free hours and use blue‑light filters.',
      mental: 'Dedicate 10 minutes daily to journaling or meditation.',
    };
    riskAreas.forEach(cat => {
      if (tipMap[cat]) tips.push(tipMap[cat]);
    });
    if (tips.length === 0) tips.push('Keep up the great work! Continue your healthy habits.');

    setResult({
      score: Math.round(score),
      healthAge,
      lifestyleRating: rating,
      strengths: strengths.map(c => c.charAt(0).toUpperCase() + c.slice(1)),
      riskAreas: riskAreas.map(c => c.charAt(0).toUpperCase() + c.slice(1)),
      tips,
    });
  }, [answers]);

  const handleAnswer = useCallback(
    (direction: 'left' | 'right' | 'up') => {
      if (isComplete) return;
      let answer: Answer;
      if (direction === 'right') answer = 'yes';
      else if (direction === 'left') answer = 'no';
      else answer = 'skip';

      setAnswers(prev => [...prev, answer]);
      setCurrentIndex(prev => prev + 1);
    },
    [isComplete]
  );

  if (isComplete && !result && answers.length === totalQuestions) {
    computeResult();
  }

  const handleRestart = () => {
    setStarted(false);
    setCurrentIndex(0);
    setAnswers([]);
    setResult(null);
  };

  const handleClose = () => {
    setResult(null);
    setStarted(false);
    setCurrentIndex(0);
    setAnswers([]);
  };

  const currentQuestion = questions[currentIndex];

  return (
    <section className="py-6 px-4 md:py-10 bg-gradient-to-br from-blue-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-lg mx-auto relative">
        {!started ? (
          // START SCREEN
          <motion.div
            className="text-center p-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 dark:border-gray-700/30"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
            <div className="text-7xl mb-4">🩺</div>
            <h2 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              30 Second AI Health Challenge
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Discover your Health Score by swiping only {totalQuestions} cards.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-6 px-8 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl transition"
              onClick={() => setStarted(true)}
            >
              Start Challenge
            </motion.button>
          </motion.div>
        ) : (
          // CHALLENGE MODE
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {currentIndex + 1} of {totalQuestions}
              </span>
              <ProgressBar current={currentIndex} total={totalQuestions} />
            </div>

            <div className="relative h-[460px] md:h-[500px] w-full">
              <AnimatePresence mode="wait">
                {!isComplete && currentQuestion ? (
                  <SwipeCard
                    key={currentQuestion.id}
                    question={currentQuestion}
                    onSwipe={handleAnswer}
                    index={currentIndex}
                    total={totalQuestions}
                  />
                ) : null}
              </AnimatePresence>
              {!isComplete && currentIndex < totalQuestions - 1 && (
                <div className="absolute inset-0 -z-10 scale-[0.96] translate-y-4 opacity-40 bg-white/40 dark:bg-gray-800/40 rounded-3xl border border-white/10 dark:border-gray-700/20" />
              )}
            </div>

            {/* Action Buttons – larger, more tappable */}
            <div className="flex justify-center gap-6 mt-6">
              <button
                onClick={() => handleAnswer('left')}
                className="p-4 bg-red-100 dark:bg-red-900/30 rounded-full shadow-md hover:scale-110 transition active:scale-95"
                aria-label="No"
              >
                <span className="text-2xl">❌</span>
              </button>
              <button
                onClick={() => handleAnswer('up')}
                className="p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-full shadow-md hover:scale-110 transition active:scale-95"
                aria-label="Skip"
              >
                <span className="text-2xl">⏭️</span>
              </button>
              <button
                onClick={() => handleAnswer('right')}
                className="p-4 bg-green-100 dark:bg-green-900/30 rounded-full shadow-md hover:scale-110 transition active:scale-95"
                aria-label="Yes"
              >
                <span className="text-2xl">❤️</span>
              </button>
            </div>
          </div>
        )}

        <AnimatePresence>
          {result && (
            <ResultModal
              result={result}
              onRestart={handleRestart}
              onClose={handleClose}
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}