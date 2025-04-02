import { Navigate } from 'react-router-dom';

export default function ProtectedAdminRoute({ children }) {
  const isAdmin = localStorage.getItem('userType') === 'admin';
  
  if (!isAdmin) {
    return <Navigate to="/exercises" replace />;
  }
  
  return children;
}