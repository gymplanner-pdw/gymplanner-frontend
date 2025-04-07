import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import MainLayout from './components/MainLayout';
import Workouts from './pages/Workouts'; 
import Schedules from './pages/Schedules';
import Machines from './pages/Machines';
import Users from './pages/Users';
import ProtectedRoute from './components/ProtectedRoute';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={<Navigate to="/login" replace />} /> 
        
        {/* Protected Routes (require authentication) */}
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          {/* Common user routes */}
          <Route path="/workouts" element={<Workouts />} /> 
          <Route path="/schedules" element={<Schedules />} />
          
          {/* Admin-only routes */}
          <Route
            path="/machines"
            element={
              <ProtectedAdminRoute>
                <Machines />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedAdminRoute>
                <Users />
              </ProtectedAdminRoute>
            }
          />

          <Route path="*" element={<Navigate to="/workouts" replace />} /> 
        </Route>
      </Routes>
    </BrowserRouter>
  );
}