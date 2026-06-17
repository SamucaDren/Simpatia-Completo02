const express = require("express");
const router = express.Router();
const { callGroq } = require("./groq");

router.post("/", async (req, res) => {
  try {
    const { messages } = req.body;

    const response = await callGroq(
      [
        {
          role: "system",
          content: `
Você é um assistente do sistema OratorIA.

Responda apenas dúvidas sobre:
- funcionamento do sistema
- debates
- feedback
- navegação
- funcionalidades

Não responda assuntos fora do sistema.
`,
        },
        ...(messages || []),
      ],
      400,
      0.5
    );

    res.json({
      response,
      provider: "groq",
    });
  } catch (error) {
    res.status(500).json({
      error: "Erro ao consultar assistente",
      details: error.message,
    });
  }
});

module.exports = router;