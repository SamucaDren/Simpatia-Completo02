import { NextResponse } from "next/server";
import { callGroq } from "@/lib/groq";

const GEMINI_API_URL =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

interface FeedbackPayload {
    strengths: string[];
    improvements: string[];
    overall: string;
}

function buildPrompt(messages: string, theme: string, difficulty: string) {
    return `Analise o seguinte debate sobre "${theme}" e forneça um feedback detalhado sobre as habilidades de argumentação do participante.
Considere o nível de dificuldade ${difficulty === "easy" ? "fácil" : difficulty === "medium" ? "médio" : "difícil"}.

Mensagens do participante:
${messages}

Forneça um feedback estruturado com:
1. Pontos fortes (3-4 pontos)
2. Pontos a melhorar (3-4 pontos)
3. Uma avaliação geral

Formate a resposta como um objeto JSON com as seguintes chaves:
{
  "strengths": ["ponto forte 1", "ponto forte 2"],
  "improvements": ["ponto a melhorar 1", "ponto a melhorar 2"],
  "overall": "avaliação geral em 2-3 frases"
}

Seja construtivo, específico e foque em clareza dos argumentos, evidências, estrutura lógica, respeito ao tema, contra-argumentação e uso da linguagem.`;
}

function parseFeedback(text: string): FeedbackPayload {
    const jsonMatch = text.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
        throw new Error("Formato de resposta inválido.");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return {
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
        improvements: Array.isArray(parsed.improvements) ? parsed.improvements : [],
        overall: typeof parsed.overall === "string" ? parsed.overall : "",
    };
}

async function callGeminiForFeedback(messages: string, theme: string, difficulty: string) {
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
                            text: buildPrompt(messages, theme, difficulty),
                        },
                    ],
                },
            ],
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1024,
            },
        }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        const error = new Error(data?.error?.message || "Erro ao gerar feedback com Gemini.");
        (error as Error & { status?: number }).status = response.status;
        throw error;
    }

    const feedbackText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!feedbackText) {
        throw new Error("Formato de resposta inválido da API Gemini.");
    }

    return parseFeedback(feedbackText);
}

async function callGroqForFeedback(messages: string, theme: string, difficulty: string) {
    const feedbackText = await callGroq(
        [
            {
                role: "system",
                content:
                    "Você avalia debates e sempre responde em português do Brasil. Sua resposta deve ser somente um JSON válido com strengths, improvements e overall.",
            },
            {
                role: "user",
                content: buildPrompt(messages, theme, difficulty),
            },
        ],
        800,
        0.5
    );

    return parseFeedback(feedbackText);
}

export async function POST(request: Request) {
    try {
        const { messages, theme, difficulty } = await request.json();

        if (!messages || !theme || !difficulty) {
            return NextResponse.json({ error: "Todos os campos são obrigatórios" }, { status: 400 });
        }

        try {
            const feedback = await callGeminiForFeedback(messages, theme, difficulty);
            return NextResponse.json({ ...feedback, provider: "gemini" });
        } catch (error) {
            const status = (error as Error & { status?: number }).status;

            console.error("Gemini API error in feedback route:", {
                status,
                message: error instanceof Error ? error.message : error,
            });

            if (status && status !== 429 && status !== 401 && status !== 403) {
                throw error;
            }

            const feedback = await callGroqForFeedback(messages, theme, difficulty);
            return NextResponse.json({ ...feedback, provider: "groq-fallback" });
        }
    } catch (error) {
        console.error("Error generating feedback:", error);
        return NextResponse.json(
            {
                strengths: ["Não foi possível gerar feedback neste momento."],
                improvements: ["Por favor, tente novamente mais tarde."],
                overall: error instanceof Error ? error.message : "Ocorreu um erro ao gerar o feedback.",
            },
            { status: 500 }
        );
    }
}
