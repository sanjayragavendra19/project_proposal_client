import { Routes, Route } from 'react-router-dom';
import Home from '../components/Home';
import SubmitProposal from '../components/SubmitProposal';
import ViewProposals from '../components/ViewProposals';
import EditProposal from '../components/EditProposal';
import TrashBin from '../components/TrashBin';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/submit" element={<SubmitProposal />} />
      <Route path="/view" element={<ViewProposals />} />
      <Route path="/edit/:id" element={<EditProposal />} />
      <Route path="/trash" element={<TrashBin />} />
    </Routes>
  );
};

export default AppRoutes;