export default function Disclaimer() {
  return (
    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-3xl border border-white/20 dark:border-gray-700/30 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Medical Disclaimer</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300">
        This calculator provides estimates only and is not a substitute for professional medical advice.
        Always consult a healthcare provider for personalized dietary and health recommendations.
      </p>
    </div>
  );
}