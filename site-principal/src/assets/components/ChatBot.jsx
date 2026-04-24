import { useState } from "react";
import "./ChatBot.css";
import MODULOS_DATA from "../../data/modulosData";
import FAQ from "../../data/FacData";
import KEYWORDS from "../../data/KeywordsData";

function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Olá! Como posso ajudar?", from: "bot" },
  ]);
  const [input, setInput] = useState("");

  function handleSend() {
    if (!input.trim()) return;

    const userMsg = { text: input, from: "user" };
    const botMsg = { text: getResponse(input), from: "bot" };

    setMessages([...messages, userMsg, botMsg]);
    setInput("");
  }

  function getResponse(text) {
    const lower = text.toLowerCase();

    //EXIBE AS RESPOSTA COM BASE NAS PALAVRAS
    const faq = FAQ.find((f) => f.keywords.some((k) => lower.includes(k)));
    if (faq) return faq.answer;

    //TENTA ACHAR UM MODULO COM BASE NAS PALAVRAS TAMBEM SE ACHAR MOSTRA O NOME DESSE MODULOS
    const match = KEYWORDS.find((k) =>
      k.keywords.some((word) => lower.includes(word)),
    );

    const todosModulos = Object.values(MODULOS_DATA).flat();

    if (match) {
      const modulo = todosModulos.find((m) => m.id === match.moduloId);

      return modulo
        ? `Achei o módulo: ${modulo.titulo}`
        : "Módulo não encontrado.";
    }

    return "Não entendi 😅 tente outra pergunta.";
  }

  return (
    <div className="chatbot">
      {!open && (
        <button className="chatbot-button" onClick={() => setOpen(true)}>
          <img src="/site-principal/chat.png"></img>
        </button>
      )}

      {open && (
        <div className="chatbot-box">
          <div className="chatbot-header">
            Chat
            <button onClick={() => setOpen(false)}>X</button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div key={i} className={msg.from}>
                {msg.text}
              </div>
            ))}
          </div>

          <div className="chatbot-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Faça uma pergunta..."
            />
            <button onClick={handleSend}>Enviar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatBot;
