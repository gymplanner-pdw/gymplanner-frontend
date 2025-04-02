import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <Link to="/home" style={styles.link}>Home</Link>
      <button onClick={handleLogout} style={styles.button}>
        Sair
      </button>
    </nav>
  );
}

const styles = {
  nav: {
    backgroundColor: '#333',
    padding: '1rem',
    display: 'flex',
    justifyContent: 'space-between'
  },
  link: {
    color: 'white',
    textDecoration: 'none'
  },
  button: {
    background: 'transparent',
    border: 'none',
    color: 'white',
    cursor: 'pointer'
  }
};