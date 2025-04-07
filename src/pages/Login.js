import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
//import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import '../styles/Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    localStorage.removeItem('userType');
  }, []);

  const testUsers = {
    admin: {
      email: "admin@academia.com",
      password: "12345",
      token: "fake-admin-token",
      id: "001",
      name: "Administrador",
      type: "admin"
    },
    user: {
      email: "usuario@academia.com",
      password: "12345",
      token: "fake-user-token",
      id: "002",
      name: "Usuário Padrão",
      type: "user"
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (process.env.NODE_ENV === 'development') {
      const user = Object.values(testUsers).find(
        u => u.email === email && u.password === password
      );

      if (user) {
        localStorage.setItem('token', user.token);
        localStorage.setItem('userId', user.id);
        localStorage.setItem('user', user.name);
        localStorage.setItem('userType', user.type);
        navigate('/exercises');
        return;
      } else {
        setError('Credenciais inválidas!');
        return;
      }
    }

    try {
      const response = await fetch('https://backend-ks2k.onrender.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.id);
        localStorage.setItem('user', data.name || email.split('@')[0]);
        localStorage.setItem('userType', data.userType || 'user');
        navigate('/exercises');
      } else {
        setError(data.message || 'Credenciais inválidas');
      }
    } catch (error) {
      setError('Erro de conexão com o servidor');
      console.error('Login error:', error);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const { email, name, sub } = jwtDecode(credentialResponse.credential);
      
      const response = await fetch('https://backend-ks2k.onrender.com/auth/google/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          fullName: name, 
          password: sub 
        })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.id);
        localStorage.setItem('user', name || email.split('@')[0]);
        localStorage.setItem('userType', data.userType || 'user');
        navigate('/exercises');
      } else {
        setError('Falha no login com Google');
      }
    } catch (error) {
      setError('Erro ao conectar com o Google');
      console.error('Google login error:', error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Gym Planner</h1>
          <p>Sua jornada fitness começa aqui</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-button">
            Entrar
          </button>
        </form>

        {/* <div className="login-divider">
          <span>OU</span>
        </div>

        <div className="social-login">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => setError('Falha no login com Google')}
            theme="filled_blue"
            size="large"
            text="signin_with"
          />
        </div>

        <div className="login-footer">
          {process.env.NODE_ENV === 'development' && (
            <div className="test-credentials">
              <h4>Usuários para teste:</h4>
              <div className="user-credential">
                <strong>Admin:</strong> admin@academia.com / 12345
              </div>
              <div className="user-credential">
                <strong>Usuário:</strong> usuario@academia.com / 12345
              </div>
            </div>
          )}
        </div> */}
        
      </div>
    </div>
  );
}