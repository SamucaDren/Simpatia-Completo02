"use client";

import { useEffect, useMemo, useState } from "react";
import { X } from "phosphor-react";

export interface TutorialStep {
    selector: string;
    title: string;
    description: string;
}

interface GuidedTutorialProps {
    isOpen: boolean;
    step?: TutorialStep;
    currentStep: number;
    totalSteps: number;
    onClose: () => void;
    onNext: () => void;
    onPrevious: () => void;
}

interface RectState {
    top: number;
    left: number;
    width: number;
    height: number;
}

export function GuidedTutorial({
    isOpen,
    step,
    currentStep,
    totalSteps,
    onClose,
    onNext,
    onPrevious,
}: GuidedTutorialProps) {
    const [targetRect, setTargetRect] = useState<RectState | null>(null);

    useEffect(() => {
        if (!isOpen || !step) {
            setTargetRect(null);
            return;
        }

        const updatePosition = () => {
            const element = document.querySelector(step.selector) as HTMLElement | null;

            if (!element) {
                setTargetRect(null);
                return;
            }

            element.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
            const rect = element.getBoundingClientRect();

            setTargetRect({
                top: rect.top,
                left: rect.left,
                width: rect.width,
                height: rect.height,
            });
        };

        updatePosition();
        window.addEventListener("resize", updatePosition);
        window.addEventListener("scroll", updatePosition, true);

        return () => {
            window.removeEventListener("resize", updatePosition);
            window.removeEventListener("scroll", updatePosition, true);
        };
    }, [isOpen, step]);

    const tooltipStyle = useMemo(() => {
        if (!targetRect || typeof window === "undefined") {
            return {
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "min(380px, calc(100vw - 32px))",
            };
        }

        const desiredTop = targetRect.top + targetRect.height + 20;
        const fallbackTop = Math.max(24, targetRect.top - 220);
        const fitsBelow = desiredTop < window.innerHeight - 220;
        const width = Math.min(380, window.innerWidth - 32);
        const left = Math.min(
            Math.max(16, targetRect.left + targetRect.width / 2 - width / 2),
            window.innerWidth - width - 16
        );

        return {
            top: fitsBelow ? desiredTop : fallbackTop,
            left,
            width,
        };
    }, [targetRect]);

    if (!isOpen || !step) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-[70]">
            <div className="absolute inset-0 bg-[#001839]/70 backdrop-blur-[2px]" />

            {targetRect && (
                <div
                    className="pointer-events-none absolute rounded-[28px] border-2 border-primary-blue bg-primary-blue/10 shadow-[0_0_0_9999px_rgba(0,24,57,0.35)] transition-all duration-300"
                    style={{
                        top: targetRect.top - 10,
                        left: targetRect.left - 10,
                        width: targetRect.width + 20,
                        height: targetRect.height + 20,
                    }}
                />
            )}

            <div
                className="absolute z-[71] rounded-[28px] border border-white/70 bg-neutral-000 p-6 text-neutral-700 shadow-[0_30px_90px_rgba(0,24,57,0.28)]"
                style={tooltipStyle}
            >
                <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                        <p className="text-body-14-semibold text-primary-blue">
                            Passo {currentStep} de {totalSteps}
                        </p>
                        <h3 className="mt-1 text-heading-24 text-neutral-700">{step.title}</h3>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full p-2 text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-700"
                    >
                        <X size={18} weight="bold" />
                    </button>
                </div>

                <p className="text-body-16-medium text-neutral-600">{step.description}</p>

                <div className="mt-6 flex items-center justify-between gap-3">
                    <button
                        type="button"
                        onClick={onPrevious}
                        disabled={currentStep === 1}
                        className="rounded-full border border-neutral-200 px-4 py-2 text-body-14-semibold text-neutral-600 transition hover:border-neutral-300 hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Anterior
                    </button>
                    <button
                        type="button"
                        onClick={onNext}
                        className="rounded-full bg-primary-blue px-5 py-2 text-body-14-semibold text-neutral-000 transition hover:bg-blue-1"
                    >
                        {currentStep === totalSteps ? "Concluir" : "Próximo"}
                    </button>
                </div>
            </div>
        </div>
    );
}
