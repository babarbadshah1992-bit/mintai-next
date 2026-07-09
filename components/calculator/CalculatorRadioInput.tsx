interface Option {
  value: string;
  label: string;
}

interface CalculatorRadioInputProps {
  name: string;
  label: string;
  selectedValue: string;
  onChange: (value: string) => void;
  options: Option[];
}

export default function CalculatorRadioInput({
  name,
  label,
  selectedValue,
  onChange,
  options,
}: CalculatorRadioInputProps) {
  return (
    <div>
      <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{label}</span>
      <div className="flex gap-4">
        {options.map((opt) => (
          <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={selectedValue === opt.value}
              onChange={() => onChange(opt.value)}
              className="w-4 h-4 text-orange-600 focus:ring-orange-500"
            />
            <span className="text-gray-700 dark:text-gray-300 capitalize">{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}