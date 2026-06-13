import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Quiz from "./pages/Quiz";
import Resultado from "./pages/Resultado";
import Dashboard from "./pages/Dashboard";
import Revisao from "./pages/Revisao";

export default function App() {
  return (
    <BrowserRouter basename="/quiz-simpatia">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/resultado" element={<Resultado />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/revisao/:id" element={<Revisao />} />
      </Routes>
    </BrowserRouter>
  );
}
