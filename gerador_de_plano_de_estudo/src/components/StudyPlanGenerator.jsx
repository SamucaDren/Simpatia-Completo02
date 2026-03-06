import React, { useState } from "react";
import {
  availableDisciplines,
  knowledgeLevels,
  studyGoals,
} from "../data/infosToGeneratePlan";

import { calculateDaysAvailable } from "../utils/calculateDaysAvailable";
import { exportStudyPlanToPDF } from "../services/pdfServices";

import {
  BookOpen,
  Clock,
  Calendar,
  Download,
  Target,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

export default function StudyPlanGenerator() {
  const [discipline, setDiscipline] = useState("");
  const [dailyHours, setDailyHours] = useState("");
  const [knowledgeLevel, setKnowledgeLevel] = useState("");
  const [deadline, setDeadline] = useState("");
  const [studyGoal, setStudyGoal] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [studyPlan, setStudyPlan] = useState(null);
  const [error, setError] = useState("");
  const [hasDeadline, setHasDeadline] = useState(true);

  const generateStudyPlanWithAI = async () => {
    const daysAvailable = calculateDaysAvailable(hasDeadline, deadline);
    const totalHoursAvailable = daysAvailable * parseInt(dailyHours);
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

    try {
      const apiKey = "aqui_vai_a_sua_chave_de_api"; // substitua pela sua chave de API

      if (!apiKey) {
        throw new Error("VITE_OPENAI_API_KEY não configurada no arquivo .env");
      }

      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content:
                  "Você é um especialista em educação que cria planos de estudo detalhados e realistas. Sempre responda APENAS com JSON válido, sem markdown ou texto adicional.",
              },
              {
                role: "user",
                content: prompt,
              },
            ],
            temperature: 0.7,
            max_tokens: 4000,
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `Erro OpenAI (${response.status}): ${errorData.error?.message || "Erro desconhecido"}`,
        );
      }

      const data = await response.json();
      const content = data.choices[0].message.content;

      // Remove markdown code blocks se existirem
      const cleanedContent = content
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();

      // Parse do JSON
      const parsedData = JSON.parse(cleanedContent);

      return parsedData;
    } catch (error) {
      console.error("Erro detalhado:", error);

      // Mensagens de erro mais específicas
      if (error.message.includes("VITE_OPENAI_API_KEY")) {
        throw new Error("Configure a chave da OpenAI no arquivo .env");
      }
      if (error.message.includes("401")) {
        throw new Error("Chave de API inválida. Verifique VITE_OPENAI_API_KEY");
      }
      if (error.message.includes("429")) {
        throw new Error(
          "Limite de requisições atingido. Aguarde alguns minutos",
        );
      }
      if (error.message.includes("JSON")) {
        throw new Error("Erro ao processar resposta da IA. Tente novamente");
      }

      throw new Error(`Falha na geração: ${error.message}`);
    }
  };

  const generateStudyPlan = async () => {
    if (
      !discipline.trim() ||
      !dailyHours.trim() ||
      !knowledgeLevel ||
      !studyGoal
    ) {
      alert("Por favor, preencha todos os campos obrigatórios!");
      return;
    }

    if (hasDeadline && !deadline) {
      alert("Por favor, selecione uma data limite!");
      return;
    }

    const daysAvailable = calculateDaysAvailable(hasDeadline, deadline);

    if (hasDeadline && daysAvailable < 1) {
      alert("A data limite não pode ser no passado!");
      return;
    }

    setIsGenerating(true);
    setError("");
    setStudyPlan(null);

    try {
      const aiPlan = await generateStudyPlanWithAI();

      const completePlan = {
        ...aiPlan,
        knowledgeLevel,
        dailyHours: parseInt(dailyHours),
        daysAvailable,
        studyGoal,
        hasDeadline,
      };

      setStudyPlan(completePlan);
    } catch (error) {
      console.error("Erro ao gerar plano de estudo:", error);
      setError(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const getIntensityColor = () => {
    if (!studyPlan) return "from-purple-600 to-blue-600";

    const intensity = studyPlan.studyIntensity?.toLowerCase();
    if (intensity.includes("crítico") || intensity.includes("ultra-intensivo"))
      return "from-red-600 to-orange-600";
    if (intensity.includes("intensivo")) return "from-orange-500 to-yellow-500";
    if (intensity.includes("moderado")) return "from-blue-500 to-cyan-500";
    return "from-green-500 to-emerald-500";
  };

  const getSuccessProbabilityColor = (probability) => {
    switch (probability?.toLowerCase()) {
      case "muito baixa":
        return "text-red-600 bg-red-100";
      case "baixa":
        return "text-orange-600 bg-orange-100";
      case "média":
        return "text-yellow-600 bg-yellow-100";
      case "alta":
        return "text-green-600 bg-green-100";
      case "muito alta":
        return "text-emerald-600 bg-emerald-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const handleExportPDF = () => {
    exportStudyPlanToPDF(studyPlan, discipline);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Cabeçalho */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="w-12 h-12 text-purple-600 mr-3" />
            <h1 className="text-5xl font-bold text-gray-900">
              Plano de Estudo{" "}
              <span className="text-purple-600">Inteligente</span>
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Planos adaptados ao seu tempo - sempre realista e honesto
          </p>
        </div>

        {/* Formulário */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Target className="w-6 h-6 mr-2 text-purple-600" />
            Configure seu Plano
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Disciplina */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                📚 Disciplina *
              </label>
              <select
                value={discipline}
                onChange={(e) => setDiscipline(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                required
              >
                <option value="">-- Escolha uma disciplina --</option>
                {availableDisciplines.map((d, idx) => (
                  <option key={idx} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Horas diárias */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                ⏰ Horas por dia *
              </label>
              <input
                type="number"
                min="1"
                max="8"
                value={dailyHours}
                onChange={(e) => setDailyHours(e.target.value)}
                placeholder="Ex: 2"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                required
              />
            </div>

            {/* Nível de conhecimento */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                📊 Seu nível *
              </label>
              <select
                value={knowledgeLevel}
                onChange={(e) => setKnowledgeLevel(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                required
              >
                <option value="">-- Selecione seu nível --</option>
                {knowledgeLevels.map((level, idx) => (
                  <option key={idx} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Data limite toggle */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                📅 Tem data limite?
              </label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setHasDeadline(true)}
                  className={`flex-1 px-4 py-3 rounded-lg border-2 transition ${
                    hasDeadline
                      ? "bg-purple-100 border-purple-500 text-purple-700 font-semibold"
                      : "bg-gray-100 border-gray-300 text-gray-600"
                  }`}
                >
                  Sim, tenho prazo
                </button>
                <button
                  type="button"
                  onClick={() => setHasDeadline(false)}
                  className={`flex-1 px-4 py-3 rounded-lg border-2 transition ${
                    !hasDeadline
                      ? "bg-green-100 border-green-500 text-green-700 font-semibold"
                      : "bg-gray-100 border-gray-300 text-gray-600"
                  }`}
                >
                  Não, estudo contínuo
                </button>
              </div>
            </div>

            {/* Data limite (condicional) */}
            {hasDeadline && (
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-semibold mb-2">
                  📅 Data limite da prova/projeto *
                </label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  required={hasDeadline}
                />
                {deadline && hasDeadline && (
                  <p
                    className={`text-sm mt-2 font-medium ${
                      calculateDaysAvailable(hasDeadline, deadline) <= 1
                        ? "text-red-600"
                        : calculateDaysAvailable(hasDeadline, deadline) <= 3
                          ? "text-orange-600"
                          : calculateDaysAvailable(hasDeadline, deadline) <= 7
                            ? "text-yellow-600"
                            : "text-green-600"
                    }`}
                  >
                    {calculateDaysAvailable(hasDeadline, deadline)} dias
                    disponíveis -{" "}
                    {calculateDaysAvailable(hasDeadline, deadline) <= 1
                      ? "EMERGÊNCIA"
                      : calculateDaysAvailable(hasDeadline, deadline) <= 3
                        ? "CRÍTICO"
                        : calculateDaysAvailable(hasDeadline, deadline) <= 7
                          ? "URGENTE"
                          : "CONFORTAVEL"}
                  </p>
                )}
              </div>
            )}

            {/* Objetivo do estudo */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-semibold mb-2">
                🎯 Objetivo principal *
              </label>
              <select
                value={studyGoal}
                onChange={(e) => setStudyGoal(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                required
              >
                <option value="">-- Qual seu objetivo? --</option>
                {studyGoals.map((goal, idx) => (
                  <option key={idx} value={goal}>
                    {goal}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-red-800 font-semibold">
                    Erro na geração:
                  </p>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Botão de gerar */}
          <button
            onClick={generateStudyPlan}
            disabled={
              isGenerating ||
              !discipline ||
              !dailyHours ||
              !knowledgeLevel ||
              !studyGoal ||
              (hasDeadline && !deadline)
            }
            className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-lg rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                IA analisando seu tempo...
              </>
            ) : (
              <>
                <TrendingUp className="w-5 h-5 mr-2" />
                Gerar Plano Realista
              </>
            )}
          </button>
        </div>

        {/* Resultado do Plano */}
        {studyPlan && (
          <div className="space-y-6">
            {/* Cabeçalho do Plano */}
            <div
              className={`bg-gradient-to-r ${getIntensityColor()} rounded-2xl shadow-xl p-8 text-white`}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-3xl font-bold">{studyPlan.discipline}</h2>
                  <p className="text-white/80 mt-1">
                    {studyPlan.hasDeadline
                      ? "Plano com prazo"
                      : "Estudo contínuo"}{" "}
                    • {studyPlan.studyIntensity}
                  </p>
                </div>
                <button
                  onClick={handleExportPDF}
                  className="flex items-center px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition font-semibold"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exportar PDF
                </button>
              </div>
              <div className="grid md:grid-cols-4 gap-4 text-sm">
                <div className="bg-white/20 rounded-lg p-3">
                  <Clock className="w-5 h-5 mb-1" />
                  <div className="font-semibold">Duração</div>
                  <div>{studyPlan.totalDuration}</div>
                </div>
                <div className="bg-white/20 rounded-lg p-3">
                  <Calendar className="w-5 h-5 mb-1" />
                  <div className="font-semibold">Dias</div>
                  <div>{studyPlan.daysAvailable} dias</div>
                </div>
                <div className="bg-white/20 rounded-lg p-3">
                  <Target className="w-5 h-5 mb-1" />
                  <div className="font-semibold">Horas/Dia</div>
                  <div>{studyPlan.dailyHours}h</div>
                </div>
                <div className="bg-white/20 rounded-lg p-3">
                  <TrendingUp className="w-5 h-5 mb-1" />
                  <div className="font-semibold">Sucesso</div>
                  <div
                    className={`px-2 py-1 rounded text-xs font-bold ${getSuccessProbabilityColor(studyPlan.successProbability)}`}
                  >
                    {studyPlan.successProbability}
                  </div>
                </div>
              </div>
            </div>

            {/* Análise de Viabilidade */}
            {studyPlan.timeAssessment && (
              <div
                className={`border-l-4 rounded-r-2xl shadow-lg p-6 ${
                  studyPlan.availableDays <= 1
                    ? "bg-red-50 border-red-500"
                    : studyPlan.availableDays <= 3
                      ? "bg-orange-50 border-orange-500"
                      : studyPlan.availableDays <= 7
                        ? "bg-yellow-50 border-yellow-500"
                        : "bg-blue-50 border-blue-500"
                }`}
              >
                <h3
                  className={`text-xl font-bold mb-3 flex items-center ${
                    studyPlan.availableDays <= 1
                      ? "text-red-900"
                      : studyPlan.availableDays <= 3
                        ? "text-orange-900"
                        : studyPlan.availableDays <= 7
                          ? "text-yellow-900"
                          : "text-blue-900"
                  }`}
                >
                  <Target className="w-6 h-6 mr-2" />
                  {studyPlan.availableDays <= 3
                    ? "🚨 ANÁLISE DE VIABILIDADE"
                    : "🔍 ANÁLISE REALISTA"}
                </h3>
                <p
                  className={`text-lg ${
                    studyPlan.availableDays <= 1
                      ? "text-red-800"
                      : studyPlan.availableDays <= 3
                        ? "text-orange-800"
                        : studyPlan.availableDays <= 7
                          ? "text-yellow-800"
                          : "text-blue-800"
                  }`}
                >
                  {studyPlan.timeAssessment}
                </p>
                <div className="mt-3 text-sm text-gray-600 flex gap-4">
                  <span>
                    <strong>Módulos:</strong> {studyPlan.modules?.length || 0}/
                    {studyPlan.maxPossibleModules}
                  </span>
                  <span>
                    <strong>Intensidade:</strong> {studyPlan.studyIntensity}
                  </span>
                  <span>
                    <strong>Total de horas:</strong> {studyPlan.totalHours}h
                  </span>
                </div>
              </div>
            )}

            {/* Módulos de Estudo */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  📖 MÓDULOS DE ESTUDO
                </h3>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                  {studyPlan.modules?.length || 0} de{" "}
                  {studyPlan.maxPossibleModules} módulos possíveis
                </span>
              </div>
              <div className="space-y-8">
                {studyPlan.modules?.map((module, index) => (
                  <div
                    key={index}
                    className={`border-l-4 rounded-r-xl p-6 ${
                      module.priority === "CRÍTICO"
                        ? "border-red-500 bg-red-50"
                        : module.priority === "ALTO"
                          ? "border-orange-500 bg-orange-50"
                          : "border-purple-500 bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h4 className="text-xl font-bold text-gray-900">
                          Módulo {index + 1}: {module.title}
                        </h4>
                        <div className="flex gap-2 mt-2">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              module.priority === "CRÍTICO"
                                ? "bg-red-100 text-red-700"
                                : module.priority === "ALTO"
                                  ? "bg-orange-100 text-orange-700"
                                  : "bg-purple-100 text-purple-700"
                            }`}
                          >
                            {module.duration}
                          </span>
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                            {module.priority}
                          </span>
                          {module.focus && (
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                              {module.focus}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Tópicos Essenciais */}
                    <div className="mb-6">
                      <h5 className="font-semibold text-gray-700 mb-3 flex items-center">
                        <BookOpen className="w-5 h-5 mr-2" />
                        TÓPICOS ESSENCIAIS ({module.topics?.length || 0})
                      </h5>
                      <ul className="grid md:grid-cols-2 gap-3">
                        {module.topics?.map((topic, idx) => (
                          <li
                            key={idx}
                            className="flex items-start p-3 bg-white rounded-lg border border-gray-200"
                          >
                            <span className="text-purple-500 mr-2 text-lg">
                              •
                            </span>
                            <span className="text-gray-700">{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Aplicações Práticas */}
                    {module.practicalApplications &&
                      module.practicalApplications.length > 0 && (
                        <div className="mb-6">
                          <h5 className="font-semibold text-gray-700 mb-3 flex items-center">
                            <Target className="w-5 h-5 mr-2" />
                            APLICAÇÕES PRÁTICAS (
                            {module.practicalApplications.length})
                          </h5>
                          <div className="grid md:grid-cols-2 gap-3">
                            {module.practicalApplications.map((app, idx) => (
                              <div
                                key={idx}
                                className="flex items-start p-3 bg-green-50 rounded-lg border-l-4 border-green-500"
                              >
                                <span className="text-green-600 font-bold mr-2">
                                  {idx + 1}.
                                </span>
                                <span className="text-gray-800">{app}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Cronograma Adaptado */}
                    {module.dailySchedule && (
                      <div>
                        <h5 className="font-semibold text-gray-700 mb-3 flex items-center">
                          <Calendar className="w-5 h-5 mr-2" />
                          {studyPlan.availableDays <= 3
                            ? "CRONOGRAMA DIÁRIO"
                            : "CRONOGRAMA SEMANAL"}
                        </h5>
                        <div
                          className={`grid ${
                            studyPlan.availableDays <= 1
                              ? "grid-cols-1"
                              : studyPlan.availableDays <= 3
                                ? "grid-cols-1"
                                : "grid-cols-2"
                          } gap-3`}
                        >
                          {Object.entries(module.dailySchedule).map(
                            ([period, task], idx) => (
                              <div
                                key={idx}
                                className={`p-3 rounded-lg border ${
                                  studyPlan.availableDays <= 1
                                    ? "bg-red-50 border-red-200"
                                    : studyPlan.availableDays <= 3
                                      ? "bg-orange-50 border-orange-200"
                                      : "bg-white border-gray-200"
                                }`}
                              >
                                <div className="font-semibold text-purple-600">
                                  {period}:
                                </div>
                                <div className="text-gray-700 text-sm mt-1">
                                  {task}
                                </div>
                                {studyPlan.availableDays <= 3 && (
                                  <div className="text-xs text-red-500 mt-1 font-medium">
                                    {studyPlan.availableDays <= 1
                                      ? "⚡ EMERGÊNCIA"
                                      : "⏰ URGENTE"}
                                  </div>
                                )}
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Metas e Recomendações */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Metas Realistas */}
              {studyPlan.goals && (
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    🎯 METAS REALISTAS
                  </h3>
                  <div className="space-y-3">
                    {studyPlan.goals.map((goal, idx) => (
                      <div
                        key={idx}
                        className="flex items-start p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500"
                      >
                        <span className="font-bold text-blue-600 mr-3">
                          {idx + 1}.
                        </span>
                        <span className="text-gray-700">{goal}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recomendações */}
              {studyPlan.recommendations && (
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    💡 RECOMENDAÇÕES
                  </h3>
                  <ul className="space-y-3">
                    {studyPlan.recommendations.map((rec, idx) => (
                      <li
                        key={idx}
                        className="flex items-start p-3 bg-yellow-50 rounded-lg transition"
                      >
                        <span className="text-yellow-500 mr-3 text-xl">→</span>
                        <span className="text-gray-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
