import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const HackathonCard = ({ hackathon }) => {
  const {
    id,
    title,
    description,
    startDate,
    endDate,
    registrationDeadline,
    tags,
    prize,
    participants,
    isRegistrationOpen,
    image,
    organizer,
    location
  } = hackathon;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysUntilDeadline = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilDeadline = getDaysUntilDeadline(registrationDeadline);
  const isDeadlineSoon = daysUntilDeadline <= 3 && daysUntilDeadline > 0;

  return (
    <div className="bg-background border border-border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            isRegistrationOpen 
              ? 'bg-success bg-opacity-10 text-success' :'bg-error bg-opacity-10 text-error'
          }`}>
            <div className={`w-2 h-2 rounded-full mr-1 ${
              isRegistrationOpen ? 'bg-success' : 'bg-error'
            }`}></div>
            {isRegistrationOpen ? 'Open' : 'Closed'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-text-primary mb-2 line-clamp-2">
            {title}
          </h3>
          <p className="text-sm text-text-secondary line-clamp-2">
            {description}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary-light text-primary"
            >
              {tag}
            </span>
          ))}
          {tags.length > 3 && (
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-surface text-text-tertiary">
              +{tags.length - 3} more
            </span>
          )}
        </div>

        {/* Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-text-secondary">
            <Icon name="Calendar" size={14} className="mr-2" />
            <span>{formatDate(startDate)} - {formatDate(endDate)}</span>
          </div>
          
          <div className="flex items-center text-sm text-text-secondary">
            <Icon name="MapPin" size={14} className="mr-2" />
            <span>{location}</span>
          </div>

          <div className="flex items-center text-sm text-text-secondary">
            <Icon name="Users" size={14} className="mr-2" />
            <span>{participants} participants</span>
          </div>

          <div className="flex items-center text-sm text-text-secondary">
            <Icon name="Trophy" size={14} className="mr-2" />
            <span>{prize}</span>
          </div>
        </div>

        {/* Registration Deadline */}
        {isRegistrationOpen && (
          <div className={`flex items-center text-sm mb-4 ${
            isDeadlineSoon ? 'text-warning' : 'text-text-secondary'
          }`}>
            <Icon 
              name={isDeadlineSoon ? "AlertTriangle" : "Clock"} 
              size={14} 
              className="mr-2" 
            />
            <span>
              Registration ends {formatDate(registrationDeadline)}
              {daysUntilDeadline > 0 && (
                <span className="ml-1">
                  ({daysUntilDeadline} day{daysUntilDeadline !== 1 ? 's' : ''} left)
                </span>
              )}
            </span>
          </div>
        )}

        {/* Action Button */}
        <Link
          to={`/hackathon-details-registration-screen?id=${id}`}
          className="w-full inline-flex items-center justify-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
        >
          View Details
          <Icon name="ArrowRight" size={16} className="ml-2" />
        </Link>
      </div>
    </div>
  );
};

export default HackathonCard;