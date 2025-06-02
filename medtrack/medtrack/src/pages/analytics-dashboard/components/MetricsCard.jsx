import React from 'react';
import Icon from 'components/AppIcon';

const MetricsCard = ({ 
  title, 
  value, 
  subtitle, 
  change, 
  changeType, 
  icon, 
  color = 'primary' 
}) => {
  const colorClasses = {
    primary: {
      bg: 'bg-primary-50',
      icon: 'text-primary',
      border: 'border-primary-200'
    },
    success: {
      bg: 'bg-success-50',
      icon: 'text-success',
      border: 'border-success-200'
    },
    accent: {
      bg: 'bg-accent-50',
      icon: 'text-accent',
      border: 'border-accent-200'
    },
    warning: {
      bg: 'bg-warning-50',
      icon: 'text-warning-500',
      border: 'border-warning-200'
    }
  };

  const getChangeColor = () => {
    if (changeType === 'positive') return 'text-success';
    if (changeType === 'negative') return 'text-error';
    return 'text-text-secondary';
  };

  const getChangeIcon = () => {
    if (changeType === 'positive') return 'TrendingUp';
    if (changeType === 'negative') return 'TrendingDown';
    return 'Minus';
  };

  return (
    <div className={`
      bg-surface rounded-lg border ${colorClasses[color].border} p-6 
      hover:shadow-elevated transition-smooth
    `}>
      <div className="flex items-center justify-between mb-4">
        <div className={`
          w-12 h-12 ${colorClasses[color].bg} rounded-lg 
          flex items-center justify-center
        `}>
          <Icon 
            name={icon} 
            size={24} 
            className={colorClasses[color].icon}
            strokeWidth={2}
          />
        </div>
        
        {change !== undefined && (
          <div className={`flex items-center space-x-1 ${getChangeColor()}`}>
            <Icon name={getChangeIcon()} size={16} strokeWidth={2} />
            <span className="text-sm font-medium">
              {Math.abs(change)}%
            </span>
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-text-secondary mb-1">
          {title}
        </h3>
        <p className="text-2xl font-bold text-text-primary mb-1">
          {value}
        </p>
        {subtitle && (
          <p className="text-xs text-text-secondary">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default MetricsCard;