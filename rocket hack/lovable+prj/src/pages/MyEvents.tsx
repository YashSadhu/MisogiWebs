import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Users, MapPin, Clock, Trophy, Code, ExternalLink, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useNotificationStore } from '@/stores/notificationStore';

const MyEvents = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addNotification } = useNotificationStore();

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

  const registeredEvents = [
    {
      id: 1,
      title: "AI Innovation Challenge 2024",
      status: "upcoming",
      startDate: "2024-07-15",
      endDate: "2024-07-17",
      location: "San Francisco, CA",
      registrationDate: "2024-06-20",
      teamStatus: "joined",
      teamName: "AI Innovators"
    },
    {
      id: 2,
      title: "Web3 Future Builder",
      status: "active",
      startDate: "2024-08-01",
      endDate: "2024-08-03",
      location: "Austin, TX",
      registrationDate: "2024-07-10",
      teamStatus: "leader",
      teamName: "Web3 Builders"
    }
  ];

  const pastEvents = [
    {
      id: 3,
      title: "Spring Code Jam 2024",
      status: "completed",
      startDate: "2024-04-15",
      endDate: "2024-04-17",
      location: "Boston, MA",
      placement: "2nd Place",
      teamName: "Code Warriors",
      projectTitle: "Smart Campus Navigator"
    }
  ];

  const handleViewDetails = (eventId: number, eventTitle: string) => {
    console.log(`Viewing details for event ${eventId}: ${eventTitle}`);
    toast({
      title: "Event Details",
      description: `Loading details for ${eventTitle}...`,
    });
    // Simulate navigation to event details
    setTimeout(() => {
      addNotification({
        title: "Event Details Viewed",
        message: `You viewed details for ${eventTitle}`,
        type: "info"
      });
    }, 500);
  };

  const handleManageTeam = (eventId: number, teamName: string) => {
    console.log(`Managing team for event ${eventId}: ${teamName}`);
    toast({
      title: "Team Management",
      description: `Opening team management for ${teamName}...`,
    });
    setTimeout(() => {
      addNotification({
        title: "Team Management",
        message: `You accessed team management for ${teamName}`,
        type: "info"
      });
    }, 500);
  };

  const handleViewProject = (eventId: number, projectTitle: string | undefined) => {
    console.log(`Viewing project for event ${eventId}: ${projectTitle}`);
    toast({
      title: "Project Showcase",
      description: `Opening project: ${projectTitle || 'Untitled Project'}...`,
    });
    setTimeout(() => {
      window.open('#', '_blank');
    }, 500);
  };

  const handleDownloadCertificate = (eventId: number, eventTitle: string) => {
    console.log(`Downloading certificate for event ${eventId}: ${eventTitle}`);
    toast({
      title: "Certificate Download",
      description: `Preparing certificate for ${eventTitle}...`,
    });
    setTimeout(() => {
      toast({
        title: "Download Started",
        description: "Your certificate is being downloaded.",
      });
      addNotification({
        title: "Certificate Downloaded",
        message: `Certificate for ${eventTitle} has been downloaded`,
        type: "success"
      });
    }, 1000);
  };

  const EventCard = ({ event, isPast = false }: { event: any, isPast?: boolean }) => (
    <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{event.title}</CardTitle>
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <Calendar className="h-4 w-4 mr-1" />
              {event.startDate} - {event.endDate}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-1" />
              {event.location}
            </div>
          </div>
          <Badge
            variant={
              event.status === 'active' ? 'default' :
              event.status === 'upcoming' ? 'secondary' : 'outline'
            }
          >
            {event.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {isPast ? (
          <div className="space-y-3">
            {event.placement && (
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-yellow-600" />
                <span className="font-semibold text-yellow-700">{event.placement}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-600" />
              <span className="text-sm">Team: {event.teamName}</span>
            </div>
            {event.projectTitle && (
              <div className="flex items-center gap-2">
                <Code className="h-4 w-4 text-gray-600" />
                <span className="text-sm">Project: {event.projectTitle}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-600" />
              <span className="text-sm">Registered: {event.registrationDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-600" />
              <span className="text-sm">
                Team: {event.teamName} 
                {event.teamStatus === 'leader' && (
                  <Badge variant="outline" className="ml-2 text-xs">Leader</Badge>
                )}
              </span>
            </div>
          </div>
        )}
        
        <div className="flex gap-2 mt-4">
          {!isPast && (
            <>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleViewDetails(event.id, event.title)}
                className="hover:bg-blue-50 transition-colors"
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                View Details
              </Button>
              {event.teamStatus === 'leader' && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleManageTeam(event.id, event.teamName)}
                  className="hover:bg-purple-50 transition-colors"
                >
                  <Settings className="h-3 w-3 mr-1" />
                  Manage Team
                </Button>
              )}
            </>
          )}
          {isPast && (
            <>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleViewProject(event.id, event.projectTitle)}
                className="hover:bg-green-50 transition-colors"
              >
                <Code className="h-3 w-3 mr-1" />
                View Project
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleDownloadCertificate(event.id, event.title)}
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
            {registeredEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {registeredEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
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
            {pastEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastEvents.map((event) => (
                  <EventCard key={event.id} event={event} isPast />
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
                {registeredEvents.length + pastEvents.length}
              </div>
              <div className="text-sm text-gray-600">Total Events</div>
            </CardContent>
          </Card>
          <Card className="text-center bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {registeredEvents.length}
              </div>
              <div className="text-sm text-gray-600">Active Registrations</div>
            </CardContent>
          </Card>
          <Card className="text-center bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {pastEvents.filter(e => e.placement).length}
              </div>
              <div className="text-sm text-gray-600">Awards Won</div>
            </CardContent>
          </Card>
          <Card className="text-center bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-indigo-600 mb-2">
                {registeredEvents.filter(e => e.teamStatus === 'leader').length}
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
