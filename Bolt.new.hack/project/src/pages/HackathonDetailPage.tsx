import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Trophy, Users, Clock, Tag } from 'lucide-react';
import { useHackathonStore } from '../store/hackathonStore';
import useAuthStore from '../store/authStore';
import { Hackathon } from '../types';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Alert from '../components/ui/Alert';
import { formatDateRange, hasDatePassed } from '../utils/dates';

const HackathonDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { hackathons, isLoading, error, fetchHackathons, registerForHackathon } = useHackathonStore();
  const { user, isAuthenticated } = useAuthStore();
  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [registering, setRegistering] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);
  
  useEffect(() => {
    if (hackathons.length === 0) {
      fetchHackathons();
    } else {
      const found = hackathons.find(h => h.id === id);
      if (found) {
        setHackathon(found);
      }
    }
  }, [id, hackathons, fetchHackathons]);
  
  const handleRegister = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/hackathons/${id}` } } });
      return;
    }
    
    if (!user || !hackathon) return;
    
    setRegistering(true);
    setRegisterError(null);
    
    try {
      await registerForHackathon(hackathon.id, user.id);
      setRegisterSuccess(true);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setRegisterSuccess(false);
      }, 3000);
    } catch (error) {
      setRegisterError('Failed to register for hackathon. Please try again.');
    } finally {
      setRegistering(false);
    }
  };
  
  const handleCreateTeam = () => {
    navigate('/teams/create');
  };
  
  const handleJoinTeam = () => {
    navigate('/teams/join');
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Alert variant="error">
          {error}
        </Alert>
        <div className="mt-4 text-center">
          <Button variant="primary" onClick={() => fetchHackathons()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }
  
  if (!hackathon) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Alert variant="error">
          Hackathon not found
        </Alert>
        <div className="mt-4 text-center">
          <Button variant="primary" onClick={() => navigate('/')}>
            Back to Hackathons
          </Button>
        </div>
      </div>
    );
  }
  
  const registrationClosed = hasDatePassed(hackathon.registrationDeadline);
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {registerSuccess && (
        <div className="mb-6">
          <Alert variant="success\" onClose={() => setRegisterSuccess(false)}>
            Successfully registered for {hackathon.title}!
          </Alert>
        </div>
      )}
      
      {registerError && (
        <div className="mb-6">
          <Alert variant="error" onClose={() => setRegisterError(null)}>
            {registerError}
          </Alert>
        </div>
      )}
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="relative h-64 bg-gray-200">
          <img
            src={hackathon.imageUrl || 'https://images.pexels.com/photos/7103/writing-notes-idea-conference.jpg'}
            alt={hackathon.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4">
            <Badge
              variant={registrationClosed ? 'danger' : 'success'}
              size="lg"
            >
              {registrationClosed ? 'Registration Closed' : 'Registration Open'}
            </Badge>
          </div>
        </div>
        
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{hackathon.title}</h1>
          <p className="text-lg text-gray-600 mb-6">{hackathon.theme}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Details</h2>
              
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-5 w-5 mr-3 text-indigo-500" />
                  <span>{formatDateRange(hackathon.startDate, hackathon.endDate)}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Clock className="h-5 w-5 mr-3 text-indigo-500" />
                  <span>Registration Deadline: {new Date(hackathon.registrationDeadline).toLocaleDateString()}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Users className="h-5 w-5 mr-3 text-indigo-500" />
                  <span>Team Size: {hackathon.minTeamSize}-{hackathon.maxTeamSize} members</span>
                </div>
              </div>
              
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-4">Prizes</h2>
              <ul className="space-y-2">
                {hackathon.prizes.map((prize, index) => (
                  <li key={index} className="flex items-start">
                    <Trophy className="h-5 w-5 mr-3 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">{prize}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Description</h2>
              <p className="text-gray-600 mb-6">{hackathon.description}</p>
              
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Tags</h2>
              <div className="flex flex-wrap gap-2 mb-6">
                {hackathon.tags.map((tag, index) => (
                  <Badge key={index} variant="primary">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="space-y-4 mt-8">
                <Button
                  variant="primary"
                  fullWidth
                  onClick={handleRegister}
                  isLoading={registering}
                  disabled={registrationClosed}
                >
                  {registrationClosed ? 'Registration Closed' : 'Register for Hackathon'}
                </Button>
                
                {isAuthenticated && (
                  <>
                    <Button
                      variant="outline"
                      fullWidth
                      onClick={handleCreateTeam}
                    >
                      Create a Team
                    </Button>
                    
                    <Button
                      variant="outline"
                      fullWidth
                      onClick={handleJoinTeam}
                    >
                      Join a Team
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HackathonDetailPage;