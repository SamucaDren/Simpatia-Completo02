"use client";

import { useState } from "react";
import {
  ArrowLeft,
  PaperPlaneRight,
  DownloadSimple,
  ArrowCounterClockwise,
} from "phosphor-react";

const THEMES = ["Caso jurídico", "Dilema ético", "Debate temático"];
const MIN_MESSAGES = 5;
const MAX_MESSAGES = 15;
const FEEDBACK_THRESHOLD = 3;

interface DebateFormProps {
  onSubmit: (data: {
    topic: string;
    context: string;
    difficulty: "easy" | "medium" | "hard";
    argument: string;
  }) => void;
  isLoading: boolean;
}

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
  score: number;
}

export function DebateForm({ onSubmit, isLoading }: DebateFormProps) {
  const [theme, setTheme] = useState(THEMES[0]);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "medium",
  );
  const [context, setContext] = useState<string>("");
  const [argument, setArgument] = useState("");
  const [isGeneratingContext, setIsGeneratingContext] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showThemeSelection, setShowThemeSelection] = useState(true);
  const [messageCount, setMessageCount] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);
  const [isSubmittingArgument, setIsSubmittingArgument] = useState(false);

  //função para gerar feedback ao final do debate, chamada quando o número máximo de mensagens é atingido ou quando o usuário decide finalizar o debate
  const generateFeedback = async () => {
    //impede que o feedback seja gerado múltiplas vezes se o usuário clicar várias vezes no botão
    setIsGeneratingFeedback(true);
    try {
      //puxa todas as mensagens do usuário e junta em um único texto para enviar à API de feedback
      const userMessages = messages
        .filter((m) => m.sender === "user")
        .map((m) => m.text)
        .join("\n");

      //chama a API de feedback passando as mensagens do usuário, tema e dificuldade
      const response = await fetch(
        "https://backend-simpatia.onrender.com/oratoria/feedback",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: userMessages, theme, difficulty }),
        },
      );

      //recebe o feedback gerado pela API e atualiza o estado para exibir na tela
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

  //função para iniciar o debate, chamada quando o usuário seleciona o tema e a dificuldade e clica no botão para iniciar
  const handleThemeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGeneratingContext(true);
    try {
      //chama a API para gerar o contexto do debate com base no tema e dificuldade selecionados
      const res = await fetch(
        "https://backend-simpatia.onrender.com/oratoria/context",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ theme, difficulty }),
        },
      );
      const result = await res.json();

      //atualiza o estado com o contexto gerado e inicia a conversa com as mensagens iniciais
      setContext(result.context);
      setMessages([
        {
          id: Date.now().toString(),
          text: `Tema: ${theme}\nNível: ${difficulty === "easy" ? "Fácil" : difficulty === "medium" ? "Médio" : "Difícil"}`,
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
      setContext(
        "Desculpe, ocorreu um erro ao gerar o contexto. Por favor, tente novamente.",
      );
    } finally {
      setIsGeneratingContext(false);
    }
  };

  //função para enviar um argumento do usuário, chamada quando o usuário digita um argumento e clica no botão para enviar ou pressiona Enter
  const handleArgumentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    //impede que o usuário envie um argumento enquanto outro está sendo processado ou enquanto o contexto ainda está sendo gerado
    if (isLoading || isSubmittingArgument) return;

    //verifica se o número máximo de mensagens foi atingido antes de permitir o envio de um novo argumento, se sim, gera o feedback automaticamente
    if (messageCount >= MAX_MESSAGES) {
      await generateFeedback();
      return;
    }

    setIsSubmittingArgument(true);
    const userArgument = argument;
    setArgument("");

    //adiciona o argumento do usuário à lista de mensagens para exibir na conversa
    const newMessage: Message = {
      id: Date.now().toString(),
      text: userArgument,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setMessageCount((prev) => prev + 1);

    //chama a API para processar o argumento do usuário e obter a resposta da IA
    try {
      const response = await fetch(
        "https://backend-simpatia.onrender.com/oratoria/debate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            topic: theme,
            context,
            difficulty,
            argument: userArgument,
          }),
        },
      );
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
      setMessages((prev) => [...prev, aiMessage]);
      setMessageCount((prev) => prev + 1);

      //verifica novamente se o número máximo de mensagens foi atingido após adicionar a resposta da IA, se sim, gera o feedback automaticamente
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

      setMessages((prev) => [...prev, errorMessage]);
      setMessageCount((prev) => prev + 1);
    } finally {
      setIsSubmittingArgument(false);
    }
  };

  //função para baixar o histórico da conversa em um arquivo de texto, chamada quando o usuário clica no botão para baixar o histórico após o debate ser finalizado
  const downloadConversationHistory = () => {
    const history = messages
      .map((msg) => {
        const sender = msg.sender === "user" ? "Você" : "IA";
        const timestamp = msg.timestamp.toLocaleString();
        return `[${timestamp}] ${sender}:\n${msg.text}\n`;
      })
      .join("\n---\n\n");

    const blob = new Blob([history], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `debate_${theme}_${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  //função para finalizar o debate e gerar o feedback, chamada quando o usuário clica no botão para finalizar o debate
  const handleFinishDebate = async () => {
    if (messageCount < FEEDBACK_THRESHOLD) {
      alert(
        `É necessário ter pelo menos ${FEEDBACK_THRESHOLD} mensagens para finalizar o debate.`,
      );
      return;
    }
    await generateFeedback();
  };

  //função para voltar para a tela de seleção de tema, chamada quando o usuário clica no botão de voltar durante o debate
  const handleBack = () => {
    if (messageCount < MIN_MESSAGES) {
      alert(
        `O debate precisa ter pelo menos ${MIN_MESSAGES} mensagens antes de ser encerrado.`,
      );
      return;
    }
    setShowThemeSelection(true);
    setContext("");
    setMessages([]);
    setMessageCount(0);
    setShowFeedback(false);
    setFeedback(null);
  };

  const getDifficultyLabel = (level: string) => {
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
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleArgumentSubmit(e as any);
    }
  };

  return (
    <div className="w-full bg-neutral-000 p-8 rounded-2xl shadow-md">
      {showThemeSelection ? (
        <div>
          <h2 className="text-heading-24 text-neutral-700 mb-6 text-center">
            Iniciar Debate
          </h2>
          <form onSubmit={handleThemeSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="theme"
                className="block text-body-14-medium text-neutral-600 mb-2"
              >
                Tipo de Debate
              </label>
              <select
                id="theme"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-100 border border-neutral-300 text-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
                required
              >
                {THEMES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-body-14-medium text-neutral-600 mb-2">
                {" "}
                Nível de Dificuldade{" "}
              </label>
              <div className="flex items-center space-x-6">
                {["easy", "medium", "hard"].map((level) => (
                  <label
                    key={level}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="difficulty"
                      value={level}
                      checked={difficulty === level}
                      onChange={(e) =>
                        setDifficulty(
                          e.target.value as "easy" | "medium" | "hard",
                        )
                      }
                      className="h-4 w-4 text-primary-blue focus:ring-primary-blue border-neutral-400"
                    />
                    <span className="text-neutral-600">
                      {getDifficultyLabel(level)}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading || isGeneratingContext}
              className="w-full bg-primary-blue text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGeneratingContext ? "Gerando contexto..." : "Iniciar Debate"}
            </button>
          </form>
        </div>
      ) : showFeedback && feedback ? (
        <div>
          <h3 className="text-heading-24 text-neutral-700 mb-4 text-center">
            Feedback do Debate
          </h3>
          <div className="p-4 bg-blue-light-3 rounded-lg space-y-4 text-blue-dark-1">
            <div>
              <h4 className="font-semibold mb-2">Pontos Fortes:</h4>
              <ul className="list-disc list-inside space-y-1 marker:text-primary-blue">
                {feedback.strengths.map((strength, index) => (
                  <li key={index}>{strength}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Pontos a Melhorar:</h4>
              <ul className="list-disc list-inside space-y-1 marker:text-primary-blue">
                {feedback.improvements.map((improvement, index) => (
                  <li key={index}>{improvement}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Avaliação Geral:</h4>
              <p>{feedback.overall}</p>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            <button
              onClick={downloadConversationHistory}
              className="w-full bg-neutral-200 text-neutral-700 font-semibold py-3 px-4 rounded-lg hover:bg-neutral-300 transition-colors flex items-center justify-center gap-2"
            >
              <DownloadSimple size={20} /> Baixar Histórico
            </button>
            <button
              onClick={() => {
                setShowThemeSelection(true);
                setContext("");
                setMessages([]);
                setMessageCount(0);
                setShowFeedback(false);
                setFeedback(null);
              }}
              className="w-full bg-neutral-200 text-neutral-700 font-semibold py-3 px-4 rounded-lg hover:bg-neutral-300 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowCounterClockwise size={20} /> Debater Novamente
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-heading-24 text-neutral-700">
                Debate em Andamento
              </h2>
              <p className="text-body-14-medium text-neutral-400 mt-1">
                {" "}
                Mensagens: {messageCount}/{MAX_MESSAGES}{" "}
              </p>
            </div>
            <button
              onClick={handleBack}
              className="text-neutral-500 hover:text-neutral-700 transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
          </div>
          <div className="mb-6 p-4 bg-neutral-100 rounded-lg">
            <h3 className="font-semibold text-neutral-700 mb-2">
              Contexto do Debate:
            </h3>
            <p className="text-neutral-600 whitespace-pre-wrap">{context}</p>
          </div>
          <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${message.sender === "user" ? "bg-primary-blue text-white" : "bg-neutral-200 text-neutral-700"}`}
                >
                  <p className="whitespace-pre-wrap">{message.text}</p>
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleArgumentSubmit} className="space-y-4">
            <textarea
              id="argument"
              value={argument}
              onChange={(e) => setArgument(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite seu argumento aqui..."
              className="w-full p-3 bg-neutral-100 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue resize-none"
              rows={3}
              disabled={isLoading || isSubmittingArgument}
            />
            <button
              type="submit"
              disabled={isLoading || isSubmittingArgument}
              className="w-full bg-primary-blue text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmittingArgument ? "Processando..." : "Enviar Argumento"}
              <PaperPlaneRight size={20} weight="fill" />
            </button>
          </form>
          {messageCount >= FEEDBACK_THRESHOLD && !showFeedback && (
            <div className="mt-4 text-center">
              <button
                onClick={handleFinishDebate}
                disabled={isGeneratingFeedback}
                className="text-primary-blue font-semibold hover:underline disabled:opacity-50"
              >
                {isGeneratingFeedback
                  ? "Gerando Feedback..."
                  : "Finalizar Debate e Gerar Feedback"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
