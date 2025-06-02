import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import TeamInfoPanel from './components/TeamInfoPanel';
import MembersList from './components/MembersList';
import ProjectIdeaBoard from './components/ProjectIdeaBoard';
import CommentSection from './components/CommentSection';
import NotificationFeed from './components/NotificationFeed';
import DeadlineReminder from './components/DeadlineReminder';
import Icon from '../../components/AppIcon';

const TeamDashboardScreen = () => {
  const [activeTab, setActiveTab] = useState('ideas');
  const [isOnline, setIsOnline] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Mock team data
  const teamData = {
    id: "team-001",
    name: "CodeCrafters",
    description: "Building innovative solutions for sustainable technology",
    hackathon: {
      name: "EcoTech Hackathon 2025",
      theme: "Sustainable Technology",
      endDate: "2025-06-15T23:59:59Z",
      registrationDeadline: "2025-06-10T23:59:59Z"
    },
    leader: "alex_chen",
    members: [
      {
        id: "user-001",
        username: "alex_chen",
        name: "Alex Chen",
        role: "Team Leader",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        skills: ["React", "Node.js", "UI/UX Design", "Project Management"],
        isOnline: true,
        joinedAt: "2024-01-15T10:00:00Z"
      },
      {
        id: "user-002",
        username: "sarah_dev",
        name: "Sarah Johnson",
        role: "Frontend Developer",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        skills: ["React", "TypeScript", "CSS", "Figma"],
        isOnline: true,
        joinedAt: "2024-01-16T14:30:00Z"
      },
      {
        id: "user-003",
        username: "mike_backend",
        name: "Mike Rodriguez",
        role: "Backend Developer",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        skills: ["Python", "Django", "PostgreSQL", "AWS"],
        isOnline: false,
        joinedAt: "2024-01-17T09:15:00Z"
      },
      {
        id: "user-004",
        username: "emma_data",
        name: "Emma Wilson",
        role: "Data Scientist",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        skills: ["Python", "Machine Learning", "TensorFlow", "Data Analysis"],
        isOnline: true,
        joinedAt: "2024-01-18T11:45:00Z"
      }
    ]
  };

  const projectIdeas = [
    {
      id: "idea-001",
      title: "EcoTrack - Carbon Footprint Monitor",
      description: `A comprehensive platform that helps individuals and businesses track their carbon footprint in real-time. Users can input daily activities, transportation methods, and energy consumption to get personalized insights and actionable recommendations for reducing their environmental impact.

The app will feature AI-powered suggestions, gamification elements to encourage sustainable behavior, and integration with smart home devices for automatic data collection.`,
      author: "alex_chen",
      authorName: "Alex Chen",
      techStack: ["React Native", "Node.js", "MongoDB", "TensorFlow", "IoT Integration"],
      votes: 8,
      comments: 12,
      createdAt: "2025-06-01T10:30:00Z",
      updatedAt: "2025-06-03T15:45:00Z",
      hasVoted: true
    },
    {
      id: "idea-002",
      title: "GreenCommute - Sustainable Transportation Hub",
      description: `A smart transportation platform that optimizes commuting routes based on environmental impact, cost, and time efficiency. The system will aggregate data from public transport, bike-sharing, carpooling, and walking routes to suggest the most sustainable options.

Features include real-time transit updates, carbon savings calculator, social carpooling matching, and rewards for choosing eco-friendly transportation methods.`,
      author: "sarah_dev",
      authorName: "Sarah Johnson",
      techStack: ["React", "Express.js", "PostgreSQL", "Google Maps API", "Machine Learning"],
      votes: 6,
      comments: 8,
      createdAt: "2025-06-04T14:20:00Z",
      updatedAt: "2025-06-05T16:30:00Z",
      hasVoted: false
    },
    {
      id: "idea-003",
      title: "WasteWise - Smart Recycling Assistant",
      description: `An AI-powered mobile application that helps users properly sort and dispose of waste by scanning items with their camera. The app provides instant identification of materials, local recycling guidelines, and nearby drop-off locations.

Additional features include waste reduction tips, community challenges, impact tracking, and partnerships with local recycling centers for pickup scheduling.`,
      author: "emma_data",
      authorName: "Emma Wilson",
      techStack: ["Flutter", "Python", "Computer Vision", "Firebase", "Google Cloud"],
      votes: 5,
      comments: 6,
      createdAt: "2025-06-06T09:15:00Z",
      updatedAt: "2025-06-06T11:20:00Z",
      hasVoted: false
    }
  ];

  const notifications = [
    {
      id: "notif-001",
      type: "deadline",
      title: "Registration Deadline Approaching",
      message: "Only 3 days left to finalize your team registration for EcoTech Hackathon 2025",
      timestamp: "2025-06-07T08:00:00Z",
      isRead: false,
      priority: "high"
    },
    {
      id: "notif-002",
      type: "team",
      title: "New Team Member Joined",
      message: "Emma Wilson has joined your team as Data Scientist",
      timestamp: "2025-06-06T11:45:00Z",
      isRead: true,
      priority: "medium"
    },
    {
      id: "notif-003",
      type: "idea",
      title: "New Project Idea Posted",
      message: "Emma Wilson posted a new project idea: WasteWise - Smart Recycling Assistant",
      timestamp: "2025-06-06T09:15:00Z",
      isRead: true,
      priority: "low"
    },
    {
      id: "notif-004",
      type: "comment",
      title: "New Comment on Your Idea",
      message: "Sarah Johnson commented on your EcoTrack project idea",
      timestamp: "2025-06-05T16:30:00Z",
      isRead: true,
      priority: "medium"
    }
  ];

  const chatMessages = [
    {
      id: "msg-001",
      sender: "sarah_dev",
      senderName: "Sarah Johnson",
      message: "Hey team! I've been working on the UI mockups for the EcoTrack idea. Should I share them here or create a separate design document?",
      timestamp: "2025-06-05T10:15:00Z",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face"
    },
    {
      id: "msg-002",
      sender: "alex_chen",
      senderName: "Alex Chen",
      message: "That's awesome Sarah! Please share them here for now, and we can discuss the design direction. Also, has everyone had a chance to review the project requirements?",
      timestamp: "2025-06-05T10:18:00Z",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
    },
    {
      id: "msg-003",
      sender: "emma_data",
      senderName: "Emma Wilson",
      message: "I've been researching the ML models we could use for carbon footprint calculation. TensorFlow.js might be perfect for real-time processing on the client side.",
      timestamp: "2025-06-05T10:22:00Z",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face"
    },
    {
      id: "msg-004",
      sender: "mike_backend",
      senderName: "Mike Rodriguez",
      message: "Great thinking Emma! I can start setting up the backend architecture. Should we go with microservices or a monolithic approach for the MVP?",
      timestamp: "2025-06-05T10:25:00Z",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
    }
  ];

  // Simulate data refresh
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-surface">
      <Header />
      
      {/* Offline Indicator */}
      {!isOnline && (
        <div className="bg-warning bg-opacity-10 border-b border-warning border-opacity-20 px-4 py-2">
          <div className="max-w-7xl mx-auto flex items-center justify-center space-x-2">
            <Icon name="WifiOff" size={16} className="text-warning" />
            <span className="text-sm text-warning font-medium">
              You're currently offline. Some features may be limited.
            </span>
          </div>
        </div>
      )}

      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Team Info Section */}
        <div className="mb-6">
          <TeamInfoPanel teamData={teamData} />
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-12 lg:gap-6">
          {/* Left Column - Team Members */}
          <div className="lg:col-span-3">
            <MembersList members={teamData.members} teamLeader={teamData.leader} />
            <div className="mt-6">
              <DeadlineReminder hackathon={teamData.hackathon} />
            </div>
          </div>

          {/* Center Column - Project Ideas */}
          <div className="lg:col-span-6">
            <ProjectIdeaBoard 
              ideas={projectIdeas} 
              teamId={teamData.id}
              currentUser="alex_chen"
            />
          </div>

          {/* Right Column - Notifications & Chat */}
          <div className="lg:col-span-3 space-y-6">
            <NotificationFeed 
              notifications={notifications}
              lastUpdated={lastUpdated}
            />
            <CommentSection 
              messages={chatMessages}
              currentUser="alex_chen"
              teamId={teamData.id}
            />
          </div>
        </div>

        {/* Mobile Layout - Tabbed Interface */}
        <div className="lg:hidden">
          {/* Tab Navigation */}
          <div className="border-b border-border mb-6">
            <nav className="flex space-x-8" aria-label="Dashboard sections">
              {[
                { id: 'ideas', name: 'Ideas', icon: 'Lightbulb' },
                { id: 'team', name: 'Team', icon: 'Users' },
                { id: 'chat', name: 'Chat', icon: 'MessageCircle' },
                { id: 'notifications', name: 'Updates', icon: 'Bell' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary text-primary' :'border-transparent text-text-secondary hover:text-text-primary hover:border-border'
                  }`}
                  aria-current={activeTab === tab.id ? 'page' : undefined}
                >
                  <Icon name={tab.icon} size={16} />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === 'ideas' && (
              <ProjectIdeaBoard 
                ideas={projectIdeas} 
                teamId={teamData.id}
                currentUser="alex_chen"
              />
            )}
            
            {activeTab === 'team' && (
              <div className="space-y-6">
                <MembersList members={teamData.members} teamLeader={teamData.leader} />
                <DeadlineReminder hackathon={teamData.hackathon} />
              </div>
            )}
            
            {activeTab === 'chat' && (
              <CommentSection 
                messages={chatMessages}
                currentUser="alex_chen"
                teamId={teamData.id}
              />
            )}
            
            {activeTab === 'notifications' && (
              <NotificationFeed 
                notifications={notifications}
                lastUpdated={lastUpdated}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeamDashboardScreen;