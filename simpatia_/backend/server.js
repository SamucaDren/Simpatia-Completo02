require("dotenv").config();

const express = require("express");
const OpenAI = require("openai");
const cors = require("cors");

const app = express();
app.use(cors());
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
);

//QUIZ SIMPATIA
app.use("/api/quiz-simpatia/quiz", require("./routes/quiz-simpatia/quiz"));

app.use("/api/quiz-simpatia/chat", require("./routes/quiz-simpatia/chat"));

//CHATBOT
app.use("/api/chatbot-geral/chat", require("./routes/chatbot-geral/chat"));

//GERADOR DE PLANO DE ESTUDO
app.use(
  "/api/gerador-plano-estudo",
  require("./routes/gerador-plano-estudo/study-plan.js"),
);

//CORRETOR QUESTOES DESCRITIVAS
app.use(
  "/api/corretor-questoes-descritivas",
  require("./routes/corretor-questoes-descritivas/server.js"),
);

//SIMPATICO 
app.use(
  "/api/simpatico",
  require("./routes/simpatico/chat.js")
);

//ORATORIA
app.use("/api/oratoria/context", require("./routes/oratoria/context"));
app.use("/api/oratoria/debate", require("./routes/oratoria/debate"));
app.use("/api/oratoria/feedback", require("./routes/oratoria/feedback"));
app.use("/api/oratoria/system-chat", require("./routes/oratoria/system-chat"));

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
