"use client";

import { Box, Button, Paper, Popper, Typography } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { TUTORIAL_RESTART_EVENT, TUTORIAL_STORAGE_KEY } from "@/lib/tutorialConstants";

type TourStep = {
  id: string;
  path: string;
  targetId: string;
  title: string;
  description: string;
  advanceOnClick?: boolean;
  autoNextPath?: string;
  requireEnabledTarget?: boolean;
};


const TOUR_STEPS: TourStep[] = [
  {
    id: "home-logo",
    path: "/",
    targetId: "header-logo",
    title: "Logo do Simpatico",
    description: "Clique aqui para voltar para a p\u00e1gina inicial a qualquer momento.",
  },
  {
    id: "home-entrar",
    path: "/",
    targetId: "header-entrar",
    title: "Entrar",
    description:
      "N\u00e3o h\u00e1 login com banco. Este bot\u00e3o leva direto para o in\u00edcio do fluxo.",
    advanceOnClick: true,
  },
  {
    id: "home-comecar",
    path: "/",
    targetId: "hero-comecar",
    title: "Come\u00e7ar",
    description:
      "Inicia o uso do sistema e te leva para selecionar curso e disciplina.",
    advanceOnClick: true,
    autoNextPath: "/selecionar_disciplina",
  },
  {
    id: "select-voltar",
    path: "/selecionar_disciplina",
    targetId: "header-voltar",
    title: "Voltar",
    description: "Retorna para a p\u00e1gina inicial do Simpatico.",
  },
  {
    id: "select-curso",
    path: "/selecionar_disciplina",
    targetId: "select-curso",
    title: "Seu Curso",
    description: "Escolha o curso para liberar as disciplinas.",
  },
  {
    id: "select-disciplina",
    path: "/selecionar_disciplina",
    targetId: "select-disciplina",
    title: "Disciplina",
    description: "Selecione a mat\u00e9ria que voc\u00ea precisa de ajuda.",
  },
  {
    id: "select-avatar",
    path: "/selecionar_disciplina",
    targetId: "header-avatar",
    title: "Perfil",
    description:
      "Atalho de perfil (em breve). Hoje ele n\u00e3o tem fun\u00e7\u00f5es extras.",
  },
  {
    id: "select-start-chat",
    path: "/selecionar_disciplina",
    targetId: "start-chat",
    title: "Iniciar Chat",
    description: "Abre o chat com a disciplina escolhida.",
    advanceOnClick: true,
    autoNextPath: "/chat_simpatico",
    requireEnabledTarget: true,
  },
  {
    id: "chat-alterar",
    path: "/chat_simpatico",
    targetId: "header-alterar",
    title: "Alterar Disciplina",
    description: "Volta para trocar o curso ou a disciplina.",
  },
  {
    id: "chat-input",
    path: "/chat_simpatico",
    targetId: "chat-input",
    title: "Campo de Mensagem",
    description: "Digite sua d\u00favida para o tutor.",
  },
  {
    id: "chat-send",
    path: "/chat_simpatico",
    targetId: "chat-send",
    title: "Enviar",
    description: "Envia sua pergunta para o tutor.",
  },
  {
    id: "floating-assistant",
    path: "*",
    targetId: "floating-chat-toggle",
    title: "Assistente do Sistema",
    description:
      "Abra o chat flutuante para tirar d\u00favidas sobre o pr\u00f3prio Simpatico.",
  },
];

const normalizePath = (path: string) => {
  if (path === "/") return "/";
  return path.replace(/\/+$/, "");
};

const clampIndex = (index: number) =>
  Math.min(Math.max(index, 0), TOUR_STEPS.length - 1);


const getIndexForPath = (path: string) => {
  const normalized = normalizePath(path);
  const exactIndex = TOUR_STEPS.findIndex(
    (item) => item.path !== "*" && normalizePath(item.path) === normalized,
  );
  if (exactIndex !== -1) return exactIndex;
  const starIndex = TOUR_STEPS.findIndex((item) => item.path === "*");
  return starIndex !== -1 ? starIndex : 0;
};


const isTargetDisabled = (el: HTMLElement | null) => {
  if (!el) return false;
  const ariaDisabled = el.getAttribute("aria-disabled") === "true";
  const hasDisabledAttr = el.getAttribute("disabled") !== null;
  const isDisabledProp = (el as HTMLButtonElement).disabled === true;
  return ariaDisabled || hasDisabledAttr || isDisabledProp;
};
type StoredState = {
  completed: boolean;
  index: number;
};

const loadState = (): StoredState | null => {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(TUTORIAL_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredState;
  } catch {
    return null;
  }
};

const saveState = (state: StoredState) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TUTORIAL_STORAGE_KEY, JSON.stringify(state));
};

export function TutorialOverlay() {
  const pathname = usePathname();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const pendingClickRef = useRef(false);

  useEffect(() => {
    const stored = loadState();
    const initialIndex = clampIndex(stored?.index ?? getIndexForPath(pathname));

    if (stored?.completed) {
      setIsActive(false);
      setCurrentIndex(initialIndex);
    } else {
      setIsActive(true);
      setCurrentIndex(initialIndex);
    }

    setIsReady(true);
  }, []);

  const normalizedPathname = normalizePath(pathname);
  const step = TOUR_STEPS[currentIndex];
  const isStepMatch =
    step &&
    (step.path === "*" || normalizePath(step.path) === normalizedPathname);
  const shouldShow = isReady && isActive && step && isStepMatch;
  const isNextLocked = Boolean(step?.autoNextPath || step?.requireEnabledTarget);
  const shouldWarnDisabled = Boolean(step?.requireEnabledTarget && isTargetDisabled(anchorEl));


  useEffect(() => {
    const handleRestart = () => {
      const nextIndex = clampIndex(getIndexForPath(normalizedPathname));
      setIsActive(true);
      setCurrentIndex(nextIndex);
      saveState({ completed: false, index: nextIndex });
    };

    if (typeof window === "undefined") return;
    window.addEventListener(TUTORIAL_RESTART_EVENT, handleRestart);
    return () => {
      window.removeEventListener(TUTORIAL_RESTART_EVENT, handleRestart);
    };
  }, [normalizedPathname]);
  useEffect(() => {
    if (!isReady || !isActive || !step) return;
    if (isStepMatch) return;

    const isExactMatch = (path: string) =>
      path !== "*" && normalizePath(path) === normalizedPathname;

    const findForward = (predicate: (path: string) => boolean) =>
      TOUR_STEPS.findIndex(
        (item, index) => index > currentIndex && predicate(item.path),
      );

    const findBackward = (predicate: (path: string) => boolean) => {
      for (let i = currentIndex - 1; i >= 0; i -= 1) {
        if (predicate(TOUR_STEPS[i].path)) {
          return i;
        }
      }
      return -1;
    };

    let nextIndex = findForward(isExactMatch);
    if (nextIndex === -1) {
      nextIndex = findBackward(isExactMatch);
    }
    if (nextIndex === -1) {
      nextIndex = findForward((path) => path === "*");
    }
    if (nextIndex === -1) {
      nextIndex = findBackward((path) => path === "*");
    }

    if (nextIndex !== -1) {
      setCurrentIndex(nextIndex);
      saveState({ completed: false, index: nextIndex });
    }
  }, [
    currentIndex,
    isActive,
    isReady,
    isStepMatch,
    normalizedPathname,
    step,
  ]);

  useEffect(() => {
    if (!shouldShow || !step) {
      setAnchorEl(null);
      return;
    }

    let cancelled = false;
    let attempts = 0;

    const findTarget = () => {
      if (cancelled) return;
      const el = document.querySelector(
        `[data-tour-id="${step.targetId}"]`,
      ) as HTMLElement | null;
      if (el) {
        setAnchorEl(el);
        return;
      }
      if (attempts < 20) {
        attempts += 1;
        setTimeout(findTarget, 150);
      } else {
        setAnchorEl(null);
      }
    };

    findTarget();
    return () => {
      cancelled = true;
    };
  }, [shouldShow, step?.targetId]);

  useEffect(() => {
    if (!anchorEl) return;
    anchorEl.classList.add("tour-highlight");
    anchorEl.setAttribute("data-tour-active", "true");
    if (!pendingClickRef.current) {
      anchorEl.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    return () => {
      anchorEl.classList.remove("tour-highlight");
      anchorEl.removeAttribute("data-tour-active");
    };
  }, [anchorEl]);

  useEffect(() => {
    if (!anchorEl || !step?.advanceOnClick) return;

    const handleClick = () => {
      pendingClickRef.current = true;
      goNext({ triggeredByTarget: true });
      setTimeout(() => {
        pendingClickRef.current = false;
      }, 300);
    };

    anchorEl.addEventListener("click", handleClick);
    return () => anchorEl.removeEventListener("click", handleClick);
  }, [anchorEl, step?.advanceOnClick]);

  const goNext = (options?: { triggeredByTarget?: boolean }) => {
    if (!step) return;
    const triggeredByTarget = options?.triggeredByTarget ?? false;

    if ((step.autoNextPath || step.requireEnabledTarget) && !triggeredByTarget) {
      return;
    }
    if (step.requireEnabledTarget && isTargetDisabled(anchorEl)) {
      return;
    }
    if (currentIndex >= TOUR_STEPS.length - 1) {
      setIsActive(false);
      saveState({ completed: true, index: currentIndex });
      return;
    }
    const nextIndex = clampIndex(currentIndex + 1);
    setCurrentIndex(nextIndex);
    saveState({ completed: false, index: nextIndex });
    if (step.autoNextPath && (triggeredByTarget || !step.advanceOnClick)) {
      router.push(step.autoNextPath);
    }
  };

  const goPrev = () => {
    const prevIndex = clampIndex(currentIndex - 1);
    setCurrentIndex(prevIndex);
    saveState({ completed: false, index: prevIndex });
  };

  const skipTour = () => {
    setIsActive(false);
    saveState({ completed: true, index: currentIndex });
  };

  if (!shouldShow || !step || !anchorEl) {
    return null;
  }

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(15, 23, 42, 0.4)",
          zIndex: 1300,
          pointerEvents: "none",
        }}
      />
      <Popper
        open
        anchorEl={anchorEl}
        placement="auto"
        modifiers={[{ name: "offset", options: { offset: [0, 12] } }]}
        sx={{ zIndex: 1402 }}
      >
        <Paper
          elevation={0}
          sx={{
            width: { xs: "280px", sm: "320px" },
            borderRadius: "16px",
            border: "1px solid",
            borderColor: "rgba(148, 163, 184, 0.4)",
            boxShadow: "0 20px 45px rgba(15, 23, 42, 0.28)",
            p: 2,
            backgroundColor: "white",
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
            {step.title}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 1.5 }}>
            {step.description}
          </Typography>
          {step.advanceOnClick && (
            <Typography
              variant="caption"
              sx={{ color: "text.secondary", display: "block", mb: 1.5 }}
            >
              Dica: clique no item destacado para seguir.
            </Typography>
          )}
          {shouldWarnDisabled && (
            <Typography
              variant="caption"
              sx={{ color: "text.secondary", display: "block", mb: 1.5 }}
            >
              Selecione curso e disciplina para habilitar este botao.
            </Typography>
          )}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1,
            }}
          >
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {currentIndex + 1} de {TOUR_STEPS.length}
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button variant="text" size="small" onClick={skipTour}>
                Pular
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={goPrev}
                disabled={currentIndex === 0}
              >
                Voltar
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={() => goNext()}
                disabled={isNextLocked}
              >
                {currentIndex >= TOUR_STEPS.length - 1 ? "Concluir" : "Pr\u00f3ximo"}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Popper>
    </>
  );
}


































