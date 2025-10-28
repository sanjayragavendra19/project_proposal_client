import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import proposalService from '../services/proposalService';
import authService from '../services/authService';

const ViewProposals = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [reviewForm, setReviewForm] = useState({});
  const [showReviewModal, setShowReviewModal] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const user = authService.getCurrentUser();
  const isAdmin = authService.isAdmin();
  const isAuthenticated = authService.isAuthenticated();

  const fetchProposals = async () => {
    try {
      setLoading(true);
      const response = isAuthenticated ? 
        await proposalService.getAll(user.username) : 
        await proposalService.getAll();
      setProposals(response.data);
    } catch (error) {
      console.error('Error fetching proposals:', error);
      setError('Failed to load proposals. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  const handleEdit = (proposal) => {
    setEditingId(proposal.id);
    setEditForm({
      studentName: proposal.studentName || '',
      studentId: proposal.studentId || '',
      projectTitle: proposal.projectTitle || '',
      description: proposal.description || ''
    });
  };

  const handleSaveEdit = async (id) => {
    try {
      const username = isAuthenticated ? user.username : null;
      await proposalService.update(id, editForm, username);
      setEditingId(null);
      fetchProposals();
    } catch (error) {
      setError('Failed to update proposal');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this proposal?')) {
      try {
        const username = isAuthenticated ? user.username : null;
        await proposalService.delete(id, username);
        setError('');
        fetchProposals();
      } catch (error) {
        console.error('Delete error:', error);
        if (error.response?.status === 404) {
          setError('Proposal not found');
        } else {
          setError('Failed to delete proposal');
        }
      }
    }
  };

  const handleReview = (proposal) => {
    setShowReviewModal(proposal.id);
    setReviewForm({
      status: proposal.status || 'Pending',
      reviewComments: proposal.reviewComments || ''
    });
  };

  const handleSaveReview = async (id) => {
    try {
      await proposalService.addReviewerComment(id, reviewForm);
      setShowReviewModal(null);
      fetchProposals();
    } catch (error) {
      console.error('Review save failed:', error);
      setError('Failed to save review');
    }
  };

  const filteredProposals = React.useMemo(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    return proposals.filter(proposal => {
      const matchesStatus = statusFilter === 'All' || proposal.status === statusFilter;
      const matchesSearch = searchTerm === '' || 
        (proposal.studentName && proposal.studentName.toLowerCase().includes(lowerSearchTerm)) ||
        (proposal.projectTitle && proposal.projectTitle.toLowerCase().includes(lowerSearchTerm)) ||
        (proposal.description && proposal.description.toLowerCase().includes(lowerSearchTerm));
      return matchesStatus && matchesSearch;
    });
  }, [proposals, statusFilter, searchTerm]);

  return (
    <div className="container">
      <div className="header">
        <h1>{isAdmin ? 'All Project Proposals' : 'My Proposals'}</h1>
        <p>{isAdmin ? 'Review and manage all submitted project proposals' : 'View your submitted proposals and their status'}</p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '20px' }}>
          <Link to="/" className="nav-link">← Back to Home</Link>
          {isAuthenticated && !isAdmin && <Link to="/submit" className="nav-link">+ New Proposal</Link>}
          {isAuthenticated && isAdmin && <Link to="/trash" className="nav-link">🗑️ Trash Bin</Link>}
          <button onClick={React.useCallback(() => fetchProposals(), [fetchProposals])} className="nav-link" style={{ border: 'none' }}>
            🔄 Refresh
          </button>
        </div>
      </div>

      <div className="card">
        <div style={{ marginBottom: '20px', display: 'flex', gap: '20px', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
          <div>
            <input
              type="text"
              placeholder="Search proposals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', minWidth: '200px' }}
            />
          </div>
          <div>
            <label>Filter by Status: </label>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ marginLeft: '10px', padding: '8px' }}
            >
              <option value="All">All</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {error && <div className="error">⚠ {error}</div>}
        
        {loading ? (
          <div className="loading">⏳ Loading proposals...</div>
        ) : filteredProposals.length === 0 ? (
          <div className="empty-state">No proposals found.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f7fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Student Name</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Project Title</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Description</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Review Comments</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProposals.map((proposal) => (
                  <tr key={proposal.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '12px' }}>
                      {editingId === proposal.id ? (
                        <input
                          type="text"
                          value={editForm.studentName}
                          onChange={(e) => setEditForm({...editForm, studentName: e.target.value})}
                          style={{ width: '100%', padding: '4px' }}
                        />
                      ) : (
                        proposal.studentName || 'N/A'
                      )}
                    </td>
                    <td style={{ padding: '12px' }}>
                      {editingId === proposal.id ? (
                        <input
                          type="text"
                          value={editForm.projectTitle}
                          onChange={(e) => setEditForm({...editForm, projectTitle: e.target.value})}
                          style={{ width: '100%', padding: '4px' }}
                        />
                      ) : (
                        proposal.projectTitle
                      )}
                    </td>
                    <td className="description-cell">
                      {editingId === proposal.id ? (
                        <textarea
                          value={editForm.description}
                          onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                          className="edit-textarea"
                        />
                      ) : (
                        <div className="description-text">{proposal.description}</div>
                      )}
                    </td>
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
                    <td style={{ padding: '12px', maxWidth: '150px' }}>
                      <div style={{ wordWrap: 'break-word', fontSize: '14px' }}>
                        {proposal.reviewComments || 'No comments'}
                      </div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                        {editingId === proposal.id ? (
                          <>
                            <button
                              onClick={() => handleSaveEdit(proposal.id)}
                              style={{ padding: '4px 8px', fontSize: '12px', backgroundColor: '#48bb78', color: 'white', border: 'none', borderRadius: '4px' }}
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              style={{ padding: '4px 8px', fontSize: '12px', backgroundColor: '#718096', color: 'white', border: 'none', borderRadius: '4px' }}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEdit(proposal)}
                              style={{ padding: '4px 8px', fontSize: '12px', backgroundColor: '#4299e1', color: 'white', border: 'none', borderRadius: '4px' }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(proposal.id)}
                              style={{ padding: '4px 8px', fontSize: '12px', backgroundColor: '#f56565', color: 'white', border: 'none', borderRadius: '4px' }}
                            >
                              Delete
                            </button>
                            {isAdmin && (
                              <button
                                onClick={() => handleReview(proposal)}
                                style={{ padding: '4px 8px', fontSize: '12px', backgroundColor: '#ed8936', color: 'white', border: 'none', borderRadius: '4px' }}
                              >
                                Review
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showReviewModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '8px',
            width: '400px',
            maxWidth: '90vw'
          }}>
            <h3>Add Review</h3>
            <div style={{ marginBottom: '15px' }}>
              <label>Status:</label>
              <select
                value={reviewForm.status}
                onChange={(e) => setReviewForm({...reviewForm, status: e.target.value})}
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              >
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label>Comments:</label>
              <textarea
                value={reviewForm.reviewComments}
                onChange={(e) => setReviewForm({...reviewForm, reviewComments: e.target.value})}
                style={{ width: '100%', padding: '8px', marginTop: '5px', minHeight: '80px' }}
                placeholder="Enter review comments..."
              />
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowReviewModal(null)}
                style={{ padding: '8px 16px', backgroundColor: '#718096', color: 'white', border: 'none', borderRadius: '4px' }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveReview(showReviewModal)}
                style={{ padding: '8px 16px', backgroundColor: '#48bb78', color: 'white', border: 'none', borderRadius: '4px' }}
              >
                Save Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewProposals;
