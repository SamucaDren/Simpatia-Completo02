import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Quiz.css';

export default function Quiz() {
  const { state }  = useLocation();
  const navigate   = useNavigate();

  const questoes   = state?.questoes   || [];
  const tema       = state?.tema       || 'Quiz';
  const nivel      = state?.nivel      || 'medio';
  const nivelLabel = state?.nivelRotulo || 'Médio';

  const [respostas, setRespostas] = useState(Array(questoes.length).fill(null));
  const [enviando, setEnviando]   = useState(false);

  useEffect(() => {
    if (questoes.length === 0) navigate('/');
  }, [questoes, navigate]);

  function selecionar(questaoIdx, altIdx) {
    setRespostas(r => {
      const novo = [...r];
      novo[questaoIdx] = altIdx;
      return novo;
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setEnviando(true);

    const total = questoes.length;
    let acertos = 0;
    questoes.forEach((q, i) => {
      if (respostas[i] !== null && respostas[i] !== undefined
          && parseInt(respostas[i]) === parseInt(q.resposta_correta)) {
        acertos++;
      }
    });
    const erros = total - acertos;
    const percentual = total > 0 ? parseFloat(((acertos / total) * 100).toFixed(1)) : 0;

    const id = Date.now().toString();
    const resultado = {
      id,
      userId: 'guest',
      tema,
      nivelLabel,
      nivel,
      acertos,
      erros,
      total,
      percentual,
      data: new Date().toLocaleString('pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      }),
      questoes,
      respostas,
    };

    const historico = JSON.parse(localStorage.getItem('quiz_historico') || '[]');
    historico.push(resultado);
    localStorage.setItem('quiz_historico', JSON.stringify(historico));

    navigate('/resultado', { state: resultado });
  }

  return (
    <div className="quiz-page">
      <header className="quiz-topbar">
        <Link to="/">
          <img
            src="/logo-simpatia.png"
            alt="Simpat.IA"
            className="quiz-topbar__logo"
            onError={e => { e.target.style.display = 'none'; }}
          />
        </Link>
      </header>

      <div className="quiz-container">
        <h2 className="quiz-title">TESTE SEUS CONHECIMENTOS</h2>

        <form onSubmit={handleSubmit}>
          {questoes.map((q, i) => (
            <div key={i} className="questao-card">
              <p className="questao-enunciado">
                <strong>{i + 1}. {q.pergunta}</strong>
              </p>

              {q.alternativas.map((alt, j) => (
                <label
                  key={j}
                  className={`questao-alt ${respostas[i] === j ? 'selecionada' : ''}`}
                >
                  <input
                    type="radio"
                    name={`q${i}`}
                    value={j}
                    checked={respostas[i] === j}
                    onChange={() => selecionar(i, j)}
                  />
                  <span className="questao-alt__circulo" />
                  {alt}
                </label>
              ))}
            </div>
          ))}

          <button type="submit" className="quiz-btn-submit" disabled={enviando}>
            {enviando ? 'Salvando…' : 'Enviar Respostas'}
          </button>
        </form>
      </div>
    </div>
  );
}
