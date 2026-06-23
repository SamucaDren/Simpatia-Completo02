# Arquitetura do agente

## Decisao de arquitetura
Modelo Prompt-Based. A base de conhecimento e pequena e bem estruturada, permitindo inserir o contexto diretamente no prompt. A arquitetura esta preparada para evoluir para RAG se a base crescer.

## Componentes
- UI: components/FloatingChat/FloatingChat.tsx
- API intermediaria: app/api/system-chat/route.ts
- Base de conhecimento: knowledge-base/*.md
- Configuracao do modulo: lib/agentConfig.ts
- Prompt do agente: lib/agentPrompt.ts
- Provedor LLM: Groq API

## Fluxo principal
```mermaid
flowchart TD
  U[Usuario] --> UI[Chatbot de Suporte]
  UI --> API[/api/system-chat]
  API --> KB[Base de conhecimento]
  API --> PROMPT[Prompt estruturado]
  API --> LLM[Groq LLM]
  LLM --> API --> UI --> U
```

## Estrutura do prompt
- Persona e objetivo do agente
- Regras de comportamento e limites
- Contexto do modulo
- Base de conhecimento versionada

## Observabilidade e erros
- Logs de erro no backend (console.error).
- Mensagens de falha retornam erro padrao ao usuario.

## Limites atuais
- Sem persistencia de memoria longa.
- Sem busca semantica (RAG) ativa.
- Dependencia do provedor de LLM.
