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

//GERADOR DE QUESTÕES OBJETIVAS
app.use(
  "/api/gerador-questoes-objetivas/chat",
  require("./routes/gerador-questoes-objetivas/chat"),
);
app.use(
  "/api/gerador-questoes-objetivas/questions",
  require("./routes/gerador-questoes-objetivas/questions"),
);

//GERADOR DE PLANOS DE AULA
/*
app.use(
  "/api/gerador-plano-aula/chat",
  require("./routes/gerador-plano-aula/chat"),
);

app.use(
  "/api/gerador-plano-aula/generate-pdf",
  require("./routes/gerador-plano-aula/generate-pdf"),
);

app.use(
  "/api/gerador-plano-aula/tutorial",
  require("./routes/gerador-plano-aula/tutorial"),
);*/

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
