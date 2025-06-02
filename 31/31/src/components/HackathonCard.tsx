import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Trophy, MapPin, Clock } from "lucide-react";
import { useNavigate } from 'react-router-dom';

interface HackathonCardProps {
  hackathon: {
    id: number;
    title: string;
    theme: string;
    startDate: string;
    endDate: string;
    registrationDeadline: string;
    location: string;
    prizes: string;
    tags: string[];
    participants: number;
    teamsFormed: number;
    description: string;
    image: string;
  };
}

const HackathonCard = ({ hackathon }: HackathonCardProps) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysLeft = getDaysUntilDeadline(hackathon.registrationDeadline);

  const handleCardClick = () => {
    navigate(`/hackathons/${hackathon.id}`);
  };

  return (
    <Card 
      className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm overflow-hidden cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Hero Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={`https://images.unsplash.com/${hackathon.image}?auto=format&fit=crop&w=800&q=80`}
          alt={hackathon.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <div className="absolute top-4 right-4 flex gap-2">
          <Badge variant="secondary" className="bg-white/90 text-gray-800">
            <Trophy className="h-3 w-3 mr-1" />
            {hackathon.prizes}
          </Badge>
        </div>
        <div className="absolute bottom-4 left-4">
          <Badge 
            variant={daysLeft <= 3 ? "destructive" : daysLeft <= 7 ? "default" : "secondary"}
            className="bg-white/90 text-gray-800"
          >
            <Clock className="h-3 w-3 mr-1" />
            {daysLeft > 0 ? `${daysLeft} days left` : 'Registration closed'}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
              {hackathon.title}
            </CardTitle>
            <CardDescription className="text-gray-600 font-medium">
              {hackathon.theme}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-gray-600 text-sm line-clamp-2">
          {hackathon.description}
        </p>

        {/* Event Details */}
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
            <span>{formatDate(hackathon.startDate)} - {formatDate(hackathon.endDate)}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-gray-400" />
            <span>{hackathon.location}</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-2 text-gray-400" />
            <span>{hackathon.participants} participants • {hackathon.teamsFormed} teams</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {hackathon.tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Action Button */}
        <Button 
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
          disabled={daysLeft <= 0}
          onClick={(e) => { 
            e.stopPropagation(); // Prevent card click when button is clicked
            if (daysLeft > 0) {
              navigate(`/hackathons/${hackathon.id}?action=register`);
            }
          }}
        >
          {daysLeft <= 0 ? 'Registration Closed' : 'View Details & Register'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default HackathonCard;
