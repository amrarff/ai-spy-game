export async function handler(event) {
  return {
    statusCode: 200,
    body: JSON.stringify({
      keyExists: !!process.env.GEMINI_API_KEY,
      keyPreview: process.env.GEMINI_API_KEY?.slice(0, 10)
    })
  };
}
      };
    }

    const systemPrompt = `
You are "AI Spy", a detective guessing game AI.

RULES:
- User thinks of an object.
- Ask ONLY YES/NO questions.
- Be strategic and logical.
- Narrow down step by step.
- If confident, make a final guess dramatically.
- Keep responses short and fun.
`;

    const contents = [
      {
        role: "user",
        parts: [{ text: systemPrompt }]
      },
      ...messages.map(m => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }]
      }))
    ];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
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
      "I couldn't think clearly... try again.";

    return {
      statusCode: 200,
      body: JSON.stringify({ reply })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        reply: "Server error: " + err.message
      })
    };
  }
}
