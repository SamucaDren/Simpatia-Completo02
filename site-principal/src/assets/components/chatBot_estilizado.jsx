import { useState } from "react";
import styles from "./chatBot_estilizado.module.css";

function ChatBotStylized() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "Olá, sou o Simpatinho o ChatBot do Simpatia!" +
        " Te ajudo a encontrar o módulo certo. O que você está procurando?", from: "bot"
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    const texto = input.trim();
    if (!texto || loading) return;

    const userMsg = { text: texto, from: "user" };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chatbot-geral/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensagem: texto }),
      });

      const data = await response.json();
      const botText =
        data.resposta || "Não consegui processar sua mensagem. Tente novamente.";

      setMessages((prev) => [...prev, { text: botText, from: "bot" }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          text: "Erro de conexão. Verifique sua internet e tente novamente.",
          from: "bot",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleSend();
  }

  return (
    <div className={styles.chatbot}>
      {!open && (
        <button
          className={styles.chatBotContainer}
          onClick={() => setOpen(true)}
          aria-label="Abrir chat-bot"
        >
          <svg
            width="104"
            height="104"
            viewBox="0 0 104 104"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M104 52C104 80.7188 80.7188 104 52 104C23.2812 104 0 80.7188 0 52C0 23.2812 23.2812 0 52 0C80.7188 0 104 23.2812 104 52Z"
              fill="url(#paint0_linear_1563_2139)"
            />
            <path
              d="M102.516 52C102.516 24.1007 79.8993 1.48379 52 1.48379C24.1007 1.48379 1.48379 24.1007 1.48379 52C1.48379 79.8993 24.1007 102.516 52 102.516V104C23.2812 104 0 80.7188 0 52C0 23.2812 23.2812 0 52 0C80.7188 0 104 23.2812 104 52C104 80.7188 80.7188 104 52 104V102.516C79.8993 102.516 102.516 79.8993 102.516 52Z"
              fill="url(#paint1_linear_1563_2139)"
            />
            <g className={styles.robozimHead}>
              <path
                d="M33.1105 28.9798C33.756 26.5707 36.2323 25.141 38.6415 25.7865V25.7865C41.0506 26.432 42.4803 28.9084 41.8348 31.3175L39.4379 40.2627C38.7924 42.6719 36.3161 44.1016 33.9069 43.4561V43.4561C31.4978 42.8105 30.0681 40.3342 30.7136 37.9251L33.1105 28.9798Z"
                fill="url(#paint2_linear_1563_2139)"
              />
              <path
                d="M62.4149 31.3177C61.7694 28.9086 63.1991 26.4323 65.6083 25.7867V25.7867C68.0174 25.1412 70.4937 26.5709 71.1393 28.9801L73.5361 37.9253C74.1817 40.3344 72.752 42.8107 70.3428 43.4563V43.4563C67.9336 44.1018 65.4573 42.6721 64.8118 40.2629L62.4149 31.3177Z"
                fill="url(#paint3_linear_1563_2139)"
              />
              <path
                d="M82.8227 54.9024C82.8227 67.2801 69.0533 77.3142 52.0679 77.3142C35.0824 77.3142 21.313 67.2801 21.313 54.9024C21.313 42.5248 35.0824 32.4907 52.0679 32.4907C69.0533 32.4907 82.8227 42.5248 82.8227 54.9024Z"
                fill="url(#paint4_linear_1563_2139)"
              />
              <path
                d="M32.213 40.2803C35.6732 36.567 40.9972 35.2428 45.7937 36.9025L47.107 37.3569C50.277 38.4538 53.7236 38.4538 56.8936 37.3569L58.2069 36.9025C63.0034 35.2428 68.3274 36.567 71.7876 40.2803C82.6391 51.9256 75.2247 70.9531 59.3549 72.1861L53.6847 72.6266C52.5635 72.7137 51.4371 72.7137 50.3159 72.6266L44.6457 72.1861C28.7759 70.9531 21.3615 51.9256 32.213 40.2803Z"
                fill="#0C0C12"
              />
              <path
                d="M58.207 36.9018C63.0033 35.2424 68.327 36.5667 71.7871 40.2797C82.6386 51.9251 75.2242 70.953 59.3545 72.186L53.6845 72.6264L53.2636 72.6547C52.4219 72.7037 51.578 72.7037 50.7363 72.6547L50.3154 72.6264L44.6455 72.186C29.0237 70.9723 21.5953 52.5159 31.7177 40.8315L32.2129 40.2797C35.6729 36.5667 40.9966 35.2424 45.7929 36.9018L47.1064 37.3569C50.0783 38.3852 53.2936 38.4491 56.2959 37.5492L56.8935 37.3569L58.207 36.9018ZM70.8994 41.1078C67.7667 37.746 62.9461 36.5467 58.6035 38.0492L57.29 38.5033C53.8629 39.6892 50.1371 39.6892 46.7099 38.5033L45.3965 38.0492C41.0538 36.5466 36.2333 37.746 33.1006 41.1078C22.9426 52.0093 29.8833 69.8208 44.7392 70.975L50.4092 71.4155C51.4678 71.4977 52.5321 71.4977 53.5908 71.4155L59.2607 70.975C74.1166 69.8208 81.0573 52.0093 70.8994 41.1078Z"
                fill="#765ACD"
              />
              <g className={styles.olhosMovimento}>
                <g className={styles.olhosPiscar}>
                  <path
                    d="M43.6977 49.2353C44.9606 49.2353 45.9843 51.7416 45.9843 54.8332C45.9843 57.9249 44.9606 60.4312 43.6977 60.4312C42.4349 60.4312 41.4111 57.9249 41.4111 54.8332C41.4111 51.7416 42.4349 49.2353 43.6977 49.2353Z"
                    fill="#CAAFFC"
                  />
                  <path
                    d="M60.5723 49.2353C61.8351 49.2353 62.8589 51.7416 62.8589 54.8332C62.8589 57.9249 61.8351 60.4312 60.5723 60.4312C59.3094 60.4312 58.2856 57.9249 58.2856 54.8332C58.2856 51.7416 59.3094 49.2353 60.5723 49.2353Z"
                    fill="#CAAFFC"
                  />
                </g>
              </g>
            </g>
            <defs>
              <linearGradient
                id="paint0_linear_1563_2139"
                x1="52"
                y1="0"
                x2="52"
                y2="104"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#0166FF" />
                <stop offset="1" stopColor="#8059C9" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_1563_2139"
                x1="10.5888"
                y1="-1.56038"
                x2="40.9715"
                y2="111.829"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#78A8FF" />
                <stop offset="1" stopColor="#9579C8" />
              </linearGradient>
              <linearGradient
                id="paint2_linear_1563_2139"
                x1="38.6415"
                y1="25.7865"
                x2="33.9069"
                y2="43.4561"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="white" />
                <stop offset="1" stopColor="#CAAFFC" />
              </linearGradient>
              <linearGradient
                id="paint3_linear_1563_2139"
                x1="65.6083"
                y1="25.7867"
                x2="70.3428"
                y2="43.4563"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="white" />
                <stop offset="1" stopColor="#CAAFFC" />
              </linearGradient>
              <linearGradient
                id="paint4_linear_1563_2139"
                x1="52.0679"
                y1="32.4907"
                x2="52.0679"
                y2="77.3142"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="white" />
                <stop offset="1" stopColor="#CAAFFC" />
              </linearGradient>
            </defs>
          </svg>
        </button>
      )}

      {open && (
        <div className={styles.chatbot_box}>
          <div className={styles.chatbot_header}>
            Ficou com alguma dúvida?
            <button onClick={() => setOpen(false)}>X</button>
          </div>

          <div className={styles.chatbot_messages}>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={
                  msg.from === "user"
                    ? styles.user
                    : styles.bot
                }
              >
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="bot">Digitando...</div>
            )}
          </div>

          <div className={styles.chatbot_input}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Faça uma pergunta..."
              disabled={loading}
            />
            <button onClick={handleSend} disabled={loading}>
              Enviar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatBotStylized;