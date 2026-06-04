import styles from "./hero.module.css";

function HeroAlt({ tagDeContexto, tituloPrincipal, subtitulo }) {
  return (
    <section className={styles.fundo_hero}>
      <div className={styles.secao_hero_alt}>
        <div className={styles.hero_container_alt}>
          {tagDeContexto && <div className="tagAzul">{tagDeContexto}</div>}

          <h1>{tituloPrincipal}</h1>
          <p>{subtitulo}</p>
        </div>
      </div>
    </section>
  );
}

export default HeroAlt;
