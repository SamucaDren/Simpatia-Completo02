import { useState } from "react";
import Acordion from "./Acordion";
import styles from "./faq.module.css";

function ServicosPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className={styles.container_pagina}>
      <div className={styles.conteudo_textual}>
        <span className="tag">PERGUNTAS FREQUENTES</span>
        <h2>Possui alguma dúvida?</h2>
        <p>
          Aqui estão algumas das perguntas mais comuns que recebemos sobre
          nossos serviços.
        </p>
      </div>

      <div className={styles.lista_acordeoes}>
        <Acordion
          pergunta="O que é o SIMPATIA?"
          isExpanded={openIndex === 0}
          onToggle={() => toggleAccordion(0)}
        >
          É um sistema de mídias pedagógicas com ferramentas de Inteligência
          Artificial para apoiar professores e alunos em atividades
          educacionais.
        </Acordion>

        <Acordion
          pergunta="Quem pode usar o SIMPATIA?"
          isExpanded={openIndex === 1}
          onToggle={() => toggleAccordion(1)}
        >
          Tanto professores quanto alunos podem se beneficiar do SIMPATIA. Cada
          um com acessos aos módulos e funcionalidades específicas para suas
          necessidades.
        </Acordion>

        <Acordion
          pergunta="Quais são os principais módulos disponíveis?"
          isExpanded={openIndex === 2}
          onToggle={() => toggleAccordion(2)}
        >
          Gerador de Plano de Aula. Gerador de Questões. Agente de conversa por
          disciplina. Outras ferramentas educacionais baseadas em IA.
        </Acordion>

        <Acordion
          pergunta="Quem desenvolveu o SIMPATIA?"
          isExpanded={openIndex === 3}
          onToggle={() => toggleAccordion(3)}
        >
          O Simpatia está sendo desenvolvido por uma equipe de estudantes da
          Unifenas, sob a orientação do professor Dr. Celso de Avila Ramos. A
          cada ano novos alunos se juntam ao projeto para contribuir com seu
          desenvolvimento.
        </Acordion>

        <Acordion
          pergunta="As respostas do agente de IA são confiáveis?"
          isExpanded={openIndex === 4}
          onToggle={() => toggleAccordion(4)}
        >
          De forma geral, sim. O agente utiliza modelos avançados de IA para
          fornecer respostas precisas. No entanto, recomendamos que os usuários
          verifiquem as informações críticas para garantir sua exatidão.
        </Acordion>
      </div>
    </div>
  );
}

export default ServicosPage;
