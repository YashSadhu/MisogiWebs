import React from 'react';
import Icon from '../../../components/AppIcon';

const DeadlineReminder = ({ hackathon }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDaysRemaining = (dateString) => {
    const targetDate = new Date(dateString);
    const today = new Date();
    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getHoursRemaining = (dateString) => {
    const targetDate = new Date(dateString);
    const today = new Date();
    const diffTime = targetDate - today;
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    return diffHours;
  };

  const registrationDays = getDaysRemaining(hackathon.registrationDeadline);
  const hackathonDays = getDaysRemaining(hackathon.endDate);
  const registrationHours = getHoursRemaining(hackathon.registrationDeadline);
  const hackathonHours = getHoursRemaining(hackathon.endDate);

  const getUrgencyLevel = (days) => {
    if (days <= 1) return 'critical';
    if (days <= 3) return 'high';
    if (days <= 7) return 'medium';
    return 'low';
  };

  const getUrgencyStyles = (urgency) => {
    switch (urgency) {
      case 'critical':
        return {
          bg: 'bg-error bg-opacity-10',
          border: 'border-error border-opacity-20',
          text: 'text-error',
          icon: 'AlertTriangle'
        };
      case 'high':
        return {
          bg: 'bg-warning bg-opacity-10',
          border: 'border-warning border-opacity-20',
          text: 'text-warning',
          icon: 'Clock'
        };
      case 'medium':
        return {
          bg: 'bg-info bg-opacity-10',
          border: 'border-info border-opacity-20',
          text: 'text-info',
          icon: 'Calendar'
        };
      default:
        return {
          bg: 'bg-success bg-opacity-10',
          border: 'border-success border-opacity-20',
          text: 'text-success',
          icon: 'CheckCircle'
        };
    }
  };

  const deadlines = [];

  // Add registration deadline if still upcoming
  if (registrationDays > 0) {
    const urgency = getUrgencyLevel(registrationDays);
    const styles = getUrgencyStyles(urgency);
    
    deadlines.push({
      id: 'registration',
      title: 'Registration Deadline',
      date: hackathon.registrationDeadline,
      days: registrationDays,
      hours: registrationHours,
      urgency,
      styles,
      description: 'Complete team registration'
    });
  }

  // Add hackathon end deadline
  if (hackathonDays > 0) {
    const urgency = getUrgencyLevel(hackathonDays);
    const styles = getUrgencyStyles(urgency);
    
    deadlines.push({
      id: 'hackathon',
      title: 'Hackathon Ends',
      date: hackathon.endDate,
      days: hackathonDays,
      hours: hackathonHours,
      urgency,
      styles,
      description: 'Submit your final project'
    });
  }

  if (deadlines.length === 0) {
    return null;
  }

  return (
    <div className="bg-background rounded-lg border border-border shadow-sm">
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="Clock" size={20} className="text-primary" />
          <h2 className="text-lg font-semibold text-text-primary">Upcoming Deadlines</h2>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {deadlines.map((deadline) => (
          <div
            key={deadline.id}
            className={`p-4 rounded-lg border ${deadline.styles.bg} ${deadline.styles.border}`}
          >
            <div className="flex items-start space-x-3">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-background flex items-center justify-center ${deadline.styles.text}`}>
                <Icon name={deadline.styles.icon} size={16} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className={`text-sm font-semibold ${deadline.styles.text}`}>
                    {deadline.title}
                  </h3>
                  {deadline.urgency === 'critical' && (
                    <span className="bg-error text-white text-xs font-medium px-2 py-1 rounded-full">
                      URGENT
                    </span>
                  )}
                </div>
                
                <p className="text-xs text-text-secondary mb-2">
                  {deadline.description}
                </p>
                
                <div className="space-y-1">
                  <div className={`text-lg font-bold ${deadline.styles.text}`}>
                    {deadline.days > 0 ? (
                      `${deadline.days} day${deadline.days !== 1 ? 's' : ''}`
                    ) : (
                      `${deadline.hours} hour${deadline.hours !== 1 ? 's' : ''}`
                    )}
                  </div>
                  
                  <div className="text-xs text-text-tertiary">
                    {formatDate(deadline.date)}
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-3">
                  <div className="w-full bg-background rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        deadline.urgency === 'critical' ? 'bg-error' :
                        deadline.urgency === 'high' ? 'bg-warning' :
                        deadline.urgency === 'medium' ? 'bg-info' : 'bg-success'
                      }`}
                      style={{
                        width: `${Math.max(10, Math.min(100, (deadline.days / 30) * 100))}%`
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-t border-border bg-surface">
        <div className="flex space-x-2">
          <button className="flex-1 flex items-center justify-center space-x-2 py-2 px-3 bg-primary text-white rounded-md hover:bg-primary-hover transition-colors text-sm font-medium">
            <Icon name="Calendar" size={14} />
            <span>Add to Calendar</span>
          </button>
          <button className="flex items-center justify-center space-x-2 py-2 px-3 border border-border rounded-md text-text-secondary hover:text-text-primary hover:bg-background transition-colors text-sm">
            <Icon name="Bell" size={14} />
            <span>Remind Me</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeadlineReminder;