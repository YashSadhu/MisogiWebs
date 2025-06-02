import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Trophy, ClipboardList, MessageSquare, Bell, Lightbulb, Settings, LogOut, ChevronRight, PlusCircle, ArrowRight } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useNavigate } from 'react-router-dom';

interface CustomUser {
  name: string;
  email: string;
  avatarUrl: string;
}

const mockHackathons = [
  {
    id: 'hack001',
    name: 'AI Innovation Challenge',
    theme: 'Artificial Intelligence',
    date: '2024-08-15',
    registered: true,
    team: 'Team Alpha',
    progress: 75,
    deadline: '3 days left',
    icon: <Lightbulb className="h-5 w-5 text-purple-500" />
  },
  {
    id: 'hack002',
    name: 'Climate Tech Hack',
    theme: 'Sustainability',
    date: '2024-09-01',
    registered: false,
    team: null,
    progress: 0,
    deadline: 'Register by Aug 20',
    icon: <Users className="h-5 w-5 text-green-500" />
  },
];

const mockTeam = {
  name: 'Team Alpha',
  members: [
    { id: 'user001', name: 'Alex C.', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face' },
    { id: 'user002', name: 'Sarah J.', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=face' },
    { id: 'user003', name: 'Mike R.', avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face' },
  ],
  projectIdea: {
    title: 'EcoTrack - Carbon Footprint Monitor',
    description: 'A platform to track and reduce carbon footprint.',
    status: 'In Progress',
  },
};

const mockNotifications = [
  { id: 'notif001', title: 'Project Submission Reminder', message: 'EcoTrack submission due in 3 days.', time: '2h ago', read: false, icon: <Calendar className="h-4 w-4 text-orange-500"/> },
  { id: 'notif002', title: 'New Team Invite', message: 'You have been invited to join "Code Wizards".', time: '1 day ago', read: true, icon: <Users className="h-4 w-4 text-blue-500"/> },
  { id: 'notif003', title: 'Comment on your Idea', message: 'Sarah J. commented on EcoTrack.', time: '3 days ago', read: true, icon: <MessageSquare className="h-4 w-4 text-green-500"/> },
];

// Mock Data (replace with actual data fetching)
const mockUser: CustomUser = {
  name: 'Alex Chen',
  email: 'alex.chen@example.com',
  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
};

const Dashboard = () => {
  const { user } = useAuth();
  const currentUser: CustomUser = user ? {
    name: user.email?.split('@')[0] || 'User',
    email: user.email || '',
    avatarUrl: mockUser.avatarUrl
  } : mockUser;
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Welcome back, {currentUser.name}!
        </h1>
        <p className="text-gray-500 mt-1">Here's what's happening with your hackathons and teams.</p>
      </header>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Hackathons & Quick Actions) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white border border-gray-200/50 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
                <Trophy className="h-6 w-6 mr-2 text-purple-600" /> My Hackathons
              </CardTitle>
              <CardDescription className="text-gray-500">Overview of your ongoing and upcoming hackathons.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockHackathons.map(hackathon => (
                <Card key={hackathon.id} className="bg-gray-50 border border-gray-200 hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-start justify-between p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-md">{hackathon.icon}</div>
                      <div>
                        <CardTitle className="text-lg font-medium text-gray-900">{hackathon.name}</CardTitle>
                        <CardDescription className="text-sm text-gray-500">{hackathon.theme} - {hackathon.date}</CardDescription>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                      onClick={() => navigate(`/hackathons/${hackathon.id}`)}
                    >
                      View <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    {hackathon.registered ? (
                      <>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-500">Team: {hackathon.team}</span>
                          <span className="text-xs font-semibold text-purple-600">{hackathon.deadline}</span>
                        </div>
                        <Progress value={hackathon.progress} className="h-2 bg-gray-200 [&>div]:bg-gradient-to-r [&>div]:from-purple-600 [&>div]:to-blue-600" />
                      </>
                    ) : (
                      <Button 
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                        onClick={() => navigate(`/hackathons/${hackathon.id}`)}
                      >
                        Register Now <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </CardContent>
            <CardFooter className="p-4">
              <Button 
                variant="outline" 
                className="w-full border-purple-600 text-purple-600 hover:bg-purple-50"
                onClick={() => navigate('/')}
              >
                <Calendar className="h-4 w-4 mr-2" /> Explore More Hackathons
              </Button>
            </CardFooter>
          </Card>

          <Card className="bg-white border border-gray-200/50 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
                <Lightbulb className="h-6 w-6 mr-2 text-blue-600" /> Project Ideas & Collaboration
              </CardTitle>
            </CardHeader>
            <CardContent>
              {mockTeam.projectIdea ? (
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-900">{mockTeam.projectIdea.title}</h3>
                  <p className="text-sm text-gray-500 mb-2">{mockTeam.projectIdea.description}</p>
                  <Badge className={`text-xs ${mockTeam.projectIdea.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' : 'bg-green-100 text-green-700 border-green-200'}`}>
                    {mockTeam.projectIdea.status}
                  </Badge>
                  <Button 
                    variant="link" 
                    className="text-purple-600 p-0 h-auto mt-2 float-right"
                    onClick={() => navigate('/projects')}
                  >
                    Go to Project Board <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500 mb-3">No active project ideas for your current teams.</p>
                  <Button 
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                    onClick={() => navigate('/projects')}
                  >
                    <PlusCircle className="h-4 w-4 mr-2" /> Submit a New Idea
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column (Profile, Team, Notifications) */}
        <div className="space-y-6">
          <Card className="bg-white border border-gray-200/50 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="items-center text-center">
              <Avatar className="w-20 h-20 mx-auto mb-3 border-2 border-purple-600">
                <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
                <AvatarFallback>{currentUser.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-xl font-semibold text-gray-900">{currentUser.name}</CardTitle>
              <CardDescription className="text-gray-500">{currentUser.email}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full border-gray-200 text-gray-700 hover:bg-gray-50"
                onClick={() => navigate('/profile')}
              >
                <Settings className="h-4 w-4 mr-2" /> Account Settings
              </Button>
              <Button 
                variant="ghost" 
                className="w-full text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={() => navigate('/auth')}
              >
                <LogOut className="h-4 w-4 mr-2" /> Sign Out
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200/50 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                <Users className="h-5 w-5 mr-2 text-green-600" /> Current Team: {mockTeam.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex -space-x-2 overflow-hidden mb-3">
                {mockTeam.members.map(member => (
                  <Avatar key={member.id} className="inline-block h-8 w-8 rounded-full ring-2 ring-white">
                    <AvatarImage src={member.avatarUrl} alt={member.name} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <p className="text-sm text-gray-500 mb-3">{mockTeam.members.length} members actively collaborating.</p>
              <Button 
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                onClick={() => navigate('/find-team')}
              >
                View Team Details
              </Button>
              <Button
                variant="outline"
                className="w-full border-purple-600 text-purple-600 hover:bg-purple-100"
                onClick={() => navigate('/')}
              >
                Explore Hackathons
              </Button>
              <Button 
                variant="link"
                className="text-purple-600"
                onClick={() => navigate('/projects')}
              >
                View All Projects
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200/50 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                <Bell className="h-5 w-5 mr-2 text-purple-600" /> Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {mockNotifications.map(notif => (
                <div key={notif.id} className={`flex items-start gap-3 p-2.5 rounded-md ${notif.read ? 'bg-gray-50' : 'bg-purple-50 border border-purple-100'}`}>
                  <div className={`mt-1 ${notif.read ? 'text-gray-400' : 'text-purple-600'}`}>{notif.icon}</div>
                  <div>
                    <p className={`text-sm font-medium ${notif.read ? 'text-gray-700' : 'text-gray-900'}`}>{notif.title}</p>
                    <p className={`text-xs ${notif.read ? 'text-gray-500' : 'text-gray-600'}`}>{notif.message}</p>
                    <p className={`text-xs mt-0.5 ${notif.read ? 'text-gray-400' : 'text-purple-600'}`}>{notif.time}</p>
                  </div>
                  {!notif.read && <div className="w-2 h-2 rounded-full bg-purple-600 ml-auto mt-1 self-start shrink-0"></div>}
                </div>
              ))}
              {mockNotifications.length === 0 && <p className="text-gray-500 text-sm text-center py-4">No new notifications.</p>}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;