const chatBox = document.getElementById("chat");

let history = [];

function addMessage(text, type) {
  const div = document.createElement("div");
  div.className = "msg " + type;
  div.textContent = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function startGame() {
  chatBox.innerHTML = "";
  history = [];

  addMessage("🕵️ AI Spy activated... Think of an object!", "ai");

  sendToAI("Start the game. Begin by asking a yes/no question.");
}

async function sendToAI(userInput) {
  history.push({ role: "user", content: userInput });

  addMessage(userInput, "user");

  try {
    const res = await fetch("/.netlify/functions/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ messages: history })
    });

    const data = await res.json();

    addMessage(data.reply, "ai");

    history.push({ role: "assistant", content: data.reply });

  } catch (err) {
    addMessage("⚠️ Connection error. Try again.", "ai");
  }
}

function answerYes() {
  sendToAI("User answered YES. Continue questioning or guess if confident.");
}

function answerNo() {
  sendToAI("User answered NO. Adjust strategy and ask another question.");
}
