import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function detectLanguage(text: string): 'en' | 'hi' {
  const hindiRegex = /[\u0900-\u097F]/;
  if (hindiRegex.test(text)) return 'hi';
  return 'en';
}

export async function POST(req: Request) {
  try {
    const { question } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ 
        answer: "Hey! 👋 I'm MintAI. API key missing. Try again later." 
      });
    }

    const lang = detectLanguage(question);
    const systemPrompt = lang === 'en'
      ? `You are MintAI, a friendly health and beauty assistant. Answer in natural, conversational English – like a knowledgeable friend. Keep it short, practical, and helpful.`
      : `You are MintAI, a friendly health and beauty assistant. Answer in Hinglish (mix Hindi and English) – just like a friend would talk. Keep it short, warm, and practical.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: question }
      ],
      temperature: 0.8,
      max_tokens: 300,
    });

    const answer = completion.choices[0]?.message?.content || 
      (lang === 'en' ? "Sorry, I couldn't think of an answer." : "Maaf karna, kuch jawab nahi soch paaya.");

    return NextResponse.json({ answer });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ 
      answer: "🙏 Our AI service is temporarily unavailable. Please check back later." 
    });
  }
}