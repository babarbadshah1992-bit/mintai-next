"use client";

import { useState } from "react";

export default function HealthScorePage() {
  const [formData, setFormData] = useState({
    age: "",
    sleep: "",
    stress: "",
    digestion: "",
    skin: "",
    exercise: "",
    urineColor: "",
    stoolType: "",
    weight: "",
    bpSystolic: "",
    bpDiastolic: "",
    bpSkip: false,
  });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/health-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper for score color
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreGradient = (score: number) => {
    const red = 255 - (score * 2.55);
    const green = score * 2.55;
    return `rgb(${Math.min(255, red)}, ${Math.min(255, green)}, 0)`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-2">🏥 Complete Health Checkup</h1>
      <p className="text-center text-gray-600 mb-6">Answer 10+ questions to get your personalised wellness score and actionable tips</p>

      <form onSubmit={handleSubmit} className="space-y-5 bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-green-100">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Your age</label>
            <input type="number" name="age" value={formData.age} onChange={handleChange} required className="w-full p-2 border rounded-lg" placeholder="e.g., 28" />
          </div>
          <div>
            <label className="block font-medium">Weight (kg, optional)</label>
            <input type="number" name="weight" value={formData.weight} onChange={handleChange} className="w-full p-2 border rounded-lg" placeholder="e.g., 65" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Sleep (hours/day)</label>
            <select name="sleep" value={formData.sleep} onChange={handleChange} required className="w-full p-2 border rounded-lg">
              <option value="">Select</option>
              <option value="<5">&lt;5 hours</option>
              <option value="5-6">5-6 hours</option>
              <option value="7-8">7-8 hours</option>
              <option value=">8">&gt;8 hours</option>
            </select>
          </div>
          <div>
            <label className="block font-medium">Stress level</label>
            <select name="stress" value={formData.stress} onChange={handleChange} required className="w-full p-2 border rounded-lg">
              <option value="">Select</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Digestion (acidity, gas, constipation?)</label>
            <select name="digestion" value={formData.digestion} onChange={handleChange} required className="w-full p-2 border rounded-lg">
              <option value="">Select</option>
              <option value="Good">Good</option>
              <option value="Occasional issues">Occasional issues</option>
              <option value="Frequent issues">Frequent issues</option>
            </select>
          </div>
          <div>
            <label className="block font-medium">Skin concerns</label>
            <select name="skin" value={formData.skin} onChange={handleChange} required className="w-full p-2 border rounded-lg">
              <option value="">Select</option>
              <option value="Clear">Clear</option>
              <option value="Acne">Acne</option>
              <option value="Dryness">Dryness</option>
              <option value="Oiliness">Oiliness</option>
              <option value="Pigmentation">Pigmentation</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Exercise frequency</label>
            <select name="exercise" value={formData.exercise} onChange={handleChange} required className="w-full p-2 border rounded-lg">
              <option value="">Select</option>
              <option value="Rarely">Rarely</option>
              <option value="1-2 times/week">1-2 times/week</option>
              <option value="3-4 times/week">3-4 times/week</option>
              <option value="Daily">Daily</option>
            </select>
          </div>
          <div>
            <label className="block font-medium">Urine color</label>
            <select name="urineColor" value={formData.urineColor} onChange={handleChange} className="w-full p-2 border rounded-lg">
              <option value="">Optional</option>
              <option value="Pale yellow">Pale yellow (hydrated)</option>
              <option value="Dark yellow">Dark yellow (need water)</option>
              <option value="Brown/tea">Brown/tea (may be dehydrated)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Stool type (Bristol scale)</label>
            <select name="stoolType" value={formData.stoolType} onChange={handleChange} className="w-full p-2 border rounded-lg">
              <option value="">Optional</option>
              <option value="Type1-2">Type 1-2 (hard, constipation)</option>
              <option value="Type3-4">Type 3-4 (normal, healthy)</option>
              <option value="Type5-7">Type 5-7 (loose, diarrhoea)</option>
            </select>
          </div>
          <div>
            <label className="block font-medium">Blood pressure (BP)</label>
            <div className="flex gap-2 items-center">
              <input type="number" name="bpSystolic" value={formData.bpSystolic} onChange={handleChange} placeholder="Systolic" className="w-1/2 p-2 border rounded-lg" />
              <span>/</span>
              <input type="number" name="bpDiastolic" value={formData.bpDiastolic} onChange={handleChange} placeholder="Diastolic" className="w-1/2 p-2 border rounded-lg" />
              <label className="flex items-center gap-1 ml-2 text-sm">
                <input type="checkbox" name="bpSkip" checked={formData.bpSkip} onChange={handleChange} />
                Skip
              </label>
            </div>
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition">
          {loading ? "Analyzing your health..." : "🔍 Get My Complete Health Score"}
        </button>
      </form>

      {error && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>}

      {result && (
        <div className="mt-8 bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl border-t-4 border-green-400">
          {/* Score Gauge */}
          <div className="text-center">
            <div className="relative w-40 h-40 mx-auto">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r="45" fill="none"
                  stroke={getScoreGradient(result.score)}
                  strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 45 * result.score / 100} ${2 * Math.PI * 45}`}
                  strokeDashoffset="0"
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
                <text x="50" y="55" textAnchor="middle" dominantBaseline="middle" className={`text-2xl font-bold ${getScoreColor(result.score)}`}>
                  {result.score}
                </text>
                <text x="50" y="72" textAnchor="middle" dominantBaseline="middle" className="text-xs text-gray-500">out of 100</text>
              </svg>
            </div>
            <p className={`text-xl font-semibold mt-2 ${getScoreColor(result.score)}`}>
              {result.score >= 80 ? "Excellent! 🌟" : result.score >= 60 ? "Good 👍" : "Needs Improvement ⚠️"}
            </p>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <h3 className="font-semibold text-lg">📋 Summary</h3>
              <p className="text-gray-700">{result.summary}</p>
            </div>
            {result.improvementTips && result.improvementTips.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg">🌿 Personalized Tips</h3>
                <ul className="list-disc list-inside space-y-1">
                  {result.improvementTips.map((tip: string, i: number) => <li key={i}>{tip}</li>)}
                </ul>
              </div>
            )}
            {result.productSuggestions && result.productSuggestions.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg">🛍️ Recommended Products for You</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {result.productSuggestions.map((p: any, i: number) => (
                    <a key={i} href={p.link} target="_blank" rel="noopener noreferrer" className="bg-green-100 hover:bg-green-200 px-3 py-1 rounded-full text-sm transition">
                      {p.name}
                    </a>
                  ))}
                </div>
              </div>
            )}
            {result.customAdvice && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-800">💡 {result.customAdvice}</p>
              </div>
            )}
          </div>
        </div>
      )}
      <style jsx>{`
        input, select { background: white; color: #1a2e1a; }
      `}</style>
    </div>
  );
}