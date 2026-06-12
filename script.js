const chat = document.getElementById("chat");

let history = [];

function addMsg(text, type) {
    const div = document.createElement("div");
    div.className = "msg " + type;
    div.innerText = text;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}

function startGame() {
    chat.innerHTML = "";
    history = [];

    addMsg("Think of ANY object... I will try to read your mind 🧠", "ai");

    sendToAI("Start the game. Ask your first smart yes/no question.");
}

async function sendToAI(userMessage) {

    history.push({ role: "user", content: userMessage });

    const res = await fetch("/.netlify/functions/chat", {
        method: "POST",
        body: JSON.stringify({ messages: history })
    });

    const data = await res.json();

    history.push({ role: "assistant", content: data.reply });

    addMsg(data.reply, "ai");
}

function sendAnswer(ans) {
    addMsg(ans.toUpperCase(), "user");

    sendToAI(
        "User answered: " + ans +
        ". Continue guessing intelligently. Ask next yes/no question OR make a final guess if confident."
    );
}