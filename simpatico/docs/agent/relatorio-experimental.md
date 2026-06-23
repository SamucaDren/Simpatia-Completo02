# Relatorio tecnico-cientifico

## Resumo
Este relatorio descreve o agente de suporte ao modulo "Tutor de Disciplinas" do SIMPATIA, sua arquitetura Prompt-Based e a organizacao da base de conhecimento. A avaliacao foi definida por um conjunto de testes tecnicos (docs/agent/testes-tecnicos.md). A execucao dos testes deve ser realizada pela equipe para preencher os resultados finais.

## Introducao
O SIMPATIA oferece recursos de apoio pedagogico com IA. O modulo "Tutor de Disciplinas" permite conversas por disciplina e exige suporte tecnico-operacional. Este agente atende duvidas de uso, limitacoes e erros comuns do modulo.

## Metodologia
O projeto foi estruturado em quatro fases: engenharia de conhecimento, modelagem/arquitetura, implementacao e avaliacao experimental. A base de conhecimento foi organizada em arquivos versionados e integrada ao prompt do agente.

## Arquitetura
A solucao utiliza um chatbot de suporte (FloatingChat) e uma API intermediaria (/api/system-chat) que injeta contexto e base de conhecimento no prompt. O modelo LLM e acessado via Groq API.

## Base de conhecimento
A pasta knowledge-base/ contem visao geral, funcionalidades, operacao, FAQ, erros comuns, limites e exemplos. O versionamento e controlado por knowledge-base/version.json.

## Avaliacao experimental
O conjunto de testes tecnicos cobre fluxo de uso, erros comuns, limites de escopo, privacidade e configuracao tecnica. Os casos estao documentados em docs/agent/testes-tecnicos.md.

## Resultados
Resultados pendentes de execucao dos testes. Recomenda-se registrar taxa de acerto, tempo de resposta e principais falhas observadas.

## Analise critica e limitacoes
- Dependencia do provedor de LLM e da disponibilidade de rede.
- Sem persistencia de memoria longa.
- Respostas limitadas ao escopo do modulo e ao conteudo da base.

## Aspectos eticos
O agente explicita seus limites, evita inventar informacoes e nao acessa dados sensiveis. Respostas fora de escopo sao recusadas de forma transparente.

## Conclusao
O agente de suporte foi implementado com foco em clareza, escopo bem definido e base de conhecimento versionada. Os testes tecnicos devem ser executados para consolidar resultados e orientar melhorias futuras.
