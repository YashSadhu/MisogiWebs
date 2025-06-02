import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, UserPlus } from 'lucide-react';
import useTeamStore from '../store/teamStore';
import TeamCard from '../components/teams/TeamCard';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';

const TeamsPage: React.FC = () => {
  const navigate = useNavigate();
  const { teams, isLoading, error, fetchTeams, clearError } = useTeamStore();
  
  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);
  
  const handleCreateTeam = () => {
    navigate('/teams/create');
  };
  
  const handleJoinTeam = () => {
    navigate('/teams/join');
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Teams</h1>
          <p className="text-gray-600 mt-1">Manage your hackathon teams and projects</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
          <Button
            variant="primary"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={handleCreateTeam}
          >
            Create Team
          </Button>
          
          <Button
            variant="outline"
            leftIcon={<UserPlus className="h-4 w-4" />}
            onClick={handleJoinTeam}
          >
            Join Team
          </Button>
        </div>
      </div>
      
      {error && (
        <Alert variant="error" onClose={clearError} className="mb-6">
          {error}
        </Alert>
      )}
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : teams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">You're not part of any teams yet</h2>
          <p className="text-gray-600 mb-6">
            Create a new team or join an existing one to start collaborating on hackathon projects.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              variant="primary"
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={handleCreateTeam}
            >
              Create Team
            </Button>
            
            <Button
              variant="outline"
              leftIcon={<UserPlus className="h-4 w-4" />}
              onClick={handleJoinTeam}
            >
              Join Team
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamsPage;