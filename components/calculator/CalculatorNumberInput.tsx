import { ReactNode, useState, useEffect } from 'react';

interface CalculatorNumberInputProps {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  icon?: ReactNode;
  placeholder?: string;
}

export default function CalculatorNumberInput({
  id,
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  icon,
  placeholder = '0',
}: CalculatorNumberInputProps) {
  const [inputValue, setInputValue] = useState<string>(String(value));

  // Sync when parent value changes (e.g., reset)
  useEffect(() => {
    setInputValue(String(value));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value;

    // Allow empty (user deleting everything)
    if (raw === '') {
      setInputValue('');
      return;
    }

    // 🔥 Remove ALL leading zeros if more than one character
    if (raw.length > 1 && raw.startsWith('0')) {
      raw = raw.replace(/^0+/, '');
    }

    setInputValue(raw);

    const num = Number(raw);
    if (!isNaN(num)) {
      let clamped = num;
      if (min !== undefined && clamped < min) clamped = min;
      if (max !== undefined && clamped > max) clamped = max;
      onChange(clamped);
    }
  };

  const handleBlur = () => {
    // If empty, set to 0
    if (inputValue === '') {
      setInputValue('0');
      onChange(0);
      return;
    }

    const num = Number(inputValue);
    if (!isNaN(num)) {
      let clamped = num;
      if (min !== undefined && clamped < min) clamped = min;
      if (max !== undefined && clamped > max) clamped = max;
      setInputValue(String(clamped));
      onChange(clamped);
    }
  };

  return (
    <div className="group">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-2"
      >
        {icon && (
          <span className="text-orange-500 group-focus-within:text-orange-600 transition-colors">
            {icon}
          </span>
        )}
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="text"          // Using text to avoid browser quirks
          inputMode="numeric"
          pattern="[0-9]*"
          value={inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="w-full px-4 py-3.5 rounded-2xl border border-gray-200/70 dark:border-gray-700/70 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm hover:shadow-md focus:ring-2 focus:ring-orange-500/80 focus:border-transparent outline-none transition-all duration-200 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
        />
        <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 focus-within:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-orange-500/5 to-amber-500/5" />
      </div>
    </div>
  );
}