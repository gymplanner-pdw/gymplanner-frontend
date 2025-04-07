import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedAdminRoute({ children }) {

  const userType = localStorage.getItem('userType');
  console.log('ProtectedAdminRoute - userType:', userType);
  

  if (userType !== 'admin') {
    console.log('Redirecionando para /exercises');
    return <Navigate to="/exercises" replace />;
  }
  

  return <>{children}</>;
}