import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import proposalService from '../services/proposalService';
import authService from '../services/authService';

const TrashBin = () => {
  const [deletedProposals, setDeletedProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = authService.getCurrentUser();
  const isAdmin = authService.isAdmin();

  const fetchDeletedProposals = async () => {
    try {
      setLoading(true);
      const response = await proposalService.getTrash();
      setDeletedProposals(response.data);
    } catch (error) {
      console.error('Error fetching deleted proposals:', error);
      setError('Failed to load deleted proposals.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeletedProposals();
  }, []);

  const handleRestore = async (id) => {
    if (window.confirm('Are you sure you want to restore this proposal?')) {
      try {
        await proposalService.restore(id);
        fetchDeletedProposals();
      } catch (error) {
        setError('Failed to restore proposal');
      }
    }
  };

  if (!isAdmin) {
    return (
      <div className="container">
        <div className="header">
          <h1>Access Denied</h1>
          <p>Only administrators can access the trash bin.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <h1>🗑️ Trash Bin</h1>
        <p>Manage deleted proposals</p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '20px' }}>
          <Link to="/view" className="nav-link">← Back to Proposals</Link>
          <button onClick={fetchDeletedProposals} className="nav-link" style={{ border: 'none' }}>
            🔄 Refresh
          </button>
        </div>
      </div>

      <div className="card">
        {error && <div className="error">⚠ {error}</div>}
        
        {loading ? (
          <div className="loading">⏳ Loading deleted proposals...</div>
        ) : deletedProposals.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🗑️</div>
            <h3>Trash bin is empty</h3>
            <p>No deleted proposals found.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="proposals-table">
              <thead>
                <tr style={{ backgroundColor: '#f7fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Student Name</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Student ID</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Project Title</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Description</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {deletedProposals.map((proposal) => (
                  <tr key={proposal.id} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: '#fef5e7' }}>
                    <td style={{ padding: '12px' }}>{proposal.studentName || 'N/A'}</td>
                    <td style={{ padding: '12px' }}>{proposal.studentId || 'N/A'}</td>
                    <td style={{ padding: '12px' }}>{proposal.projectTitle}</td>
                    <td style={{ padding: '12px', maxWidth: '200px' }}>
                      <div style={{ wordWrap: 'break-word' }}>{proposal.description}</div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        backgroundColor: '#fed7d7',
                        color: '#742a2a'
                      }}>
                        Deleted
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <button
                        onClick={() => handleRestore(proposal.id)}
                        className="btn btn-restore"
                      >
                        🔄 Restore
                      </button>
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

export default TrashBin;