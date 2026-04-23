import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { topic } = await req.json()
    
    const prompt = `Generate a complete health blog post in HTML format on the topic: "${topic}".
    
    Return a JSON object with:
    - title: catchy title in Hinglish (Hindi+English)
    - slug: URL-friendly version (lowercase, hyphens)
    - excerpt: short description (100-150 chars)
    - content: full HTML content with <h2>, <ul>, <li> tags
    - tags: array of 4-5 relevant tags (e.g., ["health","remedies"])
    
    Make it informative, natural remedies focused, and user-friendly.`
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7
      })
    })
    
    const data = await response.json()
    let aiContent = data.choices[0].message.content
    
    aiContent = aiContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const blogData = JSON.parse(aiContent)
    
    return NextResponse.json(blogData)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to generate blog' }, { status: 500 })
  }
}