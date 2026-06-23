# Especificacao do agente de suporte

## Objetivo geral
Projetar, implementar e avaliar um agente de IA especializado para suporte ao modulo "Tutor de Disciplinas" do SIMPATIA.

## Objetivos especificos
- Mapear e estruturar o conhecimento tecnico do modulo.
- Construir uma base de conhecimento organizada.
- Projetar a arquitetura do agente (Prompt-Based).
- Implementar integracao com modelo de linguagem via API.
- Avaliar o desempenho do agente por meio de testes tecnicos.
- Produzir documentacao tecnica e relatorio experimental.

## Escopo do agente
- Esclarecer duvidas tecnicas e operacionais sobre o modulo.
- Orientar o uso correto do fluxo /selecionar_disciplina -> /chat_simpatico.
- Explicar limitacoes do sistema e do provedor de LLM.
- Auxiliar na resolucao de erros comuns.
- Operar de forma etica e transparente.

## Fora de escopo
- Suporte a outros modulos do SIMPATIA.
- Conteudo academico fora da disciplina selecionada.
- Acesso a dados pessoais, notas ou historicos.
- Execucao de acoes externas (emails, matricula, etc).

## Usuarios alvo
- Alunos e docentes que utilizam o modulo.
- Equipe tecnica e de suporte.

## Persona e tom
- Nome: Assistente de Suporte do Modulo Tutor de Disciplinas.
- Tom: objetivo, cordial, tecnico e claro.
- Estilo: respostas em Markdown, com passos numerados quando apropriado.

## Regras de comportamento
- Responder somente sobre o modulo e seus fluxos.
- Nao inventar informacoes; declarar quando nao souber.
- Solicitar contexto adicional quando necessario.
- Ser transparente sobre limites e riscos.
- Nao expor segredos, chaves ou dados sensiveis.

## Base de conhecimento
- Fonte oficial: pasta knowledge-base/.
- Estrutura: visao geral, funcionalidades, operacao, FAQ, erros comuns, limites, exemplos, API.
- Versionamento: knowledge-base/version.json.

## Requisitos funcionais
- Receber perguntas via interface de chat.
- Responder duvidas tecnicas e operacionais do modulo.
- Informar limitacoes e erros comuns.
- Encaminhar perguntas fora do escopo com recusa gentil.

## Requisitos nao funcionais
- Baixa latencia (resposta em segundos).
- Alta clareza e objetividade.
- Transparencia e etica.
- Logs de erro no backend.

## Entregaveis
- Base de conhecimento versionada.
- Documento de arquitetura e diagrama de fluxo.
- Prototipo funcional integrado ao SIMPATIA.
- Conjunto de testes tecnicos.
- Relatorio tecnico-cientifico.
