# Detalhes tecnicos e API

Endpoint do modulo de tutoria:
- POST /api/chat
Campos obrigatorios: curso, materia, mensagem_usuario, nome, id.

Endpoint do agente de suporte:
- POST /api/system-chat
Campos: id (opcional), messages[] ou message.

Dependencias:
- Variavel de ambiente GROQ_API_KEY.
- Modelo padrao: llama-3.1-8b-instant (configuravel via GROQ_MODEL).

Observacao:
- Nao exponha chaves de API para o cliente.
