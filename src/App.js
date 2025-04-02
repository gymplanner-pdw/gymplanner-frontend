import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import MainLayout from './components/MainLayout';
import Exercises from './pages/Exercises';
import Schedules from './pages/Schedules';
import Machines from './pages/Machines';
import Users from './pages/Users'; 
import ProtectedRoute from './components/ProtectedRoute';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/exercises" replace />} />
        
        {/* Protected Routes (require authentication) */}
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          {/* Common user routes */}
          <Route path="/exercises" element={<Exercises />} />
          <Route path="/schedules" element={<Schedules />} />
          
          {/* Admin-only routes */}
          <Route element={<ProtectedAdminRoute />}>
            <Route path="/machines" element={<Machines />} />
            <Route path="/users" element={<Users />} />
          </Route>
          
          {/* Catch-all for invalid routes */}
          <Route path="*" element={<Navigate to="/exercises" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}