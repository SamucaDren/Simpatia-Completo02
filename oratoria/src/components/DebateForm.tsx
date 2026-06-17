"use client";

import type { FormEvent, KeyboardEvent } from "react";
import { useMemo, useState } from "react";
import {
    ArrowCounterClockwise,
    ArrowLeft,
    DownloadSimple,
    PaperPlaneRight,
} from "phosphor-react";

const THEMES = ["Caso jurídico", "Dilema ético", "Debate temático"];
const MIN_MESSAGES = 5;
const MAX_MESSAGES = 15;
const FEEDBACK_THRESHOLD = 3;

interface Message {
    id: string;
    text: string;
    sender: "user" | "ai";
    timestamp: Date;
}

interface Feedback {
    strengths: string[];
    improvements: string[];
    overall: string;
    score?: number;
}

interface DebateFormProps {
    tutorialMode?: boolean;
    tutorialPreviewStage?: "setup" | "active" | "feedback" | "assistant";
}

const tutorialMessages: Message[] = [
    {
        id: "tutorial-user-1",
        text: "A universidade deveria exigir formação em oratória para todos os cursos.",
        sender: "user",
        timestamp: new Date(),
    },
    {
        id: "tutorial-ai-1",
        text: "Essa proposta parece promissora, mas como justificar a obrigatoriedade para áreas com necessidades tão diferentes? Quais evidências mostram que a medida melhora resultados acadêmicos ou profissionais?",
        sender: "ai",
        timestamp: new Date(),
    },
    {
        id: "tutorial-user-2",
        text: "A prática pode melhorar clareza, autoconfiança e defesa de ideias em qualquer área.",
        sender: "user",
        timestamp: new Date(),
    },
    {
        id: "tutorial-ai-2",
        text: "Então vale aprofundar. Como evitar que a disciplina vire algo genérico demais e sem conexão com a realidade de cada curso?",
        sender: "ai",
        timestamp: new Date(),
    },
];

const tutorialFeedback: Feedback = {
    strengths: [
        "Apresentou uma tese clara logo no início da discussão.",
        "Manteve coerência entre os argumentos ao longo da rodada.",
        "Demonstrou boa capacidade de responder aos contrapontos levantados.",
    ],
    improvements: [
        "Trazer exemplos concretos deixaria a defesa mais convincente.",
        "Alguns pontos podem ganhar mais profundidade analítica.",
        "Faltou citar evidências para sustentar os benefícios afirmados.",
    ],
    overall:
        "O desempenho demonstra uma base argumentativa consistente e boa organização de ideias. Com mais evidências e aprofundamento, a defesa pode se tornar significativamente mais persuasiva.",
    score: 8,
};

export function DebateForm({
    tutorialMode = false,
    tutorialPreviewStage = "setup",
}: DebateFormProps) {
    const [theme, setTheme] = useState(THEMES[0]);
    const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
    const [context, setContext] = useState("");
    const [argument, setArgument] = useState("");
    const [isGeneratingContext, setIsGeneratingContext] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [showThemeSelection, setShowThemeSelection] = useState(true);
    const [messageCount, setMessageCount] = useState(0);
    const [showFeedback, setShowFeedback] = useState(false);
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);
    const [isSubmittingArgument, setIsSubmittingArgument] = useState(false);

    const previewContext =
        "A universidade deve tornar obrigatória uma disciplina de oratória para todos os cursos, mesmo em áreas técnicas com pouca exposição pública?";

    const effectiveMessages = useMemo(() => {
        if (!tutorialMode) {
            return messages;
        }

        if (tutorialPreviewStage === "setup") {
            return [];
        }

        return tutorialMessages;
    }, [messages, tutorialMode, tutorialPreviewStage]);

    const effectiveContext = tutorialMode ? previewContext : context;
    const previewStage = tutorialPreviewStage === "assistant" ? "active" : tutorialPreviewStage;
    const effectiveFeedback = tutorialMode ? tutorialFeedback : feedback;
    const effectiveMessageCount = tutorialMode ? (previewStage === "setup" ? 0 : tutorialMessages.length) : messageCount;
    const effectiveShowThemeSelection = tutorialMode ? previewStage === "setup" : showThemeSelection;
    const effectiveShowFeedback = tutorialMode
        ? previewStage === "feedback"
        : showFeedback && !!feedback;

    const generateFeedback = async () => {
        setIsGeneratingFeedback(true);
        try {
            const userMessages = messages
                .filter((message) => message.sender === "user")
                .map((message) => message.text)
                .join("\n");

            const response = await fetch("/api/oratoria/feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: userMessages, theme, difficulty }),
            });

            const result = await response.json();
            setFeedback(result);
            setShowFeedback(true);
        } catch (error) {
            console.error("Error generating feedback:", error);
            setFeedback({
                strengths: ["Não foi possível gerar feedback neste momento."],
                improvements: ["Por favor, tente novamente mais tarde."],
                overall: "Ocorreu um erro ao gerar o feedback.",
                score: 0,
            });
            setShowFeedback(true);
        } finally {
            setIsGeneratingFeedback(false);
        }
    };

    const handleThemeSubmit = async (event: FormEvent) => {
        event.preventDefault();

        if (tutorialMode) {
            return;
        }

        setIsGeneratingContext(true);

        try {
            const response = await fetch("/api/oratoria/context", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ theme, difficulty }),
            });

            const result = await response.json();
            setContext(result.context);
            setMessages([
                {
                    id: Date.now().toString(),
                    text: `Tema: ${theme}\nNível: ${getDifficultyLabel(difficulty)}`,
                    sender: "user",
                    timestamp: new Date(),
                },
                {
                    id: (Date.now() + 1).toString(),
                    text: result.context,
                    sender: "ai",
                    timestamp: new Date(),
                },
            ]);
            setMessageCount(2);
            setShowThemeSelection(false);
        } catch (error) {
            console.error("Error:", error);
            setContext("Desculpe, ocorreu um erro ao gerar o contexto. Por favor, tente novamente.");
        } finally {
            setIsGeneratingContext(false);
        }
    };

    const handleArgumentSubmit = async (event: FormEvent) => {
        event.preventDefault();

        if (tutorialMode || isSubmittingArgument) {
            return;
        }

        if (messageCount >= MAX_MESSAGES) {
            await generateFeedback();
            return;
        }

        setIsSubmittingArgument(true);
        const userArgument = argument;
        setArgument("");

        const newMessage: Message = {
            id: Date.now().toString(),
            text: userArgument,
            sender: "user",
            timestamp: new Date(),
        };

        setMessages((current) => [...current, newMessage]);
        setMessageCount((current) => current + 1);

        try {
            const response = await fetch("/api/oratoria/debate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ topic: theme, context, difficulty, argument: userArgument }),
            });
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Erro ao processar o debate");
            }

            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: result.response,
                sender: "ai",
                timestamp: new Date(),
            };

            setMessages((current) => [...current, aiMessage]);
            setMessageCount((current) => current + 1);

            if (messageCount + 2 >= MAX_MESSAGES) {
                await generateFeedback();
            }
        } catch (error) {
            console.error("Error:", error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: "Desculpe, ocorreu um erro ao processar seu argumento. Por favor, tente novamente.",
                sender: "ai",
                timestamp: new Date(),
            };
            setMessages((current) => [...current, errorMessage]);
            setMessageCount((current) => current + 1);
        } finally {
            setIsSubmittingArgument(false);
        }
    };

    const downloadConversationHistory = () => {
        const history = messages
            .map((message) => {
                const sender = message.sender === "user" ? "Você" : "IA";
                const timestamp = message.timestamp.toLocaleString();
                return `[${timestamp}] ${sender}:\n${message.text}\n`;
            })
            .join("\n---\n\n");

        const blob = new Blob([history], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = `debate_${theme}_${new Date().toISOString().split("T")[0]}.txt`;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        URL.revokeObjectURL(url);
    };

    const resetDebate = () => {
        setShowThemeSelection(true);
        setContext("");
        setMessages([]);
        setMessageCount(0);
        setShowFeedback(false);
        setFeedback(null);
        setArgument("");
    };

    const handleFinishDebate = async () => {
        if (tutorialMode) {
            return;
        }

        if (messageCount < FEEDBACK_THRESHOLD) {
            alert(`É necessário ter pelo menos ${FEEDBACK_THRESHOLD} mensagens para finalizar o debate.`);
            return;
        }

        await generateFeedback();
    };

    const handleBack = () => {
        if (tutorialMode) {
            return;
        }

        if (messageCount < MIN_MESSAGES) {
            alert(`O debate precisa ter pelo menos ${MIN_MESSAGES} mensagens antes de ser encerrado.`);
            return;
        }

        resetDebate();
    };

    const handleKeyPress = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (tutorialMode) {
            return;
        }

        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleArgumentSubmit(event as unknown as FormEvent);
        }
    };

    return (
        <div className="w-full bg-neutral-000 p-8 rounded-[32px] shadow-[0_24px_80px_rgba(0,24,57,0.10)]">
            {effectiveShowThemeSelection ? (
                <div>
                    <h2 className="text-heading-24 text-neutral-700 mb-6 text-center">Iniciar Debate</h2>

                    <form onSubmit={handleThemeSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="theme" className="block text-body-14-medium text-neutral-600 mb-2">
                                Tipo de Debate
                            </label>
                            <select
                                id="theme"
                                data-tour="theme-select"
                                value={theme}
                                onChange={(event) => setTheme(event.target.value)}
                                className="w-full px-4 py-3 bg-neutral-100 border border-neutral-300 text-neutral-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-blue"
                                disabled={tutorialMode}
                                required
                            >
                                {THEMES.map((currentTheme) => (
                                    <option key={currentTheme} value={currentTheme}>
                                        {currentTheme}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div data-tour="difficulty-options">
                            <label className="block text-body-14-medium text-neutral-600 mb-2">
                                Nível de Dificuldade
                            </label>
                            <div className="flex flex-wrap items-center gap-4">
                                {["easy", "medium", "hard"].map((level) => (
                                    <label
                                        key={level}
                                        className="flex items-center space-x-2 rounded-full border border-neutral-200 bg-neutral-100 px-4 py-2 cursor-pointer"
                                    >
                                        <input
                                            type="radio"
                                            name="difficulty"
                                            value={level}
                                            checked={difficulty === level}
                                            onChange={(event) =>
                                                setDifficulty(event.target.value as "easy" | "medium" | "hard")
                                            }
                                            disabled={tutorialMode}
                                            className="h-4 w-4 text-primary-blue focus:ring-primary-blue border-neutral-400"
                                        />
                                        <span className="text-neutral-600">{getDifficultyLabel(level)}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            data-tour="start-debate-button"
                            disabled={tutorialMode || isGeneratingContext}
                            className="w-full bg-primary-blue text-white font-semibold py-4 px-4 rounded-2xl hover:bg-blue-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isGeneratingContext ? "Gerando contexto..." : "Iniciar Debate"}
                        </button>
                    </form>
                </div>
            ) : effectiveShowFeedback && effectiveFeedback ? (
                <div>
                    <h3 className="text-heading-24 text-neutral-700 mb-4 text-center">Feedback do Debate</h3>

                    <div className="p-5 bg-blue-light-3 rounded-[24px] space-y-4 text-blue-dark-1">
                        <div>
                            <h4 className="font-semibold mb-2">Pontos Fortes:</h4>
                            <ul className="list-disc list-inside space-y-1 marker:text-primary-blue">
                                {effectiveFeedback.strengths.map((strength, index) => (
                                    <li key={index}>{strength}</li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">Pontos a Melhorar:</h4>
                            <ul className="list-disc list-inside space-y-1 marker:text-primary-blue">
                                {effectiveFeedback.improvements.map((improvement, index) => (
                                    <li key={index}>{improvement}</li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">Avaliação Geral:</h4>
                            <p>{effectiveFeedback.overall}</p>
                        </div>
                    </div>

                    <div className="mt-6 space-y-3">
                        <button
                            type="button"
                            data-tour="download-history-button"
                            onClick={downloadConversationHistory}
                            disabled={tutorialMode}
                            className="w-full bg-neutral-200 text-neutral-700 font-semibold py-3 px-4 rounded-2xl hover:bg-neutral-300 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                        >
                            <DownloadSimple size={20} />
                            Baixar Histórico
                        </button>
                        <button
                            type="button"
                            data-tour="restart-debate-button"
                            onClick={resetDebate}
                            disabled={tutorialMode}
                            className="w-full bg-neutral-200 text-neutral-700 font-semibold py-3 px-4 rounded-2xl hover:bg-neutral-300 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                        >
                            <ArrowCounterClockwise size={20} />
                            Debater Novamente
                        </button>
                    </div>
                </div>
            ) : (
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-heading-24 text-neutral-700">Debate em Andamento</h2>
                            <p className="text-body-14-medium text-neutral-400 mt-1">
                                Mensagens: {effectiveMessageCount}/{MAX_MESSAGES}
                            </p>
                        </div>
                        <button
                            type="button"
                            data-tour="back-button"
                            onClick={handleBack}
                            disabled={tutorialMode}
                            className="text-neutral-500 hover:text-neutral-700 transition-colors disabled:opacity-60"
                        >
                            <ArrowLeft size={24} />
                        </button>
                    </div>

                    <div data-tour="context-card" className="mb-6 p-4 bg-neutral-100 rounded-[24px]">
                        <h3 className="font-semibold text-neutral-700 mb-2">Contexto do Debate:</h3>
                        <p className="text-neutral-600 whitespace-pre-wrap">{effectiveContext}</p>
                    </div>

                    <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
                        {effectiveMessages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[80%] p-3 rounded-2xl ${
                                        message.sender === "user"
                                            ? "bg-primary-blue text-white"
                                            : "bg-neutral-200 text-neutral-700"
                                    }`}
                                >
                                    <p className="whitespace-pre-wrap">{message.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleArgumentSubmit} className="space-y-4">
                        <textarea
                            id="argument"
                            data-tour="argument-input"
                            value={
                                tutorialMode
                                    ? "Escreva aqui o argumento que será confrontado pela IA."
                                    : argument
                            }
                            onChange={(event) => setArgument(event.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder="Digite seu argumento aqui..."
                            className="w-full p-4 bg-neutral-100 border border-neutral-300 rounded-[24px] focus:outline-none focus:ring-2 focus:ring-primary-blue resize-none"
                            rows={4}
                            disabled={tutorialMode || isSubmittingArgument}
                        />
                        <button
                            type="submit"
                            data-tour="send-argument-button"
                            disabled={tutorialMode || isSubmittingArgument}
                            className="w-full bg-primary-blue text-white font-semibold py-4 px-4 rounded-2xl hover:bg-blue-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSubmittingArgument ? "Processando..." : "Enviar Argumento"}
                            <PaperPlaneRight size={20} weight="fill" />
                        </button>
                    </form>

                    {effectiveMessageCount >= FEEDBACK_THRESHOLD && !effectiveShowFeedback && (
                        <div className="mt-4 text-center">
                            <button
                                type="button"
                                data-tour="finish-feedback-button"
                                onClick={handleFinishDebate}
                                disabled={tutorialMode || isGeneratingFeedback}
                                className="text-primary-blue font-semibold hover:underline disabled:opacity-50"
                            >
                                {isGeneratingFeedback ? "Gerando Feedback..." : "Finalizar Debate e Gerar Feedback"}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function getDifficultyLabel(level: string) {
    switch (level) {
        case "easy":
            return "Fácil";
        case "medium":
            return "Médio";
        case "hard":
            return "Difícil";
        default:
            return level;
    }
}
