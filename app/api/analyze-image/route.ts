import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: Request) {
  try {
    const { image, type } = await req.json()
    
    const prompts = {
      skin: "Analyze this skin image. Tell the user in simple Hinglish (Hindi+English) about: skin type (oily/dry/combination), any visible issues (acne, dark spots, pigmentation), and suggest natural remedies and products. Keep it positive and helpful. Response should be 3-4 lines in Hinglish.",
      
      food: "Identify the food item in this image. Tell the user in simple Hinglish: what is it, its health benefits, nutritional value, and how to eat it. Response should be 3-4 lines in Hinglish.",
      
      plant: "Identify the medicinal plant in this image. Tell the user in simple Hinglish: plant name in Hindi/English, its ayurvedic benefits, how to use it for common health issues (like cold, digestion, skin). Response should be 3-4 lines in Hinglish.",
      
      report: "Analyze this medical report image. Explain the key findings in very simple Hinglish that a common person can understand. Mention important values and what they mean. Add a disclaimer that this is not a doctor's advice. Response should be 5-6 lines in Hinglish."
    }
    
    // Convert image to base64 for OpenAI vision
    const base64Image = image.split(',')[1]
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompts[type as keyof typeof prompts] },
            { type: "image_url", image_url: { url: image } }
          ]
        }
      ],
      max_tokens: 500,
      temperature: 0.7
    })
    
    const analysis = response.choices[0].message.content
    
    return NextResponse.json({ analysis })
  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json({ analysis: "Sorry, could not analyze the image. Please try again." })
  }
}