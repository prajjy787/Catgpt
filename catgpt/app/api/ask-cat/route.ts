import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {          // Handle POST requests to interact with the OpenRouter API
  const body = await req.json();                      // Parse the request body             
  const message = body.message;                     // Extract the message from the request body        

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", { // Send a POST request to the OpenRouter API
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({                      // Create the request body for the OpenRouter API
      model: "openai/gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a cute, funny cat that answers in a cat-like way." },
        { role: "user", content: message },
      ],
    }),
  });

  const data = await response.json();  // Handle the response from the OpenRouter API

  if (!response.ok) {                // Check if the response is not OK
    return new Response(JSON.stringify(data), { status: response.status }); // Return the error response
  }

  
  const chatText = data.choices?.[0]?.message?.content || "No reply"; // Get the chat text from the response

  return new Response(
    JSON.stringify({ reply: chatText }),   // Return the chat text in JSON format
    {
      status: 200,                                // Set the response status to 200
      headers: { "Content-Type": "application/json" }, // Set the content type to JSON
    }
  );
}
