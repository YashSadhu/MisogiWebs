import React from 'react';
import Icon from '../../../components/AppIcon';

const SkillMatchIndicator = ({ percentage }) => {
  const getMatchColor = (percent) => {
    if (percent >= 80) return 'text-success bg-success';
    if (percent >= 60) return 'text-warning bg-warning';
    return 'text-error bg-error';
  };

  const getMatchLabel = (percent) => {
    if (percent >= 80) return 'Excellent Match';
    if (percent >= 60) return 'Good Match';
    return 'Partial Match';
  };

  const getMatchIcon = (percent) => {
    if (percent >= 80) return 'CheckCircle';
    if (percent >= 60) return 'AlertCircle';
    return 'XCircle';
  };

  return (
    <div className="mb-4 p-3 bg-surface rounded-lg border border-border">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon 
            name={getMatchIcon(percentage)} 
            size={16} 
            className={getMatchColor(percentage).split(' ')[0]} 
          />
          <span className="text-sm font-medium text-text-primary">
            Skill Match: {getMatchLabel(percentage)}
          </span>
        </div>
        <span className={`text-sm font-semibold ${getMatchColor(percentage).split(' ')[0]}`}>
          {percentage}%
        </span>
      </div>
      
      {/* Progress Bar */}
      <div className="mt-2 w-full bg-border rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${getMatchColor(percentage).split(' ')[1]} bg-opacity-20`}
          style={{ width: `${percentage}%` }}
        >
          <div 
            className={`h-full rounded-full ${getMatchColor(percentage).split(' ')[1]}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          ></div>
        </div>
      </div>
      
      <p className="text-xs text-text-secondary mt-1">
        Based on your profile skills and experience
      </p>
    </div>
  );
};

export default SkillMatchIndicator;