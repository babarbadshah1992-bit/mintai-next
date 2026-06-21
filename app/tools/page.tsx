"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Flame,
  Scale,
  Heart,
  Beef,
  Droplet,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const tools = [
  {
    slug: "calories",
    title: "🔥 Calories Calculator",
    description:
      "Estimate your daily calorie needs for maintenance, weight loss, or weight gain based on your activity level.",
    icon: Flame,
    gradient: "from-orange-500 to-amber-500",
  },
  {
    slug: "bmi",
    title: "⚖️ BMI Calculator",
    description:
      "Calculate your Body Mass Index and get personalized health advice and category classification.",
    icon: Scale,
    gradient: "from-sky-500 to-cyan-500",
  },
  {
    slug: "bmr",
    title: "❤️ BMR Calculator",
    description:
      "Find your Basal Metabolic Rate and understand how many calories your body burns at rest.",
    icon: Heart,
    gradient: "from-pink-500 to-rose-500",
  },
  {
    slug: "protein",
    title: "🥩 Protein Calculator",
    description:
      "Determine your ideal daily protein intake based on your weight and fitness goals.",
    icon: Beef,
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    slug: "water",
    title: "💧 Water Intake Calculator",
    description:
      "Calculate how much water you should drink daily to stay hydrated and healthy.",
    icon: Droplet,
    gradient: "from-blue-500 to-indigo-500",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

export default function ToolsPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-green-50">

      {/* Background Blobs - behind everything */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-300/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-300/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">

        {/* Hero Section */}
        <section className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 font-medium text-sm mb-6">
            <Sparkles size={16} />
            AI Powered Tools
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight">
            <span className="bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-600 bg-clip-text text-transparent animate-gradient">
              Health & Beauty
            </span>
            <br />
            <span className="text-gray-900">
              Calculators
            </span>
          </h1>

          <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-gray-600">
            Free, instant health & beauty calculators designed to help you
            achieve your wellness goals with accuracy and simplicity.
          </p>
        </section>

        {/* Cards Grid - each card is a clickable Link */}
        <motion.section
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
        >
          {tools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              prefetch={true}
              className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-3xl"
            >
              <motion.div
                variants={item}
                whileHover={{
                  y: -10,
                  scale: 1.02,
                  transition: { type: "spring", stiffness: 300 },
                }}
                whileTap={{
                  scale: 0.98,
                  transition: { duration: 0.1 },
                }}
                className="group relative h-full rounded-3xl border border-white/50 bg-white/80 backdrop-blur-xl p-8 shadow-xl hover:shadow-2xl hover:shadow-emerald-200/30 transition-shadow duration-500 cursor-pointer"
              >
                {/* Glow effect on hover */}
                <div
                  className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br ${tool.gradient} rounded-3xl`}
                  style={{ pointerEvents: "none" }}
                />

                {/* Icon */}
                <div
                  className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center text-white shadow-lg mb-6`}
                >
                  <tool.icon size={32} />
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  {tool.title}
                </h2>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed mb-6">
                  {tool.description}
                </p>

                {/* CTA - visually indicates clickability */}
                <div className="inline-flex items-center gap-2 text-emerald-600 font-semibold group-hover:text-emerald-700 transition-colors">
                  Open Calculator
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.section>
      </div>

      {/* Add custom animation for gradient if not in global.css */}
      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          animation: gradient 6s ease infinite;
          background-size: 200% 200%;
        }
        /* Ensure touch actions work on mobile */
        .cursor-pointer {
          touch-action: manipulation;
        }
      `}</style>
    </main>
  );
}