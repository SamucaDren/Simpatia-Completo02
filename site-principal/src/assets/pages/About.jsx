import HeroAlt from "../components/HeroAlt.jsx";
import Faq from "../components/Faq.jsx";
import UnifenasAlt from "../components/UnifenasAlt.jsx";
import Atualizacoes from "../components/Atualizacoes.jsx";
import styles from "./about.module.css";
import { Helmet } from "react-helmet-async";
function UpdatesPage() {
  const linhaDivisoria = {
    width: "100%",
    height: "0",
    margin: "0",
    borderTop: "2px dashed var(--roxo-claro-03)",
  };

  return (
    <>
      <Helmet>
        <title>Sobre o Projeto | SIMPATIA</title>

        <meta
          name="description"
          content="Conheça a história do SIMPATIA, um projeto desenvolvido por alunos da Unifenas para aplicar inteligência artificial na educação. Explore os módulos, atualizações e contribuições dos estudantes."
        />

        <meta
          name="keywords"
          content="SIMPATIA, Unifenas, projeto acadêmico, inteligência artificial na educação, ciência da computação, tecnologia educacional, módulos educacionais, IA para professores, IA para alunos, projeto universitário"
        />

        <link rel="canonical" href={window.location.origin + "/sobre/"} />

        <meta property="og:title" content="Sobre o Projeto | SIMPATIA" />

        <meta
          property="og:description"
          content="Conheça o desenvolvimento do SIMPATIA, um projeto criado por alunos da Unifenas para integrar inteligência artificial ao ensino."
        />

        <meta property="og:url" content={window.location.origin + "/sobre/"} />

        <meta property="og:type" content="website" />

        <meta
          property="og:image"
          content={window.location.origin + "/images/og-image.jpg"}
        />

        <meta name="twitter:card" content="summary_large_image" />

        <meta name="twitter:title" content="Sobre o Projeto | SIMPATIA" />

        <meta
          name="twitter:description"
          content="Conheça o desenvolvimento do SIMPATIA, um projeto criado por alunos da Unifenas para integrar inteligência artificial ao ensino."
        />

        <meta
          name="twitter:image"
          content={window.location.origin + "/images/og-image.jpg"}
        />
      </Helmet>
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
    </>
  );
}

export default UpdatesPage;
/*
<div className={styles.unifenas_about_container}>
<UnifenasAlt />
</div>*/
