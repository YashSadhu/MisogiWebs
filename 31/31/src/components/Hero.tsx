
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Code, Calendar } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useNotificationStore } from '@/stores/notificationStore';

const Hero = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addNotification } = useNotificationStore();

  const handleFindTeam = () => {
    console.log('Find Team button clicked');
    if (user) {
      toast({
        title: "Navigating to Teams",
        description: "Finding amazing teams for you...",
      });
      setTimeout(() => navigate('/find-team'), 500);
    } else {
      toast({
        title: "Sign In Required",
        description: "Please sign in to find teams.",
        variant: "destructive"
      });
      navigate('/auth');
    }
  };

  const handleCreateTeam = () => {
    console.log('Create Team button clicked');
    if (user) {
      toast({
        title: "Team Creation",
        description: "Let's build your dream team!",
      });
      setTimeout(() => navigate('/create-team'), 500);
    } else {
      toast({
        title: "Sign In Required",
        description: "Please sign in to create a team.",
        variant: "destructive"
      });
      navigate('/auth');
    }
  };

  const handleViewProjects = () => {
    console.log('Projects button clicked');
    toast({
      title: "Project Showcase",
      description: "Exploring amazing hackathon projects...",
    });
    setTimeout(() => navigate('/projects'), 500);
  };

  const handleMyEvents = () => {
    console.log('My Events button clicked');
    if (user) {
      toast({
        title: "My Events",
        description: "Loading your hackathon journey...",
      });
      setTimeout(() => {
        navigate('/my-events');
        addNotification({
          title: "Events Dashboard",
          message: "Welcome to your events dashboard! Track your progress here.",
          type: "info"
        });
      }, 500);
    } else {
      toast({
        title: "Sign In Required",
        description: "Please sign in to view your events.",
        variant: "destructive"
      });
      navigate('/auth');
    }
  };

  return (
    <section className="relative py-20 px-4 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-blue-600/10 to-indigo-600/10" />
      <div className="absolute top-20 left-20 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
      
      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-8">
            <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Build the Future
            </span>
            <br />
            <span className="text-gray-800">Together</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            Connect with passionate developers, designers, and innovators. 
            Join hackathons, form teams, and create solutions that matter.
          </p>
          
          {/* CTA Buttons Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white p-6 h-auto flex flex-col items-center space-y-2 transform hover:scale-105 transition-all duration-200"
              onClick={handleFindTeam}
            >
              <Users className="h-6 w-6" />
              <span>Find Your Team</span>
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-purple-200 hover:bg-purple-50 p-6 h-auto flex flex-col items-center space-y-2 transform hover:scale-105 transition-all duration-200"
              onClick={handleCreateTeam}
            >
              <Users className="h-6 w-6" />
              <span>Create Your Team</span>
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-blue-200 hover:bg-blue-50 p-6 h-auto flex flex-col items-center space-y-2 transform hover:scale-105 transition-all duration-200"
              onClick={handleViewProjects}
            >
              <Code className="h-6 w-6" />
              <span>Projects</span>
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-indigo-200 hover:bg-indigo-50 p-6 h-auto flex flex-col items-center space-y-2 transform hover:scale-105 transition-all duration-200"
              onClick={handleMyEvents}
            >
              <Calendar className="h-6 w-6" />
              <span>My Events</span>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <div className="text-center p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-purple-100 hover:shadow-lg transition-shadow">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Team Formation</h3>
            <p className="text-gray-600">Find teammates with complementary skills or create your own team for upcoming hackathons.</p>
          </div>
          
          <div className="text-center p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-blue-100 hover:shadow-lg transition-shadow">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Event Discovery</h3>
            <p className="text-gray-600">Discover hackathons worldwide, register for events, and track your participation history.</p>
          </div>
          
          <div className="text-center p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-indigo-100 hover:shadow-lg transition-shadow">
            <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Code className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Project Showcase</h3>
            <p className="text-gray-600">Share your creations, get feedback from the community, and discover innovative solutions.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
