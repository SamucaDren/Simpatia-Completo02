import { readJsonBody, sendError } from './_utils.js';
import { createGroqChatCompletion, getGroqModel } from './_groq.js';

function getPlanningRules(daysAvailable) {
  if (daysAvailable <= 1) return { maxModules: 1, intensity: 'crítico', durationType: '1 dia', successProbability: 'baixa' };
  if (daysAvailable <= 3) return { maxModules: 2, intensity: 'ultra-intensivo', durationType: `${daysAvailable} dias`, successProbability: 'baixa' };
  if (daysAvailable <= 7) return { maxModules: 3, intensity: 'intensivo', durationType: `${daysAvailable} dias`, successProbability: 'média' };
  if (daysAvailable <= 14) return { maxModules: 4, intensity: 'moderado', durationType: `${Math.ceil(daysAvailable / 7)} semanas`, successProbability: 'alta' };
  return { maxModules: 5, intensity: 'leve', durationType: `${Math.ceil(daysAvailable / 7)} semanas`, successProbability: 'muito alta' };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return sendError(res, 405, 'Método não permitido. Use POST.');
  }

  try {
    const body = await readJsonBody(req);
    const { discipline, dailyHours, knowledgeLevel, studyGoal, hasDeadline, deadline, daysAvailable, totalHoursAvailable } = body;

    if (!discipline || !dailyHours || !knowledgeLevel || !studyGoal || !daysAvailable) {
      return sendError(res, 400, 'Campos obrigatórios ausentes para gerar o plano.');
    }

    const rules = getPlanningRules(Number(daysAvailable));

    const prompt = `Crie um plano de estudo realista e adaptado em JSON puro.

CONTEXTO:
- Disciplina: ${discipline}
- Nível: ${knowledgeLevel}
- Horas por dia: ${dailyHours}
- Dias disponíveis: ${daysAvailable}
- Total de horas: ${totalHoursAvailable}
- Objetivo: ${studyGoal}
- Tem prazo: ${hasDeadline ? 'sim' : 'não'}
- Data limite: ${deadline || 'não informada'}

REGRAS OBRIGATÓRIAS:
- Gere exatamente ${rules.maxModules} módulo(s).
- Intensidade: ${rules.intensity}.
- Seja honesto sobre a viabilidade.
- Atividades precisam ser específicas para a disciplina.
- Não inclua texto fora do JSON.

ESTRUTURA EXATA:
{
  "discipline": "${discipline}",
  "totalDuration": "${rules.durationType}",
  "studyIntensity": "${rules.intensity}",
  "timeAssessment": "Análise honesta sobre viabilidade baseada no tempo disponível",
  "totalHours": ${Number(totalHoursAvailable)},
  "availableDays": ${Number(daysAvailable)},
  "maxPossibleModules": ${rules.maxModules},
  "successProbability": "${rules.successProbability}",
  "modules": [
    {
      "title": "Título do módulo",
      "duration": "duração apropriada",
      "priority": "CRÍTICO ou ALTO ou MÉDIO",
      "focus": "foco do estudo",
      "topics": ["tópico 1", "tópico 2", "tópico 3"],
      "practicalApplications": ["aplicação 1", "aplicação 2"],
      "dailySchedule": {
        "periodo1": "atividade com horas",
        "periodo2": "atividade com horas"
      }
    }
  ],
  "goals": ["meta 1", "meta 2", "meta 3"],
  "recommendations": ["recomendação 1", "recomendação 2", "recomendação 3"]
}`;

    const completion = await createGroqChatCompletion({
      temperature: 0.5,
      max_tokens: 2500,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: 'Você é um especialista em planejamento educacional. Responda somente com JSON válido.' },
        { role: 'user', content: prompt },
      ],
    });

    const content = completion.choices?.[0]?.message?.content || '{}';
    const plan = JSON.parse(content);
    return res.status(200).json({ ...plan, provider: 'groq', model: getGroqModel() });
  } catch (error) {
    const status = error.status || error.code || 500;
    if (status === 401) return sendError(res, 401, 'Chave da Groq inválida ou sem permissão.', error.message);
    if (status === 429) return sendError(res, 429, 'Limite de requisições atingido. Aguarde alguns minutos.', error.message);
    if (error instanceof SyntaxError) return sendError(res, 500, 'Erro ao processar JSON retornado pela IA.', error.message);
    return sendError(res, 500, 'Erro ao gerar plano de estudo.', error.message);
  }
}
