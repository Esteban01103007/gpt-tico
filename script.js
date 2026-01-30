const API_URL = "https://gpt-tico.onrender.com/api/chat";

const chatContainer = document.getElementById('chat-container');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const chatItems = document.querySelectorAll('.sidebar-item');

let currentChat = 'programacion';

const chats = {
    programacion: [],
    futbol: []
};

function renderChat() {
    chatContainer.innerHTML = '';
    const history = chats[currentChat];

    if (history.length === 0) {
        const welcome = document.createElement('div');
        welcome.id = 'welcome-msg';
        welcome.textContent = '¿Qué tienes pensado para hoy?';
        chatContainer.appendChild(welcome);
        return;
    }

    history.forEach(msg => {
        const div = document.createElement('div');
        div.className = `msg-bubble ${msg.role === 'user' ? 'user' : 'bot'}`;
        div.innerHTML = `<b>${msg.role === 'user' ? 'Tú' : 'GPT-Tico'}:</b> ${msg.content}`;
        chatContainer.appendChild(div);
    });

    chatContainer.scrollTop = chatContainer.scrollHeight;
}

async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    chats[currentChat].push({ role: 'user', content: text });
    userInput.value = '';
    renderChat();

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: text,
                history: chats[currentChat]
            })
        });

        if (!res.ok) throw new Error('HTTP Error');

        const data = await res.json();
        chats[currentChat].push({ role: 'assistant', content: data.reply });
        renderChat();

    } catch (error) {
        chats[currentChat].push({
            role: 'assistant',
            content: '❌ Error de conexión con el servidor'
        });
        renderChat();
    }
}

// Cambiar de chat
chatItems.forEach(item => {
    item.addEventListener('click', () => {
        chatItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        currentChat = item.dataset.chat;
        renderChat();
    });
});

// Enviar mensaje
sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
        e.preventDefault();
        sendMessage();
    }
});

// Tema oscuro / claro
function toggleTheme() {
    document.body.classList.toggle('dark');
}

// Render inicial
renderChat();
