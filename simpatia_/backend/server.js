require("dotenv").config();

const express = require("express");
const OpenAI = require("openai");

const app = express();

app.use(express.json());

app.post("/api/chat", async (req, res) => {
  try {
    const { mensagem } = req.body;

    const client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });

    const response = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: mensagem,
        },
      ],
    });

    res.json({
      resposta: response.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);

    res.status(error.status || 500).json({
      erro: error.message,
    });
  }
});

app.get("/api", (req, res) => {
  res.send("<h1>Servidor rodando com ExpressJS</h1>");
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
