import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const Register = () => {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'STUDENT'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authService.register(userData);
      navigate('/login');
    } catch (error) {
      const errorMsg = typeof error.response?.data === 'string' 
        ? error.response.data 
        : error.response?.data?.message || error.message || 'Registration failed';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Register</h1>
        <p>Create your account</p>
      </div>

      <div className="card" style={{ maxWidth: '400px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit} className="form">
          {error && <div className="error">⚠ {error}</div>}
          
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              className="form-input"
              value={userData.username}
              onChange={(e) => setUserData({ ...userData, username: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              className="form-input"
              value={userData.email}
              onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-input"
              value={userData.password}
              onChange={(e) => setUserData({ ...userData, password: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Role</label>
            <select
              className="form-input"
              value={userData.role}
              onChange={(e) => setUserData({ ...userData, role: e.target.value })}
            >
              <option value="STUDENT">Student</option>
              <option value="ADMIN">Admin/Professor</option>
            </select>
          </div>

          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link to="/login">Already have an account? Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;