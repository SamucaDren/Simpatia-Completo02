import HeroAlt from "../components/HeroAlt.jsx";
import Faq from "../components/Faq.jsx";
import UnifenasAlt from "../components/UnifenasAlt.jsx";
import Atualizacoes from "../components/Atualizacoes.jsx";
import styles from "./about.module.css";
function UpdatesPage() {
  const linhaDivisoria = {
    width: "100%",
    height: "0",
    margin: "0",
    borderTop: "2px dashed var(--roxo-claro-03)",
  };

  return (
    <main className={styles.main_about_page}>
      <section className={styles.fundo_hero}>
        <div className={styles.secao_hero_alt}>
          <div className={styles.hero_container_alt}>
            <div className="tagAzul">ATUALIZAÇÕES</div>
            <h1>
              Conheça mais <br />
              <span className="texto_azul">sobre o Projeto</span>
            </h1>
            <p>
              Ferramentas criadas para apoiar alunos e professores <br />
              na sala de aula.
            </p>
          </div>
          <UnifenasAlt />
          <div className={styles.bottom_barra_branca}></div>
        </div>
      </section>

      <Atualizacoes />
      <div style={linhaDivisoria}></div>
      <Faq />
    </main>
  );
}

export default UpdatesPage;
/*
<div className={styles.unifenas_about_container}>
<UnifenasAlt />
</div>*/
