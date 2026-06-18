# Diagrama de Fluxo do Agente SIMPATIA

Este diagrama documenta o fluxo funcional do agente de suporte, conforme solicitado na fase de modelagem e arquitetura.

```mermaid
flowchart TD
    A[Usuário acessa o SIMPATIA] --> B[Interface React/Vite]
    B --> C{Usuário escolhe ação}
    C -->|Dúvida sobre o módulo| D[Chatbot.jsx]
    C -->|Gerar plano de estudo| E[StudyPlanGenerator.jsx]
    D --> F[/api/chatbot]
    E --> G[/api/generate-study-plan]
    F --> H[Prompt estruturado + base de conhecimento]
    G --> I[Prompt educacional + regras de negócio]
    H --> J[API Groq]
    I --> J[API Groq]
    J --> K[Resposta gerada pela LLM]
    K --> L{Validação}
    L -->|Chatbot| M[Resposta textual ao usuário]
    L -->|Plano| N[JSON do plano de estudo]
    N --> O[Exibição do plano na interface]
    O --> P[Exportação/uso pelo estudante]
```

## Fluxo resumido

1. O usuário interage com a interface React.
2. A interface envia a solicitação para uma API intermediária serverless.
3. A API aplica regras, persona, limites e contexto do módulo.
4. A API consulta a Groq sem expor a chave no navegador.
5. O resultado retorna para a interface.
6. O estudante visualiza a orientação ou o plano gerado.

## Segurança

- A variável `GROQ_API_KEY` fica apenas no servidor.
- O frontend não acessa diretamente a Groq.
- As respostas do chatbot são limitadas ao suporte do módulo SIMPATIA.
- O plano de estudo é apresentado como sugestão educacional, não como orientação absoluta.
