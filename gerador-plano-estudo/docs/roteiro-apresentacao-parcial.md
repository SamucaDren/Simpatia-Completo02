# Roteiro da Apresentação Parcial

## 1. Escopo definido

O projeto implementa um agente de suporte especializado para o módulo Gerador de Plano de Estudo Inteligente do SIMPATIA.

## 2. Arquitetura proposta

Foi adotada arquitetura Prompt-Based com API intermediária. O frontend React envia mensagens para uma rota serverless, que aplica o prompt estruturado e consulta a Groq.

## 3. Base de conhecimento estruturada

A base foi organizada em `docs/base-conhecimento.md` e inclui:

- Funcionamento do módulo.
- Fluxo de uso.
- Disciplinas disponíveis.
- FAQ.
- Erros comuns.
- Limitações.
- Aspectos éticos.

## 4. Protótipo funcional inicial

O protótipo possui:

- Página inicial.
- Página de geração de plano de estudo.
- Chatbot flutuante em todas as páginas.
- Integração Groq para geração do plano.
- Integração Groq para respostas do agente.
- Exportação do plano em PDF.

## 5. Demonstração sugerida

1. Abrir a aplicação.
2. Acessar a página do gerador.
3. Preencher os campos.
4. Gerar um plano.
5. Abrir o chatbot.
6. Perguntar: “Como uso o gerador?”
7. Perguntar: “Quais são as limitações?”
8. Mostrar a documentação na pasta `docs`.

## 6. Próximos passos para o Módulo XIV

- Implementar testes técnicos controlados.
- Implementar testes adversariais.
- Registrar logs de uso de forma estruturada.
- Validar com usuários reais.
- Produzir relatório técnico-científico.
