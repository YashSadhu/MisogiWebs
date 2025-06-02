import React from 'react';
import Icon from 'components/AppIcon';

const QuickStats = ({ selectedProfile }) => {
  const stats = [
    {
      id: 1,
      title: "Today\'s Adherence",
      value: "75%",
      change: "+5%",
      changeType: "positive",
      icon: "Target",
      color: "bg-accent-500",
      description: "3 of 4 medications taken"
    },
    {
      id: 2,
      title: "Weekly Streak",
      value: "6 days",
      change: "+1 day",
      changeType: "positive",
      icon: "Flame",
      color: "bg-warning-500",
      description: "Current adherence streak"
    },
    {
      id: 3,
      title: "Next Dose",
      value: "12:00 PM",
      change: "in 2 hours",
      changeType: "neutral",
      icon: "Clock",
      color: "bg-primary-500",
      description: "Metformin 500mg"
    },
    {
      id: 4,
      title: "Monthly Average",
      value: "94%",
      change: "+2%",
      changeType: "positive",
      icon: "TrendingUp",
      color: "bg-secondary-500",
      description: "This month\'s performance"
    }
  ];

  const getChangeColor = (changeType) => {
    switch (changeType) {
      case 'positive':
        return 'text-accent-600';
      case 'negative':
        return 'text-error-600';
      default:
        return 'text-text-secondary';
    }
  };

  const getChangeIcon = (changeType) => {
    switch (changeType) {
      case 'positive':
        return 'TrendingUp';
      case 'negative':
        return 'TrendingDown';
      default:
        return 'Minus';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <Icon name="BarChart3" size={20} color="var(--color-text-primary)" strokeWidth={2} />
        <h2 className="text-lg font-semibold text-text-primary">Quick Stats</h2>
      </div>

      {stats.map((stat) => (
        <div
          key={stat.id}
          className="bg-surface rounded-lg border border-secondary-200 shadow-soft p-4 hover:shadow-elevated transition-smooth"
        >
          <div className="flex items-start justify-between mb-3">
            <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center flex-shrink-0`}>
              <Icon name={stat.icon} size={20} color="white" strokeWidth={2} />
            </div>
            <div className="text-right">
              <div className={`flex items-center space-x-1 text-sm ${getChangeColor(stat.changeType)}`}>
                <Icon name={getChangeIcon(stat.changeType)} size={14} strokeWidth={2} />
                <span className="font-medium">{stat.change}</span>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-medium text-text-secondary">{stat.title}</h3>
            <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
            <p className="text-xs text-text-secondary">{stat.description}</p>
          </div>
        </div>
      ))}

      {/* Quick Actions Card */}
      <div className="bg-surface rounded-lg border border-secondary-200 shadow-soft p-4">
        <h3 className="text-sm font-semibold text-text-primary mb-3">Quick Actions</h3>
        <div className="space-y-2">
          <button className="w-full bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-smooth focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
            <Icon name="Plus" size={16} className="inline mr-2" strokeWidth={2} />
            Add Medication
          </button>
          <button className="w-full bg-secondary-100 text-secondary-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary-200 transition-smooth focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:ring-offset-2">
            <Icon name="Calendar" size={16} className="inline mr-2" strokeWidth={2} />
            View Schedule
          </button>
          <button className="w-full bg-warning-100 text-warning-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-warning-200 transition-smooth focus:outline-none focus:ring-2 focus:ring-warning-500 focus:ring-offset-2">
            <Icon name="AlertTriangle" size={16} className="inline mr-2" strokeWidth={2} />
            Log Missed Dose
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickStats;