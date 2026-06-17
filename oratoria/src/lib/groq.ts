const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

interface GroqMessage {
    role: "system" | "user" | "assistant";
    content: string;
}

export async function callGroq(messages: GroqMessage[], maxTokens = 700, temperature = 0.4) {
    if (!process.env.GROQ_API_KEY?.trim()) {
        throw new Error("GROQ_API_KEY não configurada no ambiente.");
    }

    const response = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.GROQ_API_KEY.trim()}`,
        },
        body: JSON.stringify({
            model: DEFAULT_GROQ_MODEL,
            temperature,
            max_tokens: maxTokens,
            messages,
        }),
    });

    const rawText = await response.text();
    let data: any = null;

    try {
        data = rawText ? JSON.parse(rawText) : null;
    } catch {
        data = { raw: rawText };
    }

    if (!response.ok) {
        throw new Error(data?.error?.message || data?.message || data?.raw || "Erro ao consultar o Groq.");
    }

    const content = data?.choices?.[0]?.message?.content;

    if (!content) {
        throw new Error("O Groq não retornou conteúdo.");
    }

    return content;
}
