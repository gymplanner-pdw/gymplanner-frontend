import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Home() {
  return (
    <div>
      <Navbar />
      <div className="home-menu">
        <h1>Bem-vindo ao Sistema da Academia</h1>
        <div className="menu-options">
          <Link to="/exercises" className="menu-card">
            <h2>Exercícios</h2>
            <p>Gerencie seus exercícios</p>
          </Link>
          <Link to="/schedules" className="menu-card">
            <h2>Agendamentos</h2>
            <p>Gerencie seus horários</p>
          </Link>
        </div>
      </div>
    </div>
  );
}