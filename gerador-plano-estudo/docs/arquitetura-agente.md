# Documento de Arquitetura — Assistente SIMPATIA

## 1. Abordagem adotada

A arquitetura escolhida foi **Prompt-Based**, adequada para a entrega parcial por ser simples, funcional e suficiente para um agente especializado com escopo controlado.

## 2. Visão geral

```txt
Usuário
  ↓
Chatbot.jsx
  ↓
/api/chatbot.js
  ↓
System Prompt + Base de Conhecimento
  ↓
Groq API com modelo configurável
  ↓
Resposta ao usuário
```

## 3. Componentes

### Chatbot.jsx
Interface visual do agente. Controla abertura, fechamento, histórico da conversa, envio de mensagem e exibição da resposta.

### api/chatbot.js
API intermediária responsável por:

- Proteger a chave da Groq.
- Receber mensagens do frontend.
- Aplicar o prompt de sistema.
- Enviar a requisição para a Groq.
- Retornar a resposta ao usuário.
- Tratar erros comuns.

### api/generate-study-plan.js
API intermediária responsável por gerar o plano de estudo em JSON usando Groq.

### docs/base-conhecimento.md
Base textual versionada com FAQ, erros comuns, limitações e regras do módulo.

## 4. Persona

O agente se apresenta como **Assistente SIMPATIA**, com tom cordial, didático, objetivo e honesto.

## 5. Regras de comportamento

- Responder sempre em português brasileiro.
- Manter foco no SIMPATIA.
- Não inventar funcionalidades.
- Explicar limitações.
- Recusar educadamente perguntas fora do escopo.
- Não coletar dados pessoais sensíveis.

## 6. Tratamento de erros

As APIs retornam mensagens padronizadas para:

- Método HTTP inválido.
- Campos obrigatórios ausentes.
- Chave Groq não configurada.
- Chave inválida.
- Limite de requisições.
- Falha de JSON.
- Erro interno inesperado.

## 7. Segurança

A chave da Groq não fica no frontend. O navegador chama apenas as rotas internas `/api/chatbot` e `/api/generate-study-plan`.

## 8. Justificativa da arquitetura

Para a parcial, a arquitetura Prompt-Based atende aos requisitos de persona, regras de comportamento, limites de atuação, base de conhecimento estruturada e protótipo funcional inicial. Uma evolução futura seria utilizar RAG com documentos vetorizados.
