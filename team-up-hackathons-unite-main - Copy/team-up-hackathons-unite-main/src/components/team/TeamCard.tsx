import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, MapPin, Crown } from 'lucide-react';
import { Team } from '@/types/teamTypes';
import SkillMatchIndicator from './SkillMatchIndicator';
import InviteCodeGenerator from './InviteCodeGenerator';
import { useTeamStore } from '@/stores/teamStore';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

interface TeamCardProps {
  team: Team;
  variant?: 'available' | 'my-team';
  onJoinRequest?: (teamId: string) => void;
}

const TeamCard = ({ team, variant = 'available', onJoinRequest }: TeamCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { joinTeam, isLoading, sentRequests } = useTeamStore();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const isRequestSent = sentRequests.includes(team.id);
  const isLoadingRequest = isLoading && sentRequests.includes(team.id);

  const handleJoinRequest = async () => {
    if (onJoinRequest) {
      onJoinRequest(team.id);
    } else {
      await joinTeam(team.id);
    }
  };

  const handleViewTeam = () => {
    navigate(`/team/${team.id}`);
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-amber-100 text-amber-800';
      case 'Completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl mb-2">{team.name}</CardTitle>
            <p className="text-sm text-gray-600 mb-2">{team.hackathonName}</p>
            
            {variant === 'my-team' && team.teamStatus && (
              <Badge className={getStatusColor(team.teamStatus)}>
                {team.teamStatus}
              </Badge>
            )}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Users className="h-4 w-4 mr-1" />
            {team.currentMembers}/{team.maxMembers}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Team Lead */}
        <div className="flex items-center gap-2 mb-4">
          <Avatar className="h-6 w-6">
            <AvatarImage src={team.teamLeadAvatar} alt={team.teamLead} />
            <AvatarFallback>{team.teamLead.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-gray-600">
            Led by {team.isOwner ? 'You' : team.teamLead}
          </span>
          {team.isOwner && (
            <Badge variant="outline" className="ml-auto flex items-center gap-1">
              <Crown className="h-3 w-3" /> Leader
            </Badge>
          )}
        </div>

        {/* Skill Match Indicator (for available teams) */}
        {variant === 'available' && team.skillMatchPercentage !== undefined && (
          <SkillMatchIndicator percentage={team.skillMatchPercentage} />
        )}

        {/* Team Description */}
        <div className="mb-4">
          <p className="text-gray-700 text-sm leading-relaxed">
            {isExpanded ? team.description : `${team.description.substring(0, 150)}${team.description.length > 150 ? '...' : ''}`}
          </p>
          {team.description.length > 150 && (
            <Button
              variant="link"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-600 text-sm font-medium p-0 h-auto mt-1"
            >
              {isExpanded ? 'Show less' : 'Read more'}
            </Button>
          )}
        </div>

        {/* Project Idea */}
        {team.projectIdea && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-1">Project Idea</h4>
            <p className="text-sm text-gray-600">{team.projectIdea}</p>
          </div>
        )}

        {/* Tech Stack */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Tech Stack</h4>
          <div className="flex flex-wrap gap-2">
            {team.techStack?.map((tech, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tech}
              </Badge>
            ))}
          </div>
        </div>

        {/* Required Skills */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Looking For</h4>
          <div className="flex flex-wrap gap-2">
            {team.requiredSkills.map((skill, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* Team Members */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Team Members</h4>
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {team.members.slice(0, 4).map((member, index) => (
                <Avatar key={index} className="border-2 border-white">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
              ))}
              {team.members.length > 4 && (
                <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center">
                  <span className="text-xs text-gray-500">+{team.members.length - 4}</span>
                </div>
              )}
            </div>
            <span className="text-sm text-gray-600 ml-2">
              {team.currentMembers} member{team.currentMembers !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Invite Code (for owned teams) */}
        {variant === 'my-team' && team.isOwner && team.inviteCode && (
          <div className="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
            <h4 className="text-sm font-medium text-purple-700 mb-2">Team Invite Code</h4>
            <div className="flex items-center gap-2">
              <code className="text-sm font-mono bg-white px-2 py-1 rounded border border-purple-200">
                {team.inviteCode}
              </code>
              <Button
                variant="ghost"
                size="sm"
                className="text-purple-600 hover:text-purple-700"
                onClick={() => {
                  navigator.clipboard.writeText(team.inviteCode);
                  toast({
                    title: "Copied!",
                    description: "Team code copied to clipboard",
                  });
                }}
              >
                Copy
              </Button>
            </div>
          </div>
        )}

        {/* Pending Requests (for owned teams) */}
        {variant === 'my-team' && team.isOwner && team.pendingRequests && team.pendingRequests > 0 && (
          <div className="mb-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-medium text-amber-700">
                {team.pendingRequests} pending join request{team.pendingRequests !== 1 ? 's' : ''}
              </span>
            </div>
            <Button 
              variant="link" 
              className="text-amber-600 p-0 h-auto text-sm mt-1"
              onClick={() => navigate(`/team/${team.id}/requests`)}
            >
              Review Requests
            </Button>
          </div>
        )}

        {/* Location if available */}
        {team.location && (
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <MapPin className="h-4 w-4 mr-1" />
            {team.location}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          {variant === 'available' ? (
            <>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={handleViewTeam}
              >
                View Details
              </Button>
              
              {team.isFull ? (
                <Button
                  disabled
                  className="flex-1 bg-gray-100 text-gray-500 cursor-not-allowed"
                >
                  Team Full
                </Button>
              ) : isRequestSent ? (
                <Button
                  disabled
                  className="flex-1 bg-amber-100 text-amber-700 border border-amber-200 cursor-not-allowed"
                >
                  Request Sent
                </Button>
              ) : (
                <Button
                  onClick={handleJoinRequest}
                  disabled={isLoadingRequest}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                >
                  {isLoadingRequest ? 'Sending...' : 'Request to Join'}
                </Button>
              )}
            </>
          ) : (
            <>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={handleViewTeam}
              >
                View Team
              </Button>
              
              {team.isOwner ? (
                <Button
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                  onClick={() => navigate(`/team/${team.id}/manage`)}
                >
                  Manage Team
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => navigate(`/team/${team.id}/leave`)}
                >
                  Leave Team
                </Button>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamCard;