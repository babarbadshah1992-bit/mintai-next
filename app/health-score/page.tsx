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
  });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    // Rate limit check: 1 request per hour per user
    const lastCall = localStorage.getItem("healthScoreLastCall");
    const now = Date.now();
    if (lastCall && now - parseInt(lastCall) < 60 * 60 * 1000) {
      setError("You can generate health score only once per hour. Please try again later.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/health-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setResult(data);
      localStorage.setItem("healthScoreLastCall", now.toString());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-2">🌟 Health Score</h1>
      <p className="text-center text-gray-600 mb-8">Answer 6 quick questions and get your personalised wellness score + tips</p>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white/60 backdrop-blur-sm p-6 rounded-2xl shadow-md">
        <div>
          <label className="block font-medium">Age</label>
          <input type="number" name="age" value={formData.age} onChange={handleChange} required className="w-full p-2 border rounded-lg" />
        </div>
        <div>
          <label className="block font-medium">How many hours do you sleep on average?</label>
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
        <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition">
          {loading ? "Calculating..." : "Get My Health Score"}
        </button>
      </form>

      {error && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>}

      {result && (
        <div className="mt-8 bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-green-200">
          <div className="text-center">
            <span className="text-5xl font-bold text-green-700">{result.score}</span>
            <span className="text-xl text-gray-600">/100</span>
            <p className="text-sm text-gray-500 mt-1">Your Health Score</p>
          </div>
          <div className="mt-4">
            <h3 className="font-semibold text-lg">📝 Summary</h3>
            <p className="text-gray-700">{result.summary}</p>
          </div>
          {result.improvementTips && result.improvementTips.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold text-lg">🌿 Improvement Tips</h3>
              <ul className="list-disc list-inside space-y-1">
                {result.improvementTips.map((tip: string, i: number) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
          {result.productSuggestions && result.productSuggestions.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold text-lg">🛍️ Recommended Products</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {result.productSuggestions.map((prod: any, i: number) => (
                  <a key={i} href={prod.link} target="_blank" rel="noopener noreferrer" className="bg-green-100 px-3 py-1 rounded-full text-sm hover:bg-green-200">
                    {prod.name}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}