import { Copy, Check, Share2, RefreshCw, MessageCircle } from 'lucide-react';

interface CalculatorActionsProps {
  onCopy: () => void;
  copied: boolean;
  onReset: () => void;
  onWhatsAppShare: () => void;
  onWebShare: () => void;
}

export default function CalculatorActions({
  onCopy,
  copied,
  onReset,
  onWhatsAppShare,
  onWebShare,
}: CalculatorActionsProps) {
  return (
    <div className="mt-6 flex flex-wrap gap-3">
      <button
        onClick={onCopy}
        className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold transition-all shadow-lg shadow-orange-200/40 dark:shadow-orange-900/30 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 hover:scale-[1.02] active:scale-[0.98] flex-1 sm:flex-none"
      >
        {copied ? <Check size={18} /> : <Copy size={18} />}
        {copied ? 'Copied!' : 'Copy Results'}
      </button>

      <button
        onClick={onWebShare}
        className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold transition-all shadow-lg shadow-blue-200/40 dark:shadow-blue-900/30 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 hover:scale-[1.02] active:scale-[0.98] flex-1 sm:flex-none"
      >
        <Share2 size={18} />
        Share
      </button>

      <button
        onClick={onWhatsAppShare}
        className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold transition-all shadow-lg shadow-green-200/40 dark:shadow-green-900/30 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 hover:scale-[1.02] active:scale-[0.98] flex-1 sm:flex-none"
      >
        <MessageCircle size={18} />
        WhatsApp
      </button>

      <button
        onClick={onReset}
        className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gray-200/80 dark:bg-gray-700/80 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold transition-all shadow-md hover:scale-[1.02] active:scale-[0.98] flex-1 sm:flex-none"
      >
        <RefreshCw size={18} />
        Reset
      </button>
    </div>
  );
}