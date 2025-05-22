import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const message = body.message;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openai/gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a cute, funny cat that answers in a cat-like way." },
        { role: "user", content: message },
      ],
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    return new Response(JSON.stringify(data), { status: response.status });
  }

  // Extract just the text content from the first choice
  const chatText = data.choices?.[0]?.message?.content || "No reply";

  return new Response(
    JSON.stringify({ reply: chatText }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
