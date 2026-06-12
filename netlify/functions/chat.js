export async function handler(event) {
  try {
    const { messages } = JSON.parse(event.body);

    console.log("API KEY EXISTS:", !!process.env.OPENAI_API_KEY);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are AI Spy game assistant. Ask yes/no questions and guess objects."
          },
          ...messages
        ]
      })
    });

    const data = await response.json();

    console.log("OPENAI RESPONSE:", JSON.stringify(data));

    if (!response.ok) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          reply: "OpenAI error: " + (data.error?.message || "unknown")
        })
      };
    }

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
        reply: "Server error: " + err.message
      })
    };
  }
}
