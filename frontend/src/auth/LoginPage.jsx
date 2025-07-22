import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const dummyUsers = [
  { username: 'karyawan', password: 'karyawan', role: 'karyawan' },
  { username: 'hrd', password: 'hrd', role: 'hrd' },
  { username: 'keuangan', password: 'keuangan', role: 'keuangan' },
];

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      const foundUser = dummyUsers.find(
        (user) => user.username === username && user.password === password
      );

      if (foundUser) {
        localStorage.setItem('token', 'dummy-token');
        localStorage.setItem('role', foundUser.role);

        switch (foundUser.role) {
  case 'karyawan':
    navigate('/dashboard/karyawan');
    break;
  case 'hrd':
    navigate('/dashboard/hrd');
    break;
  case 'keuangan':
    navigate('/dashboard/keuangan');
    break;
  default:
    setError('Role tidak dikenal.');
}

      } else {
        setError('Username atau password salah!');
      }

      setLoading(false);
    }, 1000); 
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="text-center mb-4">
          <h3 className="fw-bold">Welcome back</h3>
          <p className="text-muted">Please log in to your account</p>
        </div>

        {error && (
          <div className="alert alert-danger text-center py-2" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label>
            <input id="username" type="text" className="form-control" placeholder="Enter username..." value={username}onChange={(e) => setUsername(e.target.value)}required autoFocus />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input id="password" type="password" className="form-control" placeholder="Enter password..." value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={loading}> {loading ? 'Signing in...' : 'Sign in'} </button>

          <p className="text-center mt-3 text-muted">
            Don’t have an account? <span className="text-primary" role="button">Sign up now</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;