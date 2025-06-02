import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import AuthGuard from './components/layout/AuthGuard';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import HackathonDetailPage from './pages/HackathonDetailPage';
import TeamsPage from './pages/TeamsPage';
import TeamDetailPage from './pages/TeamDetailPage';
import CreateTeamPage from './pages/CreateTeamPage';
import JoinTeamPage from './pages/JoinTeamPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/hackathons/:id" element={<HackathonDetailPage />} />
            
            {/* Protected Routes */}
            <Route path="/profile" element={
              <AuthGuard>
                <ProfilePage />
              </AuthGuard>
            } />
            <Route path="/teams" element={
              <AuthGuard>
                <TeamsPage />
              </AuthGuard>
            } />
            <Route path="/teams/:id" element={
              <AuthGuard>
                <TeamDetailPage />
              </AuthGuard>
            } />
            <Route path="/teams/create" element={
              <AuthGuard>
                <CreateTeamPage />
              </AuthGuard>
            } />
            <Route path="/teams/join" element={
              <AuthGuard>
                <JoinTeamPage />
              </AuthGuard>
            } />
          </Routes>
        </main>
        <footer className="bg-white border-t border-gray-200 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-gray-500 text-sm">
              © {new Date().getFullYear()} HackTeams. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;