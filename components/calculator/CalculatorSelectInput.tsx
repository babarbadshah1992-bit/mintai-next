interface Option {
  value: string;
  label: string;
}

interface CalculatorSelectInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  icon?: React.ReactNode;
}

export default function CalculatorSelectInput({
  id,
  label,
  value,
  onChange,
  options,
  icon,
}: CalculatorSelectInputProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
        {icon && <span className="text-orange-500">{icon}</span>}
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all shadow-sm hover:shadow-md"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}