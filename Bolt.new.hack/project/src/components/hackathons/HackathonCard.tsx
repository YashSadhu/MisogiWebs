import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Trophy, Users } from 'lucide-react';
import { Hackathon } from '../../types';
import { Card, CardContent, CardFooter, CardImage } from '../ui/Card';
import Badge from '../ui/Badge';
import { formatDateRange, getTimeRemainingText, hasDatePassed } from '../../utils/dates';

interface HackathonCardProps {
  hackathon: Hackathon;
}

const HackathonCard: React.FC<HackathonCardProps> = ({ hackathon }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/hackathons/${hackathon.id}`);
  };
  
  return (
    <Card
      hoverable
      onClick={handleClick}
      className="transition-all duration-300 h-full flex flex-col"
    >
      <div className="relative">
        <CardImage
          src={hackathon.imageUrl || 'https://images.pexels.com/photos/7103/writing-notes-idea-conference.jpg'}
          alt={hackathon.title}
        />
        <div className="absolute top-4 right-4">
          <Badge
            variant={hasDatePassed(hackathon.registrationDeadline) ? 'danger' : 'success'}
            size="md"
          >
            {getTimeRemainingText(hackathon.registrationDeadline)}
          </Badge>
        </div>
      </div>

      <CardContent className="flex-1">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{hackathon.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{hackathon.description}</p>
        
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <Calendar className="h-4 w-4 mr-2" />
          <span>{formatDateRange(hackathon.startDate, hackathon.endDate)}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <Trophy className="h-4 w-4 mr-2" />
          <span>{hackathon.prizes.length} Prizes</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-500">
          <Users className="h-4 w-4 mr-2" />
          <span>Teams: {hackathon.minTeamSize}-{hackathon.maxTeamSize} members</span>
        </div>
      </CardContent>

      <CardFooter className="pt-3 flex flex-wrap gap-2">
        {hackathon.tags.slice(0, 3).map((tag, index) => (
          <Badge key={index} variant="primary" size="sm">
            {tag}
          </Badge>
        ))}
        {hackathon.tags.length > 3 && (
          <Badge variant="default" size="sm">
            +{hackathon.tags.length - 3}
          </Badge>
        )}
      </CardFooter>
    </Card>
  );
};

export default HackathonCard;