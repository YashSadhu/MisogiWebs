
import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Plus, Search, Filter } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useSupabaseTeamStore } from '@/stores/supabaseTeamStore';
import SupabaseTeamCard from '@/components/team/SupabaseTeamCard';
import SupabaseJoinTeamWithCode from '@/components/team/SupabaseJoinTeamWithCode';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Teams = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    userTeams,
    teams,
    isLoading,
    error,
    fetchUserTeams,
    fetchAvailableTeams,
    requestToJoinTeam
  } = useSupabaseTeamStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [hackathonFilter, setHackathonFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('your-teams');

  // Add dummy teams for demonstration
  const dummyUserTeams = [
    {
      id: 'dummy-team-1',
      name: "AI Innovators",
      description: "Building the next generation of AI-powered applications for healthcare.",
      hackathon: { title: "AI Innovation Challenge 2024", start_date: "2024-08-15", end_date: "2024-08-17" },
      hackathon_id: 'hack-1',
      leader_id: user?.id,
      leader: { username: user?.email?.split('@')[0] || 'user', full_name: 'Your Name' },
      tech_stack: ["Python", "TensorFlow", "React", "Node.js"],
      looking_for_skills: ["Backend Developer", "UI/UX Designer"],
      max_members: 4,
      member_count: 3,
      members: [],
      is_member: true,
      is_leader: true,
      invite_code: "TEAM123456"
    },
    {
      id: 'dummy-team-2',
      name: "Web3 Builders",
      description: "Creating decentralized solutions for the future of finance.",
      hackathon: { title: "Web3 Future Builder", start_date: "2024-09-10", end_date: "2024-09-12" },
      hackathon_id: 'hack-2',
      leader_id: 'some-other-id',
      leader: { username: 'teamlead', full_name: 'Team Leader' },
      tech_stack: ["Solidity", "React", "Web3.js", "Ethereum"],
      looking_for_skills: ["Blockchain Developer", "Frontend Developer"],
      max_members: 5,
      member_count: 2,
      members: [],
      is_member: true,
      is_leader: false,
      invite_code: ""
    }
  ];

  // Add dummy teams for browse section
  const dummyBrowseTeams = [
    {
      id: 'dummy-team-3',
      name: "Green Tech Solutions",
      description: "Developing sustainable technology to combat climate change.",
      hackathon: { title: "Green Tech Hackathon", start_date: "2024-10-05", end_date: "2024-10-07" },
      hackathon_id: 'hack-3',
      leader_id: 'green-leader',
      leader: { username: 'greendev', full_name: 'Green Developer' },
      tech_stack: ["React Native", "Python", "Firebase", "IoT"],
      looking_for_skills: ["Data Scientist", "Mobile Developer"],
      max_members: 4,
      member_count: 2,
      members: [],
      is_member: false,
      is_leader: false,
      invite_code: ""
    },
    {
      id: 'dummy-team-4',
      name: "Data Wizards",
      description: "Transforming raw data into meaningful insights and predictions.",
      hackathon: { title: "Data Science Summit", start_date: "2024-11-15", end_date: "2024-11-17" },
      hackathon_id: 'hack-4',
      leader_id: 'data-leader',
      leader: { username: 'datawiz', full_name: 'Data Wizard' },
      tech_stack: ["Python", "TensorFlow", "Pandas", "Tableau"],
      looking_for_skills: ["ML Engineer", "Data Analyst"],
      max_members: 3,
      member_count: 1,
      members: [],
      is_member: false,
      is_leader: false,
      invite_code: ""
    }
  ];

  useEffect(() => {
    if (user) {
      fetchUserTeams();
      fetchAvailableTeams();
    }
  }, [user, fetchUserTeams, fetchAvailableTeams]);

  const handleJoinRequest = async (teamId: string) => {
    const success = await requestToJoinTeam(teamId);
    if (success) {
      toast({
        title: "Request Sent!",
        description: "Your request to join the team has been sent to the team leader.",
      });
    }
  };

  // Get unique hackathons from available teams for filter
  const availableHackathons = teams.reduce((acc: any[], team) => {
    if (team.hackathon && !acc.find(h => h.id === team.hackathon_id)) {
      acc.push({
        id: team.hackathon_id,
        title: team.hackathon.title
      });
    }
    return acc;
  }, []);

  // Combine real and dummy teams
  const combinedUserTeams = [...userTeams, ...dummyUserTeams];
  const combinedBrowseTeams = [...teams, ...dummyBrowseTeams];

  // Filter available teams
  const filteredTeams = combinedBrowseTeams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.hackathon?.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesHackathon = hackathonFilter === 'all' || team.hackathon_id === hackathonFilter;
    
    return matchesSearch && matchesHackathon && !team.is_member;
  });

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
              <p className="mb-4">Please sign in to manage your teams.</p>
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
            Team Management
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Manage your hackathon teams, create new ones, or join existing teams.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">Error: {error}</p>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="your-teams">
              Your Teams ({combinedUserTeams.length})
            </TabsTrigger>
            <TabsTrigger value="browse-teams">
              Browse Teams ({filteredTeams.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="your-teams" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Your Teams</h2>
              <Button 
                onClick={() => navigate('/create-team')}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Team
              </Button>
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading your teams...</p>
              </div>
            ) : combinedUserTeams.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {combinedUserTeams.map((team) => (
                  <SupabaseTeamCard 
                    key={team.id} 
                    team={team} 
                    variant="user-team"
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No teams yet</h3>
                <p className="text-gray-500 mb-4">You haven't created or joined any teams yet.</p>
                <Button 
                  onClick={() => navigate('/create-team')}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  Create Your First Team
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="browse-teams" className="space-y-6">
            {/* Show teams instead of redirecting */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Available Teams</h2>
              <div className="flex gap-2">
                <Input
                  placeholder="Search teams..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
              </div>
            </div>
            
            {filteredTeams.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTeams.map((team) => (
                  <SupabaseTeamCard 
                    key={team.id} 
                    team={team} 
                    variant="available"
                    onJoinRequest={handleJoinRequest}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No teams found</h3>
                <p className="text-gray-500 mb-4">Try adjusting your search or filters.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {userTeams.length}
              </div>
              <div className="text-sm text-gray-600">Your Teams</div>
            </CardContent>
          </Card>
          <Card className="text-center bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {userTeams.filter(team => team.is_leader).length}
              </div>
              <div className="text-sm text-gray-600">Teams You Lead</div>
            </CardContent>
          </Card>
          <Card className="text-center bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {teams.length}
              </div>
              <div className="text-sm text-gray-600">Available Teams</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Teams;
