import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Code, CalendarDays } from 'lucide-react';
import { Team } from '../../types';
import { Card, CardContent, CardFooter } from '../ui/Card';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import { formatDate } from '../../utils/dates';

interface TeamCardProps {
  team: Team;
}

const TeamCard: React.FC<TeamCardProps> = ({ team }) => {
  const navigate = useNavigate();
  
  const handleViewTeam = () => {
    navigate(`/teams/${team.id}`);
  };
  
  return (
    <Card className="h-full flex flex-col">
      <CardContent className="flex-1">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{team.name}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{team.description}</p>
        
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <User className="h-4 w-4 mr-2" />
          <span>{team.members.length} {team.members.length === 1 ? 'Member' : 'Members'}</span>
        </div>
        
        {team.projectIdea && (
          <div className="flex items-center text-sm text-gray-500 mb-3">
            <Code className="h-4 w-4 mr-2" />
            <span className="text-indigo-600 font-medium">Has Project Idea</span>
          </div>
        )}
        
        <div className="flex items-center text-sm text-gray-500">
          <CalendarDays className="h-4 w-4 mr-2" />
          <span>Created on {formatDate(team.createdAt)}</span>
        </div>
        
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Team Members:</p>
          <div className="flex -space-x-2 overflow-hidden">
            {team.members.slice(0, 5).map((member) => (
              <Avatar
                key={member.userId}
                src={member.user.avatarUrl}
                name={member.user.name}
                size="sm"
                className="border-2 border-white"
              />
            ))}
            {team.members.length > 5 && (
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 border-2 border-white text-xs font-medium text-gray-800">
                +{team.members.length - 5}
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-3">
        <Button
          variant="primary"
          fullWidth
          onClick={handleViewTeam}
        >
          View Team
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TeamCard;