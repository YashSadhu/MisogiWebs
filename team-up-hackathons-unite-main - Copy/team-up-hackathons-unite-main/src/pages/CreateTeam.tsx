
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Plus, X, Users, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useNotificationStore } from '@/stores/notificationStore';

const CreateTeam = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addNotification } = useNotificationStore();
  const [teamName, setTeamName] = useState('');
  const [description, setDescription] = useState('');
  const [hackathonId, setHackathonId] = useState('');
  const [maxMembers, setMaxMembers] = useState('4');
  const [techStack, setTechStack] = useState<string[]>([]);
  const [lookingFor, setLookingFor] = useState<string[]>([]);
  const [newTech, setNewTech] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
        <Navigation />
        <div className="flex items-center justify-center min-h-[80vh]">
          <Card className="max-w-md w-full mx-4">
            <CardHeader className="text-center">
              <CardTitle>Authentication Required</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="mb-4">Please sign in to create a team.</p>
              <Button onClick={() => navigate('/auth')}>Sign In</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const hackathons = [
    { id: '1', name: 'AI Innovation Challenge 2024' },
    { id: '2', name: 'Web3 Future Builder' },
    { id: '3', name: 'Green Tech Hackathon' }
  ];

  const addTechStack = () => {
    if (newTech.trim() && !techStack.includes(newTech.trim())) {
      setTechStack([...techStack, newTech.trim()]);
      setNewTech('');
      console.log('Added tech stack:', newTech.trim());
    }
  };

  const removeTechStack = (tech: string) => {
    setTechStack(techStack.filter(t => t !== tech));
    console.log('Removed tech stack:', tech);
  };

  const addSkill = () => {
    if (newSkill.trim() && !lookingFor.includes(newSkill.trim())) {
      setLookingFor([...lookingFor, newSkill.trim()]);
      setNewSkill('');
      console.log('Added skill:', newSkill.trim());
    }
  };

  const removeSkill = (skill: string) => {
    setLookingFor(lookingFor.filter(s => s !== skill));
    console.log('Removed skill:', skill);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!teamName.trim() || !description.trim() || !hackathonId) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    console.log('Creating team with data:', {
      teamName,
      description,
      hackathonId,
      maxMembers,
      techStack,
      lookingFor
    });

    const inviteCode = `TEAM${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const selectedHackathon = hackathons.find(h => h.id === hackathonId);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Team Created Successfully!",
        description: `"${teamName}" has been created. Invite code: ${inviteCode}`,
      });

      addNotification({
        title: "Team Created",
        message: `Your team "${teamName}" for ${selectedHackathon?.name} has been created successfully!`,
        type: "success",
        data: { inviteCode, teamName }
      });

      // Reset form
      setTeamName('');
      setDescription('');
      setHackathonId('');
      setMaxMembers('4');
      setTechStack([]);
      setLookingFor([]);
      setIsSubmitting(false);

      // Navigate to find team page after success
      setTimeout(() => {
        navigate('/find-team');
      }, 2000);
    }, 2000);
  };

  const handleCancel = () => {
    console.log('Form cancelled');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Create Your Dream Team
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start building your hackathon team. Define your vision, skills needed, and find the perfect collaborators.
          </p>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-6 w-6 text-purple-600" />
              Team Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="teamName">Team Name *</Label>
                  <Input
                    id="teamName"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="Enter your team name"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hackathon">Hackathon *</Label>
                  <Select value={hackathonId} onValueChange={setHackathonId} disabled={isSubmitting}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a hackathon" />
                    </SelectTrigger>
                    <SelectContent>
                      {hackathons.map((hackathon) => (
                        <SelectItem key={hackathon.id} value={hackathon.id}>
                          {hackathon.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Team Description *</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your team's vision, goals, and what you plan to build..."
                  rows={4}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxMembers">Maximum Team Members</Label>
                <Select value={maxMembers} onValueChange={setMaxMembers} disabled={isSubmitting}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="6">6</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label>Tech Stack</Label>
                <div className="flex gap-2">
                  <Input
                    value={newTech}
                    onChange={(e) => setNewTech(e.target.value)}
                    placeholder="Add technology (e.g., React, Python)"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechStack())}
                    disabled={isSubmitting}
                  />
                  <Button type="button" onClick={addTechStack} size="sm" disabled={isSubmitting || !newTech.trim()}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {techStack.map((tech, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {tech}
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-red-500"
                        onClick={() => removeTechStack(tech)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label>Looking For Skills</Label>
                <div className="flex gap-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add skill needed (e.g., Frontend Developer, Designer)"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    disabled={isSubmitting}
                  />
                  <Button type="button" onClick={addSkill} size="sm" disabled={isSubmitting || !newSkill.trim()}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {lookingFor.map((skill, index) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-1">
                      {skill}
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-red-500"
                        onClick={() => removeSkill(skill)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating Team...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Create Team
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateTeam;
