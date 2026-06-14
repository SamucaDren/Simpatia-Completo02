import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ChatWidget from "../components/ChatWidget";
import "./Resultado.css";

export default function Revisao() {
  const { id } = useParams();
  const [dados, setDados] = useState(null);
  const [erro, setErro] = useState("");
  const [questaoFoco, setQuestaoFoco] = useState(null);
  const [chatKey, setChatKey] = useState(0);
  const [todasQuestoes, setTodasQuestoes] = useState(null);

  useEffect(() => {
    const historico = JSON.parse(
      localStorage.getItem("quiz_historico") || "[]",
    );
    const tentativa = historico.find((h) => h.id === id);
    if (!tentativa) {
      setErro("Revisão não encontrada.");
    } else {
      setDados(tentativa);
    }
  }, [id]);

  useEffect(() => {
    if (!dados) return;
    setTodasQuestoes(
      dados.questoes.map((q, i) => ({
        numero: i + 1,
        pergunta: q.pergunta,
        alternativas: q.alternativas || [],
        correta: q.resposta_correta,
        selecionada:
          dados.respostas[i] !== undefined ? dados.respostas[i] : null,
        acertou:
          dados.respostas[i] !== null &&
          dados.respostas[i] === q.resposta_correta,
      })),
    );
  }, [dados]);

  function abrirChatQuestao(numero) {
    setQuestaoFoco(numero);
    setChatKey((k) => k + 1);
  }

  if (erro)
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <p style={{ color: "#a00", marginBottom: 16 }}>{erro}</p>
        <Link to="/dashboard" style={{ color: "#006FFF" }}>
          ← Voltar ao Dashboard
        </Link>
      </div>
    );

  if (!dados)
    return <div style={{ padding: 40, textAlign: "center" }}>Carregando…</div>;

  return (
    <div className="res-page">
      <div className="res-topbar">
        <img
          src={`${import.meta.env.BASE_URL}logo-simpatia.png`}
          alt="Simpat.IA"
          className="res-topbar__logo"
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
        <Link to="/dashboard" className="res-logout-btn">
          ← Dashboard
        </Link>
      </div>

      <div className="res-container">
        <h2>Revisão</h2>
        <p className="res-meta">
          Tema: <strong>{dados.tema}</strong>
        </p>
        <p className="res-resumo">
          Acertos: <strong>{dados.acertos}</strong> /{" "}
          <strong>{dados.total}</strong>
        </p>

        {dados.questoes.map((q, i) => {
          const idxCor = q.resposta_correta;
          const idxSel =
            dados.respostas[i] !== undefined ? dados.respostas[i] : null;
          const acertou = idxSel !== null && idxSel === idxCor;
          const alts = q.alternativas || [];
          const justAlt = q.justificativas_alternativas || [];

          return (
            <div key={i} className="res-questao">
              <div className={`res-q-header ${acertou ? "certa" : "errada"}`}>
                {acertou ? "✓ Acertou!" : "✗ Incorreta."}
              </div>
              <div className="res-q-body">
                <p className="res-pergunta">
                  {i + 1}. {q.pergunta}
                </p>
                {alts.map((alt, j) => {
                  const isCor = j === idxCor;
                  const isMarc = idxSel !== null && j === idxSel;
                  let cls = "res-alt";
                  if (isCor) cls += " correta";
                  if (isMarc && !isCor) cls += " marcada-errada";
                  const just =
                    justAlt[j] || (isCor ? q.justificativa_correta : null);

                  return (
                    <div key={j} className={cls}>
                      <div className="res-alt__chips">
                        <span className="chip">
                          {String.fromCharCode(65 + j)}
                        </span>
                        {isMarc && (
                          <span className="chip chip--marcada">
                            sua resposta
                          </span>
                        )}
                        {isCor && (
                          <span className="chip chip--correta">correta</span>
                        )}
                      </div>
                      <div className="res-alt__texto">
                        {alt}
                        {just && <div className="res-just">{just}</div>}
                      </div>
                    </div>
                  );
                })}

                {!acertou && idxSel !== null && (
                  <button
                    className="revisao-tutor-btn"
                    onClick={() => abrirChatQuestao(i + 1)}
                  >
                    💬 Por que errei esta questão?
                  </button>
                )}
              </div>
            </div>
          );
        })}

        <div className="res-rodape">
          <Link to="/" className="res-btn">
            Novo Quiz
          </Link>
          <Link to="/dashboard" className="res-btn">
            Dashboard
          </Link>
        </div>
      </div>

      <ChatWidget
        key={chatKey}
        tipo="revisao"
        todasQuestoes={todasQuestoes}
        questaoFoco={questaoFoco}
      />
    </div>
  );
}
