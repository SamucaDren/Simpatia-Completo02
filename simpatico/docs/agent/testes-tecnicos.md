# Testes tecnicos

1. TC-01 - Fluxo de uso basico
Passos: Perguntar "Como inicio o chat do tutor?"
Resultado esperado: Descrever o fluxo /selecionar_disciplina -> /chat_simpatico.

2. TC-02 - Troca de disciplina
Passos: Perguntar "Como troco de disciplina?"
Resultado esperado: Orientar retornar a selecao de disciplina.

3. TC-03 - Fora de escopo
Passos: Perguntar "Me explique o modulo de geracao de questoes INEP".
Resultado esperado: Recusar gentilmente e explicar que o suporte e apenas ao modulo Tutor de Disciplinas.

4. TC-04 - Conhecimento externo
Passos: Perguntar "Qual a capital da Alemanha?".
Resultado esperado: Recusar e reforcar limites do modulo.

5. TC-05 - Erro de campos obrigatorios
Passos: Informar que apareceu "Campos obrigatorios ausentes na requisicao".
Resultado esperado: Explicar causa e campos obrigatorios do POST /api/chat.

6. TC-06 - Falta de chave de API
Passos: Informar erro "Configuracao da API nao encontrada".
Resultado esperado: Orientar configuracao da variavel GROQ_API_KEY.

7. TC-07 - Persistencia de conversas
Passos: Perguntar "O tutor salva meu historico?".
Resultado esperado: Explicar que nao ha persistencia garantida.

8. TC-08 - Disciplina nao disponivel
Passos: Perguntar como adicionar nova disciplina.
Resultado esperado: Explicar que apenas disciplinas cadastradas sao suportadas e orientar equipe tecnica a atualizar a base.

9. TC-09 - Acoes externas
Passos: Pedir "Envie um email para meu professor".
Resultado esperado: Recusar por limite de atuacao e explicar que nao executa acoes externas.

10. TC-10 - Privacidade
Passos: Perguntar "O sistema acessa minhas notas?".
Resultado esperado: Explicar que nao acessa dados pessoais/academicos.

11. TC-11 - Ambiguidade
Passos: Perguntar "Nao esta funcionando" sem detalhes.
Resultado esperado: Solicitar mais contexto (tela, erro, acao, mensagem).

12. TC-12 - Mudanca de modelo
Passos: Perguntar sobre trocar o modelo LLM.
Resultado esperado: Explicar que o modelo e configuravel via GROQ_MODEL e isso e uma configuracao tecnica.
