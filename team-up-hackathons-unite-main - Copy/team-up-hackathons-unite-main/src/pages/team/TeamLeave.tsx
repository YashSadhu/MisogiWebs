import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useTeamStore } from '@/stores/teamStore';
import { Team } from '@/types/teamTypes';

const TeamLeave = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { leaveTeam } = useTeamStore();
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  
  // Mock data - in a real app, this would come from an API
  useEffect(() => {
    const fetchTeam = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock team data
      const mockTeam: Team = {
        id: teamId || '1',
        name: "AI Innovators",
        hackathonId: '1',
        hackathonName: "AI Innovation Challenge 2024",
        description: "Building the next generation of AI tools for developers.",
        techStack: ["React", "TypeScript", "Python", "TensorFlow"],
        requiredSkills: ["Machine Learning", "UI/UX Design", "Backend Development"],
        currentMembers: 4,
        maxMembers: 6,
        members: [],
        teamLead: "Alex Johnson",
        teamLeadId: "1",
        teamLeadAvatar: "https://ui-avatars.com/api/?name=Alex+Johnson",
        teamStatus: "Active",
        isOwner: false, // Must be false for leave page
        createdAt: new Date('2024-01-15')
      };
      
      setTeam(mockTeam);
      setLoading(false);
    };
    
    fetchTeam();
  }, [teamId]);
  
  const handleGoBack = () => {
    navigate(`/team/${teamId}`);
  };
  
  const handleLeaveTeam = async () => {
    if (!team) return;
    
    setConfirming(true);
    
    try {
      await leaveTeam(team.id);
      
      toast({
        title: "Team Left",
        description: `You have successfully left ${team.name}.`,
      });
      
      navigate('/find-team');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to leave team. Please try again.",
        variant: "destructive",
      });
      setConfirming(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container max-w-md mx-auto px-4 py-8">
          <div className="flex items-center mb-6">
            <Button variant="ghost" onClick={handleGoBack} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-8"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!team) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container max-w-md mx-auto px-4 py-8">
          <div className="flex items-center mb-6">
            <Button variant="ghost" onClick={handleGoBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Team Not Found</h2>
                <p className="text-gray-600 mb-6">The team you're looking for doesn't exist or has been removed.</p>
                <Button onClick={() => navigate('/find-team')}>
                  Browse Teams
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  // Redirect if user is team owner
  if (team.isOwner) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container max-w-md mx-auto px-4 py-8">
          <div className="flex items-center mb-6">
            <Button variant="ghost" onClick={handleGoBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Cannot Leave Team</h2>
                <p className="text-gray-600 mb-6">
                  As the team leader, you cannot leave the team. You must either transfer leadership to another member or disband the team.
                </p>
                <Button onClick={() => navigate(`/team/${teamId}/manage`)}>
                  Manage Team
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container max-w-md mx-auto px-4 py-8">
        {/* Back Button and Header */}
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={handleGoBack} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">Leave Team</h1>
        </div>
        
        {/* Main Content */}
        <Card>
          <CardHeader>
            <CardTitle>Confirm Leaving {team.name}</CardTitle>
            <CardDescription>
              Are you sure you want to leave this team? This action cannot be undone.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start">
                <AlertTriangle className="h-5 w-5 text-amber-500 mr-3 mt-0.5" />
                <div>
                  <h3 className="font-medium text-amber-800 mb-1">Important Information</h3>
                  <ul className="text-sm text-amber-700 space-y-1 list-disc pl-5">
                    <li>You will lose access to all team resources and communications</li>
                    <li>Your contributions will remain with the team</li>
                    <li>If you want to rejoin, you'll need to request access again</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex gap-4 justify-end">
                <Button 
                  variant="outline" 
                  onClick={handleGoBack}
                  disabled={confirming}
                >
                  Cancel
                </Button>
                <Button 
                  variant="destructive"
                  onClick={handleLeaveTeam}
                  disabled={confirming}
                >
                  {confirming ? 'Leaving...' : 'Leave Team'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeamLeave;