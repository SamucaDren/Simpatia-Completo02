const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

async function generateQuestions(
  theme,
  subject,
  quantity,
  type,
  difficulty,
  alternatives,
) {
  const prompt = buildPrompt(
    theme,
    subject,
    quantity,
    type,
    difficulty,
    alternatives,
  );

  const response = await client.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const text = response.choices[0].message.content;

  const json = extractJson(text);

  return JSON.parse(json);
}

// PROMPT (NÃO ALTERADO)
function buildPrompt(theme, subject, quantity, type, difficulty, alternatives) {
  let tipoNormalizado;

  switch (type.toLowerCase()) {
    case "multipla":
      tipoNormalizado = "mc";
      break;
    case "descritiva":
      tipoNormalizado = "descriptive";
      break;
    case "ambas":
      tipoNormalizado = "mc e descriptive";
      break;
    default:
      tipoNormalizado = "mc";
  }

  return `
        Você é um gerador de questões para provas. Gere exatamente ${quantity} questões da matéria "${theme}", sobre o assunto "${subject}". Nível de dificuldade: ${difficulty}. Tipo de questão solicitado: ${tipoNormalizado}. Cada questão de múltipla escolha deve conter exatamente ${alternatives} alternativas. Responda APENAS com um JSON válido no formato:
        { "questions": [ { "id":"1", "text":"enunciado da questão (sem alternativas)", "type":"mc|descriptive", "options":["op1","op2"], "correctIndex":0, "explanation":"..." }, ... ] }

        IMPORTANTE: No campo 'text' coloque apenas o enunciado da questão, sem incluir alternativas.
        As alternativas devem ir SOMENTE no campo 'options'.
        Para questões descritivas, deixe 'options' e 'correctIndex' como null ou omitidos.
        Não inclua nenhum comentário ou texto fora do JSON.
        Considere questões no estilo INEP, contendo uma contextualização, um problema relacionado ao contexto e um comando para o aluno responder.
        `;
}

// CHAT (sem mudança de lógica de prompt)
async function askChatbot(userMessage) {
  try {
    const systemInstruction =
      "PERSONA: Você é o 'Especialista SIMPATIA', um assistente técnico de suporte ao módulo Gerador de Questões Estilo INEP. " +
      "Seu tom de voz deve ser estritamente formal, claro e objetivo.\n\n" +
      "BASE DE CONHECIMENTO (TUTORIAL):\n" +
      "1. O usuário deve informar obrigatoriamente a Disciplina e o Tópico.\n" +
      "2. O sistema suporta questões de Múltipla Escolha, Descritivas ou Ambas.\n" +
      "3. Configurações: Quantidade de itens, número de alternativas e nível de dificuldade (Básico, Intermediário ou Avançado).\n" +
      "4. RESPOSTAS DESCRITIVAS: O sistema SEMPRE gera a 'Resposta Esperada'.\n" +
      "5. EXPORTAÇÃO: Utilize os botões PDF ou GIFT.\n\n" +
      "Quando o usuário perguntar sobre Moodle, explique normalmente.\n" +
      "REGRAS DE RESPOSTA:\n" +
      "- mantenha foco no sistema\n" +
      "- não saia do tema\n";

    const prompt = systemInstruction + "\nUsuário: " + userMessage;

    const response = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error(error);
    return "Desculpe, o serviço de IA está temporariamente indisponível. Tente novamente em alguns instantes.";
  }
}

// EXTRACT JSON
function extractJson(text) {
  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");

  if (firstBrace >= 0 && lastBrace >= firstBrace) {
    return text.substring(firstBrace, lastBrace + 1);
  }

  return text;
}

module.exports = {
  generateQuestions,
  askChatbot,
};
