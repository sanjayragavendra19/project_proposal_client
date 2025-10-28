import React, { useState } from 'react';
import proposalService from '../services/proposalService';

const UpdateEvent = ({ proposalId, onUpdate }) => {
  const [proposal, setProposal] = useState({ projectTitle: '', description: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    try {
      await proposalService.update(proposalId, proposal);
      setSuccess(true);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Update failed:', error);
      setError('Failed to update proposal. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">✅ Proposal updated successfully!</div>}

      <input
        type="text"
        value={proposal.projectTitle}
        onChange={(e) => setProposal({ ...proposal, projectTitle: e.target.value })}
        placeholder="Project Title"
        required
      />
      <textarea
        value={proposal.description}
        onChange={(e) => setProposal({ ...proposal, description: e.target.value })}
        placeholder="Description"
        required
      />
      <button type="submit">Update</button>
    </form>
  );
};

export default UpdateEvent;
