# Erros comuns e resolucao

Erro: "Campos obrigatorios ausentes na requisicao"
Causa: Payload sem curso, materia, mensagem_usuario ou nome.
Solucao: Garantir que todos os campos sejam enviados no POST /api/chat.

Erro: "Configuracao da API nao encontrada"
Causa: Variavel GROQ_API_KEY ausente no servidor.
Solucao: Configurar GROQ_API_KEY no ambiente.

Erro: "Nenhuma mensagem valida foi enviada."
Causa: Lista de mensagens vazia ou com conteudo vazio no /api/system-chat.
Solucao: Enviar ao menos uma mensagem com role user/assistant e conteudo.

Erro: "Formato de resposta invalido da API"
Causa: Resposta inesperada do provedor.
Solucao: Tentar novamente e verificar logs do servidor.

Erro: "A requisicao falhou: 4xx/5xx"
Causa: Erro de rede ou limite do provedor.
Solucao: Verificar status do provedor e payload enviado.
