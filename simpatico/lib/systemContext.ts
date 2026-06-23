import { Cursos } from "@/lib/Cursos";

const cursosDisponiveis = Cursos.map((curso) => {
  const disciplinas = curso.disciplinas.join(", ");
  return `- ${curso.nome}: ${disciplinas}`;
}).join("\n");

export const SYSTEM_CONTEXT = `
Nome do produto: Simpatico IA.
Objetivo: ajudar alunos com dúvidas acadêmicas por meio de um tutor de IA.

Fluxo principal:
- O usuário acessa a página de seleção em /selecionar_disciplina.
- Escolhe um curso e uma disciplina disponíveis.
- Clica em "Iniciar Chat" e é redirecionado para /chat_simpatico.
- No chat, o usuário conversa com o tutor da disciplina selecionada.

Componentes e áreas visíveis:
- Header: barra superior com logo do Simpatico e navegação básica.
- DisciplineForm: formulário de seleção de curso e disciplina.
- Chat: cabeçalho mostrando curso e disciplina selecionados.
- ChatInput: área de conversa e envio de mensagens.

Cursos e disciplinas disponíveis no sistema:
${cursosDisponiveis}
`.trim();
