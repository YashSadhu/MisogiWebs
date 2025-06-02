import React from 'react';
import Icon from 'components/AppIcon';

const ConnectionStatus = ({
  isConnected,
  syncStatus,
  lastSyncTime,
  onConnect,
  onDisconnect,
  onManualSync
}) => {
  const getStatusConfig = () => {
    switch (syncStatus) {
      case 'connecting':
        return {
          color: 'text-warning-600',
          bgColor: 'bg-warning-50',
          borderColor: 'border-warning-200',
          icon: 'Loader2',
          text: 'Connecting to Google Calendar...',
          animate: true
        };
      case 'connected':
        return {
          color: 'text-success-600',
          bgColor: 'bg-success-50',
          borderColor: 'border-success-200',
          icon: 'CheckCircle',
          text: 'Connected to Google Calendar',
          animate: false
        };
      case 'syncing':
        return {
          color: 'text-primary-600',
          bgColor: 'bg-primary-50',
          borderColor: 'border-primary-200',
          icon: 'RefreshCw',
          text: 'Syncing medications...',
          animate: true
        };
      case 'error':
        return {
          color: 'text-error-600',
          bgColor: 'bg-error-50',
          borderColor: 'border-error-200',
          icon: 'AlertCircle',
          text: 'Connection failed',
          animate: false
        };
      default:
        return {
          color: 'text-secondary-600',
          bgColor: 'bg-secondary-50',
          borderColor: 'border-secondary-200',
          icon: 'Calendar',
          text: 'Not connected',
          animate: false
        };
    }
  };

  const status = getStatusConfig();

  const formatLastSync = (date) => {
    if (!date) return null;
    const now = new Date();
    const diffMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} hours ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-surface rounded-lg border border-secondary-200 shadow-soft p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-text-primary">Google Calendar Connection</h2>
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${status.borderColor} ${status.bgColor}`}>
          <Icon 
            name={status.icon} 
            size={16} 
            className={`${status.color} ${status.animate ? 'animate-spin' : ''}`}
            strokeWidth={2}
          />
          <span className={`text-sm font-medium ${status.color}`}>
            {status.text}
          </span>
        </div>
      </div>

      {/* Connection Actions */}
      <div className="space-y-4">
        {!isConnected ? (
          <button
            onClick={onConnect}
            disabled={syncStatus === 'connecting'}
            className="w-full bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-smooth focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            {syncStatus === 'connecting' ? (
              <div className="flex items-center justify-center space-x-2">
                <Icon name="Loader2" size={20} className="animate-spin" />
                <span>Connecting...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <Icon name="Calendar" size={20} />
                <span>Connect Google Calendar</span>
              </div>
            )}
          </button>
        ) : (
          <div className="space-y-3">
            <div className="flex space-x-3">
              <button
                onClick={onManualSync}
                disabled={syncStatus === 'syncing'}
                className="flex-1 bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-smooth focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                {syncStatus === 'syncing' ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Icon name="RefreshCw" size={16} className="animate-spin" />
                    <span>Syncing...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Icon name="RefreshCw" size={16} />
                    <span>Sync Now</span>
                  </div>
                )}
              </button>
              
              <button
                onClick={onDisconnect}
                className="px-4 py-2 border border-secondary-300 text-secondary-700 rounded-lg font-medium hover:bg-secondary-50 transition-smooth focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:ring-offset-2"
              >
                <Icon name="Unlink" size={16} />
              </button>
            </div>

            {lastSyncTime && (
              <div className="flex items-center justify-center space-x-2 text-sm text-text-secondary">
                <Icon name="Clock" size={14} />
                <span>Last synced: {formatLastSync(lastSyncTime)}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Connection Benefits */}
      <div className="mt-6 pt-6 border-t border-secondary-200">
        <h3 className="text-sm font-medium text-text-primary mb-3">Benefits of Calendar Integration</h3>
        <div className="space-y-2">
          {[
            'Automatic medication reminders across all devices',
            'Visual medication schedule in your calendar',
            'Conflict detection with other appointments',
            'Shared family medication schedules'
          ].map((benefit, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Icon name="Check" size={14} className="text-success-500" strokeWidth={2} />
              <span className="text-sm text-text-secondary">{benefit}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConnectionStatus;