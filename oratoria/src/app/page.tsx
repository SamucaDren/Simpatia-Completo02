"use client";

import { useEffect, useMemo, useState } from "react";
import { PlayCircle, Question, RocketLaunch } from "phosphor-react";
import { DebateForm } from "@/components/DebateForm";
import { FloatingSystemChat } from "@/components/FloatingSystemChat";
import { GuidedTutorial, type TutorialStep } from "@/components/GuidedTutorial";

type TutorialScreen = "welcome" | "setup" | "active" | "feedback" | "assistant";

export default function Home() {
    const [hasStarted, setHasStarted] = useState(false);
    const [isTutorialOpen, setIsTutorialOpen] = useState(false);
    const [tutorialStep, setTutorialStep] = useState(0);

    const tutorialSteps = useMemo<(TutorialStep & { screen: TutorialScreen })[]>(
        () => [
            {
                selector: '[data-tour="welcome-start-button"]',
                title: "Comecar pratica",
                description:
                    "Este botao leva o aluno direto para a area principal de pratica. Neste modulo o foco e entrar e comecar o debate sem etapas extras.",
                screen: "welcome",
            },
            {
                selector: '[data-tour="welcome-tutorial-button"]',
                title: "Tour guiado",
                description:
                    "Aqui o aluno pode abrir este tutorial sempre que quiser revisar como navegar pela plataforma.",
                screen: "welcome",
            },
            {
                selector: '[data-tour="theme-select"]',
                title: "Tipo de debate",
                description:
                    "Neste seletor o usuario escolhe o formato da pratica. O tema define como a IA vai montar o cenario inicial.",
                screen: "setup",
            },
            {
                selector: '[data-tour="difficulty-options"]',
                title: "Nivel de dificuldade",
                description:
                    "Os niveis ajustam o rigor do desafio. Facil e mais acolhedor, medio equilibra pressao e dificil exige respostas mais robustas.",
                screen: "setup",
            },
            {
                selector: '[data-tour="start-debate-button"]',
                title: "Comecar o debate",
                description:
                    "Este botao gera o contexto da rodada e leva o usuario para a conversa principal com a IA debatedora.",
                screen: "setup",
            },
            {
                selector: '[data-tour="context-card"]',
                title: "Contexto gerado",
                description:
                    "Depois de iniciar, o sistema mostra aqui o cenario que orienta todos os argumentos da sessao.",
                screen: "active",
            },
            {
                selector: '[data-tour="back-button"]',
                title: "Voltar",
                description:
                    "O retorno so deve ser usado ao encerrar a rodada. No fluxo real, o sistema impede sair cedo demais para nao perder o progresso do debate.",
                screen: "active",
            },
            {
                selector: '[data-tour="argument-input"]',
                title: "Campo do argumento",
                description:
                    "E aqui que o usuario escreve sua posicao. Pressionar Enter envia a resposta, enquanto Shift + Enter permite quebrar linha.",
                screen: "active",
            },
            {
                selector: '[data-tour="send-argument-button"]',
                title: "Enviar argumento",
                description:
                    "Ao clicar, o argumento segue para a IA debate-lo e a conversa continua com novos contrapontos.",
                screen: "active",
            },
            {
                selector: '[data-tour="finish-feedback-button"]',
                title: "Finalizar e gerar feedback",
                description:
                    "Quando ja houver conteudo suficiente, este botao encerra a pratica e monta a analise de desempenho do usuario.",
                screen: "active",
            },
            {
                selector: '[data-tour="download-history-button"]',
                title: "Baixar historico",
                description:
                    "Permite exportar toda a conversa da rodada para consulta posterior ou registro do treino.",
                screen: "feedback",
            },
            {
                selector: '[data-tour="restart-debate-button"]',
                title: "Debater novamente",
                description:
                    "Reinicia o fluxo para comecar uma nova pratica do zero, com novo tema e nova configuracao.",
                screen: "feedback",
            },
            {
                selector: '[data-tour="assistant-launcher"]',
                title: "Assistente do sistema",
                description:
                    "Este e o chatbot flutuante, separado do debate. Ele responde apenas duvidas sobre o funcionamento da plataforma.",
                screen: "assistant",
            },
            {
                selector: '[data-tour="assistant-input"]',
                title: "Pergunta sobre o sistema",
                description:
                    "O usuario pode perguntar sobre fluxo, botoes, feedback, niveis e navegacao. O assistente foi restringido para nao falar de assuntos fora do sistema.",
                screen: "assistant",
            },
            {
                selector: '[data-tour="assistant-send-button"]',
                title: "Enviar para o assistente",
                description:
                    "Este botao envia a pergunta ao endpoint conectado ao Groq e devolve uma resposta especifica sobre a plataforma.",
                screen: "assistant",
            },
        ],
        []
    );

    const activeStep = tutorialSteps[tutorialStep];
    const previewScreen = isTutorialOpen ? activeStep?.screen : undefined;

    useEffect(() => {
        if (!previewScreen) {
            return;
        }

        if (previewScreen === "welcome") {
            setHasStarted(false);
            return;
        }

        setHasStarted(true);
    }, [previewScreen]);

    const startTutorial = () => {
        setTutorialStep(0);
        setIsTutorialOpen(true);
    };

    const goToNextStep = () => {
        setTutorialStep((current) => {
            if (current >= tutorialSteps.length - 1) {
                setIsTutorialOpen(false);
                return current;
            }

            return current + 1;
        });
    };

    const showAppShell = hasStarted || (isTutorialOpen && previewScreen !== "welcome");

    return (
        <>
            <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(0,111,255,0.12),_transparent_38%),linear-gradient(180deg,#f8f8fc_0%,#eef4ff_100%)]">
                <div className="mx-auto w-full max-w-[1232px] px-6 py-10 md:py-16">
                    <header className="mb-10 flex flex-col gap-6 md:mb-12 md:flex-row md:items-start md:justify-between">
                        <div className="flex flex-col items-center gap-1 md:items-start">
                            <h1 className="flex items-center gap-2 text-heading-40 text-neutral-700">
                                SIMPATICO
                                <span className="rounded-lg bg-primary-blue px-3 py-1 text-heading-24 text-neutral-000">
                                    IA
                                </span>
                            </h1>
                            <p className="text-heading-24 tracking-wider text-neutral-500">ORATORIA</p>
                            <p className="max-w-2xl text-center text-body-16-medium text-neutral-600 md:text-left">
                                Treine argumentacao com debates guiados por IA e conte com um assistente lateral
                                especializado em explicar como cada parte do sistema funciona.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={startTutorial}
                            className="inline-flex self-center rounded-full border border-blue-light-2 bg-neutral-000 px-4 py-3 text-body-14-semibold text-primary-blue shadow-sm transition hover:border-primary-blue hover:shadow-md md:self-start"
                        >
                            <span className="inline-flex items-center gap-2">
                                <Question size={18} weight="bold" />
                                Tutorial guiado
                            </span>
                        </button>
                    </header>

                    {!showAppShell ? (
                        <section className="mx-auto max-w-4xl rounded-[32px] border border-white/80 bg-neutral-000/95 p-8 shadow-[0_24px_80px_rgba(0,24,57,0.12)] backdrop-blur md:p-12">
                            <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-center">
                                <div className="space-y-5">
                                    <span className="inline-flex rounded-full bg-blue-light-3 px-4 py-2 text-body-14-semibold text-primary-blue">
                                        Espaco de pratica do aluno
                                    </span>
                                    <div className="space-y-3">
                                        <h2 className="text-heading-40 text-neutral-700">
                                            Comece a praticar assim que entrar no modulo.
                                        </h2>
                                        <p className="text-body-16-medium text-neutral-600">
                                            Este ambiente foi pensado para o aluno acessar a pratica diretamente,
                                            escolher o tipo de debate, definir a dificuldade e iniciar a atividade sem
                                            nenhuma etapa extra nesta tela.
                                        </p>
                                    </div>
                                </div>

                                <div className="rounded-[28px] bg-neutral-100 p-6 shadow-inner shadow-blue-light-3/40">
                                    <div className="space-y-4">
                                        <button
                                            type="button"
                                            data-tour="welcome-start-button"
                                            onClick={() => setHasStarted(true)}
                                            className="w-full rounded-2xl bg-primary-blue px-5 py-4 text-body-16-semibold text-neutral-000 transition hover:bg-blue-1"
                                        >
                                            <span className="inline-flex items-center gap-2">
                                                <RocketLaunch size={20} weight="bold" />
                                                Iniciar pratica
                                            </span>
                                        </button>
                                        <button
                                            type="button"
                                            data-tour="welcome-tutorial-button"
                                            onClick={startTutorial}
                                            className="w-full rounded-2xl border border-blue-light-2 bg-neutral-000 px-5 py-4 text-body-16-semibold text-primary-blue transition hover:border-primary-blue"
                                        >
                                            <span className="inline-flex items-center gap-2">
                                                <PlayCircle size={20} weight="fill" />
                                                Ver tutorial completo
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>
                    ) : (
                        <DebateForm
                            tutorialMode={isTutorialOpen}
                            tutorialPreviewStage={
                                previewScreen && previewScreen !== "welcome" ? previewScreen : undefined
                            }
                        />
                    )}
                </div>
            </main>

            <FloatingSystemChat tutorialMode={isTutorialOpen} forceOpen={previewScreen === "assistant"} />

            <GuidedTutorial
                isOpen={isTutorialOpen}
                step={activeStep}
                currentStep={tutorialStep + 1}
                totalSteps={tutorialSteps.length}
                onClose={() => setIsTutorialOpen(false)}
                onNext={goToNextStep}
                onPrevious={() => setTutorialStep((current) => Math.max(current - 1, 0))}
            />
        </>
    );
}
