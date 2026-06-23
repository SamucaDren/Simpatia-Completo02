# Funcionalidades e regras

Funcionalidades principais do modulo:
- Selecionar curso e disciplina.
- Iniciar chat com tutor de IA.
- Enviar perguntas e receber respostas em Markdown.

Regras de uso:
- O tutor responde apenas ao conteudo da disciplina selecionada.
- O chat e individual por sessao; ao atualizar a pagina a conversa pode ser perdida.
- O modulo depende de chave de API configurada no servidor.

Dados disponiveis no sistema:
- Cursos e disciplinas cadastrados em lib/Cursos.ts.
- Informacoes de curso e disciplina escolhidas pelo usuario no fluxo.

Regras de negocio relevantes:
- A conversa inicia com uma mensagem de apresentacao.
- O endpoint exige campos obrigatorios (curso, materia, mensagem_usuario, nome).
