# SIMPATIA — Agente de Suporte com Groq API

Projeto desenvolvido para ATEX/PII XIII e XIV. A aplicação implementa o módulo **Gerador de Plano de Estudo Inteligente** e um **Agente de Suporte por Chatbot** especializado no uso do módulo SIMPATIA.

## Status de conformidade

O projeto foi preparado para atender aos itens solicitados no PDF da atividade:

- Escopo definido.
- Documento de especificação do agente.
- Base de conhecimento estruturada e versionada.
- Arquitetura Prompt-Based documentada.
- Persona, regras de comportamento e limites de atuação.
- Diagrama de fluxo do agente.
- Interface React/Vite funcional.
- API intermediária serverless.
- Integração preparada com modelo de linguagem via **Groq API**.
- Tratamento de erros comuns.
- Documento de testes técnicos.
- Relatório técnico-científico.
- Discussão de limitações e aspectos éticos.

Veja o arquivo `docs/checklist-professor.md` para conferir item por item.

## Módulos

### 1. Gerador de Plano de Estudo Inteligente

Gera planos de estudo adaptativos com base em:

- disciplina;
- nível de conhecimento;
- horas disponíveis por dia;
- prazo;
- objetivo de estudo.

### 2. Agente de Suporte — Assistente SIMPATIA

Chatbot flutuante disponível na interface. O agente esclarece dúvidas técnicas e operacionais, orienta o uso correto, explica limitações e auxilia na resolução de erros comuns.

## Arquitetura

Abordagem: **Prompt-Based com API intermediária**.

```txt
Usuário
  ↓
Interface React/Vite
  ↓
/api/chatbot.js ou /api/generate-study-plan.js
  ↓
Prompt estruturado + base de conhecimento
  ↓
Groq API
  ↓
Resposta para o usuário
```

A chave da Groq fica protegida no servidor por meio da variável `GROQ_API_KEY`. Ela não deve ser colocada no frontend React.

## Configuração da Groq

Crie um arquivo `.env` na raiz do projeto:

```env
GROQ_API_KEY=sua_chave_groq_aqui
GROQ_MODEL=llama-3.1-8b-instant
```

A variável `GROQ_MODEL` é opcional. Se ela não for informada, o sistema usa `llama-3.1-8b-instant`.

## Como rodar

Instale as dependências:

```bash
npm install
```

Para rodar apenas o frontend:

```bash
npm run dev
```

Para rodar o frontend junto com as APIs serverless localmente, use Vercel CLI:

```bash
npx vercel dev
```

## Estrutura principal

```txt
api/
├── _groq.js
├── _utils.js
├── chatbot.js
└── generate-study-plan.js

docs/
├── arquitetura-agente.md
├── base-conhecimento.md
├── checklist-professor.md
├── diagrama-fluxo-agente.md
├── especificacao-agente.md
├── relatorio-tecnico-cientifico.md
├── roteiro-apresentacao-parcial.md
└── testes-chatbot.md

src/components/
├── Chatbot.jsx
├── StudyPlanGenerator.jsx
├── Header.jsx
├── Hero.jsx
├── FAQ.jsx
└── Footer.jsx
```

## Observação importante

Este projeto não inclui uma chave real da Groq. Para funcionar com IA, cadastre a variável `GROQ_API_KEY` localmente ou no ambiente da Vercel.

## Considerações éticas

- O agente informa que é uma IA quando perguntado.
- O sistema não substitui professores ou orientadores.
- O agente não deve inventar funcionalidades.
- O plano gerado deve ser revisado pelo estudante.
- A chave de API fica protegida no backend/serverless.
