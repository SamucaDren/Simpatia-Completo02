const express = require("express");
const router = express.Router();

const chatbot = require("./chatbot");
const generateStudyPlan = require("./generate-study-plan");

router.post("/chatbot", chatbot);
router.post("/generate-study-plan", generateStudyPlan);

module.exports = router;