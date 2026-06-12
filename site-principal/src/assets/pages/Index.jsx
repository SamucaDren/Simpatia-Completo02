import Hero from "../components/Hero";
import Descubra from "../components/Descubra";
import Unifenas from "../components/Unifenas";
import Faq from "../components/Faq";
import { Helmet } from "react-helmet-async";

function Index() {
  return (
    <>
      <Helmet>
        <title>
          SIMPATIA | Plataforma Educacional com Inteligência Artificial
        </title>

        <meta
          name="description"
          content="Plataforma educacional com inteligência artificial desenvolvida por alunos da Unifenas. Explore módulos para professores e alunos, incluindo planejamento de aulas, correção de atividades e apoio ao aprendizado."
        />

        <meta
          name="keywords"
          content="SIMPATIA, inteligência artificial na educação, plataforma educacional, IA para professores, IA para alunos, ensino com IA, aprendizagem com IA, Unifenas, tecnologia educacional, plano de aula, correção automática, educação"
        />

        <link rel="canonical" href={window.location.origin + "/"} />

        <meta
          property="og:title"
          content="SIMPATIA | Plataforma Educacional com Inteligência Artificial"
        />

        <meta
          property="og:description"
          content="Plataforma educacional com inteligência artificial desenvolvida por alunos da Unifenas para apoiar alunos e professores."
        />

        <meta property="og:url" content={window.location.origin + "/"} />

        <meta property="og:type" content="website" />
      </Helmet>
      <main>
        <Hero />
        <Descubra />
        <Unifenas />
        <Faq />
      </main>
    </>
  );
}
export default Index;
