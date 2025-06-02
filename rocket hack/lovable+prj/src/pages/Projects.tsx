import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, ExternalLink, Github, Search, Filter } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useNotificationStore } from '@/stores/notificationStore';

const Projects = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addNotification } = useNotificationStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [endorsedProjects, setEndorsedProjects] = useState<Set<number>>(new Set());
  const [loadingEndorsement, setLoadingEndorsement] = useState<number | null>(null);

  const projects = [
    {
      id: 1,
      title: "EcoTracker AI",
      team: "Green Tech Solutions",
      hackathon: "Green Tech Hackathon",
      description: "An AI-powered app that helps users track their carbon footprint and suggests eco-friendly alternatives for daily activities.",
      techStack: ["React Native", "Python", "TensorFlow", "Firebase"],
      demoUrl: "https://ecotracker-demo.com",
      githubUrl: "https://github.com/team/ecotracker",
      endorsements: 24,
      category: "Environmental",
      imageUrl: "photo-1441974231531-c6227db76b6e"
    },
    {
      id: 2,
      title: "DeFi Yield Optimizer",
      team: "Web3 Builders",
      hackathon: "Web3 Future Builder",
      description: "A smart contract platform that automatically optimizes DeFi yield farming strategies across multiple protocols.",
      techStack: ["Solidity", "React", "Web3.js", "Ethereum"],
      demoUrl: "https://defi-optimizer.com",
      githubUrl: "https://github.com/team/defi-optimizer",
      endorsements: 31,
      category: "Blockchain",
      imageUrl: "photo-1639762681485-074b7f938ba0"
    },
    {
      id: 3,
      title: "HealthConnect AI",
      team: "AI Innovators",
      hackathon: "AI Innovation Challenge 2024",
      description: "An AI assistant that helps patients understand medical reports and connects them with appropriate healthcare providers.",
      techStack: ["Python", "TensorFlow", "React", "Node.js"],
      demoUrl: "https://healthconnect-ai.com",
      githubUrl: "https://github.com/team/healthconnect",
      endorsements: 45,
      category: "Healthcare",
      imageUrl: "photo-1576091160399-112ba8d25d1f"
    },
    {
      id: 4,
      title: "CodeMentor Bot",
      team: "Tech Educators",
      hackathon: "AI Innovation Challenge 2024",
      description: "An intelligent coding mentor that provides personalized learning paths and real-time code review for beginners.",
      techStack: ["Python", "OpenAI", "React", "FastAPI"],
      demoUrl: "https://codementor-bot.com",
      githubUrl: "https://github.com/team/codementor",
      endorsements: 18,
      category: "Education",
      imageUrl: "photo-1516321318423-f06f85e504b3"
    }
  ];

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.team.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || project.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    switch (sortBy) {
      case 'endorsements':
        return b.endorsements - a.endorsements;
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return b.id - a.id; // Most recent first
    }
  });

  const handleEndorse = async (projectId: number) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to endorse projects.",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }

    setLoadingEndorsement(projectId);
    console.log(`Endorsing project ${projectId}`);

    // Simulate API call
    setTimeout(() => {
      const project = projects.find(p => p.id === projectId);
      const isAlreadyEndorsed = endorsedProjects.has(projectId);
      
      if (isAlreadyEndorsed) {
        setEndorsedProjects(prev => {
          const newSet = new Set(prev);
          newSet.delete(projectId);
          return newSet;
        });
        toast({
          title: "Endorsement Removed",
          description: `You removed your endorsement from "${project?.title}".`,
        });
      } else {
        setEndorsedProjects(prev => new Set(prev).add(projectId));
        toast({
          title: "Project Endorsed!",
          description: `You endorsed "${project?.title}". Great choice!`,
        });
        
        addNotification({
          title: "Project Endorsed",
          message: `You successfully endorsed "${project?.title}"`,
          type: "success"
        });
      }
      
      setLoadingEndorsement(null);
    }, 800);
  };

  const handleExternalLink = (url: string, projectTitle: string) => {
    console.log(`Opening demo for ${projectTitle}: ${url}`);
    toast({
      title: "Opening Demo",
      description: `Launching demo for ${projectTitle}...`,
    });
    // Simulate delay then open
    setTimeout(() => {
      window.open(url, '_blank', 'noopener,noreferrer');
    }, 500);
  };

  const handleGithubLink = (url: string, projectTitle: string) => {
    console.log(`Opening GitHub for ${projectTitle}: ${url}`);
    toast({
      title: "Opening Repository",
      description: `Viewing source code for ${projectTitle}...`,
    });
    setTimeout(() => {
      window.open(url, '_blank', 'noopener,noreferrer');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Project Showcase
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover amazing projects built by talented teams during hackathons. Get inspired and endorse your favorites!
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search projects by title, description, or team..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Environmental">Environmental</SelectItem>
              <SelectItem value="Blockchain">Blockchain</SelectItem>
              <SelectItem value="Healthcare">Healthcare</SelectItem>
              <SelectItem value="Education">Education</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="endorsements">Most Endorsed</SelectItem>
              <SelectItem value="title">Title A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProjects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow bg-white/80 backdrop-blur-sm">
              <div className="aspect-video bg-gradient-to-br from-purple-100 to-blue-100 rounded-t-lg flex items-center justify-center">
                <img
                  src={`https://images.unsplash.com/${project.imageUrl}?w=400&h=250&fit=crop`}
                  alt={project.title}
                  className="w-full h-full object-cover rounded-t-lg"
                />
              </div>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{project.title}</CardTitle>
                    <p className="text-sm text-gray-600 mb-1">by {project.team}</p>
                    <p className="text-xs text-gray-500">{project.hackathon}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {project.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4 text-sm">{project.description}</p>
                
                <div className="mb-4">
                  <h4 className="font-semibold mb-2 text-sm">Tech Stack:</h4>
                  <div className="flex flex-wrap gap-1">
                    {project.techStack.map((tech, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleExternalLink(project.demoUrl, project.title)}
                      className="hover:bg-blue-50 transition-colors"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Demo
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleGithubLink(project.githubUrl, project.title)}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <Github className="h-3 w-3 mr-1" />
                      Code
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEndorse(project.id)}
                    disabled={loadingEndorsement === project.id}
                    className={`flex items-center gap-1 transition-colors ${
                      endorsedProjects.has(project.id) 
                        ? 'text-red-600 hover:text-red-700 bg-red-50' 
                        : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                    }`}
                  >
                    <Heart 
                      className={`h-4 w-4 ${
                        endorsedProjects.has(project.id) ? 'fill-current' : ''
                      }`} 
                    />
                    {loadingEndorsement === project.id ? '...' : project.endorsements + (endorsedProjects.has(project.id) ? 1 : 0)}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {sortedProjects.length === 0 && (
          <div className="text-center py-12">
            <Filter className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No projects found</h3>
            <p className="text-gray-500">Try adjusting your search criteria or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
