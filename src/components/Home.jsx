import React from 'react';
import { Link } from 'react-router-dom';
import authService from '../services/authService';

const Home = () => {
  const isAuthenticated = authService.isAuthenticated();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    try {
      authService.logout();
      window.location.reload();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Welcome to the Project Proposal Review Portal</h1>
        <p>Streamline your project proposal submission and review process</p>
        <nav className="nav">
          {isAuthenticated ? (
            <>
              {user.role === 'STUDENT' ? (
                <Link to="/student-dashboard" className="nav-link">Student Dashboard</Link>
              ) : (
                <Link to="/admin-dashboard" className="nav-link">Admin Dashboard</Link>
              )}
              <button onClick={handleLogout} className="nav-link" style={{ border: 'none' }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Register</Link>
            </>
          )}
        </nav>
      </div>
      
      <div className="card">
        <h2 style={{color: '#2d3748', marginBottom: '20px', fontSize: '1.8rem'}}>Features</h2>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px'}}>
          <div style={{textAlign: 'center', padding: '20px'}}>
            <div style={{fontSize: '3rem', marginBottom: '10px'}}>📝</div>
            <h3 style={{color: '#4a5568', marginBottom: '10px'}}>Easy Submission</h3>
            <p style={{color: '#718096'}}>Submit your project proposals with a simple, intuitive form</p>
          </div>
          <div style={{textAlign: 'center', padding: '20px'}}>
            <div style={{fontSize: '3rem', marginBottom: '10px'}}>👀</div>
            <h3 style={{color: '#4a5568', marginBottom: '10px'}}>Quick Review</h3>
            <p style={{color: '#718096'}}>View and manage all submitted proposals in one place</p>
          </div>
          <div style={{textAlign: 'center', padding: '20px'}}>
            <div style={{fontSize: '3rem', marginBottom: '10px'}}>⚡</div>
            <h3 style={{color: '#4a5568', marginBottom: '10px'}}>Fast & Secure</h3>
            <p style={{color: '#718096'}}>Built with modern technology for optimal performance</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;