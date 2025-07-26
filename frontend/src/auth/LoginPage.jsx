import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosConfig';

const LoginPage = () => {
  // 1. Ubah state 'username' menjadi 'email'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 4. Ubah object yang dikirim ke Axios: dari 'username' menjadi 'email'
      const response = await apiClient.post('http://localhost:4000/api/auth/login', {
        email, // Mengirim state 'email'
        password,
      });

      // Jika login berhasil, backend akan mengirimkan token dan role
      const { token, role, full_name, employee_id } = response.data; // Tambahkan employee_id jika perlu di frontend

      // Simpan token dan role ke localStorage
      localStorage.setItem('jwtToken', token);
      localStorage.setItem('userRole', role);
      localStorage.setItem('userName', full_name);
      localStorage.setItem('employeeId', employee_id); // Simpan employee_id juga

      // Redirect berdasarkan role
      switch (role) {
        case 'KARYAWAN':
          navigate('/dashboard/karyawan');
          break;
        case 'HRD':
          navigate('/dashboard/hrd');
          break;
        case 'KEUANGAN':
          navigate('/dashboard/keuangan');
          break;
        default:
          setError('Role tidak dikenal dari server.');
          localStorage.clear(); // Hapus token jika role tidak dikenal
          break;
      }

    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Terjadi kesalahan saat login. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
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
            {/* 2. Ubah htmlFor dan id dari 'username' menjadi 'email' */}
            <label htmlFor="email" className="form-label">Email</label>
            <input
              id="email" // Ubah id
              type="email" // Tipe input bisa email untuk validasi browser
              className="form-control"
              placeholder="Enter your email..." // 3. Ubah placeholder
              value={email} // Menggunakan state 'email'
              onChange={(e) => setEmail(e.target.value)} // Mengubah state 'email'
              required
              autoFocus
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              id="password"
              type="password"
              className="form-control"
              placeholder="Enter password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;