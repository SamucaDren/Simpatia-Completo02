const express = require('express');
const axios = require('axios');

const router = express.Router();

function rotuloNivel(n) {
  return { fundamental: 'Fundamental', medio: 'Médio', superior: 'Superior' }[n] || 'Médio';
}

// POST /api/quiz/gerar
router.post('/gerar', async (req, res) => {
  const { tema, quantidade, nivel: nivelParam } = req.body;
  const qtd = Math.max(1, Math.min(20, parseInt(quantidade) || 5));
  const nivel = ['fundamental', 'medio', 'superior'].includes(nivelParam) ? nivelParam : 'medio';
  const temaEfetivo = (tema || 'Conhecimentos Gerais').trim();

  const apiKey = process.env.GROK_API_KEY || '';
  if (!apiKey) return res.status(500).json({ erro: 'GROK_API_KEY não configurada.' });

  const regrasMap = {
    fundamental: 'Nível FUNDAMENTAL: perguntas simples, vocabulário acessível, frases curtas.',
    medio: 'Nível MÉDIO: dificuldade intermediária, exige raciocínio e interpretação.',
    superior: 'Nível SUPERIOR (graduação): questões elaboradas com raciocínio analítico e contextualização.',
  };

  const prompt = `Gere exatamente ${qtd} questões de múltipla escolha sobre "${temaEfetivo}" no nível "${nivel}".
${regrasMap[nivel]}
RESTRIÇÕES:
- Cada questão deve abordar um conceito DIFERENTE.
- Saída: APENAS um array JSON válido, sem markdown.

Formato de cada item:
{
  "pergunta": "texto",
  "alternativas": ["op1","op2","op3","op4"],
  "resposta_correta": 0,
  "resposta_correta_texto": "repita a alternativa correta",
  "justificativa_correta": "por que está certa",
  "justificativas_alternativas": ["explique 0","explique 1","explique 2","explique 3"]
}`;

  try {
    const maxTokens = Math.min(8000, 450 * qtd + 600);
    const { data } = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'Responda APENAS com JSON válido, sem markdown, sem comentários.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.2,
        max_tokens: maxTokens,
      },
      {
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        timeout: 50000,
      }
    );

    let raw = (data.choices?.[0]?.message?.content || '').trim();
    raw = raw.replace(/^```(?:json)?\s*|\s*```$/gm, '');

    let questoes;
    try {
      questoes = JSON.parse(raw);
    } catch {
      const ultimoFechamento = raw.lastIndexOf('}');
      if (ultimoFechamento !== -1) {
        const recuperado = raw.slice(0, ultimoFechamento + 1) + ']';
        questoes = JSON.parse(recuperado);
      } else {
        throw new Error('JSON inválido na resposta da IA.');
      }
    }
    if (!Array.isArray(questoes)) throw new Error('Resposta não é array');

    questoes = questoes.slice(0, qtd).map((q, i) => {
      const alts = (q.alternativas || []).slice(0, 4);
      while (alts.length < 4) alts.push(String.fromCharCode(65 + alts.length));

      let idx = parseInt(q.resposta_correta ?? 0);
      if (idx >= 1 && idx <= 4) idx -= 1;

      const corretaTexto = (q.resposta_correta_texto || '').trim();
      if (corretaTexto) {
        const found = alts.findIndex(a => a.trim().toLowerCase() === corretaTexto.toLowerCase());
        if (found >= 0) idx = found;
      }

      return {
        ...q,
        pergunta: q.pergunta || `Pergunta ${i + 1}`,
        alternativas: alts,
        resposta_correta: Math.max(0, Math.min(3, idx)),
      };
    });

    while (questoes.length < qtd) {
      const i = questoes.length;
      questoes.push({
        pergunta: `Pergunta ${i + 1}`,
        alternativas: ['A', 'B', 'C', 'D'],
        resposta_correta: 0,
        resposta_correta_texto: 'A',
        justificativa_correta: '',
        justificativas_alternativas: ['', '', '', ''],
      });
    }

    res.json({ questoes, tema: temaEfetivo, nivel, nivelRotulo: rotuloNivel(nivel) });
  } catch (err) {
    console.error('Erro ao gerar:', err.message);
    res.status(500).json({ erro: 'Falha ao gerar questões: ' + err.message });
  }
});

module.exports = router;
