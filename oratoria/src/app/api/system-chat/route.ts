import { NextResponse } from "next/server";
import { callGroq } from "@/lib/groq";
import { systemKnowledge } from "@/lib/systemKnowledge";

interface IncomingMessage {
    role: "user" | "assistant";
    content: string;
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const messages = Array.isArray(body?.messages)
            ? (body.messages as Array<IncomingMessage & { id?: string }>).filter(
                  (message) =>
                      message &&
                      (message.role === "user" || message.role === "assistant") &&
                      typeof message.content === "string" &&
                      message.content.trim().length > 0
              )
            : [];

        if (!messages.length) {
            return NextResponse.json(
                { error: "Envie pelo menos uma mensagem válida para o assistente." },
                { status: 400 }
            );
        }

        const response = await callGroq(
            [
                {
                    role: "system",
                    content: `
Você é o assistente interno do sistema SIMPATICO IA ORATORIA.

Use somente o conhecimento abaixo para responder:
${systemKnowledge}

Regras obrigatórias:
- Responda sempre em português do Brasil.
- Responda somente sobre este sistema.
- Se a pergunta fugir do sistema, diga de forma breve que você só pode ajudar com funcionalidades, telas, fluxos e botões da plataforma.
- Não dê suporte para temas externos ao produto.
- Seja objetivo, útil e fiel ao que existe no sistema.
                    `.trim(),
                },
                ...messages.map((message) => ({
                    role: message.role,
                    content: message.content.trim(),
                })),
            ],
            500,
            0.2
        );

        return NextResponse.json({ response });
    } catch (error) {
        console.error("Groq upstream error:", error);
        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Erro inesperado ao responder sobre o sistema.",
            },
            { status: 500 }
        );
    }
}
