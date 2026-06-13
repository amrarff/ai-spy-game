export async function handler(event) {
  try {
    const { messages } = JSON.parse(event.body);

    const apiKey = process.env.GEMINI_API_KEY;

    // Convert OpenAI-style history to Gemini format
    const contents = messages.map(msg => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }]
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{
              text: `
You are AI Spy, a fun detective game.

RULES:
- The user is thinking of an object.
- Ask only YES/NO questions.
- Be clever and strategic.
- Keep responses short.
- When confident, make your final guess dramatically.
              `
            }]
          },
          contents
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          reply: data.error?.message || "Gemini API error"
        })
      };
    }

    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Hmm... my detective instincts failed me.";

    return {
      statusCode: 200,
      body: JSON.stringify({ reply })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        reply: "AI Spy malfunctioned: " + err.message
      })
    };
  }
}
