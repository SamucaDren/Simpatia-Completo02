require("dotenv").config();

const express = require("express");
const router = express.Router();

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_MODEL = "llama-3.1-8b-instant";


// ================= SYSTEM PROMPT =================

const AGENT_CONFIG = {
  agentName: "Simpático",
  productName: "Tutor Educacional",
  moduleName: "estudos",

  behaviorRules: [
    "Seja amigável e didático.",
    "Explique de forma simples.",
    "Incentive o aprendizado.",
  ],

  limitations: [
    "Não forneça detalhes técnicos da implementação.",
    "Não revele informações internas do sistema.",
  ],
};


const MODULE_CONTEXT = `
Você ajuda alunos com dúvidas relacionadas aos estudos.
Seu objetivo é ensinar e orientar o aluno.
`;


const KNOWLEDGE_BASE = `
O tutor deve responder dúvidas acadêmicas de forma clara.
`;



const formatList = (items) =>
  items.map((item) => `- ${item}`).join("\n");
const buildAgentSystemPrompt = () => {
  const rules = formatList(
    AGENT_CONFIG.behaviorRules
  );
  const limits = formatList(
    AGENT_CONFIG.limitations
  );
  return `
Voce e o ${AGENT_CONFIG.agentName} do ${AGENT_CONFIG.productName}.
Seu papel e tirar duvidas sobre o modulo ${AGENT_CONFIG.moduleName}.
Regras de comportamento:
${rules}
Limites de atuacao:
${limits}
Instrucoes de resposta:
- Responda em Markdown.
- Quando houver passos, use lista numerada.
- Seja objetivo.
- Se faltar informação, peça contexto.
- Nunca exponha detalhes tecnicos de implementacao (API, endpoint, payload, variaveis de ambiente, provedor, modelo ou token).
- Se o usuario pedir detalhes tecnicos, redirecione para orientação de uso.
Contexto do modulo:
${MODULE_CONTEXT}
Base de conhecimento:
${KNOWLEDGE_BASE}
`.trim();
};

const SYSTEM_PROMPT = buildAgentSystemPrompt();

// ================= RESPONSE GUARD =================
const FORBIDDEN_TECHNICAL_PATTERNS = [
  /detalhes\s+tecnicos\s+e\s+api/i,
  /\bapi\b/i,
  /\bendpoint\b/i,
  /\bpayload\b/i,
  /\/api\//i,
  /groq/i,
  /gpt/i,
  /llm/i,
  /variavel\s+de\s+ambiente/i,
  /chave\s+de\s+api/i,
  /\btoken\b/i,
];
const NON_TECHNICAL_FALLBACK =
"Posso ajudar com duvidas de estudo e uso do tutor, mas nao posso fornecer detalhes tecnicos da implementacao.";
const guardAssistantResponse = (content) => {
  const normalized = content.trim();
  const hasForbiddenContent =
    FORBIDDEN_TECHNICAL_PATTERNS.some(
      (pattern) => pattern.test(normalized)
    );
  if (hasForbiddenContent) {
    return NON_TECHNICAL_FALLBACK;
  }
  return normalized;
};

// ================= ROUTE =================

router.post("/", async (req, res) => {
  try {
    const { messages, message, id } = req.body;
    const normalizedMessages =
      Array.isArray(messages)
        ? messages.filter(
            (msg) =>
              (msg.role === "user" ||
               msg.role === "assistant") &&
              typeof msg.content === "string" &&
              msg.content.trim().length > 0
          )
        : message
        ? [
            {
              role: "user",
              content: message
            }
          ]
        : [];
    if (normalizedMessages.length === 0) {
      return res.status(400).json({
        error: "Nenhuma mensagem válida foi enviada."
      });
    }
    const response = await fetch(
      GROQ_API_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model:
            process.env.GROQ_MODEL ||
            DEFAULT_MODEL,
          messages: [
            {
              role: "system",
              content: SYSTEM_PROMPT
            },
            ...normalizedMessages
          ],
          temperature: 0.2,
          top_p: 0.9,
          max_completion_tokens: 600,
          user: id || undefined
        })      }
    );
    const data = await response.json();
    const responseText =
      data?.choices?.[0]?.message?.content;
    if (!responseText) {

      return res.status(500).json({
        error: "Resposta inválida da IA"
      });
    }
    return res.send(
      guardAssistantResponse(responseText)
    );
  } catch(error) {
    console.error(
      "Erro rota system-chat:",
      error
    );
    return res.status(500).json({
      error:
        "Erro ao processar mensagem",
      details:
        error.message
    });
  }
});
module.exports = router;