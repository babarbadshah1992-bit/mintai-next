import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const { age, sleep, stress, digestion, skin, exercise } = await req.json();

    const prompt = `
You are MintAI health assistant. Based on following data, generate health score (0-100) and actionable tips.
Age: ${age}, Sleep: ${sleep}, Stress: ${stress}, Digestion: ${digestion}, Skin: ${skin}, Exercise: ${exercise}.
Return ONLY valid JSON with fields: score (number), summary (string), improvementTips (array of strings), productSuggestions (array of objects with name and link). 
Product links can be affiliate links for products like honey, chyawanprash, vitamin C, etc. Keep tips practical and in Hinglish if possible.
    `;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content || '{}';
    const data = JSON.parse(content);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}