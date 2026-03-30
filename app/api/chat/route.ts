import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { question } = await req.json()

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful health and beauty assistant. Answer in Hinglish (Hindi+English) with natural remedies and tips.' },
        { role: 'user', content: question }
      ],
      temperature: 0.7,
      max_tokens: 500
    })

    const answer = completion.choices[0].message.content
    return NextResponse.json({ answer })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 })
  }
}