import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Check, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useTeamStore } from '@/stores/teamStore';
import { Team, JoinRequest } from '@/types/teamTypes';

const TeamRequests = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { acceptJoinRequest, rejectJoinRequest } = useTeamStore();
  const [team, setTeam] = useState<Team | null>(null);
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState<string[]>([]);
  
  // Mock data - in a real app, this would come from an API
  useEffect(() => {
    const fetchData = async () => {
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
        isOwner: true,
        pendingRequests: 3,
        createdAt: new Date('2024-01-15')
      };
      
      // Mock join requests
      const mockRequests: JoinRequest[] = [
        {
          id: '1',
          teamId: teamId || '1',
          userId: '101',
          userName: 'Emma Wilson',
          userAvatar: 'https://ui-avatars.com/api/?name=Emma+Wilson',
          userSkills: ['React', 'UI Design', 'CSS'],
          message: 'I would love to join your team! I have experience with React and UI design, and I think I could contribute to the frontend development of your AI tool.',
          status: 'pending',
          createdAt: new Date('2024-02-10')
        },
        {
          id: '2',
          teamId: teamId || '1',
          userId: '102',
          userName: 'David Kim',
          userAvatar: 'https://ui-avatars.com/api/?name=David+Kim',
          userSkills: ['Python', 'Machine Learning', 'TensorFlow'],
          message: 'Hi! I specialize in machine learning and have worked on several AI projects. I would be excited to help with the ML components of your project.',
          status: 'pending',
          createdAt: new Date('2024-02-11')
        },
        {
          id: '3',
          teamId: teamId || '1',
          userId: '103',
          userName: 'Sophia Chen',
          userAvatar: 'https://ui-avatars.com/api/?name=Sophia+Chen',
          userSkills: ['Node.js', 'Express', 'MongoDB'],
          message: 'I have strong backend development skills and would like to contribute to your team. I can help build robust APIs and database structures for your AI application.',
          status: 'pending',
          createdAt: new Date('2024-02-12')
        }
      ];
      
      setTeam(mockTeam);
      setRequests(mockRequests);
      setLoading(false);
    };
    
    fetchData();
  }, [teamId]);
  
  const handleGoBack = () => {
    navigate(`/team/${teamId}`);
  };
  
  const handleAccept = async (requestId: string) => {
    setProcessingIds(prev => [...prev, requestId]);
    
    try {
      await acceptJoinRequest(requestId);
      
      // Update local state
      setRequests(prev => prev.filter(req => req.id !== requestId));
      
      toast({
        title: "Request Accepted",
        description: "The user has been added to your team.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to accept request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== requestId));
    }
  };
  
  const handleReject = async (requestId: string) => {
    setProcessingIds(prev => [...prev, requestId]);
    
    try {
      await rejectJoinRequest(requestId);
      
      // Update local state
      setRequests(prev => prev.filter(req => req.id !== requestId));
      
      toast({
        title: "Request Rejected",
        description: "The join request has been rejected.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== requestId));
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center mb-6">
            <Button variant="ghost" onClick={handleGoBack} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!team) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container max-w-4xl mx-auto px-4 py-8">
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
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Back Button and Header */}
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={handleGoBack} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Join Requests</h1>
            <p className="text-gray-600">{team.name}</p>
          </div>
        </div>
        
        {/* Main Content */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Requests ({requests.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {requests.length === 0 ? (
              <div className="text-center py-8">
                <h3 className="text-lg font-medium text-gray-700 mb-2">No Pending Requests</h3>
                <p className="text-gray-600">There are currently no pending join requests for your team.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {requests.map((request) => (
                  <div key={request.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-start">
                      <Avatar className="h-12 w-12 mr-4">
                        <AvatarImage src={request.userAvatar} alt={request.userName} />
                        <AvatarFallback>{request.userName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                          <h3 className="font-medium text-lg">{request.userName}</h3>
                          <span className="text-sm text-gray-500">
                            Requested {request.createdAt.toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-3">{request.message}</p>
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-1">Skills</h4>
                          <div className="flex flex-wrap gap-2">
                            {request.userSkills.map((skill, index) => (
                              <Badge key={index} variant="secondary">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-3 justify-end">
                          <Button 
                            variant="outline" 
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => handleReject(request.id)}
                            disabled={processingIds.includes(request.id)}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Decline
                          </Button>
                          <Button 
                            className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white"
                            onClick={() => handleAccept(request.id)}
                            disabled={processingIds.includes(request.id)}
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Accept
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeamRequests;