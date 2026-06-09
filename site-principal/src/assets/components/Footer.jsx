import styles from "./footer.module.css";
import ButtonUnifenas from "./ButtonUnifenas";
import ButtonConhecerModulos from "./ButtonConhecerModulos";
import MODULOS_DATA from "../../data/modulosData";

function Footer() {
  const modulosAlunos = MODULOS_DATA.aluno.slice(0, 4);
  const modulosProfessores = MODULOS_DATA.professor.slice(0, 3);

  return (
    <footer className={styles.footer_container}>
      <div className={styles.footer_content}>
        {/* Divisão Esquerda */}
        <div className={styles.footer_left}>
          <img
            src={import.meta.env.BASE_URL + "logosimpatia.svg"}
            alt="Logo Simpatia"
            className={styles.footer_logo_simpatia}
          />
          <div className={styles.footer_text_box}>
            <p>
              O SIMPATIA foi desenvolvido por alunos da Unifenas a fim de
              auxiliar discentes e docentes com ferramentas de Inteligência
              Artificial.
            </p>
          </div>
          <ButtonConhecerModulos
            texto="Quero conhecer os módulos!"
            mostrarIcone={true}
          />
        </div>

        {/* Divisão Meio/Direita */}
        <div className={styles.footer_right}>
          {/* Divisão de cima */}
          <div className={styles.footer_right_top}>
            {/* Coluna 1 (links) */}
            <div className={styles.footer_column}>
              <a href="/professor">Para Professores</a>
              <ul>
                {modulosProfessores.map((item, index) => (
                  <li key={index}>
                    <a href={item.link}>{item.titulo}</a>
                  </li>
                ))}
              </ul>
            </div>
            {/* Coluna 2 (links) */}
            <div className={styles.footer_column}>
              <a href="/aluno">Para Alunos</a>
              <ul>
                {modulosAlunos.map((item, index) => (
                  <li key={index}>
                    <a href={item.link}>{item.titulo}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* Divisão de baixo */}
          <div className={styles.footer_right_bottom}>
            <a href="/sobre" className={styles.footer_text_know_more}>
              Conheça mais sobre o projeto
            </a>
            <ButtonUnifenas />
          </div>
        </div>
      </div>

      <div className={styles.footer_divider}></div>
      <div className={styles.footer_final_division}>
        <span className={styles.atex_info}>ATEX - © 2025 SIMPATIA</span>
        <span className={styles.system_info + " " + styles.traco}>-</span>
        <span className={styles.system_info}>
          Sistema de Mídias Pedagógicas para Atividades com Inteligência
          Artificial
        </span>
      </div>
    </footer>
  );
}

export default Footer;
