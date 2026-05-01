"use client";

import { useState } from "react";
import CameraModal from "@/components/CameraModal"; // assuming you have this

export default function HealthScorePage() {
  // State for each field + skip flags
  const [formData, setFormData] = useState({
    age: "",
    skipAge: false,
    weight: "",
    skipWeight: false,
    sleep: "",
    skipSleep: false,
    stress: "",
    skipStress: false,
    digestion: "",
    skipDigestion: false,
    skin: "",
    skipSkin: false,
    exercise: "",
    skipExercise: false,
    urineColor: "",
    skipUrine: false,
    stoolType: "",
    skipStool: false,
    bpSystolic: "",
    bpDiastolic: "",
    skipBP: false,
    bloodGroup: "",
    skipBloodGroup: false,
  });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCamera, setShowCamera] = useState(false);

  // Handler for normal inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  // Handler for skip checkboxes
  const handleSkip = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    const fieldName = name.replace("skip", "").toLowerCase();
    setFormData({ ...formData, [name]: checked });
    // if skip is checked, clear the field value
    if (checked) {
      setFormData(prev => ({ ...prev, [fieldName]: "" }));
    }
  };

  const handleCameraResult = (resultText: string) => {
    // You can auto-fill some fields or send to AI
    alert("Report analysis coming soon: " + resultText.slice(0, 100));
    setShowCamera(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    // Prepare payload (only non-skipped fields)
    const payload: any = {};
    for (const [key, value] of Object.entries(formData)) {
      if (!key.startsWith("skip") && value !== "" && value !== undefined) {
        payload[key] = value;
      }
    }

    try {
      const res = await fetch("/api/health-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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

  // Helper for score color and gauge
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
      <p className="text-center text-gray-600 mb-6">Answer questions (or skip any you don't know) to get your wellness score</p>

      <form onSubmit={handleSubmit} className="space-y-5 bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-green-100">
        {/* Helper: render a field with skip checkbox */}
        {[
          { label: "Your age", name: "age", type: "number", placeholder: "e.g., 28" },
          { label: "Weight (kg)", name: "weight", type: "number", placeholder: "e.g., 65" },
          { label: "Sleep (hours/day)", name: "sleep", type: "select", options: ["<5", "5-6", "7-8", ">8"] },
          { label: "Stress level", name: "stress", type: "select", options: ["Low", "Medium", "High"] },
          { label: "Digestion", name: "digestion", type: "select", options: ["Good", "Occasional issues", "Frequent issues"] },
          { label: "Skin concerns", name: "skin", type: "select", options: ["Clear", "Acne", "Dryness", "Oiliness", "Pigmentation"] },
          { label: "Exercise frequency", name: "exercise", type: "select", options: ["Rarely", "1-2 times/week", "3-4 times/week", "Daily"] },
          { label: "Urine color", name: "urineColor", type: "select", options: ["Pale yellow", "Dark yellow", "Brown/tea"] },
          { label: "Stool type", name: "stoolType", type: "select", options: ["Type1-2 (hard)", "Type3-4 (normal)", "Type5-7 (loose)"] },
        ].map((field) => (
          <div key={field.name} className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex-1">
              <label className="block font-medium">{field.label}</label>
              {field.type === "select" ? (
                <select name={field.name} value={formData[field.name as keyof typeof formData] as string} onChange={handleChange} className="w-full p-2 border rounded-lg" disabled={formData[`skip${field.name.charAt(0).toUpperCase() + field.name.slice(1)}` as keyof typeof formData] as boolean}>
                  <option value="">Select</option>
                  {field.options?.map(opt => <option key={opt}>{opt}</option>)}
                </select>
              ) : (
                <input type={field.type} name={field.name} value={formData[field.name as keyof typeof formData] as string} onChange={handleChange} placeholder={field.placeholder} className="w-full p-2 border rounded-lg" disabled={formData[`skip${field.name.charAt(0).toUpperCase() + field.name.slice(1)}` as keyof typeof formData] as boolean} />
              )}
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" name={`skip${field.name.charAt(0).toUpperCase() + field.name.slice(1)}`} checked={formData[`skip${field.name.charAt(0).toUpperCase() + field.name.slice(1)}` as keyof typeof formData] as boolean} onChange={handleSkip} className="w-4 h-4" />
              <span className="text-sm text-gray-500">Skip</span>
            </div>
          </div>
        ))}

        {/* Blood Pressure with skip */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1">
            <label className="block font-medium">Blood Pressure (BP)</label>
            <div className="flex gap-2">
              <input type="number" name="bpSystolic" value={formData.bpSystolic} onChange={handleChange} placeholder="Systolic" className="w-1/2 p-2 border rounded-lg" disabled={formData.skipBP} />
              <span>/</span>
              <input type="number" name="bpDiastolic" value={formData.bpDiastolic} onChange={handleChange} placeholder="Diastolic" className="w-1/2 p-2 border rounded-lg" disabled={formData.skipBP} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" name="skipBP" checked={formData.skipBP} onChange={handleSkip} className="w-4 h-4" />
            <span className="text-sm text-gray-500">Skip BP</span>
          </div>
        </div>

        {/* Blood Group with skip */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1">
            <label className="block font-medium">Blood Group</label>
            <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="w-full p-2 border rounded-lg" disabled={formData.skipBloodGroup}>
              <option value="">Select</option>
              <option>A+</option><option>A-</option><option>B+</option><option>B-</option>
              <option>O+</option><option>O-</option><option>AB+</option><option>AB-</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" name="skipBloodGroup" checked={formData.skipBloodGroup} onChange={handleSkip} className="w-4 h-4" />
            <span className="text-sm text-gray-500">Skip</span>
          </div>
        </div>

        {/* Submit + Scan Button Row */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <button type="submit" disabled={loading} className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition">
            {loading ? "Analyzing..." : "🔍 Get My Complete Health Score"}
          </button>
          <button type="button" onClick={() => setShowCamera(true)} className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold transition">
            📄 Scan Medical Report
          </button>
        </div>
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
            <div><h3 className="font-semibold text-lg">📋 Summary</h3><p>{result.summary}</p></div>
            {result.improvementTips && (<div><h3 className="font-semibold text-lg">🌿 Tips</h3><ul className="list-disc list-inside">{result.improvementTips.map((tip: string, i: number) => <li key={i}>{tip}</li>)}</ul></div>)}
            {result.productSuggestions && (<div><h3 className="font-semibold text-lg">🛍️ Recommended Products</h3><div className="flex flex-wrap gap-2">{result.productSuggestions.map((p: any, i: number) => <a key={i} href={p.link} target="_blank" className="bg-green-100 px-3 py-1 rounded-full text-sm">{p.name}</a>)}</div></div>)}
          </div>
        </div>
      )}

      {showCamera && <CameraModal onClose={() => setShowCamera(false)} onResult={handleCameraResult} />}
      <style jsx>{`input, select { background: white; color: #1a2e1a; }`}</style>
    </div>
  );
}