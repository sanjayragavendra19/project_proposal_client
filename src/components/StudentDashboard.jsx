import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import authService from '../services/authService';
import proposalService from '../services/proposalService';

const StudentDashboard = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = authService.getCurrentUser();

  useEffect(() => {
    fetchMyProposals();
  }, []);

  const fetchMyProposals = async () => {
    try {
      const response = await proposalService.getAll();
      // Filter proposals by current user (you'll need to modify backend to support this)
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
        <h1>Student Dashboard</h1>
        <p>Welcome, {user.username}!</p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '20px' }}>
          <Link to="/submit" className="nav-link"> Submit Proposal</Link>
          <Link to="/my-proposals" className="nav-link"> My Proposals</Link>
          <button onClick={handleLogout} className="nav-link" style={{ border: 'none' }}>
             Logout
          </button>
        </div>
      </div>

      <div className="card">
        <h2>Quick Stats</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' }}>
          <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f7fafc', borderRadius: '8px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}></div>
            <h3>Total Proposals</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{proposals.length}</p>
          </div>
          <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f0fff4', borderRadius: '8px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>✅</div>
            <h3>Approved</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
              {proposals.filter(p => p.status === 'Approved').length}
            </p>
          </div>
          <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#fffaf0', borderRadius: '8px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}></div>
            <h3>Pending</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
              {proposals.filter(p => p.status === 'Pending').length}
            </p>
          </div>
        </div>
      </div>

      <div className="card">
        <h2>Recent Proposals</h2>
        {loading ? (
          <div className="loading">Loading...</div>
        ) : proposals.length === 0 ? (
          <div className="empty-state">
            <p>No proposals submitted yet.</p>
            <Link to="/submit" className="btn">Submit Your First Proposal</Link>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f7fafc' }}>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Project Title</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Review Comments</th>
                </tr>
              </thead>
              <tbody>
                {proposals.slice(0, 5).map((proposal) => (
                  <tr key={proposal.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
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
                    <td style={{ padding: '12px' }}>{proposal.reviewComments || 'No comments'}</td>
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

export default StudentDashboard;