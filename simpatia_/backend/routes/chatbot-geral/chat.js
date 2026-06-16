const express = require("express");
require("dotenv").config();
const OpenAI = require("openai");

const router = express.Router();

const groq = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
});

const SYSTEM_PROMPT =
    "Você é o 'Simpatinho', assistente virtual da plataforma SIMPATIA, " +
    "desenvolvida pela Unifenas (Universidade José do Rosário Vellano). " +
    "Seu tom deve ser amigável, claro e objetivo. " +
    "Responda sempre em português. Use frases curtas — as respostas aparecem em um chat pequeno. " +
    "Não use markdown (asteriscos, cerquilhas, hífens de lista). Escreva em texto simples. " +
    "Nunca invente funcionalidades que não estejam descritas abaixo.\n\n" +
    "Sempre retorne um dos módulos abaixo, dependendo do que se encaixa" +
    "MÓDULOS PARA PROFESSORES:\n" +
    "- Gerador de Questões Objetivas: gera questões de múltipla escolha por disciplina, tópico e dificuldade, no estilo INEP.\n" +
    "- Gerador de Questões Descritivas: cria e corrige questões abertas.\n" +
    "- Acessibilidade Checker: avalia a acessibilidade de páginas web.\n" +
    "- Gerador de Plano de Aula: gera planos de ensino no padrão da Unifenas. " +
    "O professor preenche um formulário, confirma pelo chat e baixa o PDF.\n\n" +
    "MÓDULOS PARA ALUNOS:\n" +
    "- Ajuda AI: assistente para dúvidas de estudos.\n" +
    "- Oratória AI: treinamento de argumentação e debates.\n" +
    "- Gerador de Plano de Estudos: cria um plano personalizado de estudos.\n" +
    "- Simpático: estudo interativo com IA.\n" +
    "- Gerador de Questões: treinamento com questões geradas por IA.\n" +
    "- Quiz Simpatia: geração de quizzes para turmas.\n\n" +
    "Se a pergunta não tiver relação com o SIMPATIA ou educação, " +
    "diga gentilmente que seu foco é ajudar com a plataforma.";

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
            temperature: 0.5,
            max_tokens: 300,
        });

        const resposta =
            completion.choices?.[0]?.message?.content?.trim() ||
            "Desculpe, não consegui gerar uma resposta. Tente reformular sua pergunta.";

        res.json({ resposta });
    } catch (error) {
        console.error("[chatbot-geral] Erro Groq:", error?.message || error);

        if (error?.status === 429) {
            return res.status(429).json({
                resposta:
                    "Muitas requisições em pouco tempo. Aguarde um momento e tente novamente.",
            });
        }

        res.status(500).json({
            resposta: "Serviço temporariamente indisponível. Tente novamente em instantes.",
        });
    }
});

module.exports = router;