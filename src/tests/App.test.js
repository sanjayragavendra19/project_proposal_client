import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppRoutes } from '../App'; // Ensure AppRoutes is exported
import "@testing-library/jest-dom"
const renderWithRoute = (route) =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <AppRoutes />
    </MemoryRouter>
  );

describe('App Component Routing and Component Rendering', () => {
  test('React_BuildUIComponents_renders Home component at default route', () => {
    renderWithRoute('/');
    expect(screen.getByText(/Welcome to the Project Proposal Review Portal/i)).toBeInTheDocument();
  });

  test('React_BuildUIComponents_renders SubmitProposal component at /submit route', () => {
    renderWithRoute('/submit');
    expect(screen.getByText(/Submit Project Proposal/i)).toBeInTheDocument();
  });

  test('React_BuildUIComponents_renders ViewProposals component at /view route', () => {
    renderWithRoute('/view');
    expect(screen.getByText(/All Project Proposals/i)).toBeInTheDocument();
  });

  test('React_BuildUIComponents_Home has both navigation links', () => {
    renderWithRoute('/');
    expect(screen.getByRole('link', { name: /Submit Proposal/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /View Proposals/i })).toBeInTheDocument();
  });

  test('React_UITestingAndResponsivenessFixes_renders not found message for unknown route', () => {
    renderWithRoute('/404');
    expect(screen.queryByText(/Welcome to the Project Proposal Review Portal/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Submit Project Proposal/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/All Project Proposals/i)).not.toBeInTheDocument();
  });
  test('React_BuildUIComponents_clicking Submit Proposal link navigates to SubmitProposal component', () => {
    renderWithRoute('/');
    fireEvent.click(screen.getByRole('link', { name: /Submit Proposal/i }));
    expect(screen.getByText(/Submit Project Proposal/i)).toBeInTheDocument();
  });

  test('React_BuildUIComponents_clicking View Proposals link navigates to ViewProposals component', () => {
    renderWithRoute('/');
    fireEvent.click(screen.getByRole('link', { name: /View Proposals/i }));
    expect(screen.getByText(/All Project Proposals/i)).toBeInTheDocument();
  });

  test('React_BuildUIComponents_ViewProposals route contains page title', () => {
    renderWithRoute('/view');
    const title = screen.getByRole('heading', { name: /All Project Proposals/i });
    expect(title).toBeInTheDocument();
  });
});
