const express = require("express");
const app = express();

app.use(express.json());
const client = new OpenAI({
  apiKey: process.env.GROK_API_KEY,
  baseURL: "https://api.x.ai/v1",
});

app.post("/api/chat", async (req, res) => {
  try {
    const { mensagem } = req.body;

    const response = await client.chat.completions.create({
      model: "grok-4",
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

    res.status(500).json({
      erro: "Falha ao consultar o Grok",
    });
  }
});

app.get("/api", (req, res) => {
  res.send("<h1>Servidor rodando com ExpressJS</h1>");
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
