import { useState, useEffect } from 'react';
import '../styles/Users.css';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    type: 'user'
  });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Load mock data - replace with API call in production
  useEffect(() => {
    const mockUsers = [
      { id: 1, name: 'Administrador', email: 'admin@academia.com', type: 'admin', password: '12345' },
      { id: 2, name: 'João Silva', email: 'joao@email.com', type: 'user', password: '12345' },
      { id: 3, name: 'Maria Souza', email: 'maria@email.com', type: 'user', password: '12345' }
    ];
    setUsers(mockUsers);
  }, []);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      alert('Preencha todos os campos obrigatórios!');
      return;
    }

    if (editingId) {
      setUsers(users.map(user =>
        user.id === editingId ? { ...newUser, id: editingId } : user
      ));
    } else {
      setUsers([...users, { ...newUser, id: Date.now() }]);
    }

    setNewUser({ name: '', email: '', password: '', type: 'user' });
    setEditingId(null);
  };

  const handleEdit = (user) => {
    setNewUser(user);
    setEditingId(user.id);
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      setUsers(users.filter(user => user.id !== id));
    }
  };

  const handleTypeChange = (userId, newType) => {
    setUsers(users.map(user =>
      user.id === userId ? { ...user, type: newType } : user
    ));
  };

  return (
    <div className="users-container">
      <h1>Gerenciamento de Usuários</h1>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar usuários..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="user-form">
        <h2>{editingId ? 'Editar' : 'Adicionar'} Usuário</h2>
        
        <div className="form-grid">
          <div className="form-group">
            <label>Nome*</label>
            <input
              type="text"
              placeholder="Nome completo"
              value={newUser.name}
              onChange={(e) => setNewUser({...newUser, name: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Email*</label>
            <input
              type="email"
              placeholder="email@exemplo.com"
              value={newUser.email}
              onChange={(e) => setNewUser({...newUser, email: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Senha*</label>
            <input
              type="password"
              placeholder="••••••••"
              value={newUser.password}
              onChange={(e) => setNewUser({...newUser, password: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Tipo*</label>
            <select
              value={newUser.type}
              onChange={(e) => setNewUser({...newUser, type: e.target.value})}
              required
            >
              <option value="user">Usuário</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button onClick={handleAddUser} className="submit-btn">
            {editingId ? 'Atualizar' : 'Adicionar'} Usuário
          </button>

          {editingId && (
            <button
              onClick={() => {
                setEditingId(null);
                setNewUser({ name: '', email: '', password: '', type: 'user' });
              }}
              className="cancel-btn"
            >
              Cancelar
            </button>
          )}
        </div>
      </div>

      <div className="user-list">
        <h2>Lista de Usuários ({filteredUsers.length})</h2>
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Tipo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <select
                    value={user.type}
                    onChange={(e) => handleTypeChange(user.id, e.target.value)}
                    className={`type-select ${user.type}`}
                    disabled={user.email === 'admin@academia.com'}
                  >
                    <option value="user">Usuário</option>
                    <option value="admin">Administrador</option>
                  </select>
                </td>
                <td className="actions">
                  <button 
                    onClick={() => handleEdit(user)}
                    className="edit-btn"
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => handleDelete(user.id)}
                    className="delete-btn"
                    disabled={user.email === 'admin@academia.com'}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}