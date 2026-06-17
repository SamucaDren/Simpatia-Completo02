const express = require("express");
const router = express.Router();
const { callGroq } = require("./groq");

router.post("/", async (req, res) => {
  try {
    const { messages, theme, difficulty } = req.body;

    const prompt = `
Analise este debate.

Tema:
${theme}

Dificuldade:
${difficulty}

Mensagens:
${messages}

Retorne SOMENTE JSON:

{
  "strengths": [],
  "improvements": [],
  "overall": ""
}
`;

    const result = await callGroq(
      [
        {
          role: "system",
          content:
            "Responda exclusivamente com JSON válido.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      800,
      0.5
    );

    const jsonMatch = result.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error("JSON inválido retornado pela IA");
    }

    const feedback = JSON.parse(jsonMatch[0]);

    res.json(feedback);
  } catch (error) {
    res.status(500).json({
      strengths: ["Não foi possível gerar feedback"],
      improvements: ["Tente novamente"],
      overall: error.message,
    });
  }
});

module.exports = router;