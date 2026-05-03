"use client";

import { useState, useEffect } from "react";

// Tip database – you can add more
const tipDatabase = [
  { id: 1, text: "सुबह उठकर गुनगुना पानी पियें। इसमें नींबू और शहद मिलाएं।", product: "Organic Honey", productLink: "https://amzn.to/3OXMbVf" },
  { id: 2, text: "तुलसी के पत्ते + अदरक उबालकर पीने से रोग प्रतिरोधक क्षमता बढ़ती है।", product: "Tulsi Drops", productLink: "#" },
  { id: 3, text: "रात को सोने से 1 घंटे पहले मोबाइल बंद कर दें। अच्छी नींद आएगी।", product: "Blue Cut Glasses", productLink: "#" },
  { id: 4, text: "नारियल तेल से सिर की मालिश करें – बाल घने और काले होंगे।", product: "Coconut Oil", productLink: "#" },
  { id: 5, text: "रोज 10 मिनट गहरी साँस लेने से तनाव कम होता है।", product: "Breathing App", productLink: "#" },
  { id: 6, text: "त्वचा पर एलोवेरा जेल लगाएं – मुंहासे और दाग कम होंगे।", product: "Aloe Vera Gel", productLink: "https://amzn.to/4cIANEH" },
  { id: 7, text: "खाली पेट चबाएं 4-5 भीगे हुए बादाम – दिमाग तेज और त्वचा ग्लोइंग।", product: "Almonds", productLink: "#" },
  { id: 8, text: "पेट साफ रखने के लिए रातभर पानी में भिगोई हुई मेथी सुबह खाएं।", product: "Methi Seeds", productLink: "#" },
  { id: 9, text: "खांसी होने पर अदरक का टुकड़ा नमक लगाकर चूसें।", product: "Ginger", productLink: "#" },
  { id: 10, text: "बालों में मेंहदी + दही + अंडा लगाने से डैंड्रफ और झड़ना कम होता है।", product: "Henna Powder", productLink: "#" }
];

export default function WellnessPage() {
  const [currentTip, setCurrentTip] = useState<any>(null);
  const [savedTips, setSavedTips] = useState<number[]>([]);
  const [likes, setLikes] = useState<Record<number, number>>({});
  const [reminderEnabled, setReminderEnabled] = useState(false);

  // Load saved data from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("wellness_saved");
    if (saved) setSavedTips(JSON.parse(saved));
    const likesData = localStorage.getItem("wellness_likes");
    if (likesData) setLikes(JSON.parse(likesData));
    const reminder = localStorage.getItem("wellness_reminder");
    if (reminder === "true") setReminderEnabled(true);
    // pick a random tip initially
    getRandomTip();
  }, []);

  const getRandomTip = () => {
    const randomIndex = Math.floor(Math.random() * tipDatabase.length);
    setCurrentTip(tipDatabase[randomIndex]);
  };

  // Save tip to localStorage
  const saveTip = () => {
    if (!currentTip) return;
    if (savedTips.includes(currentTip.id)) {
      alert("Tip already saved!");
      return;
    }
    const newSaved = [...savedTips, currentTip.id];
    setSavedTips(newSaved);
    localStorage.setItem("wellness_saved", JSON.stringify(newSaved));
    alert("Tip saved! You can view your saved tips below.");
  };

  // Like/Dislike
  const handleLike = (type: "like" | "dislike") => {
    if (!currentTip) return;
    const currentLikes = likes[currentTip.id] || 0;
    const newCount = type === "like" ? currentLikes + 1 : currentLikes - 1;
    const updatedLikes = { ...likes, [currentTip.id]: Math.max(0, newCount) };
    setLikes(updatedLikes);
    localStorage.setItem("wellness_likes", JSON.stringify(updatedLikes));
  };

  // Share on WhatsApp
  const shareOnWhatsApp = () => {
    if (!currentTip) return;
    const text = encodeURIComponent(`🌿 Wellness Tip from MintAI:\n\n${currentTip.text}\n\n${currentTip.product ? `💡 Try: ${currentTip.product}\n` : ""}👉 Get more tips at https://mintai.in/wellness`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  // Enable daily reminder (for future PWA)
  const enableReminder = () => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
    setReminderEnabled(true);
    localStorage.setItem("wellness_reminder", "true");
    alert("Reminder set! You will receive a daily tip notification (when PWA is installed).");
  };

  // List of saved tips (ids)
  const savedTipsList = tipDatabase.filter(tip => savedTips.includes(tip.id));

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
          ✨ Wellness Wisdom
        </h1>
        <p className="text-gray-600 mt-2">One random tip every day – for your health & beauty</p>
      </div>

      {/* Random Tip Card */}
      {currentTip && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-100">
          <p className="text-xl leading-relaxed">{currentTip.text}</p>
          {currentTip.product && (
            <div className="mt-3 p-3 bg-green-50 rounded-xl">
              <p className="text-green-700 font-medium">✨ Try: {currentTip.product}</p>
              <a href={currentTip.productLink} target="_blank" rel="noopener noreferrer" className="text-sm text-green-600 underline">View Product →</a>
            </div>
          )}
          <div className="flex flex-wrap gap-3 mt-5 justify-between items-center">
            <div className="flex gap-2">
              <button onClick={() => handleLike("like")} className="bg-green-100 px-4 py-2 rounded-full text-green-700 flex items-center gap-1 hover:bg-green-200">
                👍 Like {likes[currentTip.id] > 0 ? `(${likes[currentTip.id]})` : ""}
              </button>
              <button onClick={() => handleLike("dislike")} className="bg-red-100 px-4 py-2 rounded-full text-red-700 hover:bg-red-200">
                👎 Dislike
              </button>
            </div>
            <div className="flex gap-2">
              <button onClick={saveTip} className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full hover:bg-blue-200">
                🔖 Save Tip
              </button>
              <button onClick={shareOnWhatsApp} className="bg-green-500 text-white px-4 py-2 rounded-full flex items-center gap-1 hover:bg-green-600">
                📱 Share on WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Next Tip Button */}
      <div className="text-center mt-6">
        <button onClick={getRandomTip} className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-2 rounded-full shadow hover:shadow-md transition">
          🔄 Next Tip
        </button>
      </div>

      {/* Daily Reminder */}
      <div className="mt-8 text-center">
        {!reminderEnabled ? (
          <button onClick={enableReminder} className="text-gray-500 border border-gray-300 px-4 py-1 rounded-full text-sm hover:bg-gray-100">
            🔔 Get daily tip reminder (PWA)
          </button>
        ) : (
          <p className="text-green-600 text-sm">✅ Daily reminder active – you'll get a tip every day (after installing app).</p>
        )}
      </div>

      {/* Saved Tips Section */}
      {savedTipsList.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-3">📚 Your Saved Tips</h2>
          <div className="space-y-3">
            {savedTipsList.map(tip => (
              <div key={tip.id} className="bg-white/50 p-3 rounded-xl text-sm">
                <p>{tip.text}</p>
                <div className="flex justify-between items-center mt-1 text-xs text-gray-500">
                  <span>👍 {likes[tip.id] || 0} likes</span>
                  <button
                    onClick={() => {
                      const newSaved = savedTips.filter(id => id !== tip.id);
                      setSavedTips(newSaved);
                      localStorage.setItem("wellness_saved", JSON.stringify(newSaved));
                    }}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}