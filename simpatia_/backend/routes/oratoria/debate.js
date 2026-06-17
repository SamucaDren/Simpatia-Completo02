const express = require("express");
const router = express.Router();
const { callGroq } = require("./groq");

const difficultyContext = {
  easy:
    "Seja gentil mas instigante. Faça perguntas que levem o participante a refletir.",
  medium:
    "Questione os pontos fracos e exija justificativas mais sólidas.",
  hard:
    "Apresente contra-argumentos fortes e exija evidências concretas.",
};

router.post("/", async (req, res) => {
  try {
    const { topic, context, difficulty, argument } = req.body;

    if (!topic || !context || !difficulty || !argument) {
      return res.status(400).json({
        error: "Todos os campos são obrigatórios",
      });
    }

    const prompt = `
Você é um debatedor experiente.

Tema: ${topic}

Contexto:
${context}

Nível:
${difficultyContext[difficulty]}

Argumento:
${argument}

Responda em no máximo dois parágrafos.

1. Traga um contraponto forte.
2. Questione a fundamentação.
3. Peça evidências.
4. Incentive reflexão crítica.
`;

    const response = await callGroq(
      [
        {
          role: "system",
          content:
            "Você é um debatedor universitário firme e respeitoso.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      350,
      0.7
    );

    res.json({
      response,
      provider: "groq",
    });
  } catch (error) {
    res.status(500).json({
      error: "Erro ao processar debate",
      details: error.message,
    });
  }
});

module.exports = router;