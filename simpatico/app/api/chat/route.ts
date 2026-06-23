import { NextResponse } from "next/server";
import { guardAssistantResponse } from "@/lib/chatResponseGuard";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_MODEL = "llama-3.1-8b-instant";

interface IChatRequest {
  curso: string;
  materia: string;
  mensagem_usuario: string;
  nome: string;
  id: string;
}

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export async function POST(request: Request) {
  try {
    const { curso, materia, mensagem_usuario, nome, id }: IChatRequest =
      await request.json();

    if (!curso || !materia || !mensagem_usuario || !nome) {
      console.error("Missing required fields:", {
        curso,
        materia,
        mensagem_usuario,
        nome,
      });
      return NextResponse.json(
        { error: "Campos obrigatorios ausentes na requisicao" },
        { status: 400 },
      );
    }

    const isFirstMessage = mensagem_usuario === "First message";

    const systemPrompt = `Voce e um tutor de IA chamado 'Simpatico', especialista em ${materia}.
O aluno ${nome} estuda ${materia} no curso de ${curso}.
Seja amigavel, didatico e incentive o aprendizado.
    Responda sempre em Markdown.
    Nunca forneca detalhes tecnicos de implementacao (API, endpoint, payload, variavel de ambiente, chave ou token).`;

    const userPrompt = isFirstMessage
      ? `Apresente-se de forma breve e pergunte qual e a primeira duvida sobre ${materia}.`
      : `A duvida/mensagem do aluno e: "${mensagem_usuario}".
Responda de forma clara e objetiva. Use exemplos quando apropriado e mantenha o foco na pergunta.`;

    if (!process.env.GROQ_API_KEY) {
      console.error("GROQ_API_KEY is not defined");
      return NextResponse.json(
        { error: "Configuracao da API nao encontrada" },
        { status: 500 },
      );
    }

    const messages: ChatMessage[] = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ];

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL ?? DEFAULT_MODEL,
        messages,
        temperature: 0.7,
        top_p: 0.95,
        max_completion_tokens: 400,
        user: id ?? undefined,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error("Groq API error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
      });
      throw new Error(`Erro na API Groq: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const responseText = data?.choices?.[0]?.message?.content;

    if (!responseText) {
      console.error("Invalid response format:", data);
      throw new Error("Formato de resposta invalido da API");
    }

    const safeResponseText = guardAssistantResponse(responseText);

    return new Response(safeResponseText, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  } catch (error) {
    console.error("Error in chat route:", error);
    return NextResponse.json(
      {
        error: "Erro ao processar a mensagem",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    );
  }
}
