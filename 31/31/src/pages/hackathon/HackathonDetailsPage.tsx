import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, MapPin, Users, Clock, Trophy, AlertCircle, ChevronRight, Share, Bookmark, BookmarkCheck, LogIn } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface HackathonDetails {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  location: string;
  mode: 'online' | 'offline' | 'hybrid';
  totalPrize: string;
  prizes: {
    position: string;
    amount: string;
    description: string;
  }[];
  tags: string[];
  participants: number;
  maxParticipants: number;
  difficulty: string;
  teamSize: string;
  organizer: {
    name: string;
    logo: string;
  };
  schedule?: {
    day: string;
    events: {
      time: string;
      activity: string;
    }[];
  }[];
}

// Mock data for hackathons
const mockHackathons: Record<string, HackathonDetails> = {
  "1": {
    id: "1",
    title: "Future AI Innovators 2025",
    description: "Join us for the most exciting AI Innovation Challenge of 2025! This hackathon brings together brilliant minds from around the world to solve real-world problems using artificial intelligence and machine learning. Whether you're a seasoned developer, a data scientist, or an AI enthusiast, this event offers the perfect platform to showcase your skills, learn from industry experts, and network with like-minded innovators.",
    startDate: "2025-06-10",
    endDate: "2025-06-12",
    registrationDeadline: "2025-06-01",
    location: "Bengaluru, India",
    mode: "hybrid",
    totalPrize: "₹1,000,000",
    prizes: [
      { position: "1st Place", amount: "₹500,000", description: "Winner takes all" },
      { position: "2nd Place", amount: "₹300,000", description: "Runner-up prize" },
      { position: "3rd Place", amount: "₹200,000", description: "Third place prize" }
    ],
    tags: ["AI", "Machine Learning", "Deep Learning", "Innovation"],
    participants: 450,
    maxParticipants: 500,
    difficulty: "Intermediate",
    teamSize: "2-4 members",
    organizer: {
      name: "TechCorp Solutions",
      logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&crop=center"
    },
    schedule: [
      {
        day: "Day 1 - June 10, 2025",
        events: [
          { time: "09:00 AM", activity: "Registration & Check-in" },
          { time: "10:00 AM", activity: "Opening Ceremony" },
          { time: "11:00 AM", activity: "Team Formation & Networking" },
          { time: "12:00 PM", activity: "Lunch & Sponsor Booths" },
          { time: "01:00 PM", activity: "Hacking Begins!" },
          { time: "06:00 PM", activity: "Dinner Break" },
          { time: "08:00 PM", activity: "Mentor Sessions" }
        ]
      },
      {
        day: "Day 2 - June 11, 2025",
        events: [
          { time: "08:00 AM", activity: "Breakfast" },
          { time: "09:00 AM", activity: "Continued Development" },
          { time: "12:00 PM", activity: "Lunch & Tech Talks" },
          { time: "02:00 PM", activity: "Mentor Check-ins" },
          { time: "06:00 PM", activity: "Dinner & Networking" },
          { time: "08:00 PM", activity: "Late Night Coding" }
        ]
      },
      {
        day: "Day 3 - June 12, 2025",
        events: [
          { time: "08:00 AM", activity: "Breakfast" },
          { time: "09:00 AM", activity: "Final Development Sprint" },
          { time: "12:00 PM", activity: "Submission Deadline" },
          { time: "01:00 PM", activity: "Lunch & Demo Setup" },
          { time: "02:00 PM", activity: "Project Presentations" },
          { time: "04:00 PM", activity: "Judging & Deliberation" },
          { time: "05:00 PM", activity: "Awards Ceremony" },
          { time: "06:00 PM", activity: "Closing & Networking" }
        ]
      }
    ]
  },
  "2": {
    id: "2",
    title: "Decentralized India Summit",
    description: "Explore the potential of decentralized technologies and build the next wave of Web3 innovation for India. This hackathon focuses on blockchain technology, smart contracts, and decentralized applications that can transform various sectors in India.",
    startDate: "2025-07-05",
    endDate: "2025-07-07",
    registrationDeadline: "2025-06-28",
    location: "Hyderabad, India",
    mode: "hybrid",
    totalPrize: "₹750,000",
    prizes: [
      { position: "1st Place", amount: "₹350,000", description: "Winner takes all" },
      { position: "2nd Place", amount: "₹250,000", description: "Runner-up prize" },
      { position: "3rd Place", amount: "₹150,000", description: "Third place prize" }
    ],
    tags: ["Web3", "Blockchain", "NFTs", "Metaverse"],
    participants: 320,
    maxParticipants: 400,
    difficulty: "Advanced",
    teamSize: "3-5 members",
    organizer: {
      name: "Blockchain India",
      logo: "https://images.unsplash.com/photo-1639762681057-408e52192e55?w=100&h=100&fit=crop&crop=center"
    },
    schedule: [
      {
        day: "Day 1 - July 5, 2025",
        events: [
          { time: "09:00 AM", activity: "Registration & Check-in" },
          { time: "10:00 AM", activity: "Opening Ceremony" },
          { time: "11:00 AM", activity: "Blockchain Workshop" },
          { time: "12:00 PM", activity: "Lunch & Networking" },
          { time: "01:00 PM", activity: "Hacking Begins!" },
          { time: "06:00 PM", activity: "Dinner & Tech Talks" },
          { time: "08:00 PM", activity: "Mentor Sessions" }
        ]
      },
      {
        day: "Day 2 - July 6, 2025",
        events: [
          { time: "08:00 AM", activity: "Breakfast" },
          { time: "09:00 AM", activity: "Development & Mentoring" },
          { time: "12:00 PM", activity: "Lunch & Panel Discussion" },
          { time: "02:00 PM", activity: "Workshop: Smart Contracts" },
          { time: "06:00 PM", activity: "Dinner & Networking" },
          { time: "08:00 PM", activity: "Late Night Coding" }
        ]
      },
      {
        day: "Day 3 - July 7, 2025",
        events: [
          { time: "08:00 AM", activity: "Breakfast" },
          { time: "09:00 AM", activity: "Final Development" },
          { time: "12:00 PM", activity: "Submission Deadline" },
          { time: "01:00 PM", activity: "Lunch & Demo Setup" },
          { time: "02:00 PM", activity: "Project Presentations" },
          { time: "04:00 PM", activity: "Judging & Deliberation" },
          { time: "05:00 PM", activity: "Awards Ceremony" },
          { time: "06:00 PM", activity: "Closing & Networking" }
        ]
      }
    ]
  },
  "3": {
    id: "3",
    title: "Sustainable Tech Challenge",
    description: "Build innovative solutions to address climate change and promote sustainability. This hackathon focuses on creating technology solutions that can help reduce carbon footprint, promote renewable energy, and create sustainable living solutions.",
    startDate: "2025-08-15",
    endDate: "2025-08-17",
    registrationDeadline: "2025-08-01",
    location: "Mumbai, India",
    mode: "hybrid",
    totalPrize: "₹800,000",
    prizes: [
      { position: "1st Place", amount: "₹400,000", description: "Winner takes all" },
      { position: "2nd Place", amount: "₹250,000", description: "Runner-up prize" },
      { position: "3rd Place", amount: "₹150,000", description: "Third place prize" }
    ],
    tags: ["Sustainability", "Climate Tech", "Green Energy", "IoT"],
    participants: 280,
    maxParticipants: 350,
    difficulty: "Intermediate",
    teamSize: "2-4 members",
    organizer: {
      name: "GreenTech India",
      logo: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=100&h=100&fit=crop&crop=center"
    },
    schedule: [
      {
        day: "Day 1 - August 15, 2025",
        events: [
          { time: "09:00 AM", activity: "Registration & Check-in" },
          { time: "10:00 AM", activity: "Opening Ceremony" },
          { time: "11:00 AM", activity: "Sustainability Workshop" },
          { time: "12:00 PM", activity: "Lunch & Networking" },
          { time: "01:00 PM", activity: "Hacking Begins!" },
          { time: "06:00 PM", activity: "Dinner & Tech Talks" },
          { time: "08:00 PM", activity: "Mentor Sessions" }
        ]
      },
      {
        day: "Day 2 - August 16, 2025",
        events: [
          { time: "08:00 AM", activity: "Breakfast" },
          { time: "09:00 AM", activity: "Development & Mentoring" },
          { time: "12:00 PM", activity: "Lunch & Panel Discussion" },
          { time: "02:00 PM", activity: "Workshop: IoT & Sensors" },
          { time: "06:00 PM", activity: "Dinner & Networking" },
          { time: "08:00 PM", activity: "Late Night Coding" }
        ]
      },
      {
        day: "Day 3 - August 17, 2025",
        events: [
          { time: "08:00 AM", activity: "Breakfast" },
          { time: "09:00 AM", activity: "Final Development" },
          { time: "12:00 PM", activity: "Submission Deadline" },
          { time: "01:00 PM", activity: "Lunch & Demo Setup" },
          { time: "02:00 PM", activity: "Project Presentations" },
          { time: "04:00 PM", activity: "Judging & Deliberation" },
          { time: "05:00 PM", activity: "Awards Ceremony" },
          { time: "06:00 PM", activity: "Closing & Networking" }
        ]
      }
    ]
  },
  "4": {
    id: "4",
    title: "Healthcare Innovation Hackathon",
    description: "Develop cutting-edge solutions to revolutionize healthcare delivery and patient care. This hackathon focuses on creating innovative healthcare technologies, from telemedicine platforms to AI-powered diagnostics and patient management systems.",
    startDate: "2025-09-20",
    endDate: "2025-09-22",
    registrationDeadline: "2025-09-05",
    location: "Delhi, India",
    mode: "hybrid",
    totalPrize: "₹900,000",
    prizes: [
      { position: "1st Place", amount: "₹450,000", description: "Winner takes all" },
      { position: "2nd Place", amount: "₹300,000", description: "Runner-up prize" },
      { position: "3rd Place", amount: "₹150,000", description: "Third place prize" }
    ],
    tags: ["Healthcare", "MedTech", "AI", "Telemedicine"],
    participants: 350,
    maxParticipants: 400,
    difficulty: "Advanced",
    teamSize: "3-5 members",
    organizer: {
      name: "HealthTech India",
      logo: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=100&h=100&fit=crop&crop=center"
    },
    schedule: [
      {
        day: "Day 1 - September 20, 2025",
        events: [
          { time: "09:00 AM", activity: "Registration & Check-in" },
          { time: "10:00 AM", activity: "Opening Ceremony" },
          { time: "11:00 AM", activity: "Healthcare Tech Workshop" },
          { time: "12:00 PM", activity: "Lunch & Networking" },
          { time: "01:00 PM", activity: "Hacking Begins!" },
          { time: "06:00 PM", activity: "Dinner & Tech Talks" },
          { time: "08:00 PM", activity: "Mentor Sessions" }
        ]
      },
      {
        day: "Day 2 - September 21, 2025",
        events: [
          { time: "08:00 AM", activity: "Breakfast" },
          { time: "09:00 AM", activity: "Development & Mentoring" },
          { time: "12:00 PM", activity: "Lunch & Panel Discussion" },
          { time: "02:00 PM", activity: "Workshop: AI in Healthcare" },
          { time: "06:00 PM", activity: "Dinner & Networking" },
          { time: "08:00 PM", activity: "Late Night Coding" }
        ]
      },
      {
        day: "Day 3 - September 22, 2025",
        events: [
          { time: "08:00 AM", activity: "Breakfast" },
          { time: "09:00 AM", activity: "Final Development" },
          { time: "12:00 PM", activity: "Submission Deadline" },
          { time: "01:00 PM", activity: "Lunch & Demo Setup" },
          { time: "02:00 PM", activity: "Project Presentations" },
          { time: "04:00 PM", activity: "Judging & Deliberation" },
          { time: "05:00 PM", activity: "Awards Ceremony" },
          { time: "06:00 PM", activity: "Closing & Networking" }
        ]
      }
    ]
  },
  "5": {
    id: "5",
    title: "FinTech Innovation Challenge",
    description: "Create the next generation of financial technology solutions. This hackathon focuses on developing innovative fintech solutions, from digital payments and banking to investment platforms and financial inclusion technologies.",
    startDate: "2025-10-10",
    endDate: "2025-10-12",
    registrationDeadline: "2025-09-25",
    location: "Chennai, India",
    mode: "hybrid",
    totalPrize: "₹1,200,000",
    prizes: [
      { position: "1st Place", amount: "₹600,000", description: "Winner takes all" },
      { position: "2nd Place", amount: "₹400,000", description: "Runner-up prize" },
      { position: "3rd Place", amount: "₹200,000", description: "Third place prize" }
    ],
    tags: ["FinTech", "Digital Payments", "Banking", "Investment"],
    participants: 400,
    maxParticipants: 500,
    difficulty: "Advanced",
    teamSize: "3-5 members",
    organizer: {
      name: "FinTech India",
      logo: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=100&h=100&fit=crop&crop=center"
    },
    schedule: [
      {
        day: "Day 1 - October 10, 2025",
        events: [
          { time: "09:00 AM", activity: "Registration & Check-in" },
          { time: "10:00 AM", activity: "Opening Ceremony" },
          { time: "11:00 AM", activity: "FinTech Workshop" },
          { time: "12:00 PM", activity: "Lunch & Networking" },
          { time: "01:00 PM", activity: "Hacking Begins!" },
          { time: "06:00 PM", activity: "Dinner & Tech Talks" },
          { time: "08:00 PM", activity: "Mentor Sessions" }
        ]
      },
      {
        day: "Day 2 - October 11, 2025",
        events: [
          { time: "08:00 AM", activity: "Breakfast" },
          { time: "09:00 AM", activity: "Development & Mentoring" },
          { time: "12:00 PM", activity: "Lunch & Panel Discussion" },
          { time: "02:00 PM", activity: "Workshop: Blockchain in Finance" },
          { time: "06:00 PM", activity: "Dinner & Networking" },
          { time: "08:00 PM", activity: "Late Night Coding" }
        ]
      },
      {
        day: "Day 3 - October 12, 2025",
        events: [
          { time: "08:00 AM", activity: "Breakfast" },
          { time: "09:00 AM", activity: "Final Development" },
          { time: "12:00 PM", activity: "Submission Deadline" },
          { time: "01:00 PM", activity: "Lunch & Demo Setup" },
          { time: "02:00 PM", activity: "Project Presentations" },
          { time: "04:00 PM", activity: "Judging & Deliberation" },
          { time: "05:00 PM", activity: "Awards Ceremony" },
          { time: "06:00 PM", activity: "Closing & Networking" }
        ]
      }
    ]
  }
};

const CollapsibleSection = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <ChevronRight
          className={`h-5 w-5 text-gray-500 transition-transform ${
            isOpen ? 'transform rotate-90' : ''
          }`}
        />
      </button>
      {isOpen && <div className="p-6 bg-white">{children}</div>}
    </div>
  );
};

interface RegistrationFormProps {
  hackathon: HackathonDetails;
  onSubmit: (data: any) => void;
  user: any; // You might want to replace 'any' with your User type
}

const RegistrationForm = ({ hackathon, onSubmit, user }: RegistrationFormProps) => {
  const [formData, setFormData] = useState({
    teamName: '',
    teamSize: '',
    projectIdea: '',
    techStack: '',
    teamPreferences: '',
    theme: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="teamName" className="block text-sm font-medium text-gray-700 mb-1">
          Team Name
        </label>
        <input
          type="text"
          id="teamName"
          value={formData.teamName}
          onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
          required
        />
      </div>

      <div>
        <label htmlFor="teamSize" className="block text-sm font-medium text-gray-700 mb-1">
          Team Size
        </label>
        <select
          id="teamSize"
          value={formData.teamSize}
          onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
          required
        >
          <option value="">Select team size</option>
          <option value="2">2 members</option>
          <option value="3">3 members</option>
          <option value="4">4 members</option>
        </select>
      </div>

      <div>
        <label htmlFor="projectIdea" className="block text-sm font-medium text-gray-700 mb-1">
          Project Idea
        </label>
        <textarea
          id="projectIdea"
          value={formData.projectIdea}
          onChange={(e) => setFormData({ ...formData, projectIdea: e.target.value })}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
          required
        />
      </div>

      <div>
        <label htmlFor="techStack" className="block text-sm font-medium text-gray-700 mb-1">
          Tech Stack
        </label>
        <input
          type="text"
          id="techStack"
          value={formData.techStack}
          onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
          placeholder="e.g., React, Node.js, Python"
          required
        />
      </div>

      <div>
        <label htmlFor="teamPreferences" className="block text-sm font-medium text-gray-700 mb-1">
          Team Preferences
        </label>
        <textarea
          id="teamPreferences"
          value={formData.teamPreferences}
          onChange={(e) => setFormData({ ...formData, teamPreferences: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
          placeholder="Describe your team's preferences and requirements"
        />
      </div>

      <div>
        <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-1">
          Theme
        </label>
        <select
          id="theme"
          value={formData.theme}
          onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
          required
        >
          <option value="">Select a theme</option>
          <option value="AI/ML">AI/ML</option>
          <option value="Web3">Web3</option>
          <option value="Sustainability">Sustainability</option>
          <option value="Healthcare">Healthcare</option>
        </select>
      </div>

      {!user ? (
        <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Please sign in to register for this hackathon.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <Button type="submit" className="w-full" disabled={!user}>
          Register for Hackathon
        </Button>
      )}
    </form>
  );
};

const HackathonDetailsPage = () => {
  const { hackathonId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [hackathon, setHackathon] = useState<HackathonDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    const fetchHackathonDetails = async () => {
      try {
        setIsLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Use mock data instead of API call
        const hackathonData = mockHackathons[hackathonId!];
        
        if (!hackathonData) {
          // If hackathon with given ID doesn't exist, use the first available hackathon
          // In a real app, you would show a 404 page or redirect
          const firstHackathonId = Object.keys(mockHackathons)[0];
          if (firstHackathonId) {
            setHackathon(mockHackathons[firstHackathonId]);
            // Update the URL to reflect the actual hackathon ID being shown
            window.history.replaceState({}, '', `/hackathons/${firstHackathonId}`);
          } else {
            throw new Error('No hackathons available');
          }
        } else {
          setHackathon(hackathonData);
        }
      } catch (error) {
        console.error('Error loading hackathon:', error);
        toast.error('Failed to load hackathon details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHackathonDetails();
  }, [hackathonId]);

  const handleRegisterClick = () => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    setShowRegistration(true);
  };

  const handleRegister = async (data: any) => {
    if (!user) {
      navigate('/auth', { state: { from: window.location.pathname } });
      return;
    }

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful registration
      setIsRegistered(true);
      setShowRegistration(false);
      setShowLoginPrompt(false);
      toast.success('Successfully registered for the hackathon!');
    } catch (error) {
      toast.error('Failed to register for the hackathon');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <h2 className="text-xl font-semibold text-gray-800">Loading Hackathon Details</h2>
            <p className="text-gray-500">Please wait while we fetch the hackathon information...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!hackathon) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <AlertCircle className="h-12 w-12 text-red-500" />
            <h2 className="text-xl font-semibold text-gray-800">Hackathon Not Found</h2>
            <p className="text-gray-600 mb-6">We couldn't find the hackathon you're looking for.</p>
            <Link 
              to="/" 
              className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              Browse Hackathons
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const daysLeft = Math.ceil(
    (new Date(hackathon.registrationDeadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-primary transition-colors">
            Hackathons
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900">{hackathon.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Section */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="relative h-64 bg-gradient-to-r from-purple-600 to-blue-600">
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                <div className="relative h-full flex items-center justify-center">
                  <div className="text-center text-white">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">{hackathon.title}</h1>
                    <p className="text-lg opacity-90">Innovate. Create. Transform.</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200">
                    <img 
                      src={hackathon.organizer.logo} 
                      alt={hackathon.organizer.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{hackathon.organizer.name}</p>
                    <p className="text-sm text-gray-500">Event Organizer</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {hackathon.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-purple-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-500">Duration</p>
                    <p className="text-sm font-medium">3 Days</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <Users className="h-5 w-5 text-purple-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-500">Participants</p>
                    <p className="text-sm font-medium">{hackathon.participants}/{hackathon.maxParticipants}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <Trophy className="h-5 w-5 text-purple-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-500">Total Prize</p>
                    <p className="text-sm font-medium">{hackathon.totalPrize}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <MapPin className="h-5 w-5 text-purple-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-500">Mode</p>
                    <p className="text-sm font-medium">{hackathon.mode}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Collapsible Sections */}
            <div className="space-y-4">
              <CollapsibleSection title="About This Hackathon" defaultOpen={true}>
                <div className="prose max-w-none text-gray-600">
                  <p>{hackathon.description}</p>
                </div>
              </CollapsibleSection>

              {hackathon.schedule && (
                <CollapsibleSection title="Event Schedule">
                  <div className="space-y-6">
                    {hackathon.schedule.map((day, dayIndex) => (
                      <div key={dayIndex}>
                        <h4 className="font-semibold text-gray-900 mb-3">{day.day}</h4>
                        <div className="space-y-2">
                          {day.events.map((event, eventIndex) => (
                            <div key={eventIndex} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                              <div className="w-20 text-sm font-medium text-purple-600">
                                {event.time}
                              </div>
                              <div className="text-gray-600">
                                {event.activity}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CollapsibleSection>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Register Now Button - Only show if not registered and not showing registration form */}
            {!isRegistered && !showRegistration && (
              <Button 
                className="w-full py-6 text-lg" 
                onClick={handleRegisterClick}
              >
                Register Now
              </Button>
            )}

            {/* Registration Form */}
            {showRegistration && !isRegistered && (
              <Card>
                <CardHeader>
                  <CardTitle>Register for Hackathon</CardTitle>
                </CardHeader>
                <CardContent>
                  {!isRegistered && showRegistration && (
                    <RegistrationForm 
                      hackathon={hackathon} 
                      onSubmit={handleRegister} 
                      user={user}
                    />
                  )}
                  {showLoginPrompt && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <LogIn className="h-5 w-5 text-blue-500" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-blue-800">Sign in to register</h3>
                          <div className="mt-2 text-sm text-blue-700">
                            <p>You need to be signed in to register for this hackathon.</p>
                          </div>
                          <div className="mt-4">
                            <div className="flex space-x-3">
                              <Button
                                type="button"
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                onClick={() => navigate('/auth', { state: { from: window.location.pathname } })}
                              >
                                Sign In
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowLoginPrompt(false)}
                              >
                                Maybe later
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {isRegistered && (
              <Card>
                <CardHeader>
                  <CardTitle>Registration Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2 text-green-600">
                      <AlertCircle className="h-5 w-5" />
                      <p className="font-medium">You're registered!</p>
                    </div>
                    <p className="text-sm text-green-600 mt-1">
                      Check your email for confirmation details.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Prize Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="h-5 w-5 text-purple-600 mr-2" />
                  Prize Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {hackathon.prizes.map((prize, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{prize.position}</p>
                        <p className="text-sm text-gray-500">{prize.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-purple-600">{prize.amount}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Info</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Difficulty</span>
                    <span className="font-medium text-gray-900">{hackathon.difficulty}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Team Size</span>
                    <span className="font-medium text-gray-900">{hackathon.teamSize}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Location</span>
                    <span className="font-medium text-gray-900">{hackathon.location}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Share */}
            <Card>
              <CardHeader>
                <CardTitle>Share This Event</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-3">
                  <Button className="flex-1" variant="outline">
                    <Share className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button className="flex-1" variant="outline">
                    <Bookmark className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HackathonDetailsPage;