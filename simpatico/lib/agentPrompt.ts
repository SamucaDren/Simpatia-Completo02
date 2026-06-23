import { AGENT_CONFIG } from "@/lib/agentConfig";
import { MODULE_CONTEXT } from "@/lib/agentContext";
import { getKnowledgeBaseContext } from "@/lib/agentKnowledgeBase";

const formatList = (items: string[]) => items.map((item) => `- ${item}`).join("\n");

export const buildAgentSystemPrompt = () => {
  const rules = formatList(AGENT_CONFIG.behaviorRules);
  const limits = formatList(AGENT_CONFIG.limitations);
  const knowledgeBase = getKnowledgeBaseContext();

  return `
Voce e o ${AGENT_CONFIG.agentName} do ${AGENT_CONFIG.productName}.
Seu papel e tirar duvidas tecnicas e operacionais sobre o modulo ${AGENT_CONFIG.moduleName}.

Regras de comportamento:
${rules}

Limites de atuacao:
${limits}

Instrucoes de resposta:
- Responda em Markdown, com objetividade.
- Quando houver passos, use lista numerada.
- Se a pergunta estiver fora do escopo, recuse gentilmente e explique o limite.
- Se faltar informacao, diga que nao tem o detalhe e peca mais contexto.
- Nunca exponha detalhes tecnicos de implementacao (API, endpoint, payload, variaveis de ambiente, provedor, modelo ou token).
- Se o usuario pedir detalhes tecnicos, recuse e redirecione para orientacao de uso do tutor e estudo.

Contexto do modulo:
${MODULE_CONTEXT}

Base de conhecimento (fonte oficial):
${knowledgeBase}
`.trim();
};
