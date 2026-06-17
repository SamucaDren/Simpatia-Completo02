"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { ChatCircleDots, PaperPlaneRight, X } from "phosphor-react";

interface ChatMessage {
    id: string;
    role: "user" | "assistant";
    content: string;
}

interface FloatingSystemChatProps {
    tutorialMode?: boolean;
    forceOpen?: boolean;
}

const tutorialMessages: ChatMessage[] = [
    {
        id: "assistant-demo-1",
        role: "assistant",
        content:
            "Ola. Eu sou o assistente do sistema e posso explicar o fluxo da pratica, o debate, o feedback e o que cada botao faz.",
    },
    {
        id: "user-demo-1",
        role: "user",
        content: "Como funciona o botao de finalizar debate?",
    },
    {
        id: "assistant-demo-2",
        role: "assistant",
        content:
            "Ele encerra a rodada quando ja existe conteudo suficiente e abre a tela de feedback com pontos fortes, melhorias e opcao de baixar o historico.",
    },
];

export function FloatingSystemChat({
    tutorialMode = false,
    forceOpen = false,
}: FloatingSystemChatProps) {
    const [isOpen, setIsOpen] = useState(forceOpen);
    const [isLoading, setIsLoading] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: "assistant-initial",
            role: "assistant",
            content:
                "Posso responder apenas duvidas sobre este sistema: pratica do aluno, fluxo do debate, botoes, feedback e navegacao.",
        },
    ]);

    useEffect(() => {
        setIsOpen(forceOpen);
    }, [forceOpen]);

    const visibleMessages = useMemo(
        () => (tutorialMode ? tutorialMessages : messages),
        [messages, tutorialMode]
    );

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        if (tutorialMode || isLoading || !input.trim()) {
            return;
        }

        const nextUserMessage: ChatMessage = {
            id: `user-${Date.now()}`,
            role: "user",
            content: input.trim(),
        };

        const nextConversation = [...messages, nextUserMessage];
        setMessages(nextConversation);
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/oratoria/system-chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    messages: nextConversation.map((message) => ({
                        role: message.role,
                        content: message.content,
                    })),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Nao foi possivel responder.");
            }

            setMessages((current) => [
                ...current,
                {
                    id: `assistant-${Date.now()}`,
                    role: "assistant",
                    content: data.response,
                },
            ]);
        } catch (error) {
            setMessages((current) => [
                ...current,
                {
                    id: `assistant-error-${Date.now()}`,
                    role: "assistant",
                    content:
                        error instanceof Error
                            ? error.message
                            : "Ocorreu um erro ao consultar o assistente do sistema.",
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-3">
            {isOpen && (
                <section className="w-[min(380px,calc(100vw-24px))] overflow-hidden rounded-[28px] border border-white/70 bg-neutral-000 shadow-[0_24px_80px_rgba(0,24,57,0.22)]">
                    <header className="flex items-center justify-between bg-blue-dark-1 px-5 py-4 text-neutral-000">
                        <div>
                            <p className="text-body-14-semibold text-blue-light-2">Groq</p>
                            <h2 className="text-heading-18">Assistente do sistema</h2>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="rounded-full p-2 text-blue-light-2 transition hover:bg-white/10 hover:text-neutral-000"
                        >
                            <X size={18} weight="bold" />
                        </button>
                    </header>

                    <div className="max-h-[360px] space-y-3 overflow-y-auto bg-[linear-gradient(180deg,#fefeff_0%,#eef4ff_100%)] p-4">
                        {visibleMessages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${
                                    message.role === "user" ? "justify-end" : "justify-start"
                                }`}
                            >
                                <div
                                    className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${
                                        message.role === "user"
                                            ? "bg-primary-blue text-neutral-000"
                                            : "bg-neutral-000 text-neutral-700"
                                    }`}
                                >
                                    {message.content}
                                </div>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} className="border-t border-neutral-200 bg-neutral-000 p-4">
                        <div className="flex gap-3">
                            <input
                                data-tour="assistant-input"
                                value={tutorialMode ? "Como comeco a usar o sistema?" : input}
                                onChange={(event) => setInput(event.target.value)}
                                disabled={tutorialMode || isLoading}
                                placeholder="Pergunte sobre o sistema..."
                                className="flex-1 rounded-2xl border border-neutral-200 bg-neutral-100 px-4 py-3 text-body-14-medium text-neutral-700 outline-none transition focus:border-blue-light-2 focus:bg-neutral-000"
                            />
                            <button
                                type="submit"
                                data-tour="assistant-send-button"
                                disabled={tutorialMode || isLoading}
                                className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-blue text-neutral-000 transition hover:bg-blue-1 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <PaperPlaneRight size={20} weight="fill" />
                            </button>
                        </div>
                    </form>
                </section>
            )}

            <button
                type="button"
                data-tour="assistant-launcher"
                onClick={() => setIsOpen((current) => !current)}
                className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-dark-1 text-neutral-000 shadow-[0_20px_40px_rgba(0,24,57,0.26)] transition hover:scale-[1.02] hover:bg-blue-dark-2"
            >
                <ChatCircleDots size={28} weight="fill" />
            </button>
        </div>
    );
}
