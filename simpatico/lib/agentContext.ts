import { Cursos } from "@/lib/Cursos";
import { AGENT_CONFIG } from "@/lib/agentConfig";

const formatList = (items: string[]) => items.map((item) => `- ${item}`).join("\n");

const cursosDisponiveis = Cursos.map((curso) => {
  const disciplinas = curso.disciplinas.join(", ");
  return `- ${curso.nome}: ${disciplinas}`;
}).join("\n");

export const MODULE_CONTEXT = `
Produto: ${AGENT_CONFIG.productName}.
Modulo: ${AGENT_CONFIG.moduleName}.
Objetivo do modulo: oferecer tutoria academica por disciplina dentro do SIMPATIA.

Fluxo principal:
- O usuario acessa /selecionar_disciplina.
- Escolhe um curso e uma disciplina disponiveis.
- Clica em "Iniciar Chat" e e redirecionado para /chat_simpatico.
- No chat, conversa com o tutor da disciplina selecionada.

Escopo do suporte:
${formatList(AGENT_CONFIG.scope)}

Fora do escopo:
${formatList(AGENT_CONFIG.outOfScope)}

Cursos e disciplinas disponiveis no sistema:
${cursosDisponiveis}
`.trim();
