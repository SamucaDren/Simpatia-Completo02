import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { useParams } from "react-router-dom";
import CardModulos from "../components/CardModulo";
import Unifenas from "../components/Unifenas";
import HeroAlt from "../components/HeroAlt";
import styles from "./modules.module.css";

function Ferramentas({ todosModulos }) {
  const { tipo } = useParams();
  const tipoModulo = tipo || "professor";

  const listaModulos = useMemo(() => {
    return todosModulos?.[tipoModulo] || [];
  }, [todosModulos, tipoModulo]);

  const tituloExibicao = tipoModulo === "professor" ? "Professores" : "Alunos";
  const verboExibicao = tipoModulo === "professor" ? "ensino" : "aprendizado";

  const [paginaAtual, setPaginaAtual] = useState(1);
  const [ordenacao, setOrdenacao] = useState("asc");

  const MODULOS_POR_PAGINA = 9;
  const refTopo = useRef(null);

  // reset de página quando muda tipo
  useEffect(() => {
    setPaginaAtual(1);
  }, [tipoModulo]);

  // scroll otimizado (evita ref check desnecessário)
  useEffect(() => {
    refTopo.current?.scrollIntoView({ behavior: "smooth" });
  }, [paginaAtual, ordenacao]);

  const modulosOrdenados = useMemo(() => {
    if (!listaModulos.length) return [];

    return [...listaModulos].sort((a, b) => {
      const nomeA = (a?.titulo || "").toUpperCase();
      const nomeB = (b?.titulo || "").toUpperCase();

      return ordenacao === "asc"
        ? nomeA.localeCompare(nomeB)
        : nomeB.localeCompare(nomeA);
    });
  }, [listaModulos, ordenacao]);

  const totalPaginas = useMemo(() => {
    return Math.ceil(modulosOrdenados.length / MODULOS_POR_PAGINA);
  }, [modulosOrdenados.length]);

  const modulosExibidos = useMemo(() => {
    const inicio = (paginaAtual - 1) * MODULOS_POR_PAGINA;
    return modulosOrdenados.slice(inicio, inicio + MODULOS_POR_PAGINA);
  }, [modulosOrdenados, paginaAtual]);

  const alternarOrdenacao = useCallback(() => {
    setOrdenacao((prev) => (prev === "asc" ? "desc" : "asc"));
    setPaginaAtual(1);
  }, []);

  const irParaPagina = useCallback((pagina) => {
    setPaginaAtual(pagina);
  }, []);

  const proximaPagina = useCallback(() => {
    setPaginaAtual((prev) => Math.min(totalPaginas, prev + 1));
  }, [totalPaginas]);

  const paginaAnterior = useCallback(() => {
    setPaginaAtual((prev) => Math.max(1, prev - 1));
  }, []);

  return (
    <main className={styles.ferramentas_page_container}>
      <HeroAlt
        tagDeContexto="MÓDULOS DE IA"
        tituloPrincipal={
          <>
            Ferramentas de IA para <br />
            <span className={styles.texto_azul}>{tituloExibicao}</span>
          </>
        }
        subtitulo={
          <>
            Explore os módulos disponíveis e utilize as ferramentas que tornam
            seu {verboExibicao} mais dinâmico e eficiente.
          </>
        }
      />

      <div ref={refTopo} />

      <div className={styles.modulos_container}>
        <div className={styles.cabecalho}>
          <p>{listaModulos.length} módulos</p>

          <button
            onClick={alternarOrdenacao}
            className={styles.btn_ordenar}
            title={`Ordenar por: ${ordenacao === "asc" ? "(Z-A)" : "(A-Z)"}`}
          >
            Ordenar por: ({ordenacao === "asc" ? "A-Z" : "Z-A"})
          </button>
        </div>

        <div className={styles.cards_grid}>
          {modulosExibidos.length > 0 ? (
            modulosExibidos.map((modulo) => (
              <CardModulos
                key={modulo.id}
                nome={modulo.titulo}
                descricao={modulo.descricao}
                link={modulo.link}
              />
            ))
          ) : (
            <p>Nenhum módulo encontrado para {tituloExibicao}.</p>
          )}
        </div>

        {totalPaginas > 1 && (
          <div className={styles.paginacao_controls}>
            <span>
              Página {paginaAtual} de {totalPaginas}
            </span>

            <button onClick={paginaAnterior} disabled={paginaAtual === 1}>
              &lt;
            </button>

            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(
              (numero) => (
                <button
                  key={numero}
                  onClick={() => irParaPagina(numero)}
                  className={numero === paginaAtual ? styles.active : ""}
                >
                  {numero}
                </button>
              ),
            )}

            <button
              onClick={proximaPagina}
              disabled={paginaAtual === totalPaginas}
            >
              &gt;
            </button>
          </div>
        )}
      </div>

      <Unifenas />
    </main>
  );
}

export default Ferramentas;
