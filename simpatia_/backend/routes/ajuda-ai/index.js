const express = require("express");
const router = express.Router();

const ChatController = require("../../controllers/ajuda-ai/chatController");

const controller = new ChatController();

router.get("/health", (req, res) => {
  res.json({ status: "online", version: "2.0.0" });
});

router.post("/chat", async (req, res, next) => {
  try {
    const { status, payload } = await controller.chat(req.body || {});
    res.status(status).json(payload);
  } catch (err) {
    next(err);
  }
});

router.post("/ajuda-ai", async (req, res, next) => {
  try {
    const { status, payload } = await controller.ajudaAI(req.body || {});
    res.status(status).json(payload);
  } catch (err) {
    next(err);
  }
});

router.post("/speech", async (req, res, next) => {
  try {
    const { status, payload } = await controller.speech(req.body || {});
    res.status(status).json(payload);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
