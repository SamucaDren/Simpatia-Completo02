import ButtonConhecerModulos from "./ButtonConhecerModulos";
import EclipseGiratoria from "./EclipseGiratoria";
import styles from "./unifenas.module.css";
//import fachada from "./fachadaunifenas.png";

function Unifenas() {
  return (
    <section className={styles.inteiro}>
      <div className={styles.fundo_unifenas}>
        <div className={styles.texto_unifenas}>
          <span class="tagAzul">SOBRE</span>
          <h2>
            Projeto desenvolvido por alunos da <strong>Unifenas</strong>
          </h2>
          <p>
            O SIMPATIA é um sistema desenvolvido por alunos do curso de Ciência
            da Computação da Unifenas, com o objetivo de integrar Inteligência
            Artificial às práticas pedagógicas. Nosso propósito é oferecer
            ferramentas que tornem o aprendizado mais dinâmico, inclusivo e
            eficaz
          </p>
          <div className={styles.button_conhecer_mobile}>
            <ButtonConhecerModulos
              texto="Conheça mais sobre o projeto"
              mostrarIcone={true}
            />
          </div>
        </div>
        <div className={styles.imagem_unifenas}>
          <img
            src={import.meta.env.BASE_URL + "fachadaunifenas.png"}
            alt="fachada da Unifenas"
          />
        </div>
      </div>
    </section>
  );
}

export default Unifenas;
