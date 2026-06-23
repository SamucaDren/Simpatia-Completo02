"use client";

import {
  Box,
  Chip,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { v4 as uuidv4 } from "uuid";
import { UI_COPY } from "@/lib/agentConfig";

type ChatRole = "user" | "assistant";

interface IChatMessage {
  role: ChatRole;
  content: string;
}

const API_URL = "/api/simpatico/system-chat";
const INITIAL_MESSAGE = UI_COPY.initialMessage;

export function FloatingChat() {
  const sessionId = useRef(uuidv4());
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<IChatMessage[]>([
    { role: "assistant", content: INITIAL_MESSAGE },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const sendMessage = async (messageText: string) => {
    const trimmed = messageText.trim();
    if (!trimmed || isLoading) return;

    const nextMessages: IChatMessage[] = [
      ...messages,
      { role: "user", content: trimmed },
    ];

    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: sessionId.current,
          messages: nextMessages,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`A requisicao falhou: ${response.status} - ${errorText}`);
      }

      const data = await response.text();
      setMessages((prev) => [...prev, { role: "assistant", content: data }]);
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: UI_COPY.errorMessage,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!input.trim() || isLoading) return;
    await sendMessage(input);
  };

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: { xs: 16, sm: 20, md: 24 },
        right: { xs: 16, sm: 20, md: 24 },
        zIndex: 1400,
      }}
    >
      {!isOpen && (
        <IconButton
          onClick={() => setIsOpen(true)}
          aria-label="Abrir assistente do modulo"
          data-tour-id="floating-chat-toggle"
          sx={{
            width: 56,
            height: 56,
            borderRadius: "16px",
            background:
              "linear-gradient(135deg, rgba(15,23,42,1) 0%, rgba(37,99,235,1) 100%)",
            color: "white",
            boxShadow: "0 18px 40px rgba(15, 23, 42, 0.35)",
            "&:hover": {
              background:
                "linear-gradient(135deg, rgba(15,23,42,1) 0%, rgba(30,58,138,1) 100%)",
            },
          }}
        >
          <ChatBubbleOutlineIcon />
        </IconButton>
      )}

      {isOpen && (
        <Paper
          elevation={0}
          sx={{
            width: { xs: "calc(100vw - 32px)", sm: 360 },
            height: { xs: "70vh", sm: 520 },
            display: "flex",
            flexDirection: "column",
            borderRadius: "20px",
            overflow: "hidden",
            border: "1px solid",
            borderColor: "rgba(148, 163, 184, 0.4)",
            boxShadow: "0 24px 60px rgba(15, 23, 42, 0.22)",
            backgroundColor: "#F8FAFC",
          }}
        >
          <Box
            sx={{
              p: 2,
              background:
                "linear-gradient(135deg, rgba(15,23,42,1) 0%, rgba(30,58,138,1) 60%, rgba(37,99,235,1) 100%)",
              color: "white",
              display: "flex",
              alignItems: "center",
              gap: 2,
              width: "100%",
            }}
          >
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {UI_COPY.headerTitle}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.85 }}>
                {UI_COPY.headerSubtitle}
              </Typography>
            </Box>
            <Chip
              label={UI_COPY.chipLabel}
              size="small"
              sx={{
                backgroundColor: "rgba(255,255,255,0.16)",
                color: "white",
                fontWeight: 500,
                maxWidth: { xs: 160, sm: 220 },
                display: { xs: "none", sm: "inline-flex" },
                "& .MuiChip-label": {
                  maxWidth: "100%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                },
              }}
            />
            <IconButton
              onClick={() => setIsOpen(false)}
              aria-label="Fechar assistente do modulo"
              sx={{ color: "white", flexShrink: 0 }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              overflowY: "auto",
              p: 2,
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
              background:
                "radial-gradient(circle at top, rgba(219,234,254,0.35), rgba(248,250,252,1) 55%)",
            }}
          >
            {messages.map((msg, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  justifyContent:
                    msg.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: "10px 14px",
                    borderRadius: "14px",
                    maxWidth: "85%",
                    backgroundColor:
                      msg.role === "user" ? "#0F172A" : "white",
                    color: msg.role === "user" ? "white" : "#0F172A",
                    border:
                      msg.role === "user"
                        ? "1px solid rgba(15, 23, 42, 0.2)"
                        : "1px solid rgba(226, 232, 240, 1)",
                    boxShadow:
                      msg.role === "user"
                        ? "0 12px 30px rgba(15, 23, 42, 0.18)"
                        : "0 8px 18px rgba(15, 23, 42, 0.08)",
                    "& a": {
                      color: msg.role === "user" ? "white" : "primary.main",
                      textDecoration: "underline",
                    },
                  }}
                >
                  <Typography
                    component="div"
                    variant="body2"
                    sx={{
                      "& p": { margin: 0 },
                      "& ol, & ul": { pl: 2, my: 1 },
                    }}
                  >
                    <Markdown remarkPlugins={[remarkGfm]}>
                      {msg.content}
                    </Markdown>
                  </Typography>
                </Paper>
              </Box>
            ))}

            {isLoading && (
              <Typography
                variant="caption"
                sx={{ fontStyle: "italic", color: "text.secondary", ml: 1 }}
              >
                Assistente digitando...
              </Typography>
            )}
            <div ref={messagesEndRef} />
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              p: 2,
              borderTop: "1px solid",
              borderColor: "rgba(226, 232, 240, 1)",
              backgroundColor: "white",
            }}
          >
            <TextField
              fullWidth
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={UI_COPY.placeholder}
              disabled={isLoading}
              variant="outlined"
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  backgroundColor: "#F1F5F9",
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      type="submit"
                      color="primary"
                      disabled={!input.trim() || isLoading}
                      sx={{
                        backgroundColor: "primary.main",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "primary.dark",
                        },
                        "&.Mui-disabled": {
                          backgroundColor: "rgba(37, 99, 235, 0.3)",
                          color: "white",
                        },
                      }}
                    >
                      <SendIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Paper>
      )}
    </Box>
  );
}

