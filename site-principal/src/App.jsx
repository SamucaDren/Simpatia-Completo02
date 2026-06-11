import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./assets/components/Nav.jsx";
import Footer from "./assets/components/Footer.jsx";
import Ferramentas from "./assets/pages/Modules.jsx";
import Index from "./assets/pages/Index.jsx";
import Features from "./assets/pages/Features.jsx";
import ChatBot from "./assets/components/ChatBot.jsx";
import ChatBotStylized from "./assets/components/chatBot_estilizado.jsx";
import UpdatesPage from "./assets/pages/About.jsx";
import { useParams } from "react-router-dom";

import MODULOS_DATA from "./data/modulosData";

function FerramentasGuard({ todosModulos }) {
  const { tipo } = useParams();

  const tiposValidos = Object.keys(todosModulos);

  if (!tiposValidos.includes(tipo)) {
    return <Navigate to="/404" replace />;
  }

  return <Ferramentas todosModulos={todosModulos} />;
}

function App() {
  return (
    <BrowserRouter>
      <NavBar />

      <Routes>
        <Route path="/" element={<Index />} />

        {/* ROTAS FIXAS */}
        <Route path="/sobre" element={<UpdatesPage />} />
        <Route path="/recurso/:id" element={<Features />} />

        {/* ROTA DINÂMICA VALIDADA */}
        <Route
          path="/:tipo"
          element={<FerramentasGuard todosModulos={MODULOS_DATA} />}
        />

        {/* 404 */}
        <Route path="/404" element={<h1>404: Página Não Encontrada</h1>} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>

      {/*<ChatBot />*/}
      <ChatBotStylized />
      <Footer />
    </BrowserRouter>
  );
}

export default App;
