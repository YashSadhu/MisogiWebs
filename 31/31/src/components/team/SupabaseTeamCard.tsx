
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Crown, Copy, Share2, Clock, MapPin } from 'lucide-react';
import { useSupabaseTeamStore } from '@/stores/supabaseTeamStore';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface TeamCardProps {
  team: any;
  variant?: 'user-team' | 'available';
  onJoinRequest?: (teamId: string) => void;
}

const SupabaseTeamCard = ({ team, variant = 'available', onJoinRequest }: TeamCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { requestToJoinTeam, joinTeamWithCode, isLoading } = useSupabaseTeamStore();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleJoinRequest = async () => {
    if (onJoinRequest) {
      onJoinRequest(team.id);
    } else {
      const success = await requestToJoinTeam(team.id);
      if (success) {
        toast({
          title: "Request Sent!",
          description: `Your request to join "${team.name}" has been sent to the team leader.`,
        });
      }
    }
  };

  const handleCopyInviteCode = async () => {
    if (!team.invite_code) return;
    
    try {
      await navigator.clipboard.writeText(team.invite_code);
      toast({
        title: "Copied!",
        description: "Team invite code copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy invite code to clipboard",
        variant: "destructive"
      });
    }
  };

  const handleShareInviteCode = async () => {
    if (!team.invite_code) return;
    
    const shareText = `Join my team "${team.name}" for ${team.hackathon?.title}! Use invite code: ${team.invite_code}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join ${team.name}`,
          text: shareText,
        });
      } catch (err) {
        await navigator.clipboard.writeText(shareText);
        toast({
          title: "Copied!",
          description: "Team invite message copied to clipboard",
        });
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      toast({
        title: "Copied!",
        description: "Team invite message copied to clipboard",
      });
    }
  };

  const getStatusColor = () => {
    if (team.hackathon) {
      const startDate = new Date(team.hackathon.start_date);
      const endDate = new Date(team.hackathon.end_date);
      const now = new Date();
      
      if (now < startDate) return 'bg-blue-100 text-blue-800';
      if (now >= startDate && now <= endDate) return 'bg-green-100 text-green-800';
      return 'bg-gray-100 text-gray-800';
    }
    return 'bg-gray-100 text-gray-800';
  };

  const getStatusText = () => {
    if (team.hackathon) {
      const startDate = new Date(team.hackathon.start_date);
      const endDate = new Date(team.hackathon.end_date);
      const now = new Date();
      
      if (now < startDate) return 'Upcoming';
      if (now >= startDate && now <= endDate) return 'Active';
      return 'Completed';
    }
    return 'Unknown';
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{team.name}</CardTitle>
            <p className="text-sm text-gray-600 mb-2">{team.hackathon?.title}</p>
            
            {team.hackathon && (
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <Clock className="h-4 w-4 mr-1" />
                {format(new Date(team.hackathon.start_date), 'MMM dd')} - {format(new Date(team.hackathon.end_date), 'MMM dd, yyyy')}
              </div>
            )}
            
            <Badge className={getStatusColor()}>
              {getStatusText()}
            </Badge>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Users className="h-4 w-4 mr-1" />
            {team.member_count}/{team.max_members}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Team Lead */}
        <div className="flex items-center gap-2 mb-4">
          <Avatar className="h-6 w-6">
            <AvatarImage src={team.leader?.avatar_url} alt={team.leader?.username} />
            <AvatarFallback>{team.leader?.username?.charAt(0)?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-gray-600">
            Led by {team.is_leader ? 'You' : (team.leader?.full_name || team.leader?.username)}
          </span>
          {team.is_leader && (
            <Badge variant="outline" className="ml-auto flex items-center gap-1">
              <Crown className="h-3 w-3" /> Leader
            </Badge>
          )}
        </div>

        {/* Team Description */}
        {team.description && (
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
        )}

        {/* Tech Stack */}
        {team.tech_stack && team.tech_stack.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Tech Stack</h4>
            <div className="flex flex-wrap gap-2">
              {team.tech_stack.map((tech: string, index: number) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Looking For Skills */}
        {team.looking_for_skills && team.looking_for_skills.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Looking For</h4>
            <div className="flex flex-wrap gap-2">
              {team.looking_for_skills.map((skill: string, index: number) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Team Members */}
        {team.members && team.members.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Team Members</h4>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {team.members.slice(0, 4).map((member: any, index: number) => (
                  <Avatar key={index} className="border-2 border-white">
                    <AvatarImage src={member.user?.avatar_url} alt={member.user?.username} />
                    <AvatarFallback>{member.user?.username?.charAt(0)?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                ))}
                {team.members.length > 4 && (
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center">
                    <span className="text-xs text-gray-500">+{team.members.length - 4}</span>
                  </div>
                )}
              </div>
              <span className="text-sm text-gray-600 ml-2">
                {team.member_count} member{team.member_count !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        )}

        {/* Invite Code (only visible to team members) */}
        {variant === 'user-team' && team.invite_code && (
          <div className="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
            <h4 className="text-sm font-medium text-purple-700 mb-2">Team Invite Code</h4>
            <div className="flex items-center gap-2">
              <code className="text-sm font-mono bg-white px-2 py-1 rounded border border-purple-200 flex-1">
                {team.invite_code}
              </code>
              <Button
                variant="ghost"
                size="sm"
                className="text-purple-600 hover:text-purple-700 px-2"
                onClick={handleCopyInviteCode}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-purple-600 hover:text-purple-700 px-2"
                onClick={handleShareInviteCode}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-purple-600 mt-1">Share this code with others to invite them to your team</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          {variant === 'available' ? (
            <>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => navigate(`/team/${team.id}`)}
              >
                View Details
              </Button>
              
              {team.member_count >= team.max_members ? (
                <Button
                  disabled
                  className="flex-1 bg-gray-100 text-gray-500 cursor-not-allowed"
                >
                  Team Full
                </Button>
              ) : team.has_pending_request ? (
                <Button
                  disabled
                  className="flex-1 bg-amber-100 text-amber-700 border border-amber-200 cursor-not-allowed"
                >
                  Request Sent
                </Button>
              ) : team.is_member ? (
                <Button
                  disabled
                  className="flex-1 bg-green-100 text-green-700 border border-green-200 cursor-not-allowed"
                >
                  Already Member
                </Button>
              ) : (
                <Button
                  onClick={handleJoinRequest}
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                >
                  {isLoading ? 'Sending...' : 'Request to Join'}
                </Button>
              )}
            </>
          ) : (
            <>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => navigate(`/team/${team.id}`)}
              >
                View Team
              </Button>
              
              {team.is_leader ? (
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

export default SupabaseTeamCard;
