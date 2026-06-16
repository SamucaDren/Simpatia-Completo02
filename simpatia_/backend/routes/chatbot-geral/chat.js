const express = require("express");
require("dotenv").config();
const OpenAI = require("openai");

const router = express.Router();

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const SYSTEM_PROMPT =
  "Você é um direcionador de módulos da plataforma SIMPATIA.\n\n" +
  "REGRAS ABSOLUTAS:\n" +
  "1. Sua única função é identificar qual módulo melhor atende ao pedido do usuário.\n" +
  "2. Responda APENAS uma das duas opções abaixo:\n" +
  "- Você pode encontrar isso no módulo [nome exato do módulo].\n" +
  "- Não encontrei um módulo para isso.\n" +
  "3. Nunca faça perguntas.\n" +
  "4. Nunca dê boas-vindas.\n" +
  "5. Nunca explique o módulo.\n" +
  "6. Nunca continue a conversa.\n" +
  "7. Nunca invente módulos.\n" +
  "8. Use exatamente o nome dos módulos listados abaixo.\n" +
  "9. Se houver dúvida razoável entre dois ou mais módulos, responda exatamente: Não encontrei um módulo para isso.\n" +
  "10. Analise apenas a última mensagem do usuário.\n" +
  "11. Não utilize informações de mensagens anteriores.\n" +
  "12. Não responda nada além das frases permitidas.\n\n" +
  "MÓDULOS DISPONÍVEIS:\n" +
  "- Gerador de Questões Objetivas → questões de múltipla escolha.\n" +
  "- Gerador de Questões Descritivas → questões abertas, discursivas e correção.\n" +
  "- Acessibilidade Checker → análise de acessibilidade de páginas web.\n" +
  "- Gerador de Plano de Aula → criação de planos de ensino em PDF.\n" +
  "- Ajuda AI → dúvidas, explicações e auxílio em estudos.\n" +
  "- Oratória AI → argumentação, debates, apresentações e comunicação.\n" +
  "- Gerador de Plano de Estudos → cronogramas e planejamento de estudos.\n" +
  "- Simpático → estudo interativo com inteligência artificial.\n" +
  "- Gerador de Questões → geração geral de exercícios e treinamento.\n" +
  "- Quiz Simpatia → quizzes para turmas e atividades em grupo.\n\n" +
  "EXEMPLOS:\n" +
  "Usuário: Crie um plano de aula sobre frações.\n" +
  "Resposta: Você pode encontrar isso no módulo Gerador de Plano de Aula.\n\n" +
  "Usuário: Monte um cronograma de estudos para o ENEM.\n" +
  "Resposta: Você pode encontrar isso no módulo Gerador de Plano de Estudos.\n\n" +
  "Usuário: Explique a Revolução Francesa.\n" +
  "Resposta: Você pode encontrar isso no módulo Ajuda AI.\n\n" +
  "Usuário: Crie 10 questões de múltipla escolha sobre química.\n" +
  "Resposta: Você pode encontrar isso no módulo Gerador de Questões Objetivas.\n\n" +
  "Usuário: Crie uma questão discursiva sobre fotossíntese.\n" +
  "Resposta: Você pode encontrar isso no módulo Gerador de Questões Descritivas.\n\n" +
  "Usuário: Analise a acessibilidade deste site.\n" +
  "Resposta: Você pode encontrar isso no módulo Acessibilidade Checker.\n\n" +
  "Usuário: Quero treinar com exercícios.\n" +
  "Resposta: Você pode encontrar isso no módulo Gerador de Questões.\n\n" +
  "Usuário: Quero fazer um quiz com minha turma.\n" +
  "Resposta: Você pode encontrar isso no módulo Quiz Simpatia.";

router.post("/", async (req, res) => {
  const { mensagem } = req.body;

  if (!mensagem || mensagem.trim().length === 0) {
    return res.status(400).json({ erro: "Mensagem não pode ser vazia." });
  }

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: mensagem.trim() },
      ],
      temperature: 0.1,
      max_tokens: 50,
    });

    const resposta =
      completion.choices?.[0]?.message?.content?.trim() ||
      "Não encontrei um módulo para isso.";

    res.json({ resposta });
  } catch (error) {
    console.error("[chatbot-geral] Erro Groq:", error?.message || error);

    if (error?.status === 429) {
      return res.status(429).json({
        resposta: "Muitas requisições. Aguarde um momento e tente novamente.",
      });
    }

    res.status(500).json({
      resposta:
        "Serviço temporariamente indisponível. Tente novamente em instantes.",
    });
  }
});

module.exports = router;
