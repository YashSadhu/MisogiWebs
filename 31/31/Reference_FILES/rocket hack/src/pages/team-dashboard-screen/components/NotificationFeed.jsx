import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const NotificationFeed = ({ notifications, lastUpdated }) => {
  const [filter, setFilter] = useState('all');

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'deadline':
        return { name: 'Clock', color: 'text-warning' };
      case 'team':
        return { name: 'Users', color: 'text-info' };
      case 'idea':
        return { name: 'Lightbulb', color: 'text-success' };
      case 'comment':
        return { name: 'MessageCircle', color: 'text-primary' };
      default:
        return { name: 'Bell', color: 'text-text-tertiary' };
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-l-error';
      case 'medium':
        return 'border-l-warning';
      case 'low':
        return 'border-l-info';
      default:
        return 'border-l-border';
    }
  };

  const formatNotificationTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.isRead;
    return notification.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const filterOptions = [
    { value: 'all', label: 'All', count: notifications.length },
    { value: 'unread', label: 'Unread', count: unreadCount },
    { value: 'deadline', label: 'Deadlines', count: notifications.filter(n => n.type === 'deadline').length },
    { value: 'team', label: 'Team', count: notifications.filter(n => n.type === 'team').length }
  ];

  return (
    <div className="bg-background rounded-lg border border-border shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Icon name="Bell" size={20} className="text-primary" />
            <h2 className="text-lg font-semibold text-text-primary">Notifications</h2>
            {unreadCount > 0 && (
              <span className="bg-error text-white text-xs font-medium px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <button className="text-text-tertiary hover:text-text-secondary transition-colors">
            <Icon name="Settings" size={16} />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1 bg-surface rounded-lg p-1">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`flex-1 px-2 py-1 text-xs font-medium rounded-md transition-colors ${
                filter === option.value
                  ? 'bg-background text-text-primary shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {option.label}
              {option.count > 0 && (
                <span className={`ml-1 ${filter === option.value ? 'text-text-secondary' : 'text-text-tertiary'}`}>
                  ({option.count})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-80 overflow-y-auto">
        {filteredNotifications.length > 0 ? (
          <div className="divide-y divide-border">
            {filteredNotifications.map((notification) => {
              const icon = getNotificationIcon(notification.type);
              const priorityColor = getPriorityColor(notification.priority);
              
              return (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-surface transition-colors border-l-4 ${priorityColor} ${
                    !notification.isRead ? 'bg-primary bg-opacity-5' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-surface flex items-center justify-center ${icon.color}`}>
                      <Icon name={icon.name} size={16} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={`text-sm font-medium ${
                          !notification.isRead ? 'text-text-primary' : 'text-text-secondary'
                        }`}>
                          {notification.title}
                        </h3>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                        )}
                      </div>
                      
                      <p className="text-sm text-text-secondary leading-relaxed mb-2">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-text-tertiary">
                          {formatNotificationTime(notification.timestamp)}
                        </span>
                        
                        {notification.type === 'deadline' && (
                          <span className="text-xs font-medium text-warning bg-warning bg-opacity-10 px-2 py-1 rounded-full">
                            Urgent
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 bg-surface rounded-full flex items-center justify-center">
                <Icon name="Bell" size={24} className="text-text-tertiary" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-text-primary mb-1">No notifications</h3>
            <p className="text-xs text-text-secondary">
              {filter === 'unread' ? 'All caught up!' : 'You\'ll see team updates here'}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-border bg-surface">
        <div className="flex items-center justify-between text-xs text-text-tertiary">
          <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
          <button className="text-primary hover:text-primary-hover font-medium">
            Mark all read
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationFeed;