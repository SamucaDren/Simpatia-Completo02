require("dotenv").config();

const { OpenAI } = require("openai");

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

async function callGroq(messages, maxTokens = 500, temperature = 0.7) {
  const completion = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages,
    temperature,
    max_tokens: maxTokens,
  });

  return completion.choices[0].message.content;
}

module.exports = { callGroq };