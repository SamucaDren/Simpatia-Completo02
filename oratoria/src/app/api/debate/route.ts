import { NextResponse } from "next/server";
import { callGroq } from "@/lib/groq";

const GEMINI_API_URL =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

type Difficulty = "easy" | "medium" | "hard";

const difficultyContext: Record<Difficulty, string> = {
    easy: "Seja gentil mas instigante. Faça perguntas que levem o participante a refletir mais profundamente sobre seu argumento.",
    medium: "Seja mais desafiador. Questione os pontos fracos do argumento e exija justificativas mais sólidas.",
    hard: "Seja rigoroso e exigente. Apresente contra-argumentos fortes e exija evidências concretas para cada afirmação.",
};

function buildPrompt(topic: string, context: string, difficulty: Difficulty, argument: string) {
    return `Você é um debatedor experiente em um debate sobre "${topic}".
Contexto do debate: ${context}
Nível de dificuldade: ${difficultyContext[difficulty]}

Argumento do participante: ${argument}

IMPORTANTE: Sua resposta deve ter no máximo dois parágrafos.

No primeiro parágrafo:
- Apresente um contraponto forte ao argumento do participante
- Questione pontos específicos que precisam de mais fundamentação

No segundo parágrafo:
- Exija evidências para afirmações feitas
- Instigue o participante a pensar mais profundamente sobre suas posições

Seja direto e assertivo, mas mantenha o respeito. O objetivo é fazer o participante refletir e melhorar seus argumentos.`;
}

async function callGeminiForDebate(topic: string, context: string, difficulty: Difficulty, argument: string) {
    if (!process.env.GEMINI_API_KEY?.trim()) {
        throw new Error("GEMINI_API_KEY não configurada no ambiente.");
    }

    const response = await fetch(`${GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY.trim()}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            contents: [
                {
                    parts: [
                        {
                            text: buildPrompt(topic, context, difficulty, argument),
                        },
                    ],
                },
            ],
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 300,
            },
        }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        const error = new Error(data?.error?.message || "Erro ao processar debate com Gemini.");
        (error as Error & { status?: number }).status = response.status;
        throw error;
    }

    const responseText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!responseText) {
        throw new Error("Formato de resposta inválido da API Gemini.");
    }

    return responseText;
}

async function callGroqForDebate(topic: string, context: string, difficulty: Difficulty, argument: string) {
    return callGroq(
        [
            {
                role: "system",
                content:
                    "Você é um debatedor universitário firme, respeitoso e provocador. Responda em português do Brasil, em no máximo dois parágrafos, sempre trazendo contrapontos e pedindo melhor fundamentação.",
            },
            {
                role: "user",
                content: buildPrompt(topic, context, difficulty, argument),
            },
        ],
        320,
        0.7
    );
}

export async function POST(request: Request) {
    try {
        const { topic, context, difficulty, argument } = await request.json();

        if (!topic || !context || !difficulty || !argument) {
            return NextResponse.json({ error: "Todos os campos são obrigatórios" }, { status: 400 });
        }

        if (!["easy", "medium", "hard"].includes(difficulty)) {
            return NextResponse.json({ error: "Nível de dificuldade inválido" }, { status: 400 });
        }

        try {
            const response = await callGeminiForDebate(topic, context, difficulty as Difficulty, argument);
            return NextResponse.json({ response, provider: "gemini" });
        } catch (error) {
            const status = (error as Error & { status?: number }).status;

            console.error("Gemini API error in debate route:", {
                status,
                message: error instanceof Error ? error.message : error,
            });

            if (status && status !== 429 && status !== 401 && status !== 403) {
                throw error;
            }

            const response = await callGroqForDebate(topic, context, difficulty as Difficulty, argument);
            return NextResponse.json({ response, provider: "groq-fallback" });
        }
    } catch (error) {
        console.error("Error in debate route:", error);
        return NextResponse.json(
            {
                error: "Erro ao processar o debate",
                details: error instanceof Error ? error.message : "Erro desconhecido",
            },
            { status: 500 }
        );
    }
}
