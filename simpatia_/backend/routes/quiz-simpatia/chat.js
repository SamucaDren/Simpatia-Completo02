const express = require("express");
const axios = require("axios");
const OpenAI = require("openai");

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const router = express.Router();

function buildRevisaoPrompt(contexto) {
  const questoesStr = (contexto.questoes || [])
    .map((q) => {
      const alts = (q.alternativas || [])
        .map((a, j) => `  ${String.fromCharCode(65 + j)}) ${a}`)
        .join("\n");
      const corretaLetra = String.fromCharCode(65 + (q.correta ?? 0));
      const corretaTexto = q.alternativas?.[q.correta] || "";
      const selecionadaLetra =
        q.selecionada !== null && q.selecionada !== undefined
          ? String.fromCharCode(65 + q.selecionada)
          : null;
      const selecionadaTexto = selecionadaLetra
        ? q.alternativas?.[q.selecionada] || ""
        : "";
      const status = q.acertou ? "✓ Acertou" : "✗ Errou";

      return `Questão ${q.numero} [${status}]:
${q.pergunta}
${alts}
  Resposta correta: ${corretaLetra}) ${corretaTexto}
  Resposta do aluno: ${selecionadaLetra ? `${selecionadaLetra}) ${selecionadaTexto}` : "Não respondida"}`;
    })
    .join("\n\n");

  const focoStr = contexto.questaoFoco
    ? `\nO aluno está perguntando especificamente sobre a Questão ${contexto.questaoFoco}.`
    : "";

  return `Você é um tutor acadêmico do sistema Quiz Simpat.IA.
O aluno fez um quiz e quer entender as questões que errou. Abaixo estão todas as questões com os resultados:

${questoesStr}
${focoStr}

Quando o aluno perguntar sobre uma questão (pelo número ou conteúdo):
1. Identifique a questão correta pelo número ou pelo assunto.
2. Explique por que a alternativa escolhida pelo aluno está incorreta.
3. Explique por que a resposta correta está certa.
Use linguagem clara, didática e encorajadora. Responda em português.`;
}

router.post("/", async (req, res) => {
  const { pergunta, tipo, contexto } = req.body;
  const apiKey = process.env.GROK_API_KEY || "";

  if (!pergunta?.trim())
    return res.status(400).json({ erro: "Pergunta vazia." });
  if (!apiKey) return res.status(500).json({ erro: "Erro no servidor" });

  const ehProfessor = tipo === "professor";

  let systemMsg;

  if (tipo === "revisao" && contexto?.questoes) {
    systemMsg = buildRevisaoPrompt(contexto);
  } else if (ehProfessor) {
    systemMsg = `Você é um assistente para professores no sistema Quiz Simpat.IA.
Ajude o professor a usar o sistema: cadastrar disciplinas, organizar conteúdos, entender desempenho dos alunos.
NÃO responda perguntas de conteúdo acadêmico. Se perguntarem, diga: 'Eu ajudo apenas com o uso do sistema 😊'
Seja claro, direto e profissional.`;
  } else {
    systemMsg = `Você é um assistente do sistema Quiz Simpat.IA.
Ajude o aluno a usar o sistema: como funciona o gerador de questões, níveis, dicas de estudo.
NÃO responda perguntas de conteúdo acadêmico. Se perguntarem, diga: 'Eu ajudo apenas com dúvidas sobre como usar o sistema 😊'
Seja claro, direto e didático.`;
  }

  try {
    const data = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: systemMsg },
        { role: "user", content: pergunta },
      ],
      temperature: 0.4,
      max_tokens: 4096,
    });

    const resposta = data.choices?.[0]?.message?.content || "Sem resposta.";
    res.json({ resposta });
  } catch (err) {
    const mensagemErro =
      err.response?.data?.error?.message || err.message || "Erro desconhecido";
    console.error("[chat] Erro na requisição Groq:", mensagemErro);

    if (err.code === "ECONNABORTED" || err.message?.includes("timeout")) {
      return res.status(504).json({
        erro: "O assistente demorou para responder. Tente novamente.",
      });
    }

    res
      .status(500)
      .json({ erro: "Erro ao consultar IA. Tente novamente em instantes." });
  }
});

module.exports = router;
