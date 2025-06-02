import React from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, BookmarkCheck } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useHackathonStore } from '@/stores/hackathonStore';

const SavedHackathons = () => {
  const navigate = useNavigate();
  const { savedHackathons } = useHackathonStore();

  // Mock data for hackathons - in a real app, this would come from an API
  const mockHackathons = {
    "1": {
      id: "1",
      title: "Future AI Innovators 2025",
      startDate: "2025-06-10",
      endDate: "2025-06-12",
      location: "Bengaluru, India",
      participants: 450,
      maxParticipants: 500,
    },
    "2": {
      id: "2",
      title: "Decentralized India Summit",
      startDate: "2025-07-05",
      endDate: "2025-07-07",
      location: "Hyderabad, India",
      participants: 320,
      maxParticipants: 400,
    },
    // Add more mock hackathons as needed
  };

  const savedHackathonDetails = savedHackathons
    .map(id => mockHackathons[id])
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Saved Hackathons
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your collection of hackathons you're interested in
          </p>
        </div>

        {savedHackathonDetails.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedHackathonDetails.map((hackathon) => (
              <Card key={hackathon.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl mb-2">{hackathon.title}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{format(new Date(hackathon.startDate), 'MMM d, yyyy')}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{hackathon.location}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      <span>{hackathon.participants}/{hackathon.maxParticipants} participants</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/hackathon/${hackathon.id}`)}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookmarkCheck className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No saved hackathons yet</h3>
            <p className="text-gray-500 mb-4">Start exploring hackathons and save the ones you're interested in!</p>
            <Button
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              onClick={() => navigate('/')}
            >
              Explore Hackathons
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedHackathons; 