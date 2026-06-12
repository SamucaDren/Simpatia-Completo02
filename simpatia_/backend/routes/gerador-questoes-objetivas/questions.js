const express = require("express");
const router = express.Router();

const service = require("../../services/gerador-questoes-objetivas/geminiService");

router.post("/generate", async (req, res) => {
  try {
    const result = await service.generateQuestions(
      req.body.theme,
      req.body.subject,
      req.body.quantity,
      req.body.type,
      req.body.difficulty,
      req.body.alternatives,
    );

    res.json(result);
  } catch (e) {
    res.status(500).json({
      error: e.message,
    });
  }
});

module.exports = router;
