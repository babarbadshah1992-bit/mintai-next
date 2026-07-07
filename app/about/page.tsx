"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  const [imgError, setImgError] = useState(false);

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-white via-emerald-50/40 to-white overflow-x-hidden">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
        {/* Hero */}
        <section className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
            From a Small Dream to{" "}
            <span className="text-[#16a34a]">MintAI</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
            Building AI-powered health guidance for every Indian.
          </p>
        </section>

        {/* Founder Glass Card */}
        <section
          className="
            relative rounded-3xl border border-white/40
            bg-white/60 backdrop-blur-xl
            shadow-[0_8px_30px_rgb(0,0,0,0.08)]
            p-6 sm:p-10 lg:p-14
          "
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
            {/* Founder Image */}
            <div className="flex-shrink-0">
              <div
                className="
                  relative rounded-full ring-4 ring-[#16a34a]/15
                  w-32 h-32 md:w-48 md:h-48
                  overflow-hidden bg-emerald-100
                  flex items-center justify-center
                "
              >
                {!imgError ? (
                  <Image
                    src="/founder-babar.jpg"
                    alt="Md Babar"
                    width={192}
                    height={192}
                    className="rounded-full object-cover w-full h-full"
                    onError={() => setImgError(true)}
                    priority
                  />
                ) : (
                  <div
                    className="
                      w-full h-full rounded-full
                      bg-[#16a34a] text-white
                      flex items-center justify-center
                      text-3xl md:text-4xl font-semibold
                      select-none
                    "
                  >
                    MB
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                Md Babar
              </h2>
              <p className="mt-1 text-sm sm:text-base font-medium text-[#16a34a]">
                Founder, MintAI.in
              </p>

              <p className="mt-4 text-gray-700 text-sm sm:text-base leading-relaxed">
                Hi, I&apos;m Md Babar from Surat, Gujarat.
                <br className="hidden sm:block" />
                I started MintAI with one mission: to make trustworthy
                AI-powered health guidance simple, affordable and available in
                Indian languages.
              </p>

              <p className="mt-5 text-xs sm:text-sm text-gray-500 border-t border-gray-200 pt-4">
                MintAI provides educational wellness guidance only and is not
                a substitute for professional medical advice.
              </p>

              {/* Buttons */}
              <div className="mt-7 flex flex-col sm:flex-row items-center md:items-start justify-center md:justify-start gap-3 sm:gap-4">
                <Link
                  href="/blog"
                  className="
                    w-full sm:w-auto text-center
                    px-6 py-3 rounded-full
                    bg-[#16a34a] text-white text-sm font-medium
                    hover:bg-[#128a3e] active:scale-[0.98]
                    transition-all duration-200
                    shadow-sm hover:shadow-md
                  "
                >
                  Visit Blog
                </Link>
                <Link
                  href="/tools"
                  className="
                    w-full sm:w-auto text-center
                    px-6 py-3 rounded-full
                    bg-white text-[#16a34a] text-sm font-medium
                    border border-[#16a34a]/30
                    hover:bg-emerald-50 active:scale-[0.98]
                    transition-all duration-200
                  "
                >
                  Explore Tools
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}