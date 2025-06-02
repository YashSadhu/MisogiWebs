import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Users, Settings, UserX, Edit, Save, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useTeamStore } from '@/stores/teamStore';
import { Team } from '@/types/teamTypes';

const TeamManagement = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { updateTeam } = useTeamStore();
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  
  // Form states
  const [teamName, setTeamName] = useState('');
  const [description, setDescription] = useState('');
  const [maxMembers, setMaxMembers] = useState(5);
  const [techStack, setTechStack] = useState<string[]>([]);
  const [requiredSkills, setRequiredSkills] = useState<string[]>([]);
  const [newTech, setNewTech] = useState('');
  const [newSkill, setNewSkill] = useState('');
  
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
        isOwner: true, // Always true for management page
        pendingRequests: 2,
        createdAt: new Date('2024-01-15')
      };
      
      setTeam(mockTeam);
      setTeamName(mockTeam.name);
      setDescription(mockTeam.description);
      setMaxMembers(mockTeam.maxMembers);
      setTechStack(mockTeam.techStack || []);
      setRequiredSkills(mockTeam.requiredSkills || []);
      setLoading(false);
    };
    
    fetchTeam();
  }, [teamId]);
  
  const handleGoBack = () => {
    navigate(`/team/${teamId}`);
  };
  
  const handleSaveChanges = async () => {
    if (!team) return;
    
    setSaving(true);
    
    try {
      const updatedTeam = await updateTeam(team.id, {
        name: teamName,
        description,
        maxMembers,
        techStack,
        requiredSkills
      });
      
      setTeam(updatedTeam);
      
      toast({
        title: "Changes Saved",
        description: "Your team information has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save changes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };
  
  const handleAddTech = () => {
    if (newTech && !techStack.includes(newTech)) {
      setTechStack([...techStack, newTech]);
      setNewTech('');
    }
  };
  
  const handleRemoveTech = (tech: string) => {
    setTechStack(techStack.filter(t => t !== tech));
  };
  
  const handleAddSkill = () => {
    if (newSkill && !requiredSkills.includes(newSkill)) {
      setRequiredSkills([...requiredSkills, newSkill]);
      setNewSkill('');
    }
  };
  
  const handleRemoveSkill = (skill: string) => {
    setRequiredSkills(requiredSkills.filter(s => s !== skill));
  };
  
  const handleRemoveMember = (memberId: string) => {
    // In a real app, this would call an API
    toast({
      title: "Member Removed",
      description: "The team member has been removed.",
    });
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
            <div className="grid grid-cols-1 gap-6">
              <div className="h-64 bg-gray-200 rounded mb-6"></div>
              <div className="h-40 bg-gray-200 rounded"></div>
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
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* Back Button and Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button variant="ghost" onClick={handleGoBack} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Manage Team</h1>
              <p className="text-gray-600">{team.name}</p>
            </div>
          </div>
          <Button 
            onClick={handleSaveChanges} 
            disabled={saving}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
        
        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">
              <Settings className="h-4 w-4 mr-2" />
              General
            </TabsTrigger>
            <TabsTrigger value="members">
              <Users className="h-4 w-4 mr-2" />
              Members
            </TabsTrigger>
            <TabsTrigger value="invites">
              <Edit className="h-4 w-4 mr-2" />
              Invites
            </TabsTrigger>
          </TabsList>
          
          {/* General Settings Tab */}
          <TabsContent value="general" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Team Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Team Name */}
                  <div className="space-y-2">
                    <Label htmlFor="teamName">Team Name</Label>
                    <Input 
                      id="teamName" 
                      value={teamName} 
                      onChange={(e) => setTeamName(e.target.value)} 
                      placeholder="Enter team name"
                    />
                  </div>
                  
                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      value={description} 
                      onChange={(e) => setDescription(e.target.value)} 
                      placeholder="Describe your team and goals"
                      rows={4}
                    />
                  </div>
                  
                  {/* Max Members */}
                  <div className="space-y-2">
                    <Label htmlFor="maxMembers">Maximum Team Size</Label>
                    <Select 
                      value={maxMembers.toString()} 
                      onValueChange={(value) => setMaxMembers(parseInt(value))}
                    >
                      <SelectTrigger id="maxMembers">
                        <SelectValue placeholder="Select maximum team size" />
                      </SelectTrigger>
                      <SelectContent>
                        {[2, 3, 4, 5, 6, 7, 8, 10].map((size) => (
                          <SelectItem key={size} value={size.toString()}>
                            {size} members
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-gray-500 mt-1">
                      Current members: {team.currentMembers}/{maxMembers}
                    </p>
                  </div>
                  
                  {/* Tech Stack */}
                  <div className="space-y-2">
                    <Label>Tech Stack</Label>
                    <div className="flex gap-2">
                      <Input 
                        value={newTech} 
                        onChange={(e) => setNewTech(e.target.value)} 
                        placeholder="Add technology"
                        className="flex-1"
                      />
                      <Button onClick={handleAddTech} type="button">
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {techStack.map((tech, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {tech}
                          <button 
                            onClick={() => handleRemoveTech(tech)}
                            className="ml-1 h-4 w-4 rounded-full inline-flex items-center justify-center hover:bg-gray-200"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {/* Required Skills */}
                  <div className="space-y-2">
                    <Label>Required Skills</Label>
                    <div className="flex gap-2">
                      <Input 
                        value={newSkill} 
                        onChange={(e) => setNewSkill(e.target.value)} 
                        placeholder="Add required skill"
                        className="flex-1"
                      />
                      <Button onClick={handleAddSkill} type="button">
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {requiredSkills.map((skill, index) => (
                        <Badge key={index} variant="outline" className="flex items-center gap-1">
                          {skill}
                          <button 
                            onClick={() => handleRemoveSkill(skill)}
                            className="ml-1 h-4 w-4 rounded-full inline-flex items-center justify-center hover:bg-gray-200"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
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
                          <Badge variant="outline" className="ml-2">
                            {member.role}
                          </Badge>
                          <div className="ml-auto flex items-center">
                            <span className={`h-2 w-2 rounded-full mr-2 ${member.isOnline ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                            <span className="text-sm text-gray-500">
                              {member.isOnline ? 'Online' : 'Offline'}
                            </span>
                          </div>
                        </div>
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
                      {member.id !== team.teamLeadId && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleRemoveMember(member.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <UserX className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Invites Tab */}
          <TabsContent value="invites" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Team Invites</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Invite Code */}
                  <div>
                    <h3 className="text-lg font-medium mb-2">Invite Code</h3>
                    <div className="flex items-center p-3 bg-gray-100 rounded-lg">
                      <code className="text-lg font-mono flex-1">{team.inviteCode}</code>
                      <Button 
                        variant="outline" 
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
                    <p className="text-sm text-gray-500 mt-2">
                      Share this code with others to let them join your team directly.
                    </p>
                  </div>
                  
                  {/* Generate New Code */}
                  <div>
                    <h3 className="text-lg font-medium mb-2">Generate New Code</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      If you generate a new invite code, the old one will no longer work.
                    </p>
                    <Button variant="outline">
                      Generate New Code
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TeamManagement;