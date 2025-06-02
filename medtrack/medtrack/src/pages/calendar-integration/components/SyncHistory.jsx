import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const SyncHistory = ({ isConnected }) => {
  const [showDetails, setShowDetails] = useState({});

  // Mock sync history data
  const syncHistory = [
    {
      id: 1,
      timestamp: new Date(Date.now() - 300000), // 5 minutes ago
      status: 'success',
      action: 'Automatic Sync',
      details: 'Successfully synced 4 medications with 12 calendar events',
      eventsCreated: 12,
      eventsUpdated: 0,
      eventsDeleted: 0,
      medications: ['Lisinopril', 'Metformin', 'Atorvastatin', 'Vitamin D3']
    },
    {
      id: 2,
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      status: 'success',
      action: 'Manual Sync',
      details: 'Updated medication schedule for Lisinopril',
      eventsCreated: 2,
      eventsUpdated: 2,
      eventsDeleted: 2,
      medications: ['Lisinopril']
    },
    {
      id: 3,
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      status: 'warning',
      action: 'Automatic Sync',
      details: 'Partial sync completed - some events could not be created due to calendar conflicts',
      eventsCreated: 8,
      eventsUpdated: 0,
      eventsDeleted: 0,
      medications: ['Metformin', 'Atorvastatin'],
      warnings: ['2 events skipped due to existing appointments', 'Calendar permission may be limited']
    },
    {
      id: 4,
      timestamp: new Date(Date.now() - 86400000), // 1 day ago
      status: 'error',
      action: 'Automatic Sync',
      details: 'Sync failed - unable to connect to Google Calendar',
      eventsCreated: 0,
      eventsUpdated: 0,
      eventsDeleted: 0,
      medications: [],
      error: 'Network timeout - please check your internet connection'
    },
    {
      id: 5,
      timestamp: new Date(Date.now() - 172800000), // 2 days ago
      status: 'success',
      action: 'Initial Setup',
      details: 'First-time calendar integration completed',
      eventsCreated: 14,
      eventsUpdated: 0,
      eventsDeleted: 0,
      medications: ['Lisinopril', 'Metformin', 'Atorvastatin', 'Vitamin D3']
    }
  ];

  const getStatusConfig = (status) => {
    switch (status) {
      case 'success':
        return {
          icon: 'CheckCircle',
          color: 'text-success-600',
          bgColor: 'bg-success-50',
          borderColor: 'border-success-200'
        };
      case 'warning':
        return {
          icon: 'AlertTriangle',
          color: 'text-warning-600',
          bgColor: 'bg-warning-50',
          borderColor: 'border-warning-200'
        };
      case 'error':
        return {
          icon: 'AlertCircle',
          color: 'text-error-600',
          bgColor: 'bg-error-50',
          borderColor: 'border-error-200'
        };
      default:
        return {
          icon: 'Info',
          color: 'text-secondary-600',
          bgColor: 'bg-secondary-50',
          borderColor: 'border-secondary-200'
        };
    }
  };

  const formatTimestamp = (date) => {
    const now = new Date();
    const diffMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} hours ago`;
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const toggleDetails = (id) => {
    setShowDetails(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  if (!isConnected) {
    return (
      <div className="bg-surface rounded-lg border border-secondary-200 shadow-soft p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Sync History</h2>
        <div className="text-center py-8">
          <Icon name="Calendar" size={48} className="text-secondary-400 mx-auto mb-4" />
          <p className="text-text-secondary">Connect your Google Calendar to view sync history</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-lg border border-secondary-200 shadow-soft p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-text-primary">Sync History</h2>
        <div className="flex items-center space-x-2 text-sm text-text-secondary">
          <Icon name="Clock" size={16} />
          <span>Last 7 days</span>
        </div>
      </div>

      <div className="space-y-4">
        {syncHistory.map((entry) => {
          const config = getStatusConfig(entry.status);
          const isExpanded = showDetails[entry.id];

          return (
            <div key={entry.id} className={`border rounded-lg ${config.borderColor} ${config.bgColor}`}>
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <Icon 
                      name={config.icon} 
                      size={20} 
                      className={config.color}
                      strokeWidth={2}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-medium text-text-primary">
                          {entry.action}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          entry.status === 'success' ? 'bg-success-100 text-success-700' :
                          entry.status === 'warning' ? 'bg-warning-100 text-warning-700' :
                          entry.status === 'error'? 'bg-error-100 text-error-700' : 'bg-secondary-100 text-secondary-700'
                        }`}>
                          {entry.status}
                        </span>
                      </div>
                      <p className="text-sm text-text-secondary mb-2">
                        {entry.details}
                      </p>
                      <div className="text-xs text-text-secondary">
                        {formatTimestamp(entry.timestamp)}
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => toggleDetails(entry.id)}
                    className="ml-4 p-1 text-secondary-600 hover:text-primary transition-smooth"
                  >
                    <Icon 
                      name="ChevronDown" 
                      size={16} 
                      className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                    />
                  </button>
                </div>

                {/* Quick Stats */}
                {(entry.eventsCreated > 0 || entry.eventsUpdated > 0 || entry.eventsDeleted > 0) && (
                  <div className="mt-3 flex items-center space-x-4 text-xs">
                    {entry.eventsCreated > 0 && (
                      <div className="flex items-center space-x-1">
                        <Icon name="Plus" size={12} className="text-success-600" />
                        <span className="text-text-secondary">{entry.eventsCreated} created</span>
                      </div>
                    )}
                    {entry.eventsUpdated > 0 && (
                      <div className="flex items-center space-x-1">
                        <Icon name="Edit" size={12} className="text-warning-600" />
                        <span className="text-text-secondary">{entry.eventsUpdated} updated</span>
                      </div>
                    )}
                    {entry.eventsDeleted > 0 && (
                      <div className="flex items-center space-x-1">
                        <Icon name="Trash2" size={12} className="text-error-600" />
                        <span className="text-text-secondary">{entry.eventsDeleted} deleted</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-secondary-200">
                    {/* Medications Affected */}
                    {entry.medications.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-xs font-medium text-text-primary mb-2">Medications Affected</h4>
                        <div className="flex flex-wrap gap-1">
                          {entry.medications.map((med, index) => (
                            <span key={index} className="px-2 py-1 text-xs bg-primary-100 text-primary-700 rounded">
                              {med}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Warnings */}
                    {entry.warnings && (
                      <div className="mb-4">
                        <h4 className="text-xs font-medium text-text-primary mb-2">Warnings</h4>
                        <div className="space-y-1">
                          {entry.warnings.map((warning, index) => (
                            <div key={index} className="flex items-start space-x-2">
                              <Icon name="AlertTriangle" size={12} className="text-warning-600 mt-0.5" />
                              <span className="text-xs text-text-secondary">{warning}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Error Details */}
                    {entry.error && (
                      <div className="mb-4">
                        <h4 className="text-xs font-medium text-text-primary mb-2">Error Details</h4>
                        <div className="flex items-start space-x-2">
                          <Icon name="AlertCircle" size={12} className="text-error-600 mt-0.5" />
                          <span className="text-xs text-text-secondary">{entry.error}</span>
                        </div>
                      </div>
                    )}

                    {/* Detailed Stats */}
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-2 bg-white rounded border border-secondary-200">
                        <div className="text-lg font-semibold text-success-600">{entry.eventsCreated}</div>
                        <div className="text-xs text-text-secondary">Created</div>
                      </div>
                      <div className="p-2 bg-white rounded border border-secondary-200">
                        <div className="text-lg font-semibold text-warning-600">{entry.eventsUpdated}</div>
                        <div className="text-xs text-text-secondary">Updated</div>
                      </div>
                      <div className="p-2 bg-white rounded border border-secondary-200">
                        <div className="text-lg font-semibold text-error-600">{entry.eventsDeleted}</div>
                        <div className="text-xs text-text-secondary">Deleted</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Clear History */}
      <div className="mt-6 pt-6 border-t border-secondary-200 text-center">
        <button className="text-sm text-secondary-600 hover:text-error transition-smooth">
          <Icon name="Trash2" size={14} className="inline mr-1" />
          Clear Sync History
        </button>
      </div>
    </div>
  );
};

export default SyncHistory;