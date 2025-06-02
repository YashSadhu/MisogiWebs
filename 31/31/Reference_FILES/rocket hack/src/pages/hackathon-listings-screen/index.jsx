import React, { useState, useEffect, useCallback } from 'react';
import Header from '../../components/ui/Header';
import SearchBar from './components/SearchBar';
import FilterDropdown from './components/FilterDropdown';
import HackathonCard from './components/HackathonCard';
import LoadingSkeleton from './components/LoadingSkeleton';
import Icon from '../../components/AppIcon';

const HackathonListingsScreen = () => {
  const [hackathons, setHackathons] = useState([]);
  const [filteredHackathons, setFilteredHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentFilter, setCurrentFilter] = useState('all');
  const [displayedCount, setDisplayedCount] = useState(10);
  const [hasMore, setHasMore] = useState(true);

  // Mock data for hackathons
  const mockHackathons = [
    {
      id: 1,
      title: "AI Innovation Challenge 2024",
      description: "Build the next generation of AI applications that solve real-world problems. Focus on machine learning, natural language processing, and computer vision.",
      startDate: "2024-03-15",
      endDate: "2024-03-17",
      registrationDeadline: "2024-03-10",
      tags: ["AI", "Machine Learning", "Innovation"],
      prize: "$50,000 Total Prize Pool",
      participants: 1250,
      isRegistrationOpen: true,
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop",
      organizer: "TechCorp",
      location: "San Francisco, CA"
    },
    {
      id: 2,
      title: "Sustainable Tech Hackathon",
      description: "Create technology solutions for environmental sustainability. Focus on clean energy, waste reduction, and climate change mitigation.",
      startDate: "2024-04-20",
      endDate: "2024-04-22",
      registrationDeadline: "2024-04-15",
      tags: ["Sustainability", "CleanTech", "Environment"],
      prize: "$30,000 Total Prize Pool",
      participants: 890,
      isRegistrationOpen: true,
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
      organizer: "GreenTech Alliance",
      location: "Austin, TX"
    },
    {
      id: 3,
      title: "FinTech Revolution 2024",
      description: "Revolutionize financial services with cutting-edge technology. Build solutions for payments, lending, investment, and financial inclusion.",
      startDate: "2024-02-28",
      endDate: "2024-03-02",
      registrationDeadline: "2024-02-20",
      tags: ["FinTech", "Blockchain", "Payments"],
      prize: "$75,000 Total Prize Pool",
      participants: 2100,
      isRegistrationOpen: false,
      image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=300&fit=crop",
      organizer: "FinTech Innovators",
      location: "New York, NY"
    },
    {
      id: 4,
      title: "Healthcare Innovation Summit",
      description: "Transform healthcare through technology. Develop solutions for patient care, medical research, and healthcare accessibility.",
      startDate: "2024-05-10",
      endDate: "2024-05-12",
      registrationDeadline: "2024-05-05",
      tags: ["Healthcare", "MedTech", "Innovation"],
      prize: "$40,000 Total Prize Pool",
      participants: 750,
      isRegistrationOpen: true,
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop",
      organizer: "MedTech Solutions",
      location: "Boston, MA"
    },
    {
      id: 5,
      title: "Gaming & VR Experience Hack",
      description: "Create immersive gaming and virtual reality experiences. Push the boundaries of interactive entertainment and virtual worlds.",
      startDate: "2024-06-01",
      endDate: "2024-06-03",
      registrationDeadline: "2024-05-25",
      tags: ["Gaming", "VR", "Entertainment"],
      prize: "$25,000 Total Prize Pool",
      participants: 650,
      isRegistrationOpen: true,
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop",
      organizer: "GameDev Studios",
      location: "Los Angeles, CA"
    },
    {
      id: 6,
      title: "Smart City Solutions",
      description: "Build technology for smarter, more efficient cities. Focus on IoT, transportation, energy management, and urban planning.",
      startDate: "2024-07-15",
      endDate: "2024-07-17",
      registrationDeadline: "2024-07-10",
      tags: ["IoT", "Smart City", "Urban Tech"],
      prize: "$35,000 Total Prize Pool",
      participants: 920,
      isRegistrationOpen: true,
      image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop",
      organizer: "Urban Innovation Lab",
      location: "Seattle, WA"
    },
    {
      id: 7,
      title: "EdTech Learning Revolution",
      description: "Transform education through technology. Create innovative learning platforms, tools, and experiences for students of all ages.",
      startDate: "2024-08-20",
      endDate: "2024-08-22",
      registrationDeadline: "2024-08-15",
      tags: ["EdTech", "Learning", "Education"],
      prize: "$20,000 Total Prize Pool",
      participants: 580,
      isRegistrationOpen: true,
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop",
      organizer: "EduInnovate",
      location: "Chicago, IL"
    },
    {
      id: 8,
      title: "Cybersecurity Defense Challenge",
      description: "Strengthen digital security through innovative solutions. Build tools and systems to protect against cyber threats and vulnerabilities.",
      startDate: "2024-09-10",
      endDate: "2024-09-12",
      registrationDeadline: "2024-09-05",
      tags: ["Cybersecurity", "Security", "Defense"],
      prize: "$45,000 Total Prize Pool",
      participants: 1100,
      isRegistrationOpen: true,
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=300&fit=crop",
      organizer: "SecureTech Corp",
      location: "Washington, DC"
    },
    {
      id: 9,
      title: "Social Impact Tech",
      description: "Use technology to create positive social change. Address issues like poverty, inequality, education access, and community development.",
      startDate: "2024-10-05",
      endDate: "2024-10-07",
      registrationDeadline: "2024-09-30",
      tags: ["Social Impact", "Community", "Non-profit"],
      prize: "$15,000 Total Prize Pool",
      participants: 420,
      isRegistrationOpen: true,
      image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=300&fit=crop",
      organizer: "Social Tech Alliance",
      location: "Denver, CO"
    },
    {
      id: 10,
      title: "Space Technology Innovation",
      description: "Develop cutting-edge space technology solutions. Focus on satellite systems, space exploration, and aerospace engineering.",
      startDate: "2024-11-15",
      endDate: "2024-11-17",
      registrationDeadline: "2024-11-10",
      tags: ["Space Tech", "Aerospace", "Innovation"],
      prize: "$60,000 Total Prize Pool",
      participants: 800,
      isRegistrationOpen: true,
      image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=300&fit=crop",
      organizer: "AeroSpace Innovations",
      location: "Houston, TX"
    },
    {
      id: 11,
      title: "Mobile App Development Sprint",
      description: "Create innovative mobile applications that solve everyday problems. Focus on user experience, performance, and cross-platform compatibility.",
      startDate: "2024-12-01",
      endDate: "2024-12-03",
      registrationDeadline: "2024-11-25",
      tags: ["Mobile", "App Development", "UX"],
      prize: "$28,000 Total Prize Pool",
      participants: 950,
      isRegistrationOpen: true,
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop",
      organizer: "Mobile Innovators",
      location: "San Diego, CA"
    },
    {
      id: 12,
      title: "Data Science & Analytics Challenge",
      description: "Unlock insights from big data using advanced analytics and machine learning. Solve complex business and research problems.",
      startDate: "2024-12-15",
      endDate: "2024-12-17",
      registrationDeadline: "2024-12-10",
      tags: ["Data Science", "Analytics", "Big Data"],
      prize: "$38,000 Total Prize Pool",
      participants: 1350,
      isRegistrationOpen: true,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
      organizer: "DataTech Solutions",
      location: "Atlanta, GA"
    }
  ];

  // Simulate API call
  useEffect(() => {
    const fetchHackathons = async () => {
      setLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setHackathons(mockHackathons);
      setFilteredHackathons(mockHackathons);
      setLoading(false);
    };

    fetchHackathons();
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = [...hackathons];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(hackathon =>
        hackathon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hackathon.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hackathon.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply category filter
    switch (currentFilter) {
      case 'open':
        filtered = filtered.filter(h => h.isRegistrationOpen);
        break;
      case 'closed':
        filtered = filtered.filter(h => !h.isRegistrationOpen);
        break;
      case 'upcoming':
        filtered = filtered.filter(h => {
          const startDate = new Date(h.startDate);
          const today = new Date();
          const diffDays = Math.ceil((startDate - today) / (1000 * 60 * 60 * 24));
          return diffDays <= 30 && diffDays > 0;
        });
        break;
      case 'popular':
        filtered = filtered.sort((a, b) => b.participants - a.participants);
        break;
      case 'recent':
        filtered = filtered.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
        break;
      default:
        break;
    }

    setFilteredHackathons(filtered);
    setDisplayedCount(10);
    setHasMore(filtered.length > 10);
  }, [hackathons, searchTerm, currentFilter]);

  // Load more functionality
  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newCount = displayedCount + 6;
    setDisplayedCount(newCount);
    setHasMore(newCount < filteredHackathons.length);
    setLoadingMore(false);
  }, [displayedCount, filteredHackathons.length, loadingMore, hasMore]);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMore]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (filter) => {
    setCurrentFilter(filter);
  };

  const displayedHackathons = filteredHackathons.slice(0, displayedCount);

  return (
    <div className="min-h-screen bg-surface">
      <Header />
      
      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-text-primary mb-4">
            Discover Amazing Hackathons
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Join innovative hackathons, build amazing projects, and connect with talented developers from around the world.
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <SearchBar onSearch={handleSearch} />
          </div>
          <div className="flex-shrink-0">
            <FilterDropdown 
              onFilterChange={handleFilterChange} 
              currentFilter={currentFilter} 
            />
          </div>
        </div>

        {/* Results Summary */}
        {!loading && (
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-text-secondary">
              Showing {displayedHackathons.length} of {filteredHackathons.length} hackathons
              {searchTerm && (
                <span className="ml-1">
                  for "<span className="font-medium text-text-primary">{searchTerm}</span>"
                </span>
              )}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-sm text-primary hover:text-primary-hover font-medium"
              >
                Clear search
              </button>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading && <LoadingSkeleton count={6} />}

        {/* Hackathons Grid */}
        {!loading && displayedHackathons.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {displayedHackathons.map((hackathon) => (
              <HackathonCard key={hackathon.id} hackathon={hackathon} />
            ))}
          </div>
        )}

        {/* Load More Loading */}
        {loadingMore && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <LoadingSkeleton count={3} />
          </div>
        )}

        {/* Load More Button */}
        {!loading && !loadingMore && hasMore && displayedHackathons.length > 0 && (
          <div className="text-center">
            <button
              onClick={loadMore}
              className="inline-flex items-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
            >
              Load More Hackathons
              <Icon name="ChevronDown" size={16} className="ml-2" />
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredHackathons.length === 0 && (
          <div className="text-center py-12">
            <div className="flex justify-center items-center mb-4">
              <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center">
                <Icon name="Search" size={32} className="text-text-tertiary" />
              </div>
            </div>
            <h3 className="text-lg font-medium text-text-primary mb-2">
              No hackathons found
            </h3>
            <p className="text-text-secondary mb-4">
              {searchTerm 
                ? `No hackathons match your search for "${searchTerm}"`
                : "No hackathons match your current filters"
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="inline-flex items-center px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-hover transition-colors"
                >
                  Clear search
                </button>
              )}
              <button
                onClick={() => {
                  setSearchTerm('');
                  setCurrentFilter('all');
                }}
                className="inline-flex items-center px-4 py-2 bg-surface text-text-primary font-medium rounded-lg hover:bg-border transition-colors"
              >
                Reset filters
              </button>
            </div>
          </div>
        )}

        {/* End of Results */}
        {!loading && !hasMore && displayedHackathons.length > 0 && (
          <div className="text-center py-8">
            <p className="text-text-secondary">
              You've reached the end of the results
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default HackathonListingsScreen;