import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, MapPin, Clock, Search } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useNotificationStore } from '@/stores/notificationStore';

const FindTeam = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addNotification } = useNotificationStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [skillFilter, setSkillFilter] = useState('all');
  const [requestedTeams, setRequestedTeams] = useState<Set<number>>(new Set());
  const [loadingRequest, setLoadingRequest] = useState<number | null>(null);

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
              <p className="mb-4">Please sign in to find teams for hackathons.</p>
              <Button onClick={() => navigate('/auth')}>Sign In</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const teams = [
    {
      id: 1,
      name: "AI Innovators",
      hackathon: "AI Innovation Challenge 2024",
      description: "Building the next generation of AI-powered applications for healthcare",
      membersCount: 3,
      maxMembers: 4,
      lookingFor: ["Backend Developer", "UI/UX Designer"],
      techStack: ["Python", "TensorFlow", "React", "Node.js"],
      location: "San Francisco, CA"
    },
    {
      id: 2,
      name: "Web3 Builders",
      hackathon: "Web3 Future Builder",
      description: "Creating decentralized solutions for the future of finance",
      membersCount: 2,
      maxMembers: 5,
      lookingFor: ["Blockchain Developer", "Frontend Developer", "Smart Contract Expert"],
      techStack: ["Solidity", "React", "Web3.js", "Ethereum"],
      location: "Austin, TX"
    },
    {
      id: 3,
      name: "Green Tech Solutions",
      hackathon: "Green Tech Hackathon",
      description: "Developing sustainable technology to combat climate change",
      membersCount: 2,
      maxMembers: 4,
      lookingFor: ["Data Scientist", "Mobile Developer"],
      techStack: ["React Native", "Python", "Firebase", "IoT"],
      location: "Seattle, WA"
    }
  ];

  const filteredTeams = teams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.lookingFor.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSkill = skillFilter === 'all' || 
      team.lookingFor.some(skill => skill.toLowerCase().includes(skillFilter.toLowerCase())) ||
      team.techStack.some(tech => tech.toLowerCase().includes(skillFilter.toLowerCase()));
    
    return matchesSearch && matchesSkill;
  });

  const handleJoinRequest = async (teamId: number) => {
    setLoadingRequest(teamId);
    const team = teams.find(t => t.id === teamId);
    
    console.log(`Requesting to join team ${teamId}: ${team?.name}`);
    
    // Simulate API call
    setTimeout(() => {
      setRequestedTeams(prev => new Set(prev).add(teamId));
      
      toast({
        title: "Join Request Sent!",
        description: `Your request to join "${team?.name}" has been sent to the team leader.`,
      });
      
      addNotification({
        title: "Team Join Request",
        message: `You requested to join "${team?.name}". The team leader will review your request.`,
        type: "info"
      });
      
      setLoadingRequest(null);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Find Your Perfect Team
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover amazing teams looking for talented individuals like you. Join forces and build something incredible together.
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search teams by name, description, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={skillFilter} onValueChange={setSkillFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by skill" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Skills</SelectItem>
              <SelectItem value="frontend">Frontend</SelectItem>
              <SelectItem value="backend">Backend</SelectItem>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="data">Data Science</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Teams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map((team) => (
            <Card key={team.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl mb-2">{team.name}</CardTitle>
                    <p className="text-sm text-gray-600 mb-2">{team.hackathon}</p>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="h-4 w-4 mr-1" />
                    {team.membersCount}/{team.maxMembers}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{team.description}</p>
                
                <div className="mb-4">
                  <h4 className="font-semibold mb-2 text-sm">Looking for:</h4>
                  <div className="flex flex-wrap gap-1">
                    {team.lookingFor.map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold mb-2 text-sm">Tech Stack:</h4>
                  <div className="flex flex-wrap gap-1">
                    {team.techStack.map((tech, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <MapPin className="h-4 w-4 mr-1" />
                  {team.location}
                </div>

                <Button 
                  className={`w-full transition-all duration-200 ${
                    requestedTeams.has(team.id)
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
                  }`}
                  onClick={() => handleJoinRequest(team.id)}
                  disabled={loadingRequest === team.id || requestedTeams.has(team.id)}
                >
                  {loadingRequest === team.id ? (
                    'Sending Request...'
                  ) : requestedTeams.has(team.id) ? (
                    'Request Sent ✓'
                  ) : (
                    'Request to Join'
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTeams.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No teams found</h3>
            <p className="text-gray-500">Try adjusting your search criteria or create your own team!</p>
            <Button 
              className="mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              onClick={() => navigate('/create-team')}
            >
              Create Your Team
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindTeam;
