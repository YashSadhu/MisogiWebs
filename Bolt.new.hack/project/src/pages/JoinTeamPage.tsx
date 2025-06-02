import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import JoinTeamForm from '../components/forms/JoinTeamForm';
import useTeamStore from '../store/teamStore';
import Alert from '../components/ui/Alert';

const JoinTeamPage: React.FC = () => {
  const navigate = useNavigate();
  const { joinTeam, isLoading, error, clearError, currentTeam } = useTeamStore();
  const [success, setSuccess] = useState(false);
  
  useEffect(() => {
    if (currentTeam && success) {
      // Navigate after a short delay to show success message
      const timer = setTimeout(() => {
        navigate(`/teams/${currentTeam.id}`);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [currentTeam, success, navigate]);
  
  const handleJoinTeam = async (data: { inviteCode: string }) => {
    try {
      await joinTeam(data.inviteCode);
      setSuccess(true);
    } catch (error) {
      // Error is handled by the store
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Join a Team</h1>
      
      {success && (
        <Alert variant="success" className="mb-6">
          Successfully joined the team! Redirecting...
        </Alert>
      )}
      
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-800">Enter Invite Code</h2>
          <p className="text-sm text-gray-500">
            Enter the invite code you received from a team owner to join their team.
          </p>
        </CardHeader>
        
        <CardContent>
          <JoinTeamForm
            onSubmit={handleJoinTeam}
            isLoading={isLoading}
            error={error}
            onClearError={clearError}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default JoinTeamPage;