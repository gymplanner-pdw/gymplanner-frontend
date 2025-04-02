import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem('token');
  
  if (!isAuthenticated) {
    // Limpa qualquer dado residual ao redirecionar
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    return <Navigate to="/login" replace />;
  }
  
  return children;
}