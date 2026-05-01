import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // Mock response with more specific analysis based on inputs (optional)
  const mockScore = Math.floor(Math.random() * 30) + 60;
  let summary = "Your overall health is decent. Focus on sleep and stress management for improvement.";
  let tips = [
    "Drink 2–3 litres of water daily",
    "Add turmeric milk at night",
    "Walk 30 minutes every day",
    "Avoid screen 1 hour before sleep"
  ];
  let products = [
    { name: "Organic Honey", link: "https://amzn.to/3OXMbVf" },
    { name: "Ashwagandha Capsules", link: "https://amzn.to/4cXveCA" }
  ];
  let customAdvice = "";

  if (mockScore < 60) tips.push("Consult a nutritionist for personalised diet plan.");

  return NextResponse.json({
    score: mockScore,
    summary,
    improvementTips: tips,
    productSuggestions: products,
    customAdvice
  });
}