import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Users, MapPin, Clock, Search, Filter } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useNotificationStore } from '@/stores/notificationStore';
import { useTeamStore } from '@/stores/teamStore';
import TeamCard from '@/components/team/TeamCard';
import JoinTeamWithCode from '@/components/team/JoinTeamWithCode';

const FindTeam = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addNotification } = useNotificationStore();
  const { joinTeam, sentRequests } = useTeamStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [skillFilter, setSkillFilter] = useState('all');
  const [minSkillMatch, setMinSkillMatch] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [availableSlotsOnly, setAvailableSlotsOnly] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  // Mock user skills - in a real app, these would come from the user's profile
  const userSkills = ['React', 'TypeScript', 'Node.js'];

  // Mock teams data - in a real app, this would come from an API
  const teams = [
    {
      id: '1',
      name: "AI Innovators",
      hackathonId: '1',
      hackathonName: "AI Innovation Challenge 2024",
      description: "Building the next generation of AI-powered applications for healthcare. We're looking for passionate developers and designers who want to make a difference in the medical field.",
      projectIdea: "An AI-powered diagnostic assistant for rural healthcare workers",
      techStack: ["Python", "TensorFlow", "React", "Node.js"],
      requiredSkills: ["Backend Developer", "UI/UX Designer"],
      currentMembers: 3,
      maxMembers: 4,
      members: [
        { id: '1', name: 'Alex Johnson', username: 'alexj', avatar: 'https://i.pravatar.cc/150?img=1', role: 'Team Lead', skills: ['Python', 'TensorFlow', 'Project Management'], joinedAt: new Date(2023, 0, 15) },
        { id: '2', name: 'Samantha Lee', username: 'samlee', avatar: 'https://i.pravatar.cc/150?img=5', role: 'ML Engineer', skills: ['Python', 'TensorFlow', 'Data Science'], joinedAt: new Date(2023, 0, 16) },
        { id: '3', name: 'David Chen', username: 'dchen', avatar: 'https://i.pravatar.cc/150?img=8', role: 'Frontend Developer', skills: ['React', 'JavaScript', 'UI Design'], joinedAt: new Date(2023, 0, 17) }
      ],
      teamLead: "Alex Johnson",
      teamLeadId: "1",
      teamLeadAvatar: "https://i.pravatar.cc/150?img=1",
      location: "San Francisco, CA",
      inviteCode: "TEAM123456",
      teamStatus: "Active",
      isFull: false,
      isOwner: false,
      pendingRequests: 0,
      skillMatchPercentage: 75,
      createdAt: new Date(2023, 0, 15)
    },
    {
      id: '2',
      name: "Web3 Builders",
      hackathonId: '2',
      hackathonName: "Web3 Future Builder",
      description: "Creating decentralized solutions for the future of finance. Our team is focused on building innovative DeFi applications that can revolutionize how people interact with financial services.",
      techStack: ["Solidity", "React", "Web3.js", "Ethereum"],
      requiredSkills: ["Blockchain Developer", "Frontend Developer", "Smart Contract Expert"],
      currentMembers: 2,
      maxMembers: 5,
      members: [
        { id: '4', name: 'Michael Wong', username: 'mwong', avatar: 'https://i.pravatar.cc/150?img=11', role: 'Team Lead', skills: ['Solidity', 'Ethereum', 'Smart Contracts'], joinedAt: new Date(2023, 1, 10) },
        { id: '5', name: 'Emily Davis', username: 'edavis', avatar: 'https://i.pravatar.cc/150?img=9', role: 'Product Manager', skills: ['Product Strategy', 'Blockchain', 'UX Research'], joinedAt: new Date(2023, 1, 12) }
      ],
      teamLead: "Michael Wong",
      teamLeadId: "4",
      teamLeadAvatar: "https://i.pravatar.cc/150?img=11",
      location: "Austin, TX",
      inviteCode: "TEAM789012",
      teamStatus: "Active",
      isFull: false,
      isOwner: false,
      pendingRequests: 0,
      skillMatchPercentage: 30,
      createdAt: new Date(2023, 1, 10)
    },
    {
      id: '3',
      name: "Green Tech Solutions",
      hackathonId: '3',
      hackathonName: "Green Tech Hackathon",
      description: "Developing sustainable technology to combat climate change. We believe technology can help solve some of our planet's most pressing environmental challenges.",
      projectIdea: "IoT-based system for optimizing energy usage in homes",
      techStack: ["React Native", "Python", "Firebase", "IoT"],
      requiredSkills: ["Data Scientist", "Mobile Developer"],
      currentMembers: 2,
      maxMembers: 4,
      members: [
        { id: '6', name: 'Jessica Kim', username: 'jkim', avatar: 'https://i.pravatar.cc/150?img=6', role: 'Team Lead', skills: ['Python', 'Data Science', 'IoT'], joinedAt: new Date(2023, 2, 5) },
        { id: '7', name: 'Ryan Patel', username: 'rpatel', avatar: 'https://i.pravatar.cc/150?img=12', role: 'Backend Developer', skills: ['Python', 'Firebase', 'Cloud Computing'], joinedAt: new Date(2023, 2, 7) }
      ],
      teamLead: "Jessica Kim",
      teamLeadId: "6",
      teamLeadAvatar: "https://i.pravatar.cc/150?img=6",
      location: "Seattle, WA",
      inviteCode: "TEAM345678",
      teamStatus: "Active",
      isFull: false,
      isOwner: false,
      pendingRequests: 0,
      skillMatchPercentage: 50,
      createdAt: new Date(2023, 2, 5)
    }
  ];

  // Available skills for filtering
  const skillOptions = [
    "React", "Node.js", "Python", "JavaScript", "TypeScript",
    "MongoDB", "PostgreSQL", "Machine Learning", "AI", "Blockchain",
    "Unity", "C#", "Java", "Go", "Vue.js", "Angular"
  ];

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const filteredTeams = teams.filter(team => {
    // Search term filter
    const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.requiredSkills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Skill filter
    const matchesSkill = skillFilter === 'all' || 
      team.requiredSkills.some(skill => skill.toLowerCase().includes(skillFilter.toLowerCase())) ||
      team.techStack.some(tech => tech.toLowerCase().includes(skillFilter.toLowerCase()));
    
    // Skill match percentage filter
    const matchesSkillPercentage = team.skillMatchPercentage >= minSkillMatch;
    
    // Available slots filter
    const matchesAvailableSlots = !availableSlotsOnly || team.currentMembers < team.maxMembers;
    
    // Selected skills filter
    const matchesSelectedSkills = selectedSkills.length === 0 || 
      selectedSkills.some(skill => 
        team.requiredSkills.some(req => req.toLowerCase().includes(skill.toLowerCase())) ||
        team.techStack.some(tech => tech.toLowerCase().includes(skill.toLowerCase()))
      );
    
    return matchesSearch && matchesSkill && matchesSkillPercentage && matchesAvailableSlots && matchesSelectedSkills;
  });

  const handleJoinRequest = async (teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    if (!team) return;
    
    await joinTeam(teamId);
    
    toast({
      title: "Join Request Sent!",
      description: `Your request to join "${team.name}" has been sent to the team leader.`,
    });
    
    addNotification({
      title: "Team Join Request",
      message: `You requested to join "${team.name}". The team leader will review your request.`,
      type: "info"
    });
  };

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

        {/* Join with Code Section */}
        <JoinTeamWithCode />

        {/* Search and Filter Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
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
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
              Advanced Filters
              {(minSkillMatch > 0 || availableSlotsOnly || selectedSkills.length > 0) && (
                <Badge className="ml-2 bg-blue-500">Active</Badge>
              )}
            </Button>
          </div>
          
          {/* Advanced Filters */}
          {showFilters && (
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Minimum Skill Match: {minSkillMatch}%</h3>
                    <Slider
                      value={[minSkillMatch]}
                      onValueChange={(value) => setMinSkillMatch(value[0])}
                      max={100}
                      step={10}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>0%</span>
                      <span>50%</span>
                      <span>100%</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="flex items-center gap-2 text-sm mb-4">
                      <input
                        type="checkbox"
                        checked={availableSlotsOnly}
                        onChange={(e) => setAvailableSlotsOnly(e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span>Show teams with available slots only</span>
                    </label>
                    
                    <h3 className="text-sm font-medium mb-2">Filter by Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {skillOptions.map((skill) => (
                        <Badge
                          key={skill}
                          variant={selectedSkills.includes(skill) ? "default" : "outline"}
                          className={`cursor-pointer ${selectedSkills.includes(skill) ? 'bg-blue-500 hover:bg-blue-600' : 'hover:bg-gray-100'}`}
                          onClick={() => toggleSkill(skill)}
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                {(minSkillMatch > 0 || availableSlotsOnly || selectedSkills.length > 0) && (
                  <Button 
                    variant="link" 
                    className="mt-4 text-red-500 p-0 h-auto"
                    onClick={() => {
                      setMinSkillMatch(0);
                      setAvailableSlotsOnly(false);
                      setSelectedSkills([]);
                    }}
                  >
                    Clear All Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Teams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map((team) => (
            <TeamCard 
              key={team.id} 
              team={team} 
              variant="available"
              onJoinRequest={handleJoinRequest}
            />
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
