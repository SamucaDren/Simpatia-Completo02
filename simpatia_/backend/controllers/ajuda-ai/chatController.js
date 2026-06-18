"use strict";

const GrokService = require("../../services/ajuda-ai/groqService");

class ChatController {
  constructor() {
    this.grok = new GrokService();
  }

  async chat(body) {
    const pergunta = body.pergunta;
    let specialties = body.specialties;

    if (!Array.isArray(pergunta) || pergunta.length === 0) {
      return {
        status: 400,
        payload: { erro: "Campo obrigatório: pergunta (array)" },
      };
    }

    if (Array.isArray(specialties)) {
      specialties = specialties.join(", ");
    }

    if (!specialties) {
      return {
        status: 400,
        payload: { erro: "Campo obrigatório: specialties (string ou array)" },
      };
    }

    const resposta = await this.grok.chatMensagem(
      pergunta,
      String(specialties),
    );
    return { status: 200, payload: { resposta } };
  }

  async ajudaAI(body) {
    const pergunta = body.pergunta;
    const agents = body.agents;

    if (typeof pergunta !== "string" || !pergunta || !Array.isArray(agents)) {
      return {
        status: 400,
        payload: {
          erro: "Campos obrigatórios: pergunta (string) e agents (array)",
        },
      };
    }

    const resultado = await this.grok.ajudaAIMensagem(pergunta, agents);
    return { status: 200, payload: resultado };
  }

  async speech(body) {
    const text = body.text;
    const voiceId = body.voiceId || body.voice_id || undefined;
    const language = body.language || undefined;

    if (typeof text !== "string" || !text) {
      return {
        status: 400,
        payload: { erro: "Campo obrigatório: text (string)" },
      };
    }

    try {
      const resultado = await this.grok.generateSpeech(text, voiceId, language);
      return { status: 200, payload: resultado };
    } catch {
      return {
        status: 500,
        payload: { erro: "Erro ao gerar áudio. Tente novamente." },
      };
    }
  }
}

module.exports = ChatController;
