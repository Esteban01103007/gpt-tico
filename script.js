const sendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const chatContainer = document.getElementById('chat-container');
const welcomeMsg = document.getElementById('welcome-msg');

let history = [];
const API_URL = "https://gpt-tico.onrender.com/api/chat";

async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    // Quitar mensaje de bienvenida
    if (welcomeMsg) welcomeMsg.remove();

    // Mensaje del usuario
    const userDiv = document.createElement('div');
    userDiv.className = 'msg-bubble user';
    userDiv.innerHTML = `<b>Tú:</b> ${text}`;
    chatContainer.appendChild(userDiv);

    userInput.value = '';
    chatContainer.scrollTop = chatContainer.scrollHeight;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: text,
                history: history
            })
        });

        // 🔴 Manejo real de errores HTTP
        if (!response.ok) {
            throw new Error(`Error HTTP ${response.status}`);
        }

        const data = await response.json();

        if (!data.reply) {
            throw new Error("Respuesta inválida del servidor");
        }

        // Respuesta del bot
        const botDiv = document.createElement('div');
        botDiv.className = 'msg-bubble bot';
        botDiv.innerHTML = `<b>GPT-Tico:</b> ${data.reply}`;
        chatContainer.appendChild(botDiv);

        // Guardar historial
        history.push(
            { role: 'user', content: text },
            { role: 'assistant', content: data.reply }
        );

        chatContainer.scrollTop = chatContainer.scrollHeight;

    } catch (error) {
        console.error("Error:", error);

        const errDiv = document.createElement('div');
        errDiv.className = 'msg-bubble error';
        errDiv.innerHTML = `<b>Error:</b> No se pudo conectar con el servidor.`;
        chatContainer.appendChild(errDiv);

        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
}

// Enviar con botón
sendBtn.addEventListener('click', sendMessage);

// Enviar con Enter
userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        sendMessage();
    }
});
