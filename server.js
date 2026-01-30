require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Groq = require('groq-sdk');
const { tavily } = require('@tavily/core');

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de las IAs
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });

app.post('/api/chat', async (req, res) => {
    const { message, history } = req.body;

    try {
        // Lógica de búsqueda inteligente (Tavily)
        const keywords = ["partido", "juega", "unafut", "saprissa", "liga", "marcador", "clima", "noticias", "costa rica"];
        const needsSearch = keywords.some(k => message.toLowerCase().includes(k));
        
        let searchContext = "";
        if (needsSearch) {
            try {
                const search = await tvly.search(message, { 
                    searchDepth: "advanced", 
                    maxResults: 3 
                });
                searchContext = search.results.map(r => r.content).join("\n");
            } catch (searchError) {
                console.error("Error en búsqueda:", searchError);
            }
        }

        // Respuesta de la IA (Groq)
        const completion = await groq.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: [
                { 
                    role: "system", 
                    content: `Eres GPT-Tico, una IA avanzada creada por Esteban. 
                    Si te piden código, usa bloques markdown (\`\`\`).
                    Si hablas de fútbol, usa emojis (⚽, 🕒, 🏟️).
                    Contexto de internet: ${searchContext}` 
                },
                ...history,
                { role: "user", content: message }
            ],
            temperature: 0.2
        });

        res.json({ reply: completion.choices[0].message.content });

    } catch (error) {
        console.error("Error General:", error);
        res.status(500).json({ error: "El servidor tuvo un hipo técnico." });
    }
});

// Ruta de estado para que Render no se duerma
app.get('/api/status', (req, res) => res.send('GPT-Tico Core Online'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor en puerto ${PORT}`));