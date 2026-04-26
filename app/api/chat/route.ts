import { NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
})

export async function POST(req: Request) {
  try {
    const { question } = await req.json()

    // Debug log (Vercel logs mein dikhega)
    console.log('Received question:', question)
    console.log('GROQ_API_KEY exists?', !!process.env.GROQ_API_KEY)

    if (!process.env.GROQ_API_KEY) {
      console.error('Missing GROQ_API_KEY')
      return NextResponse.json({ error: 'Server configuration error: missing API key' }, { status: 500 })
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are MintAI, a helpful health and beauty assistant. Answer in Hinglish (mix of Hindi and English) with simple, natural remedies and tips. Keep it short, friendly, and practical.'
        },
        { role: 'user', content: question }
      ],
      model: 'llama3-8b-8192',
      temperature: 0.7,
      max_tokens: 500,
    })

    const answer = completion.choices[0]?.message?.content || 'Sorry, could not generate response.'
    return NextResponse.json({ answer })
  } catch (error: any) {
    console.error('Groq API error:', error)
    return NextResponse.json({ error: error.message || 'Something went wrong' }, { status: 500 })
  }
}