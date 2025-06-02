import React from 'react';
import Icon from '../../../components/AppIcon';

const TeamInfoPanel = ({ teamData }) => {
  const { name, description, hackathon, members } = teamData;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysRemaining = (dateString) => {
    const targetDate = new Date(dateString);
    const today = new Date();
    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilEnd = getDaysRemaining(hackathon.endDate);
  const daysUntilRegistration = getDaysRemaining(hackathon.registrationDeadline);

  return (
    <div className="bg-background rounded-lg border border-border shadow-sm p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Team Info */}
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 bg-primary bg-opacity-10 rounded-lg">
              <Icon name="Users" size={20} className="text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text-primary">{name}</h1>
              <p className="text-sm text-text-secondary">{members.length} members</p>
            </div>
          </div>
          <p className="text-text-secondary mb-4 max-w-2xl">{description}</p>
          
          {/* Hackathon Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Icon name="Trophy" size={16} className="text-primary" />
              <span className="font-medium text-text-primary">{hackathon.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Tag" size={16} className="text-text-tertiary" />
              <span className="text-text-secondary">{hackathon.theme}</span>
            </div>
          </div>
        </div>

        {/* Deadline Info */}
        <div className="flex flex-col sm:flex-row gap-4">
          {daysUntilRegistration > 0 && (
            <div className="bg-warning bg-opacity-10 border border-warning border-opacity-20 rounded-lg p-4 text-center min-w-0 sm:min-w-[140px]">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <Icon name="Clock" size={16} className="text-warning" />
                <span className="text-xs font-medium text-warning uppercase tracking-wide">Registration</span>
              </div>
              <div className="text-lg font-bold text-warning">{daysUntilRegistration} days</div>
              <div className="text-xs text-warning opacity-80">{formatDate(hackathon.registrationDeadline)}</div>
            </div>
          )}
          
          <div className={`rounded-lg p-4 text-center min-w-0 sm:min-w-[140px] ${
            daysUntilEnd <= 3 
              ? 'bg-error bg-opacity-10 border border-error border-opacity-20' :'bg-info bg-opacity-10 border border-info border-opacity-20'
          }`}>
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Icon name="Calendar" size={16} className={daysUntilEnd <= 3 ? 'text-error' : 'text-info'} />
              <span className={`text-xs font-medium uppercase tracking-wide ${
                daysUntilEnd <= 3 ? 'text-error' : 'text-info'
              }`}>
                Hackathon Ends
              </span>
            </div>
            <div className={`text-lg font-bold ${daysUntilEnd <= 3 ? 'text-error' : 'text-info'}`}>
              {daysUntilEnd} days
            </div>
            <div className={`text-xs opacity-80 ${daysUntilEnd <= 3 ? 'text-error' : 'text-info'}`}>
              {formatDate(hackathon.endDate)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamInfoPanel;