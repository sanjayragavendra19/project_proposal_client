import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import proposalService from '../services/proposalService';

const EditProposal = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [proposal, setProposal] = useState({ studentName: '', studentId: '', projectTitle: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProposal = async () => {
      try {
        const response = await proposalService.getAll();
        const proposalData = response.data.find(p => p.id === parseInt(id));
        if (proposalData) {
          setProposal({
            studentName: proposalData.studentName || '',
            studentId: proposalData.studentId || '',
            projectTitle: proposalData.projectTitle || '',
            description: proposalData.description || ''
          });
        } else {
          setError('Proposal not found');
        }
      } catch (error) {
        setError('Failed to load proposal');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProposal();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (!proposal.studentName.trim() || !proposal.studentId.trim() || !proposal.projectTitle.trim() || !proposal.description.trim()) {
      setError('All fields are required');
      setIsSubmitting(false);
      return;
    }

    try {
      await proposalService.update(id, proposal);
      navigate('/view');
    } catch (error) {
      setError('Failed to update proposal');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading"> Loading proposal...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Edit Proposal</h1>
        <p>Update your project proposal details</p>
        <Link to="/view" className="nav-link back-link">
          ← Back to Proposals
        </Link>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="form">
          {error && <div className="error">⚠ {error}</div>}

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

          <div className="form-actions">
            <button type="submit" className="btn" disabled={isSubmitting}>
              {isSubmitting ? '⏳ Updating...' : '💾 Update Proposal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProposal;