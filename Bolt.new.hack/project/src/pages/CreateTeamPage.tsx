import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import TeamForm from '../components/forms/TeamForm';
import useTeamStore from '../store/teamStore';
import { useHackathonStore } from '../store/hackathonStore';

const CreateTeamPage: React.FC = () => {
  const navigate = useNavigate();
  const { createTeam, isLoading, error, clearError, currentTeam } = useTeamStore();
  const { hackathons, fetchHackathons } = useHackathonStore();
  
  useEffect(() => {
    if (hackathons.length === 0) {
      fetchHackathons();
    }
  }, [hackathons, fetchHackathons]);
  
  useEffect(() => {
    if (currentTeam) {
      navigate(`/teams/${currentTeam.id}`);
    }
  }, [currentTeam, navigate]);
  
  const handleCreateTeam = async (data: { name: string; description: string; hackathonId: string }) => {
    await createTeam(data.name, data.description, data.hackathonId);
  };
  
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create a New Team</h1>
      
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-800">Team Details</h2>
          <p className="text-sm text-gray-500">
            Create a team to collaborate with others on a hackathon project.
          </p>
        </CardHeader>
        
        <CardContent>
          <TeamForm
            hackathons={hackathons}
            onSubmit={handleCreateTeam}
            isLoading={isLoading}
            error={error}
            onClearError={clearError}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateTeamPage;