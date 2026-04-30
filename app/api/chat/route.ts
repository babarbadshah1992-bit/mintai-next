import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { question } = await req.json()

    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is missing')
      return NextResponse.json({ error: 'Server config error' }, { status: 500 })
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are MintAI, a helpful health and beauty assistant. Answer in Hinglish (mix of Hindi and English) with simple, natural remedies and tips. Keep it short, friendly, and practical.'
        },
        { role: 'user', content: question }
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    const answer = completion.choices[0]?.message?.content || 'Sorry, could not generate response.'
    return NextResponse.json({ answer })
  } catch (error: any) {
    console.error('OpenAI API error:', error)
    return NextResponse.json({ error: error.message || 'Something went wrong' }, { status: 500 })
  }
}