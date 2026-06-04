import styles from "./acordion.module.css";

// Componente para o ícone de recolher (o "menos")
const RecolherIcon = () => (
  <svg
    width="26"
    height="27"
    viewBox="0 0 26 27"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <ellipse cx="13" cy="13.5056" rx="13" ry="12.8571" fill="#370199" />
    <path
      d="M9 13.5056L17 13.5056"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

// Componente para o ícone de expandir (o "mais")
const ExpandirIcon = () => (
  <svg
    width="26"
    height="27"
    viewBox="0 0 26 27"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <ellipse cx="13" cy="13.5056" rx="13" ry="12.8571" fill="#370199" />
    <path
      d="M12.9995 8.56055V18.4507"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M9 13.5056L17 13.5056"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const Acordion = ({ pergunta, children, isExpanded, onToggle }) => {
  return (
    <div
      className={[
        styles.acordion_container,
        isExpanded ? styles.is_open : "",
      ].join(" ")}
    >
      <div className={styles.acordion_content}>
        <p className={styles.acordion_pergunta}>{pergunta}</p>

        <div
          className={[
            styles.acordion_resposta_wrapper,
            isExpanded ? styles.is_open : "",
          ].join(" ")}
        >
          <p className={styles.acordion_resposta}>{children}</p>
        </div>
      </div>

      <div className={styles.acordion_icone_wrapper} onClick={onToggle}>
        <div className={styles.icone_transicao_container}>
          <div
            className={`${styles.expandir_icon_wrapper} ${
              !isExpanded ? styles.visible : styles.hidden
            }`}
          >
            <ExpandirIcon />
          </div>

          <div
            className={`${styles.recolher_icon_wrapper} ${
              isExpanded ? styles.visible : styles.hidden
            }`}
          >
            <RecolherIcon />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Acordion;
