import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Helper to detect language mix
function detectLanguage(text: string): 'en' | 'hi' | 'hinglish' {
  const hindiRegex = /[\u0900-\u097F]/;
  if (hindiRegex.test(text)) {
    // If contains Devanagari script, treat as Hindi/Hinglish
    return 'hinglish';
  }
  // Otherwise assume English
  return 'en';
}

export async function POST(req: Request) {
  try {
    const { question } = await req.json();

    // If no API key or quota error, return a friendly fallback
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ 
        answer: "Hey! 👋 I'm MintAI. I can't answer right now (API key missing). Please try again later. Meanwhile, you can browse our health tips and blogs." 
      });
    }

    const lang = detectLanguage(question);
    let systemPrompt = '';
    
    if (lang === 'en') {
      systemPrompt = `You are MintAI, a friendly health and beauty assistant. 
Answer in natural, conversational English – like a knowledgeable friend. 
Keep it short, practical, and helpful. Never use fixed labels like "Dadi ka nuskha". 
Focus on home remedies, wellness tips, and product suggestions.`;
    } else {
      systemPrompt = `You are MintAI, a friendly health and beauty assistant. 
Answer in Hinglish (mix of Hindi and English) – just like a friend would talk. 
Never use fixed labels like "Dadi ka nuskha". 
Keep it short, practical, and warm. Focus on home remedies, wellness tips, and product suggestions.`;
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: question }
      ],
      temperature: 0.8,
      max_tokens: 300,
    });

    let answer = completion.choices[0]?.message?.content || 
      (lang === 'en' ? "Sorry, I couldn't think of an answer. Please try again." : "Maaf karna, kuch jawab nahi soch paaya. Phir se try karo.");

    return NextResponse.json({ answer });
  } catch (error: any) {
    console.error('Chat API error:', error);
    
    // Handle OpenAI quota error specifically
    if (error?.code === 'insufficient_quota') {
      return NextResponse.json({ 
        answer: "🙏 Our AI service is temporarily out of quota. We're working to restore it. In the meantime, check out our blogs and health tips – they're all free!" 
      });
    }
    
    // Generic fallback
    return NextResponse.json({ 
      answer: "Hey! Something went wrong. Please refresh the page and try again. 🙏" 
    });
  }
}