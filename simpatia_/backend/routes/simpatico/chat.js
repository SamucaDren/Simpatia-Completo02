require("dotenv").config();

const express = require("express");
const { OpenAI } = require("openai");

const router = express.Router();

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

router.post("/chat", async (req, res) => {
  try {
    const {
      curso,
      materia,
      mensagem_usuario,
      nome,
    } = req.body;

    if (!curso || !materia || !mensagem_usuario || !nome) {
      return res.status(400).json({
        error: "Campos obrigatórios ausentes na requisição",
      });
    }

    let prompt;

    if (mensagem_usuario === "First message") {
      prompt = `
Você é um tutor de IA chamado 'Simpático', especialista em ${materia}.
Sua tarefa é ajudar o aluno ${nome} na matéria de ${materia} do curso de ${curso}.
Seja amigável, didático e incentive o aprendizado.
Comece a conversa se apresentando de forma breve e perguntando ao aluno qual é sua primeira dúvida sobre ${materia}.
Responda em Markdown.`;
    } else {
      prompt = `Você é um tutor de IA chamado 'Simpático', especialista em ${materia}.O aluno ${nome} está estudando ${materia} no curso de ${curso}.A dúvida/mensagem do aluno é:"${mensagem_usuario}"Responda à dúvida do aluno de forma clara, didática e amigável.Use exemplos quando apropriado e incentive o aluno a fazer mais perguntas.Mantenha a resposta concisa e focada na pergunta.Responda em Markdown.`;
    }

    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "Você é um tutor educacional chamado Simpático.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 400,
    });

    const responseText =
      completion.choices[0].message.content;

    res.send(responseText);
  } catch (error) {
    console.error("Erro rota Simpático:", error);

    res.status(500).json({
      error: "Erro ao processar a mensagem",
      details: error.message,
    });
  }
});

module.exports = router;