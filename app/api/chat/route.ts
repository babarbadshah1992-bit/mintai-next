import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { question } = await req.json()
    
    // Simple mock responses for common health queries
    const answers: Record<string, string> = {
      sardi: "Sardi ke liye garam paani piye, adrak wali chai banaaye, tulsi ka kadha peeye, aur aaram karein. Vitamin C lena bhi achha hai.",
      head: "Sar dard ke liye thanda paani malish karein, nariyal tel lagaaye, aaram karein aur adrak ki chai piyein.",
    }
    
    let answer = answers[question.toLowerCase()] || 
      `MintAI: ${question} ke liye natural remedies: swasth rahne ke liye paani piye, yoga karein, aur doctor se consult karein.`
    
    return NextResponse.json({ answer })
  } catch (error) {
    return NextResponse.json({ answer: "Kripya dubara try karein." })
  }
}