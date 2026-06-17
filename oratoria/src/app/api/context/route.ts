import { NextResponse } from "next/server";
import { callGroq } from "@/lib/groq";

const GEMINI_API_URL =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

type Difficulty = "easy" | "medium" | "hard";

const difficultyContext: Record<Difficulty, string> = {
    easy: "O cenário deve ser simples e direto, adequado para iniciantes no debate.",
    medium: "O cenário deve apresentar um desafio moderado, com elementos que exijam uma análise mais profunda.",
    hard: "O cenário deve ser complexo e desafiador, com múltiplas camadas de análise e possíveis interpretações.",
};

function buildPrompt(theme: string, difficulty: Difficulty) {
    return `Crie um cenário de debate universitário sobre o tema "${theme}".

Nível de dificuldade: ${difficulty === "easy" ? "Fácil" : difficulty === "medium" ? "Médio" : "Difícil"}
${difficultyContext[difficulty]}

O cenário deve ser:
- Direto e claro
- Apropriado para estudantes universitários
- Focado em um caso específico ou situação concreta
- Formulado como uma pergunta ou situação que exija posicionamento

Formate a resposta como uma única pergunta ou situação, sem explicações adicionais.`;
}

async function callGeminiForContext(theme: string, difficulty: Difficulty) {
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
                            text: buildPrompt(theme, difficulty),
                        },
                    ],
                },
            ],
        }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        const error = new Error(data?.error?.message || "Erro ao gerar contexto com Gemini.");
        (error as Error & { status?: number }).status = response.status;
        throw error;
    }

    const context = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!context) {
        throw new Error("Formato de resposta inválido da API Gemini.");
    }

    return context;
}

async function callGroqForContext(theme: string, difficulty: Difficulty) {
    return callGroq(
        [
            {
                role: "system",
                content:
                    "Você cria cenários curtos e claros para debates universitários. Responda sempre em português do Brasil e entregue apenas o cenário final, sem introduções.",
            },
            {
                role: "user",
                content: buildPrompt(theme, difficulty),
            },
        ],
        220,
        0.5
    );
}

export async function POST(request: Request) {
    try {
        const { theme, difficulty } = await request.json();

        if (!theme || !difficulty || !["easy", "medium", "hard"].includes(difficulty)) {
            return NextResponse.json(
                { error: "Tema e dificuldade válidos são obrigatórios." },
                { status: 400 }
            );
        }

        try {
            const context = await callGeminiForContext(theme, difficulty as Difficulty);
            return NextResponse.json({ context, provider: "gemini" });
        } catch (error) {
            const status = (error as Error & { status?: number }).status;

            console.error("Gemini API error in context route:", {
                status,
                message: error instanceof Error ? error.message : error,
            });

            if (status && status !== 429 && status !== 401 && status !== 403) {
                throw error;
            }

            const context = await callGroqForContext(theme, difficulty as Difficulty);
            return NextResponse.json({ context, provider: "groq-fallback" });
        }
    } catch (error) {
        console.error("Error in context route:", error);
        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Erro ao gerar o contexto do debate",
            },
            { status: 500 }
        );
    }
}
