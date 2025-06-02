
import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Users, MapPin, Clock, Trophy, Code, ExternalLink, Settings, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useNotificationStore } from '@/stores/notificationStore';
import { useSupabaseTeamStore } from '@/stores/supabaseTeamStore';
import { supabase } from '@/integrations/supabase/client';
import Certificate from '@/components/Certificate';

interface Hackathon {
  id: string;
  title: string;
  start_date: string;
  end_date: string;
  location: string;
  image_url?: string;
  registration_status?: string;
  team?: any;
}

const MyEvents = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addNotification } = useNotificationStore();
  const { userTeams, fetchUserTeams } = useSupabaseTeamStore();
  const [registeredHackathons, setRegisteredHackathons] = useState<Hackathon[]>([]);
  const [pastHackathons, setPastHackathons] = useState<Hackathon[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchRegisteredHackathons();
      fetchUserTeams();
    }
  }, [user, fetchUserTeams]);

  useEffect(() => {
    // Update hackathons with team information when userTeams changes
    if (userTeams.length > 0) {
      updateHackathonsWithTeams();
    }
  }, [userTeams]);

  const fetchRegisteredHackathons = async () => {
    try {
      setIsLoading(true);
      const { data: registrations, error } = await supabase
        .from('registrations')
        .select(`
          *,
          hackathons(*)
        `)
        .eq('user_id', user?.id)
        .eq('status', 'confirmed');

      if (error) throw error;

      const hackathons = registrations?.map(reg => reg.hackathons).filter(Boolean) || [];
      
      // Separate current and past hackathons
      const now = new Date();
      const current = hackathons.filter(h => new Date(h.end_date) >= now);
      const past = hackathons.filter(h => new Date(h.end_date) < now);
      
      setRegisteredHackathons(current);
      setPastHackathons(past);
    } catch (error: any) {
      console.error('Error fetching hackathons:', error);
      toast({
        title: "Error",
        description: "Failed to fetch your registered hackathons",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateHackathonsWithTeams = () => {
    // Update current hackathons with team info
    setRegisteredHackathons(prev => prev.map(hackathon => {
      const team = userTeams.find(t => t.hackathon_id === hackathon.id);
      return { ...hackathon, team };
    }));

    // Update past hackathons with team info
    setPastHackathons(prev => prev.map(hackathon => {
      const team = userTeams.find(t => t.hackathon_id === hackathon.id);
      return { ...hackathon, team };
    }));
  };

  const handleViewDetails = (hackathon: Hackathon) => {
    console.log(`Viewing details for hackathon ${hackathon.id}: ${hackathon.title}`);
    navigate(`/hackathon/${hackathon.id}`);
  };

  const handleManageTeam = (hackathon: Hackathon) => {
    if (hackathon.team) {
      console.log(`Managing team for hackathon ${hackathon.id}: ${hackathon.team.name}`);
      navigate(`/team/${hackathon.team.id}`);
    }
  };

  const handleCreateTeam = (hackathon: Hackathon) => {
    console.log(`Creating team for hackathon ${hackathon.id}: ${hackathon.title}`);
    navigate(`/create-team?hackathon=${hackathon.id}`);
  };

  const handleJoinTeam = (hackathon: Hackathon) => {
    console.log(`Looking for teams for hackathon ${hackathon.id}: ${hackathon.title}`);
    navigate(`/teams?tab=browse-teams&hackathon=${hackathon.id}`);
  };

  const handleViewProject = (hackathon: Hackathon) => {
    console.log(`Viewing project for hackathon ${hackathon.id}`);
    if (hackathon.team?.project_ideas?.[0]) {
      navigate(`/project/${hackathon.team.project_ideas[0].id}`);
    } else {
      toast({
        title: "No Project Found",
        description: "No project has been submitted for this hackathon yet.",
      });
    }
  };

  const handleDownloadCertificate = (hackathon: Hackathon) => {
    console.log(`Downloading certificate for hackathon ${hackathon.id}: ${hackathon.title}`);
    toast({
      title: "Opening Certificate",
      description: `Preparing certificate for ${hackathon.title}...`,
    });

    // Create a new window for the certificate
    const certificateWindow = window.open('', '_blank');
    if (certificateWindow) {
      certificateWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Certificate - ${hackathon.title}</title>
            <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
            <style>
              @media print {
                body { margin: 0; padding: 0; }
                .certificate { page-break-inside: avoid; }
              }
            </style>
          </head>
          <body class="bg-gray-100 min-h-screen flex items-center justify-center p-8">
            <div id="certificate-container"></div>
          </body>
        </html>
      `);

      // Add print button
      const printButton = certificateWindow.document.createElement('button');
      printButton.innerHTML = 'Print Certificate';
      printButton.className = 'fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition-colors';
      printButton.onclick = () => certificateWindow.print();
      certificateWindow.document.body.appendChild(printButton);
    }

    addNotification({
      title: "Certificate Opened",
      message: `Certificate for ${hackathon.title} has been opened in a new tab`,
      type: "success"
    });
  };

  const HackathonCard = ({ hackathon, isPast = false }: { hackathon: Hackathon, isPast?: boolean }) => (
    <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{hackathon.title}</CardTitle>
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <Calendar className="h-4 w-4 mr-1" />
              {hackathon.start_date} - {hackathon.end_date}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-1" />
              {hackathon.location}
            </div>
          </div>
          <Badge
            variant={
              isPast ? 'outline' : 'default'
            }
          >
            {isPast ? 'Completed' : 'Registered'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* Team Status */}
        <div className="space-y-3 mb-4">
          {hackathon.team ? (
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-800">{hackathon.team.name}</span>
                {hackathon.team.is_leader && (
                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">Leader</Badge>
                )}
              </div>
              <div className="text-sm text-green-700">
                {hackathon.team.member_count}/{hackathon.team.max_members} members
              </div>
            </div>
          ) : !isPast && (
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-amber-600" />
                <span className="font-medium text-amber-800">No Team Yet</span>
              </div>
              <div className="text-sm text-amber-700">
                You haven't joined or created a team for this hackathon
              </div>
            </div>
          )}
        </div>
        
        <div className="flex gap-2 mt-4">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => handleViewDetails(hackathon)}
            className="hover:bg-blue-50 transition-colors"
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            View Details
          </Button>

          {!isPast && (
            <>
              {hackathon.team ? (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleManageTeam(hackathon)}
                  className="hover:bg-purple-50 transition-colors"
                >
                  <Settings className="h-3 w-3 mr-1" />
                  {hackathon.team.is_leader ? 'Manage Team' : 'View Team'}
                </Button>
              ) : (
                <>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleCreateTeam(hackathon)}
                    className="hover:bg-green-50 transition-colors"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Create Team
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleJoinTeam(hackathon)}
                    className="hover:bg-blue-50 transition-colors"
                  >
                    <Users className="h-3 w-3 mr-1" />
                    Find Team
                  </Button>
                </>
              )}
            </>
          )}

          {isPast && (
            <>
              {hackathon.team && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleViewProject(hackathon)}
                  className="hover:bg-green-50 transition-colors"
                >
                  <Code className="h-3 w-3 mr-1" />
                  View Project
                </Button>
              )}
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleDownloadCertificate(hackathon)}
                className="hover:bg-yellow-50 transition-colors"
              >
                <Trophy className="h-3 w-3 mr-1" />
                Certificate
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );

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
              <p className="mb-4">Please sign in to view your events.</p>
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
            My Events
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Track your hackathon journey, manage your teams, and view your achievements.
          </p>
        </div>

        <Tabs defaultValue="current" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="current">Current Events</TabsTrigger>
            <TabsTrigger value="past">Past Events</TabsTrigger>
          </TabsList>
          
          <TabsContent value="current" className="space-y-6">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading your events...</p>
              </div>
            ) : registeredHackathons.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {registeredHackathons.map((hackathon) => (
                  <HackathonCard key={hackathon.id} hackathon={hackathon} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No current events</h3>
                <p className="text-gray-500 mb-4">You haven't registered for any upcoming hackathons yet.</p>
                <Button 
                  onClick={() => navigate('/')}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  Browse Hackathons
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="past" className="space-y-6">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading past events...</p>
              </div>
            ) : pastHackathons.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastHackathons.map((hackathon) => (
                  <HackathonCard key={hackathon.id} hackathon={hackathon} isPast />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No past events</h3>
                <p className="text-gray-500">Your completed hackathons will appear here.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="text-center bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {registeredHackathons.length + pastHackathons.length}
              </div>
              <div className="text-sm text-gray-600">Total Events</div>
            </CardContent>
          </Card>
          <Card className="text-center bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {registeredHackathons.length}
              </div>
              <div className="text-sm text-gray-600">Active Registrations</div>
            </CardContent>
          </Card>
          <Card className="text-center bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {userTeams.length}
              </div>
              <div className="text-sm text-gray-600">Teams Joined</div>
            </CardContent>
          </Card>
          <Card className="text-center bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-indigo-600 mb-2">
                {userTeams.filter(team => team.is_leader).length}
              </div>
              <div className="text-sm text-gray-600">Teams Led</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MyEvents;
