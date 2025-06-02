import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, MapPin, Calendar, Clock, ArrowLeft, Crown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useTeamStore } from '@/stores/teamStore';
import { useProjectIdeaStore } from '@/stores/projectIdeaStore';
import { Team } from '@/types/teamTypes';
import InviteCodeGenerator from '@/components/team/InviteCodeGenerator';

const TeamDetails = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { joinTeam, sentRequests } = useTeamStore();
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
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
        description: "Building the next generation of AI tools for developers. Our team focuses on creating intelligent assistants that help with code generation, debugging, and optimization.",
        projectIdea: "An AI-powered code review assistant that provides real-time feedback and suggestions as developers write code.",
        techStack: ["React", "TypeScript", "Python", "TensorFlow", "Node.js"],
        requiredSkills: ["Machine Learning", "UI/UX Design", "Backend Development"],
        currentMembers: 4,
        maxMembers: 6,
        members: [
          {
            id: '1',
            name: 'Alex Johnson',
            username: 'alexj',
            avatar: 'https://ui-avatars.com/api/?name=Alex+Johnson',
            role: 'Team Lead',
            skills: ['React', 'TypeScript', 'Node.js'],
            isOnline: true,
            joinedAt: new Date('2024-01-15')
          },
          {
            id: '2',
            name: 'Samantha Lee',
            username: 'samlee',
            avatar: 'https://ui-avatars.com/api/?name=Samantha+Lee',
            role: 'ML Engineer',
            skills: ['Python', 'TensorFlow', 'Data Science'],
            isOnline: false,
            joinedAt: new Date('2024-01-18')
          },
          {
            id: '3',
            name: 'Michael Chen',
            username: 'mchen',
            avatar: 'https://ui-avatars.com/api/?name=Michael+Chen',
            role: 'Frontend Developer',
            skills: ['React', 'CSS', 'UI Design'],
            isOnline: true,
            joinedAt: new Date('2024-01-20')
          },
          {
            id: '4',
            name: 'Priya Patel',
            username: 'ppatel',
            avatar: 'https://ui-avatars.com/api/?name=Priya+Patel',
            role: 'Backend Developer',
            skills: ['Node.js', 'Express', 'MongoDB'],
            isOnline: false,
            joinedAt: new Date('2024-01-22')
          }
        ],
        teamLead: "Alex Johnson",
        teamLeadId: "1",
        teamLeadAvatar: "https://ui-avatars.com/api/?name=Alex+Johnson",
        location: "Remote",
        inviteCode: "TEAM123ABC",
        teamStatus: "Active",
        isFull: false,
        isOwner: Math.random() > 0.5, // Randomly decide if user is owner for demo
        pendingRequests: 2,
        skillMatchPercentage: 75,
        createdAt: new Date('2024-01-15')
      };
      
      setTeam(mockTeam);
      setLoading(false);
    };
    
    fetchTeam();
  }, [teamId]);
  
  const handleJoinRequest = async () => {
    if (!team) return;
    
    try {
      await joinTeam(team.id);
      toast({
        title: "Request Sent",
        description: `Your request to join ${team.name} has been sent.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send join request. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleGoBack = () => {
    navigate(-1);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center mb-6">
            <Button variant="ghost" onClick={handleGoBack} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <div className="h-64 bg-gray-200 rounded mb-6"></div>
                <div className="h-40 bg-gray-200 rounded"></div>
              </div>
              <div>
                <div className="h-40 bg-gray-200 rounded mb-6"></div>
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
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
        <div className="container max-w-6xl mx-auto px-4 py-8">
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
  
  const isRequestSent = sentRequests.includes(team.id);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={handleGoBack} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{team.name}</h1>
            <p className="text-gray-600">{team.hackathonName}</p>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Team Info */}
          <div className="md:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="members">Members</TabsTrigger>
                <TabsTrigger value="ideas">Project Ideas</TabsTrigger>
              </TabsList>
              
              {/* Overview Tab */}
              <TabsContent value="overview" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Team Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Team Description */}
                      <div>
                        <h3 className="text-lg font-medium mb-2">About</h3>
                        <p className="text-gray-700">{team.description}</p>
                      </div>
                      
                      {/* Project Idea */}
                      {team.projectIdea && (
                        <div>
                          <h3 className="text-lg font-medium mb-2">Project Idea</h3>
                          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                            <p className="text-gray-700">{team.projectIdea}</p>
                          </div>
                        </div>
                      )}
                      
                      {/* Tech Stack */}
                      <div>
                        <h3 className="text-lg font-medium mb-2">Tech Stack</h3>
                        <div className="flex flex-wrap gap-2">
                          {team.techStack?.map((tech, index) => (
                            <Badge key={index} variant="secondary">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      {/* Required Skills */}
                      <div>
                        <h3 className="text-lg font-medium mb-2">Looking For</h3>
                        <div className="flex flex-wrap gap-2">
                          {team.requiredSkills.map((skill, index) => (
                            <Badge key={index} variant="outline">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      {/* Team Details */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center">
                          <Users className="h-5 w-5 mr-2 text-gray-500" />
                          <span>
                            {team.currentMembers}/{team.maxMembers} Members
                          </span>
                        </div>
                        {team.location && (
                          <div className="flex items-center">
                            <MapPin className="h-5 w-5 mr-2 text-gray-500" />
                            <span>{team.location}</span>
                          </div>
                        )}
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                          <span>
                            Created {team.createdAt.toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-5 w-5 mr-2 text-gray-500" />
                          <span>
                            Status: <Badge className="ml-1">{team.teamStatus}</Badge>
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Members Tab */}
              <TabsContent value="members" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Team Members</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {team.members.map((member) => (
                        <div key={member.id} className="flex items-start p-4 border rounded-lg hover:bg-gray-50">
                          <Avatar className="h-10 w-10 mr-4">
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center">
                              <h3 className="font-medium">{member.name}</h3>
                              {member.id === team.teamLeadId && (
                                <Badge variant="outline" className="ml-2 flex items-center gap-1">
                                  <Crown className="h-3 w-3" /> Team Lead
                                </Badge>
                              )}
                              <div className="ml-auto flex items-center">
                                <span className={`h-2 w-2 rounded-full mr-2 ${member.isOnline ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                                <span className="text-sm text-gray-500">
                                  {member.isOnline ? 'Online' : 'Offline'}
                                </span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{member.role}</p>
                            <div className="mt-2 flex flex-wrap gap-1">
                              {member.skills.map((skill, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                              Joined {member.joinedAt.toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Project Ideas Tab */}
              <TabsContent value="ideas" className="mt-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Project Ideas</CardTitle>
                    <Button 
                      onClick={() => navigate(`/team/${team.id}/ideas`)}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                    >
                      View All Ideas
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {/* This would be populated with actual project ideas */}
                    <div className="text-center py-8">
                      <h3 className="text-lg font-medium text-gray-700 mb-2">Share Your Project Ideas</h3>
                      <p className="text-gray-600 mb-4">Collaborate with your team by sharing and discussing project ideas.</p>
                      <Button 
                        onClick={() => navigate(`/team/${team.id}/ideas`)}
                        variant="outline"
                      >
                        Add New Idea
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Right Column - Actions */}
          <div>
            {/* Team Status Card */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Team Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Members</span>
                    <span className="font-medium">{team.currentMembers}/{team.maxMembers}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${(team.currentMembers / team.maxMembers) * 100}%` }}
                    ></div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Team Lead</h4>
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src={team.teamLeadAvatar} alt={team.teamLead} />
                        <AvatarFallback>{team.teamLead.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{team.teamLead}</span>
                    </div>
                  </div>
                  
                  {team.skillMatchPercentage !== undefined && (
                    <div className="pt-4 border-t">
                      <h4 className="font-medium mb-2">Your Skill Match</h4>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                        <div 
                          className={`h-2.5 rounded-full ${team.skillMatchPercentage >= 70 ? 'bg-green-500' : team.skillMatchPercentage >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${team.skillMatchPercentage}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Match</span>
                        <span className="font-medium">{team.skillMatchPercentage}%</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Action Card */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {team.isOwner ? (
                    <>
                      {/* Team Owner Actions */}
                      <Button 
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                        onClick={() => navigate(`/team/${team.id}/manage`)}
                      >
                        Manage Team
                      </Button>
                      
                      {team.pendingRequests && team.pendingRequests > 0 && (
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => navigate(`/team/${team.id}/requests`)}
                        >
                          Review Requests ({team.pendingRequests})
                        </Button>
                      )}
                      
                      {team.inviteCode && (
                        <div className="pt-4 border-t">
                          <h4 className="font-medium mb-2">Invite Code</h4>
                          <div className="flex items-center justify-between p-2 bg-gray-100 rounded">
                            <code className="text-sm font-mono">{team.inviteCode}</code>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                navigator.clipboard.writeText(team.inviteCode || '');
                                toast({
                                  title: "Copied!",
                                  description: "Invite code copied to clipboard",
                                });
                              }}
                            >
                              Copy
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      {/* Non-Owner Actions */}
                      {team.isFull ? (
                        <Button disabled className="w-full bg-gray-100 text-gray-500 cursor-not-allowed">
                          Team Full
                        </Button>
                      ) : isRequestSent ? (
                        <Button disabled className="w-full bg-amber-100 text-amber-700 border border-amber-200 cursor-not-allowed">
                          Request Sent
                        </Button>
                      ) : (
                        <Button 
                          onClick={handleJoinRequest}
                          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                        >
                          Request to Join
                        </Button>
                      )}
                      
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => navigate(`/team/${team.id}/ideas`)}
                      >
                        View Project Ideas
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamDetails;