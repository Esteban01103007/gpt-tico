const chatContainer = document.getElementById("chat-container");
const chatList = document.getElementById("chatList");
const newChatBtn = document.getElementById("newChatBtn");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

let currentChatId = "programacion";

const chats = {
    programacion: [],
    futbol: []
};

function renderChat(){
    chatContainer.innerHTML = "";

    const history = chats[currentChatId];

    if(history.length === 0){
        const welcome = document.createElement("div");
        welcome.id = "welcome-msg";
        welcome.textContent = "¿En qué puedo ayudarte hoy?";
        chatContainer.appendChild(welcome);
        return;
    }

    history.forEach(msg=>{
        const div = document.createElement("div");
        div.className = `msg-bubble ${msg.role}`;
        div.textContent = msg.content;
        chatContainer.appendChild(div);
    });

    chatContainer.scrollTop = chatContainer.scrollHeight;
}

sendBtn.onclick = ()=>{
    const text = userInput.value.trim();
    if(!text) return;

    chats[currentChatId].push({role:"user",content:text});
    userInput.value="";
    renderChat();

    setTimeout(()=>{
        chats[currentChatId].push({
            role:"bot",
            content:"Respuesta simulada del bot 🤖"
        });
        renderChat();
    },600);
};

newChatBtn.onclick = ()=>{
    const id = "chat_"+Date.now();
    chats[id] = [];

    const div = document.createElement("div");
    div.className = "sidebar-item";
    div.textContent = "Nuevo chat";
    div.onclick = ()=>{
        document.querySelectorAll(".sidebar-item").forEach(i=>i.classList.remove("active"));
        div.classList.add("active");
        currentChatId = id;
        renderChat();
    };

    chatList.appendChild(div);
    div.click();
};

document.querySelectorAll(".sidebar-item[data-chat]").forEach(item=>{
    item.onclick = ()=>{
        document.querySelectorAll(".sidebar-item").forEach(i=>i.classList.remove("active"));
        item.classList.add("active");
        currentChatId = item.dataset.chat;
        renderChat();
    };
});

function toggleTheme(){
    document.body.classList.toggle("dark");
}

renderChat();
