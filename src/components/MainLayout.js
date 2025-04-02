import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/MainLayout.css';

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const userType = localStorage.getItem('userType') || 'user';
  const userName = localStorage.getItem('user') || 'Usuário';

  const handleLogout = () => {
    if (window.confirm('Tem certeza que deseja sair?')) {
      // Clear all auth data
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('user');
      localStorage.removeItem('userType');
      
      // Redirect to login and reload to clear state
      navigate('/login');
      window.location.reload();
    }
  };

  // Check if current route is active
  const isActive = (path) => location.pathname.includes(path);

  return (
    <div className="app-container">
      <aside className="sidebar">
        <nav>
          <div className="sidebar-header">
            <h2>Gym Planner</h2>
            <div className="user-info">
              <span className="material-icons">account_circle</span>
              <div>
                <span className="user-name">{userName}</span>
                <span className={`user-type ${userType}`}>
                  {userType === 'admin' ? 'Administrador' : 'Usuário'}
                </span>
              </div>
            </div>
          </div>
          
          <ul className="nav-menu">
            {/* Common routes for all users */}
            <li>
              <Link 
                to="/exercises" 
                className={`nav-link ${isActive('exercises') ? 'active' : ''}`}
              >
                <span className="material-icons">fitness_center</span>
                Exercícios
              </Link>
            </li>
            <li>
              <Link 
                to="/schedules" 
                className={`nav-link ${isActive('schedules') ? 'active' : ''}`}
              >
                <span className="material-icons">calendar_today</span>
                Agendamentos
              </Link>
            </li>

            {/* Admin-only routes */}
            {userType === 'admin' && (
              <>
                <li>
                  <Link 
                    to="/machines" 
                    className={`nav-link ${isActive('machines') ? 'active' : ''}`}
                  >
                    <span className="material-icons">build</span>
                    Máquinas
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/users" 
                    className={`nav-link ${isActive('users') ? 'active' : ''}`}
                  >
                    <span className="material-icons">people</span>
                    Usuários
                  </Link>
                </li>
              </>
            )}

            {/* Logout button */}
            <li className="logout-item">
              <button onClick={handleLogout} className="logout-button">
                <span className="material-icons">logout</span>
                Sair
              </button>
            </li>
          </ul>
        </nav>
      </aside>
      
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}