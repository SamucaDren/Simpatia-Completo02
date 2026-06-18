const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

function getGroqModel() {
  return process.env.GROQ_MODEL || 'llama-3.1-8b-instant';
}

function ensureGroqKey() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    const error = new Error('GROQ_API_KEY não configurada no servidor. Crie a variável de ambiente com sua chave da Groq.');
    error.status = 500;
    throw error;
  }
  return apiKey;
}

async function createGroqChatCompletion({ messages, temperature = 0.3, max_tokens = 1000, response_format }) {
  const apiKey = ensureGroqKey();
  const payload = {
    model: getGroqModel(),
    messages,
    temperature,
    max_tokens,
  };

  if (response_format) payload.response_format = response_format;

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data?.error?.message || data?.message || `Erro HTTP ${response.status} na API da Groq.`;
    const error = new Error(message);
    error.status = response.status;
    error.details = data;
    throw error;
  }

  return data;
}

module.exports = {
  getGroqModel,
  ensureGroqKey,
  createGroqChatCompletion
};