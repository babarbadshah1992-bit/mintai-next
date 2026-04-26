import { NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
})

export async function POST(req: Request) {
  try {
    const { image, type } = await req.json()

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: 'Server config error' }, { status: 500 })
    }

    // Base64 image data (remove data:image prefix if present)
    let base64Image = image
    if (image.includes('base64,')) {
      base64Image = image.split('base64,')[1]
    }

    const prompt = type === 'skin' ? 'Analyze this skin image. Tell in Hinglish if there are any issues like acne, dark spots, or dryness. Suggest basic remedies.' :
                   type === 'food' ? 'Identify this food item and tell its health benefits in Hinglish.' :
                   type === 'plant' ? 'Identify this medicinal plant and explain its benefits in Hinglish.' :
                   'Explain this medical report in simple Hinglish for a common person.'

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64Image}` } }
          ]
        }
      ],
      model: 'llava-v1.5-7b-4096-preview', // Free vision model
      temperature: 0.7,
      max_tokens: 500,
    })

    const analysis = completion.choices[0]?.message?.content || 'Could not analyze image.'
    return NextResponse.json({ analysis })
  } catch (error) {
    console.error('Groq Vision API error:', error)
    return NextResponse.json({ analysis: 'Image analysis failed. Please try again.' }, { status: 500 })
  }
}