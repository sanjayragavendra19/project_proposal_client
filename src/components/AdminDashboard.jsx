import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import authService from '../services/authService';
import proposalService from '../services/proposalService';

const AdminDashboard = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = authService.getCurrentUser();

  useEffect(() => {
    fetchAllProposals();
  }, []);

  const fetchAllProposals = async () => {
    try {
      const response = await proposalService.getAll();
      setProposals(response.data);
    } catch (error) {
      console.error('Error fetching proposals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/login';
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Admin Dashboard</h1>
        <p>Welcome, Professor {user.username}!</p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '20px' }}>
          <Link to="/view" className="nav-link"> All Proposals</Link>
          <Link to="/trash" className="nav-link"> Trash Bin</Link>
          <button onClick={handleLogout} className="nav-link" style={{ border: 'none' }}>
            🚪 Logout
          </button>
        </div>
      </div>

      <div className="card">
        <h2>System Overview</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' }}>
          <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f7fafc', borderRadius: '8px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}></div>
            <h3>Total Proposals</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{proposals.length}</p>
          </div>
          <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#fffaf0', borderRadius: '8px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}></div>
            <h3>Pending Review</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
              {proposals.filter(p => p.status === 'Pending').length}
            </p>
          </div>
          <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f0fff4', borderRadius: '8px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>✅</div>
            <h3>Approved</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
              {proposals.filter(p => p.status === 'Approved').length}
            </p>
          </div>
          <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#fef5e7', borderRadius: '8px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>❌</div>
            <h3>Rejected</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
              {proposals.filter(p => p.status === 'Rejected').length}
            </p>
          </div>
        </div>
      </div>

      <div className="card">
        <h2>Recent Submissions</h2>
        {loading ? (
          <div className="loading">Loading...</div>
        ) : proposals.length === 0 ? (
          <div className="empty-state">No proposals submitted yet.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f7fafc' }}>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Student</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Project Title</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {proposals.slice(0, 10).map((proposal) => (
                  <tr key={proposal.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '12px' }}>{proposal.studentName}</td>
                    <td style={{ padding: '12px' }}>{proposal.projectTitle}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        backgroundColor: 
                          proposal.status === 'Approved' ? '#c6f6d5' :
                          proposal.status === 'Rejected' ? '#fed7d7' : '#fef5e7',
                        color:
                          proposal.status === 'Approved' ? '#22543d' :
                          proposal.status === 'Rejected' ? '#742a2a' : '#744210'
                      }}>
                        {proposal.status || 'Pending'}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <Link 
                        to={`/view`}
                        style={{ 
                          padding: '4px 8px', 
                          fontSize: '12px', 
                          backgroundColor: '#4299e1', 
                          color: 'white', 
                          textDecoration: 'none', 
                          borderRadius: '4px' 
                        }}
                      >
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;