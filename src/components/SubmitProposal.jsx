import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import proposalService from '../services/proposalService';
import authService from '../services/authService';

const SubmitProposal = () => {
  const [proposal, setProposal] = useState({ studentName: '', studentId: '', projectTitle: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('');
  const user = authService.getCurrentUser();
  const isAuthenticated = authService.isAuthenticated();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess(false);

    if (!proposal.studentName.trim() || !proposal.studentId.trim() || !proposal.projectTitle.trim() || !proposal.description.trim()) {
      setError('All fields are required');
      setIsSubmitting(false);
      return;
    }

    try {
      if (isAuthenticated) {
        await proposalService.create(proposal, user.username);
      } else {
        await proposalService.create(proposal);
      }
      setProposal({ studentName: '', studentId: '', projectTitle: '', description: '' });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (error) {
      console.error('Error submitting proposal:', error);
      if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
        setError('Cannot connect to server. Please ensure the backend is running on port 8080.');
      } else if (error.response?.status === 400) {
        setError('Invalid data. Please check your input and try again.');
      } else if (error.response?.status >= 500) {
        setError('Server error. Please try again later.');
      } else {
        setError(`Failed to submit proposal: ${error.response?.data?.message || error.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const testConnection = async () => {
    setConnectionStatus('Testing connection...');
    try {
      const response = await proposalService.testConnection();
      setConnectionStatus(`✅ Connected! Found ${response.data.length} proposals`);
    } catch (error) {
      console.error('Connection test failed:', error);
      setConnectionStatus(`❌ Connection failed: ${error.message}`);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Submit Project Proposal</h1>
        <p>Share your innovative project ideas with our team</p>
        <Link to="/" className="nav-link" style={{ display: 'inline-block', marginTop: '10px' }}>
          ← Back to Home
        </Link>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="form">
          {success && <div className="success">✓ Proposal submitted successfully!</div>}
          {error && <div className="error">⚠ {error}</div>}
          {connectionStatus && (
            <div className={connectionStatus.includes('✅') ? 'success' : 'error'}>
              {connectionStatus}
            </div>
          )}

          <div className="form-group">
            <label>Student Name *</label>
            <input
              type="text"
              className="form-input"
              value={proposal.studentName}
              onChange={(e) => setProposal({ ...proposal, studentName: e.target.value })}
              placeholder="Enter student name"
              required
            />
          </div>

          <div className="form-group">
            <label>Student ID *</label>
            <input
              type="text"
              className="form-input"
              value={proposal.studentId}
              onChange={(e) => setProposal({ ...proposal, studentId: e.target.value })}
              placeholder="Enter student ID"
              required
            />
          </div>

          <div className="form-group">
            <label>Project Title *</label>
            <input
              type="text"
              className="form-input"
              value={proposal.projectTitle}
              onChange={(e) => setProposal({ ...proposal, projectTitle: e.target.value })}
              placeholder="Enter project title"
              required
            />
          </div>

          <div className="form-group">
            <label>Project Description *</label>
            <textarea
              className="form-textarea"
              value={proposal.description}
              onChange={(e) => setProposal({ ...proposal, description: e.target.value })}
              placeholder="Enter project description"
              required
            />
          </div>

          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <button type="submit" className="btn" disabled={isSubmitting} style={{ marginRight: '15px' }}>
              {isSubmitting ? '⏳ Submitting...' : '🚀 Submit Proposal'}
            </button>
            {/* <button
              type="button"
              onClick={testConnection}
              className="btn"
              style={{ background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)' }}
            >
              🔗 Test Connection
            </button> */}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitProposal;
