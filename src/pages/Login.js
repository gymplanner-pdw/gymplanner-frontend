import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Usuário padrão para desenvolvimento
  const defaultUser = {
    email: "admin@academia.com",
    password: "12345",
    token: "fake-jwt-token",
    id: "001",
    name: "Administrador"
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (email === defaultUser.email && password === defaultUser.password) {
      localStorage.setItem('token', defaultUser.token);
      localStorage.setItem('user', JSON.stringify({
        id: defaultUser.id,
        name: defaultUser.name,
        email: defaultUser.email
      }));
      navigate('/home');
    } else {
      setError('Credenciais inválidas! Use admin@academia.com / 12345');
    }
  };

  return (
    <div className="login-container">
      <h1>Academia Fit</h1>
      <form onSubmit={handleLogin}>
        {error && <div className="error-message">{error}</div>}
        
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Entrar</button>
      </form>

      <div className="test-credentials">
        <p><strong>Usuário teste:</strong></p>
        <p>Email: <code>admin@academia.com</code></p>
        <p>Senha: <code>12345</code></p>
      </div>

      {/* Componente GoogleLogin agora funcionará corretamente */}
      <div className="google-login">
        <GoogleLogin
          onSuccess={credentialResponse => {
            const { email, name, sub } = jwtDecode(credentialResponse.credential);
            localStorage.setItem('token', `google-${sub}`);
            localStorage.setItem('user', JSON.stringify({ email, name }));
            navigate('/home');
          }}
          onError={() => {
            setError('Falha no login com Google');
          }}
        />
      </div>
    </div>
  );
}