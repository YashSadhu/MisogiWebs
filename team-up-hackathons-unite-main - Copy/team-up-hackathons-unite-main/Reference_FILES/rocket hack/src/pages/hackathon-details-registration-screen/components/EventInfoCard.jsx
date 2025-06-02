import React from 'react';
import Icon from '../../../components/AppIcon';
import ActionButton from './ActionButton';

const EventInfoCard = ({ hackathon, isRegistered, onRegister }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysUntilDeadline = () => {
    const deadline = new Date(hackathon.registrationDeadline);
    const today = new Date();
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysLeft = getDaysUntilDeadline();
  const isDeadlinePassed = daysLeft < 0;

  return (
    <div className="bg-background rounded-lg border border-border p-6 sticky top-24">
      <div className="text-center mb-6">
        <div className="text-3xl font-bold text-primary mb-1">{hackathon.totalPrize}</div>
        <p className="text-text-secondary">Total Prize Pool</p>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="Calendar" size={16} className="text-text-tertiary" />
            <span className="text-sm text-text-secondary">Start Date</span>
          </div>
          <span className="text-sm font-medium text-text-primary">
            {formatDate(hackathon.startDate)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="Calendar" size={16} className="text-text-tertiary" />
            <span className="text-sm text-text-secondary">End Date</span>
          </div>
          <span className="text-sm font-medium text-text-primary">
            {formatDate(hackathon.endDate)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={16} className="text-text-tertiary" />
            <span className="text-sm text-text-secondary">Registration Deadline</span>
          </div>
          <span className="text-sm font-medium text-text-primary">
            {formatDate(hackathon.registrationDeadline)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="MapPin" size={16} className="text-text-tertiary" />
            <span className="text-sm text-text-secondary">Location</span>
          </div>
          <span className="text-sm font-medium text-text-primary">{hackathon.location}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="Users" size={16} className="text-text-tertiary" />
            <span className="text-sm text-text-secondary">Participants</span>
          </div>
          <span className="text-sm font-medium text-text-primary">
            {hackathon.participants}/{hackathon.maxParticipants}
          </span>
        </div>
      </div>

      {/* Registration Status */}
      <div className="mb-6">
        {!isDeadlinePassed ? (
          <div className="p-3 bg-success bg-opacity-10 border border-success border-opacity-20 rounded-lg">
            <div className="flex items-center space-x-2">
              <Icon name="Clock" size={16} className="text-success" />
              <span className="text-sm font-medium text-success">
                {daysLeft === 0 ? 'Last day to register!' : `${daysLeft} days left to register`}
              </span>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-error bg-opacity-10 border border-error border-opacity-20 rounded-lg">
            <div className="flex items-center space-x-2">
              <Icon name="AlertCircle" size={16} className="text-error" />
              <span className="text-sm font-medium text-error">Registration closed</span>
            </div>
          </div>
        )}
      </div>

      {/* Registration Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-text-secondary">Registration Progress</span>
          <span className="text-text-primary font-medium">
            {Math.round((hackathon.participants / hackathon.maxParticipants) * 100)}%
          </span>
        </div>
        <div className="w-full bg-surface rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${(hackathon.participants / hackathon.maxParticipants) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Action Button */}
      <ActionButton
        isRegistered={isRegistered}
        isDeadlinePassed={isDeadlinePassed}
        isFull={hackathon.participants >= hackathon.maxParticipants}
        onClick={onRegister}
      />

      {isRegistered && (
        <div className="mt-4 p-3 bg-primary bg-opacity-10 border border-primary border-opacity-20 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="CheckCircle" size={16} className="text-primary" />
            <span className="text-sm font-medium text-primary">You're registered!</span>
          </div>
          <p className="text-xs text-text-secondary mt-1">
            Check your email for confirmation details.
          </p>
        </div>
      )}

      {/* Team Formation Link */}
      {isRegistered && (
        <div className="mt-4">
          <button className="w-full flex items-center justify-center space-x-2 p-3 border border-border rounded-lg hover:bg-surface transition-colors">
            <Icon name="Users" size={16} className="text-primary" />
            <span className="text-sm font-medium text-text-primary">Find Team Members</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default EventInfoCard;