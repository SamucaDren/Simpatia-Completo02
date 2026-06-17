const express = require("express");
const router = express.Router();
const { callGroq } = require("./groq");

const difficultyContext = {
  easy: "O cenário deve ser simples e direto, adequado para iniciantes no debate.",
  medium:
    "O cenário deve apresentar um desafio moderado, com elementos que exijam uma análise mais profunda.",
  hard:
    "O cenário deve ser complexo e desafiador, com múltiplas camadas de análise e possíveis interpretações.",
};

router.post("/", async (req, res) => {
  try {
    const { theme, difficulty } = req.body;

    if (!theme || !difficulty) {
      return res.status(400).json({
        error: "Tema e dificuldade são obrigatórios",
      });
    }

    const prompt = `
Crie um cenário de debate universitário sobre o tema "${theme}".

Nível:
${difficultyContext[difficulty]}

O cenário deve ser:
- Direto e claro
- Apropriado para universitários
- Um caso concreto
- Uma pergunta que exija posicionamento

Retorne apenas o cenário.
`;

    const context = await callGroq(
      [
        {
          role: "system",
          content:
            "Você cria cenários curtos para debates universitários.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      250,
      0.5
    );

    res.json({
      context,
      provider: "groq",
    });
  } catch (error) {
    res.status(500).json({
      error: "Erro ao gerar contexto",
      details: error.message,
    });
  }
});

module.exports = router;