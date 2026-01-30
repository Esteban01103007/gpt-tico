const sendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const chatContainer = document.getElementById('chat-container');
const welcomeMsg = document.getElementById('welcome-msg');

let history = [];
const API_URL = "https://gpt-tico.onrender.com";

async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    // Limpiar pantalla inicial
    if (welcomeMsg) welcomeMsg.remove();

    // Agregar mensaje usuario
    const userDiv = document.createElement('div');
    userDiv.className = 'msg-bubble';
    userDiv.innerHTML = `<b>Tú:</b> ${text}`;
    userDiv.style.alignSelf = 'flex-end';
    chatContainer.appendChild(userDiv);

    userInput.value = '';
    chatContainer.style.justifyContent = 'flex-start';

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text, history: history })
        });

        const data = await response.json();
        
        // Agregar respuesta IA
        const botDiv = document.createElement('div');
        botDiv.className = 'msg-bubble';
        botDiv.innerHTML = `<b>GPT-Tico:</b> ${data.reply}`;
        botDiv.style.alignSelf = 'flex-start';
        chatContainer.appendChild(botDiv);

        // Guardar historial
        history.push({ role: 'user', content: text }, { role: 'assistant', content: data.reply });
        
        // Auto-scroll
        chatContainer.scrollTop = chatContainer.scrollHeight;

    } catch (err) {
        const errDiv = document.createElement('div');
        errDiv.innerText = "Error: El servidor no responde.";
        chatContainer.appendChild(errDiv);
    }
}

sendBtn.addEventListener('click', sendMessage);

userInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });
