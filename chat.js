export async function handler(event) {
  try {
    const { messages } = JSON.parse(event.body);

    const systemPrompt = `
You are "AI Spy", a mind-reading detective game AI.

RULES:
- The user is thinking of an object.
- You must guess it using yes/no questions.
- Be clever, strategic, and adaptive.
- Do NOT ask open-ended questions.
- When confident (>80%), make a final guess clearly.
- Keep responses short and fun.
- Add personality like a detective AI.
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages
        ]
      })
    });

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({
        reply: data.choices[0].message.content
      })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        reply: "AI Spy malfunctioned... 🔧 Try again."
      })
    };
  }
}