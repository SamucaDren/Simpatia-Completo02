import { Link } from 'react-router-dom';
import './Header.css';

export default function Header() {
  return (
    <header className="app-header">
      <img
        src="/logo-simpatia.png"
        alt="Simpat.IA"
        className="app-header__logo"
        onError={e => { e.target.style.display = 'none'; }}
      />
      <div className="app-header__spacer" />
      <nav className="app-header__nav">
        <Link to="/" className="app-header__link">Início</Link>
        <Link to="/dashboard" className="app-header__link">Estatísticas</Link>
      </nav>
    </header>
  );
}
