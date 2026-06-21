"use client";

import { useState } from 'react';

export default function QuickHealthCheck() {
  const [age, setAge] = useState('');
  const [sleep, setSleep] = useState('');
  const [stress, setStress] = useState('');
  const [score, setScore] = useState<number | null>(null);
  const [recommendation, setRecommendation] = useState('');
  const [loading, setLoading] = useState(false);

  const calculateScore = () => {
    setLoading(true);
    
    // Validate inputs
    if (!age || !sleep || !stress) {
      alert('❌ Please fill all fields!');
      setLoading(false);
      return;
    }

    const ageNum = parseInt(age);
    const sleepNum = parseInt(sleep);
    
    let calculatedScore = 100;
    let rec = [];

    // Sleep logic
    if (sleepNum < 6) {
      calculatedScore -= 30;
      rec.push('😴 Sleep at least 7-8 hours');
    } else if (sleepNum < 7) {
      calculatedScore -= 15;
      rec.push('👍 Good, aim for 8 hours');
    } else if (sleepNum >= 8) {
      rec.push('🌟 Great sleep habit!');
    }

    // Stress logic
    if (stress === 'high') {
      calculatedScore -= 35;
      rec.push('🧘 Try meditation or deep breathing');
    } else if (stress === 'medium') {
      calculatedScore -= 15;
      rec.push('⚡ Take short breaks during work');
    } else if (stress === 'low') {
      rec.push('🎉 Keep smiling!');
    }

    // Age logic
    if (ageNum > 60) {
      calculatedScore -= 10;
      rec.push('🔍 Regular checkups recommended');
    } else if (ageNum < 18) {
      calculatedScore += 5;
      rec.push('💪 Build healthy habits now!');
    }

    calculatedScore = Math.max(0, Math.min(100, calculatedScore));
    
    setTimeout(() => {
      setScore(calculatedScore);
      setRecommendation(rec.join(' • '));
      setLoading(false);
    }, 500);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-5 m-4">
      <h2 className="text-xl font-bold text-green-700">🩺 Quick Health Check</h2>
      <p className="text-gray-500 text-sm mb-4">Answer 3 questions – get your score</p>
      
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium">Your age:</label>
          <input 
            type="number" 
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="e.g., 28"
            className="w-full p-2 border rounded-lg"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium">Sleep (hours/day):</label>
          <select 
            value={sleep}
            onChange={(e) => setSleep(e.target.value)}
            className="w-full p-2 border rounded-lg"
          >
            <option value="">Select ▼</option>
            <option value="4">&lt; 5 hours</option>
            <option value="5">5-6 hours</option>
            <option value="6">6-7 hours</option>
            <option value="7">7-8 hours</option>
            <option value="8">8+ hours</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium">Stress level:</label>
          <select 
            value={stress}
            onChange={(e) => setStress(e.target.value)}
            className="w-full p-2 border rounded-lg"
          >
            <option value="">Select ▼</option>
            <option value="low">😊 Low</option>
            <option value="medium">😐 Medium</option>
            <option value="high">😰 High</option>
          </select>
        </div>
        
        <button 
          onClick={calculateScore}
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700"
        >
          {loading ? '🔄 Getting your score...' : 'Get My Health Score'}
        </button>
        
        {score !== null && !loading && (
          <div className="mt-4 p-4 bg-green-50 rounded-lg text-center">
            <span className="text-4xl font-bold text-green-700">{score}</span>
            <span className="text-gray-500">/100</span>
            <p className="text-sm text-gray-600 mt-2">{recommendation}</p>
          </div>
        )}
      </div>
    </div>
  );
}