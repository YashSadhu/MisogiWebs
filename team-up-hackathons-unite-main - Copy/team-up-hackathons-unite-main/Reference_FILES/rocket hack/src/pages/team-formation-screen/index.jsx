import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/ui/Header';
import TabNavigation from './components/TabNavigation';
import TeamCard from './components/TeamCard';
import CreateTeamModal from './components/CreateTeamModal';
import FilterControls from './components/FilterControls';
import Icon from '../../components/AppIcon';

const TeamFormationScreen = () => {
  const [activeTab, setActiveTab] = useState('available');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    skillMatch: 0,
    availableSlots: false,
    skills: []
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for available teams
  const availableTeams = [
    {
      id: 1,
      name: "AI Innovators",
      description: `We're building an AI-powered solution for sustainable agriculture. Our team focuses on creating machine learning models that can predict crop yields and optimize farming practices. We're looking for passionate developers who want to make a real impact on food security and environmental sustainability.`,
      currentMembers: 3,
      maxMembers: 5,
      requiredSkills: ["Machine Learning", "Python", "React", "Node.js"],
      skillMatchPercentage: 85,
      hackathonName: "EcoTech Challenge 2024",
      teamLead: "Sarah Chen",
      teamLeadAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      members: [
        { name: "Sarah Chen", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face", skills: ["ML", "Python"] },
        { name: "Mike Johnson", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face", skills: ["Backend", "Node.js"] },
        { name: "Lisa Wang", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face", skills: ["Frontend", "React"] }
      ],
      projectIdea: "Smart farming assistant with predictive analytics",
      techStack: ["TensorFlow", "React", "Node.js", "MongoDB"],
      isRequestSent: false
    },
    {
      id: 2,
      name: "FinTech Pioneers",
      description: `Revolutionary blockchain-based payment solution for emerging markets. We're developing a decentralized platform that enables secure, low-cost transactions for underbanked populations. Join us if you're passionate about financial inclusion and cutting-edge technology.`,
      currentMembers: 2,
      maxMembers: 4,
      requiredSkills: ["Blockchain", "Solidity", "React", "Web3"],
      skillMatchPercentage: 72,
      hackathonName: "FinTech Revolution 2024",
      teamLead: "Alex Rodriguez",
      teamLeadAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      members: [
        { name: "Alex Rodriguez", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face", skills: ["Blockchain", "Solidity"] },
        { name: "Emma Davis", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face", skills: ["Frontend", "React"] }
      ],
      projectIdea: "Decentralized micro-lending platform",
      techStack: ["Ethereum", "Solidity", "React", "IPFS"],
      isRequestSent: false
    },
    {
      id: 3,
      name: "HealthTech Heroes",
      description: `Building the future of telemedicine with AR/VR integration. Our mission is to create immersive healthcare experiences that bridge the gap between patients and healthcare providers. We're looking for developers passionate about healthcare innovation.`,
      currentMembers: 4,
      maxMembers: 4,
      requiredSkills: ["Unity", "C#", "WebRTC", "React"],
      skillMatchPercentage: 60,
      hackathonName: "HealthTech Innovation 2024",
      teamLead: "Dr. James Wilson",
      teamLeadAvatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
      members: [
        { name: "Dr. James Wilson", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face", skills: ["Unity", "C#"] },
        { name: "Rachel Kim", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face", skills: ["WebRTC", "Backend"] },
        { name: "Tom Brown", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face", skills: ["React", "Frontend"] },
        { name: "Nina Patel", avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face", skills: ["UX Design", "Figma"] }
      ],
      projectIdea: "VR-powered remote surgery training platform",
      techStack: ["Unity", "WebRTC", "React", "Node.js"],
      isRequestSent: true,
      isFull: true
    },
    {
      id: 4,
      name: "EduTech Innovators",
      description: `Transforming online education with gamification and AI. We're creating an adaptive learning platform that personalizes education for every student. Looking for passionate developers who believe in the power of education technology.`,
      currentMembers: 1,
      maxMembers: 6,
      requiredSkills: ["React", "Python", "TensorFlow", "PostgreSQL"],
      skillMatchPercentage: 90,
      hackathonName: "EdTech Future 2024",
      teamLead: "Maria Garcia",
      teamLeadAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face",
      members: [
        { name: "Maria Garcia", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face", skills: ["React", "Python"] }
      ],
      projectIdea: "AI-powered personalized learning assistant",
      techStack: ["React", "Python", "TensorFlow", "PostgreSQL"],
      isRequestSent: false
    }
  ];

  // Mock data for user's teams
  const myTeams = [
    {
      id: 5,
      name: "Code Crusaders",
      description: `Our team is developing a revolutionary social impact platform that connects volunteers with local organizations. We're passionate about using technology to solve real-world problems and create meaningful change in communities.`,
      currentMembers: 3,
      maxMembers: 5,
      requiredSkills: ["React", "Node.js", "MongoDB", "Express"],
      hackathonName: "Social Impact Hackathon 2024",
      teamLead: "You",
      isOwner: true,
      inviteCode: "CRUSH2024",
      members: [
        { name: "You", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face", skills: ["React", "Node.js"] },
        { name: "David Lee", avatar: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face", skills: ["MongoDB", "Backend"] },
        { name: "Sophie Turner", avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face", skills: ["UI/UX", "Design"] }
      ],
      projectIdea: "Community volunteer matching platform",
      techStack: ["React", "Node.js", "MongoDB", "Express"],
      pendingRequests: 2,
      teamStatus: "Active"
    },
    {
      id: 6,
      name: "Data Wizards",
      description: `Joined this amazing team working on climate data visualization. We're creating interactive dashboards that help policymakers understand climate trends and make informed decisions for environmental protection.`,
      currentMembers: 4,
      maxMembers: 4,
      requiredSkills: ["D3.js", "Python", "React", "FastAPI"],
      hackathonName: "Climate Tech Challenge 2024",
      teamLead: "Dr. Amanda Foster",
      isOwner: false,
      members: [
        { name: "Dr. Amanda Foster", avatar: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=150&h=150&fit=crop&crop=face", skills: ["Data Science", "Python"] },
        { name: "You", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face", skills: ["React", "D3.js"] },
        { name: "Carlos Martinez", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face", skills: ["FastAPI", "Backend"] },
        { name: "Zoe Chen", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face", skills: ["Data Viz", "D3.js"] }
      ],
      projectIdea: "Interactive climate data dashboard",
      techStack: ["D3.js", "Python", "React", "FastAPI"],
      teamStatus: "Active"
    }
  ];

  const tabs = [
    { id: 'available', label: 'Available Teams', count: availableTeams.length },
    { id: 'my-teams', label: 'My Teams', count: myTeams.length }
  ];

  const filteredAvailableTeams = availableTeams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         team.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         team.hackathonName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSkillFilter = filters.skillMatch === 0 || team.skillMatchPercentage >= filters.skillMatch;
    const matchesSlotFilter = !filters.availableSlots || team.currentMembers < team.maxMembers;
    
    return matchesSearch && matchesSkillFilter && matchesSlotFilter;
  });

  const handleCreateTeam = (teamData) => {
    console.log('Creating team:', teamData);
    setIsCreateModalOpen(false);
    // In a real app, this would make an API call
  };

  const handleJoinRequest = (teamId) => {
    console.log('Requesting to join team:', teamId);
    // In a real app, this would make an API call
  };

  return (
    <div className="min-h-screen bg-surface">
      <Header />
      
      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-text-primary">Team Formation</h1>
              <p className="mt-2 text-text-secondary">
                Find the perfect team or create your own for upcoming hackathons
              </p>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-hover focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors shadow-sm"
            >
              <Icon name="Plus" size={20} className="mr-2" />
              Create Team
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <TabNavigation 
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Content Area */}
        <div className="mt-6">
          {activeTab === 'available' && (
            <div className="space-y-6">
              {/* Search and Filters */}
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Icon name="Search" size={20} className="text-text-tertiary" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search teams by name, description, or hackathon..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-border rounded-lg leading-5 bg-background placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>
                <FilterControls 
                  filters={filters}
                  onFiltersChange={setFilters}
                />
              </div>

              {/* Teams Grid */}
              {filteredAvailableTeams.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredAvailableTeams.map((team) => (
                    <TeamCard
                      key={team.id}
                      team={team}
                      variant="available"
                      onJoinRequest={handleJoinRequest}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="Users" size={32} className="text-primary" />
                  </div>
                  <h3 className="text-lg font-medium text-text-primary mb-2">No teams found</h3>
                  <p className="text-text-secondary mb-6">
                    Try adjusting your search criteria or create a new team
                  </p>
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="inline-flex items-center px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-hover transition-colors"
                  >
                    <Icon name="Plus" size={16} className="mr-2" />
                    Create Team
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'my-teams' && (
            <div className="space-y-6">
              {myTeams.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {myTeams.map((team) => (
                    <TeamCard
                      key={team.id}
                      team={team}
                      variant="my-team"
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="UserPlus" size={32} className="text-primary" />
                  </div>
                  <h3 className="text-lg font-medium text-text-primary mb-2">No teams yet</h3>
                  <p className="text-text-secondary mb-6">
                    Create your first team or join an existing one to get started
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={() => setIsCreateModalOpen(true)}
                      className="inline-flex items-center px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-hover transition-colors"
                    >
                      <Icon name="Plus" size={16} className="mr-2" />
                      Create Team
                    </button>
                    <button
                      onClick={() => setActiveTab('available')}
                      className="inline-flex items-center px-4 py-2 bg-surface text-text-primary border border-border font-medium rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Icon name="Search" size={16} className="mr-2" />
                      Browse Teams
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Navigation */}
        <div className="mt-12 p-6 bg-background rounded-lg border border-border">
          <h3 className="text-lg font-medium text-text-primary mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              to="/hackathon-details-registration-screen"
              className="flex items-center p-4 bg-surface rounded-lg hover:bg-gray-100 transition-colors group"
            >
              <div className="w-10 h-10 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center mr-3">
                <Icon name="Calendar" size={20} className="text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-text-primary group-hover:text-primary transition-colors">
                  Browse Hackathons
                </h4>
                <p className="text-sm text-text-secondary">
                  Find events to participate in
                </p>
              </div>
              <Icon name="ArrowRight" size={16} className="text-text-tertiary ml-auto" />
            </Link>
            <Link
              to="/team-dashboard-screen"
              className="flex items-center p-4 bg-surface rounded-lg hover:bg-gray-100 transition-colors group"
            >
              <div className="w-10 h-10 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center mr-3">
                <Icon name="BarChart3" size={20} className="text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-text-primary group-hover:text-primary transition-colors">
                  Team Dashboard
                </h4>
                <p className="text-sm text-text-secondary">
                  Manage your teams and projects
                </p>
              </div>
              <Icon name="ArrowRight" size={16} className="text-text-tertiary ml-auto" />
            </Link>
          </div>
        </div>
      </main>

      {/* Create Team Modal */}
      <CreateTeamModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTeam}
      />
    </div>
  );
};

export default TeamFormationScreen;