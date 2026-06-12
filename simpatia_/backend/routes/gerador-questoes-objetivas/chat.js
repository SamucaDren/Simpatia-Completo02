const express = require("express");
const router = express.Router();

const service = require("../../services/gerador-questoes-objetivas/geminiService");

router.post("/ask", async (req, res) => {
  try {
    const response = await service.askChatbot(req.body.message);

    res.json({ response });
  } catch (e) {
    res.json({ response: e.message });
  }
});

module.exports = router;
