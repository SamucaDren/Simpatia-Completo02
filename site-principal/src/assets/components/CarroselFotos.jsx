import React, { useState, useEffect, useRef } from "react";
import "./CarroselFotos.css";
import EclipseGiratoria from "./EclipseGiratoria";

function CarroselFotos({ onFotoChange }) {
  const [fotoVisivel, setFotoVisivel] = useState(1);
  const intervaloRef = useRef(null);

  const mudarFoto = () => {
    setFotoVisivel((prevFoto) => (prevFoto === 1 ? 2 : 1));
  };

  const resetarIntervalo = () => {
    if (intervaloRef.current) clearInterval(intervaloRef.current);
    intervaloRef.current = setInterval(mudarFoto, 5000);
  };

  useEffect(() => {
    resetarIntervalo();
    return () => clearInterval(intervaloRef.current);
  }, []);

  const handleClick = (foto) => {
    setFotoVisivel(foto);
    resetarIntervalo();
  };

  useEffect(() => {
    if (onFotoChange) onFotoChange(fotoVisivel);
  }, [fotoVisivel, onFotoChange]);

  return (
    <div className="fotos">
      <div className="fundo"></div>
      <div
        fetchPriority="high"
        className={`foto2 ${fotoVisivel === 1 ? "visible" : ""}`}
      />
      <div
        fetchPriority="high"
        className={`foto1 ${fotoVisivel === 2 ? "visible" : ""}`}
      />

      <div className="menu">
        <span
          onClick={() => handleClick(1)}
          className={`item-menu ${fotoVisivel === 1 ? "active" : ""}`}
        ></span>
        <span
          onClick={() => handleClick(2)}
          className={`item-menu ${fotoVisivel === 2 ? "active" : ""}`}
        ></span>
      </div>

      <div className="eclipse-container">
        <EclipseGiratoria />
      </div>
    </div>
  );
}

export default CarroselFotos;
