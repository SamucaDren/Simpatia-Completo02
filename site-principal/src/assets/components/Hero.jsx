import NavBar from "./Nav";
import ButtonConhecerModulos from "./ButtonConhecerModulos";
import styles from "./hero.module.css";
import ButtonUnifenas from "./ButtonUnifenas";
import CarroselFotos from "./CarroselFotos";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Hero() {
  const palavras = ["aprender", "ensinar"];
  const [fotoAtual, setFotoAtual] = useState(1);

  const [textoDigitado, setTextoDigitado] = useState("");

  const handleFotoChange = (novaFoto) => {
    setFotoAtual(novaFoto);
  };

  useEffect(() => {
    const palavra = palavras[fotoAtual - 1];
    let index = 0;
    setTextoDigitado("");

    const intervalo = setInterval(() => {
      setTextoDigitado((prev) => prev + palavra[index]);
      index++;
      if (index >= palavra.length) {
        clearInterval(intervalo);
      }
    }, 150);

    return () => clearInterval(intervalo);
  }, [fotoAtual]);

  return (
    <header className={styles.fundo_hero}>
      <div className={styles.secao_hero}>
        <div className={styles.hero_container}>
          <h1>
            Uma nova forma de{" "}
            <span className={styles.texto_azul}>{textoDigitado}</span> com{" "}
            <br></br>o poder da IA
          </h1>
          <p>
            Ferramentas criadas para apoiar alunos e professores na sala de
            aula.
          </p>
          <div className={styles.botoes}>
            <ButtonConhecerModulos
              texto="Quero conhecer os módulos!"
              mostrarIcone={false}
            />
            <ButtonUnifenas />
          </div>
        </div>
        <div class={styles.hero_container_foto}>
          <CarroselFotos onFotoChange={handleFotoChange} />
        </div>
      </div>
    </header>
  );
}

export default Hero;
