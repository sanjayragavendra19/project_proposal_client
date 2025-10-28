import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import StudentDashboard from './components/StudentDashboard';
import AdminDashboard from './components/AdminDashboard';
import SubmitProposal from './components/SubmitProposal';
import ViewProposals from './components/ViewProposals';
import TrashBin from './components/TrashBin';
import ProtectedRoute from './components/ProtectedRoute';
import authService from './services/authService';
import './App.css';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/student-dashboard" element={
        <ProtectedRoute requiredRole="STUDENT">
          <StudentDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin-dashboard" element={
        <ProtectedRoute requiredRole="ADMIN">
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/submit" element={<SubmitProposal />} />
      <Route path="/view" element={<ViewProposals />} />
      <Route path="/trash" element={
        <ProtectedRoute requiredRole="ADMIN">
          <TrashBin />
        </ProtectedRoute>
      } />
      <Route path="/unauthorized" element={
        <div className="container">
          <div className="header">
            <h1>Unauthorized</h1>
            <p>You don't have permission to access this page.</p>
          </div>
        </div>
      } />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <AppRoutes />
      </div>
    </Router>
  );
}

export default App;