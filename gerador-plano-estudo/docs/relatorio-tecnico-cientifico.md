# Relatório Técnico-Científico — Agente SIMPATIA

## 1. Resumo

O projeto implementa um agente de Inteligência Artificial especializado para suporte ao módulo Gerador de Plano de Estudo Inteligente do SIMPATIA. O agente utiliza arquitetura Prompt-Based com API intermediária serverless e integração preparada para a Groq.

## 2. Objetivo

Desenvolver um chatbot tira-dúvidas capaz de orientar usuários quanto ao uso correto do módulo, explicar limitações, tratar erros comuns e apoiar a geração de planos de estudo personalizados.

## 3. Metodologia

A implementação foi organizada em quatro partes:

1. Levantamento das funcionalidades do módulo.
2. Estruturação da base de conhecimento em documentação versionada.
3. Definição da arquitetura, persona, regras e limites do agente.
4. Implementação do protótipo funcional com React/Vite e API serverless.

## 4. Arquitetura

A solução utiliza frontend React/Vite, componentes de interface e rotas serverless em `/api`. A chave da Groq é armazenada em variável de ambiente, protegida no servidor. A comunicação com a Groq utiliza endpoint compatível com Chat Completions.

## 5. Avaliação

Os testes documentados em `docs/testes-chatbot.md` avaliam orientação operacional, uso da base de conhecimento, tratamento de erros, limites de atuação, ética e resistência a comandos adversariais.

## 6. Limitações

- O projeto utiliza arquitetura Prompt-Based, não RAG completo.
- A base de conhecimento está documentada e refletida no prompt, mas ainda não é indexada semanticamente.
- A qualidade da resposta depende do modelo configurado na Groq.
- O plano gerado deve ser revisado pelo estudante ou professor.

## 7. Aspectos éticos

O agente não substitui professores, não deve coletar dados sensíveis, não inventa funcionalidades e deve informar limitações quando necessário. O uso da IA é tratado como apoio educacional.

## 8. Propostas futuras

- Implementar RAG com busca semântica real.
- Criar painel de logs de interação.
- Adicionar avaliação com usuários reais.
- Expandir a base de conhecimento para outros módulos do SIMPATIA.
