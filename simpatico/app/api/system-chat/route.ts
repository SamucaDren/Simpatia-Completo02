import { NextResponse } from "next/server";
import { buildAgentSystemPrompt } from "@/lib/agentPrompt";
import { guardAssistantResponse } from "@/lib/chatResponseGuard";

export const runtime = "nodejs";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_MODEL = "llama-3.1-8b-instant";

type ChatRole = "user" | "assistant";

interface IChatMessage {
  role: ChatRole;
  content: string;
}

interface IChatRequest {
  id?: string;
  messages?: IChatMessage[];
  message?: string;
}

const SYSTEM_PROMPT = buildAgentSystemPrompt();

export async function POST(request: Request) {
  try {
    const body: IChatRequest = await request.json();
    const { messages, message } = body;

    const normalizedMessages: IChatMessage[] = Array.isArray(messages)
      ? messages.filter(
          (msg) =>
            (msg.role === "user" || msg.role === "assistant") &&
            typeof msg.content === "string" &&
            msg.content.trim().length > 0,
        )
      : message
        ? [{ role: "user", content: message }]
        : [];

    if (normalizedMessages.length === 0) {
      return NextResponse.json(
        { error: "Nenhuma mensagem valida foi enviada." },
        { status: 400 },
      );
    }

    if (!process.env.GROQ_API_KEY) {
      console.error("GROQ_API_KEY is not defined");
      return NextResponse.json(
        { error: "Configuracao da API nao encontrada" },
        { status: 500 },
      );
    }

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL ?? DEFAULT_MODEL,
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...normalizedMessages],
        temperature: 0.2,
        top_p: 0.9,
        max_completion_tokens: 600,
        user: body.id ?? undefined,
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
    console.error("Error in system chat route:", error);
    return NextResponse.json(
      {
        error: "Erro ao processar a mensagem",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    );
  }
}
