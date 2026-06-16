const express = require("express");
const OpenAI = require("openai");

const router = express.Router();

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

router.post("/generate", async (req, res) => {
  try {
    const {
      discipline,
      knowledgeLevel,
      dailyHours,
      studyGoal,
      hasDeadline,
      deadline,
    } = req.body;

    const daysAvailable = hasDeadline
      ? Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24))
      : 30;

    if (hasDeadline && daysAvailable < 1) {
      return res.status(400).json({
        message: "A data limite não pode ser no passado.",
      });
    }

    const totalHoursAvailable = daysAvailable * dailyHours;
    const weeks = Math.ceil(daysAvailable / 7);

    let maxModules;
    let intensity;
    let durationType;

    if (daysAvailable <= 1) {
      maxModules = 1;
      intensity = "crítico";
      durationType = "1 dia";
    } else if (daysAvailable <= 3) {
      maxModules = 2;
      intensity = "ultra-intensivo";
      durationType = `${daysAvailable} dias`;
    } else if (daysAvailable <= 7) {
      maxModules = 3;
      intensity = "intensivo";
      durationType = `${daysAvailable} dias`;
    } else if (daysAvailable <= 14) {
      maxModules = 4;
      intensity = "moderado";
      durationType = `${weeks} semanas`;
    } else {
      maxModules = 5;
      intensity = "leve";
      durationType = `${weeks} semanas`;
    }

    const prompt = `Como especialista em educação, crie um plano de estudo REALISTA e ADAPTADO em JSON.

CONTEXTO:
- Disciplina: ${discipline}
- Nível: ${knowledgeLevel}
- Horas/dia: ${dailyHours}h
- Dias disponíveis: ${daysAvailable} dias
- Total de horas: ${totalHoursAvailable}h
- Objetivo: ${studyGoal}
- Tipo: ${hasDeadline ? "COM prazo" : "SEM prazo específico"}

ANÁLISE DE TEMPO REALISTA:
${
  daysAvailable <= 1
    ? `
🚨 SITUAÇÃO DE EMERGÊNCIA: Apenas 1 dia disponível!
- MÁXIMO: 1 módulo ULTRA concentrado
- Foco APENAS nos 3-5 tópicos MAIS ESSENCIAIS
- 90% prática, 10% teoria
- Metas de SOBREVIVÊNCIA, não domínio
- Cronograma por HORAS, não dias
`
    : daysAvailable <= 3
      ? `
⚠️ SITUAÇÃO CRÍTICA: Apenas ${daysAvailable} dias disponíveis!
- MÁXIMO: 2 módulos intensivos
- Foco em revisão RÁPIDA e exercícios-chave
- 80% prática, 20% teoria
- Metas realistas de revisão
- Cronograma DIÁRIO detalhado
`
      : daysAvailable <= 7
        ? `
🟡 SITUAÇÃO APERTADA: ${daysAvailable} dias (1 semana)
- MÁXIMO: 3 módulos focados
- Equilíbrio 60% prática / 40% teoria
- Metas semanais alcançáveis
- Cronograma SEMANAL adaptado
`
        : daysAvailable <= 14
          ? `
🟢 SITUAÇÃO CONFORTAVEL: ${daysAvailable} dias (2 semanas)
- 3-4 módulos completos
- Aprofundamento moderado (50/50)
- Metas de compreensão sólida
- Cronograma SEMANAL completo
`
          : `
💚 SITUAÇÃO IDEAL: ${daysAvailable} dias (${weeks}+ semanas)
- 4-5 módulos detalhados
- Aprendizado profundo (40% prática / 60% teoria)
- Projetos extensos
- Metas de domínio completo
`
}

REGRAS ESTRITAS:
- Dias ≤ 1: MÁXIMO 1 módulo ULTRA concentrado
- Dias 2-3: MÁXIMO 2 módulos intensivos  
- Dias 4-7: MÁXIMO 3 módulos focados
- Dias 8-14: 3-4 módulos completos
- Dias ≥15: 4-5 módulos detalhados

CRIE ATIVIDADES ESPECÍFICAS para ${discipline} considerando o tempo REAL.

Responda APENAS com um JSON válido, sem texto adicional antes ou depois, SEM markdown. Use esta estrutura exata:

{
  "discipline": "${discipline}",
  "totalDuration": "${durationType}",
  "studyIntensity": "${intensity}",
  "timeAssessment": "Análise HONESTA sobre viabilidade baseada no tempo disponível",
  "totalHours": ${totalHoursAvailable},
  "availableDays": ${daysAvailable},
  "maxPossibleModules": ${maxModules},
  "successProbability": "${daysAvailable <= 3 ? "baixa" : daysAvailable <= 7 ? "média" : daysAvailable <= 14 ? "alta" : "muito alta"}",
  "modules": [
    {
      "title": "Título do módulo específico para ${discipline}",
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
}

IMPORTANTE: Para ${daysAvailable} dias, crie EXATAMENTE ${maxModules} módulos. Responda SOMENTE com JSON, sem explicações.`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "Você é um especialista em educação. Responda apenas JSON válido.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 50,
    });

    const content = completion.choices[0].message.content;

    const cleanedContent = content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const result = JSON.parse(cleanedContent);

    res.json(result);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message || "Erro ao gerar plano de estudo",
    });
  }
});

module.exports = router;
