import { NextResponse } from 'next/server';

// Health tips database
const healthResponses: Record<string, string> = {
  hairfall:
    "Hair fall can be reduced by using onion oil, taking biotin supplements, eating protein-rich foods, and reducing stress.",

  weightloss:
    "For weight loss, focus on calorie deficit diet, daily walking, protein-rich meals, and proper sleep.",

  acne:
    "Wash face twice daily, avoid oily food, and drink plenty of water.",

  cold:
    "Drink ginger tea, take steam inhalation, and get proper rest.",

  fever:
    "Stay hydrated, take rest, and consult doctor if fever stays high.",

  sugar:
    "Limit sugar intake, eat more fiber, and exercise daily.",

  bp:
    "Reduce salt intake, avoid stress, and walk daily.",

  sleep:
    "Avoid screens before sleep and maintain a fixed sleep schedule.",

  stomach:
    "Avoid spicy food and eat probiotic-rich foods like curd.",

  immunity:
    "Eat vitamin C rich foods and sleep properly.",
};

// CLEAN USER MESSAGE
function cleanText(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/gi, '')
    .trim();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const message = body?.message || '';

    if (!message) {
      return NextResponse.json(
        {
          error: 'Message is required',
        },
        {
          status: 400,
        }
      );
    }

    const cleanMessage = cleanText(message);

    let reply =
      "Thank you for your question. Please consult a doctor for professional advice.";

    // FIND MATCH
    for (const [key, response] of Object.entries(
      healthResponses
    )) {
      if (cleanMessage.includes(key)) {
        reply = response;
        break;
      }
    }

    // SAFE STORE MESSAGE
    reply +=
      "\n\nExplore wellness products in our store.";

    return NextResponse.json({
      reply,
    });
  } catch (error) {
    console.error('Chat API Error:', error);

    return NextResponse.json(
      {
        error: 'Internal server error',
      },
      {
        status: 500,
      }
    );
  }
}