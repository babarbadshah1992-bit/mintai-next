import { Metadata } from 'next';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Flame,
  Scale,
  Heart,
  Beef,
  Droplet,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import TransitionEffect from '@/components/TransitionEffect';

export const metadata: Metadata = {
  title: 'Health & Beauty Calculators | MintAI',
  description:
    'Free AI-powered wellness calculators for calories, BMI, protein, water intake and metabolism. Get instant, professional health insights.',
  keywords: 'health calculators, calorie counter, BMI calculator, BMR calculator, protein intake, water intake, wellness tools',
  openGraph: {
    title: 'Health & Beauty Calculators | MintAI',
    description: 'Free AI-powered wellness calculators for calories, BMI, protein, water intake and metabolism.',
    type: 'website',
    url: 'https://mintai.com/tools',
    siteName: 'MintAI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Health & Beauty Calculators | MintAI',
    description: 'Free AI-powered wellness calculators for calories, BMI, protein, water intake and metabolism.',
  },
};

const tools = [
  {
    slug: 'calories',
    title: '🔥 Calories Calculator',
    description: 'Estimate your daily calorie needs for maintenance, weight loss, or weight gain based on your activity level.',
    icon: Flame,
    gradient: 'from-orange-500 to-amber-500',
    glow: 'shadow-orange-200/40',
  },
  {
    slug: 'bmi',
    title: '⚖️ BMI Calculator',
    description: 'Calculate your Body Mass Index and get personalized health advice and category classification.',
    icon: Scale,
    gradient: 'from-blue-500 to-cyan-500',
    glow: 'shadow-blue-200/40',
  },
  {
    slug: 'bmr',
    title: '❤️ BMR Calculator',
    description: 'Find your Basal Metabolic Rate – the calories you burn at rest – and your daily calorie needs.',
    icon: Heart,
    gradient: 'from-rose-500 to-pink-500',
    glow: 'shadow-rose-200/40',
  },
  {
    slug: 'protein',
    title: '🥩 Protein Calculator',
    description: 'Determine your optimal daily protein intake based on your weight and fitness goals.',
    icon: Beef,
    gradient: 'from-emerald-500 to-teal-500',
    glow: 'shadow-emerald-200/40',
  },
  {
    slug: 'water',
    title: '💧 Water Intake Calculator',
    description: 'Calculate how much water you should drink daily to stay properly hydrated.',
    icon: Droplet,
    gradient: 'from-sky-500 to-indigo-500',
    glow: 'shadow-sky-200/40',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

export default function ToolsPage() {
  return (
    <TransitionEffect>
      <main className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-emerald-50/30 via-white to-green-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        {/* Background blobs */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <motion.div
            animate={{
              x: ['0%', '10%', '-5%', '0%'],
              y: ['0%', '-10%', '5%', '0%'],
              transition: { duration: 20, repeat: Infinity, ease: 'easeInOut' },
            }}
            className="absolute top-[-20%] left-[-10%] w-[60rem] h-[60rem] rounded-full bg-emerald-300/20 dark:bg-emerald-500/10 blur-3xl"
          />
          <motion.div
            animate={{
              x: ['0%', '-8%', '8%', '0%'],
              y: ['0%', '12%', '-6%', '0%'],
              transition: { duration: 25, repeat: Infinity, ease: 'easeInOut', delay: 2 },
            }}
            className="absolute bottom-[-30%] right-[-10%] w-[50rem] h-[50rem] rounded-full bg-blue-300/20 dark:bg-blue-500/10 blur-3xl"
          />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          {/* Hero Section */}
          <motion.section
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="text-center mb-16 md:mb-24"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/60 dark:bg-emerald-900/40 backdrop-blur-sm border border-emerald-200/50 dark:border-emerald-700/30 text-emerald-700 dark:text-emerald-300 text-sm font-medium mb-6">
              <Sparkles size={16} />
              <span>AI Powered Tools</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-600 dark:from-emerald-400 dark:via-green-400 dark:to-emerald-400 bg-clip-text text-transparent animate-gradient">
                Health & Beauty
              </span>
              <br />
              <span className="text-gray-900 dark:text-white">Calculators</span>
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Free, instant health & beauty calculators — built for accuracy, designed for you.
            </p>
          </motion.section>

          {/* Cards Grid - Each card is a clickable Link */}
          <motion.section
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            {tools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                prefetch={true}
                className="block focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-3xl"
              >
                <motion.div
                  variants={item}
                  transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                  whileHover={{
                    y: -12,
                    scale: 1.02,
                    transition: { type: 'spring', stiffness: 400, damping: 17 },
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative bg-white/60 dark:bg-gray-800/40 backdrop-blur-2xl border border-white/30 dark:border-gray-700/30 rounded-3xl shadow-2xl shadow-emerald-100/10 dark:shadow-gray-900/30 p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-200/30 dark:hover:shadow-emerald-700/20 hover:border-emerald-200/50 dark:hover:border-emerald-700/50 cursor-pointer h-full flex flex-col"
                >
                  <div
                    className={`absolute -inset-1 rounded-3xl bg-gradient-to-r ${tool.gradient} opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-20 -z-10`}
                  />
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center text-white shadow-lg ${tool.glow} dark:shadow-gray-800/40 mb-5 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <tool.icon size={28} strokeWidth={1.5} />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {tool.title}
                  </h2>
                  <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm leading-relaxed flex-1">
                    {tool.description}
                  </p>
                  <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                    Open Calculator
                    <ArrowRight
                      size={16}
                      className="transition-transform duration-300 group-hover:translate-x-1.5 group-hover:scale-110"
                    />
                  </div>
                </motion.div>
              </Link>
            ))}
          </motion.section>
        </div>
      </main>
    </TransitionEffect>
  );
}