import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const QuickActions = ({ selectedProfile }) => {
  const [showAddMedication, setShowAddMedication] = useState(false);
  const [showLogMissed, setShowLogMissed] = useState(false);

  const quickActions = [
    {
      id: 'add-medication',
      title: 'Add Medication',
      description: 'Add a new medication to your schedule',
      icon: 'Plus',
      color: 'bg-primary',
      hoverColor: 'hover:bg-primary-700',
      action: () => setShowAddMedication(true)
    },
    {
      id: 'log-missed',
      title: 'Log Missed Dose',
      description: 'Record a missed medication dose',
      icon: 'AlertTriangle',
      color: 'bg-warning-500',
      hoverColor: 'hover:bg-warning-600',
      action: () => setShowLogMissed(true)
    },
    {
      id: 'view-schedule',
      title: 'View Full Schedule',
      description: 'See your complete medication timeline',
      icon: 'Calendar',
      color: 'bg-accent',
      hoverColor: 'hover:bg-emerald-700',
      action: () => console.log('Navigate to schedule')
    },
    {
      id: 'sync-calendar',
      title: 'Sync Calendar',
      description: 'Update Google Calendar reminders',
      icon: 'RefreshCw',
      color: 'bg-secondary-500',
      hoverColor: 'hover:bg-secondary-600',
      action: () => console.log('Sync calendar')
    },
    {
      id: 'export-data',
      title: 'Export Data',
      description: 'Download your medication logs',
      icon: 'Download',
      color: 'bg-primary-600',
      hoverColor: 'hover:bg-primary-700',
      action: () => console.log('Export data')
    },
    {
      id: 'emergency-contact',
      title: 'Emergency Contact',
      description: 'Quick access to healthcare provider',
      icon: 'Phone',
      color: 'bg-error',
      hoverColor: 'hover:bg-red-600',
      action: () => console.log('Emergency contact')
    }
  ];

  const recentActivities = [
    {
      id: 1,
      action: 'Medication Added',
      details: 'Vitamin B12 added to morning routine',
      timestamp: '2 hours ago',
      icon: 'Plus',
      color: 'text-accent-500'
    },
    {
      id: 2,
      action: 'Dose Logged',
      details: 'Lisinopril marked as taken',
      timestamp: '4 hours ago',
      icon: 'Check',
      color: 'text-accent-500'
    },
    {
      id: 3,
      action: 'Reminder Set',
      details: 'Evening medication reminder updated',
      timestamp: '1 day ago',
      icon: 'Bell',
      color: 'text-primary-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Actions Grid */}
      <div className="bg-surface rounded-lg border border-secondary-200 shadow-soft">
        <div className="p-6 border-b border-secondary-200">
          <div className="flex items-center space-x-3">
            <Icon name="Zap" size={20} color="var(--color-primary)" strokeWidth={2} />
            <h2 className="text-lg font-semibold text-text-primary">Quick Actions</h2>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 gap-3">
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={action.action}
                className={`
                  ${action.color} ${action.hoverColor} text-white p-4 rounded-lg 
                  transition-smooth focus:outline-none focus:ring-2 focus:ring-offset-2 
                  focus:ring-primary-500 text-left group
                `}
              >
                <div className="flex items-center space-x-3">
                  <Icon 
                    name={action.icon} 
                    size={20} 
                    strokeWidth={2}
                    className="group-hover:scale-110 transition-transform"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-white">{action.title}</h3>
                    <p className="text-sm text-white text-opacity-90 truncate">
                      {action.description}
                    </p>
                  </div>
                  <Icon 
                    name="ChevronRight" 
                    size={16} 
                    strokeWidth={2}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-surface rounded-lg border border-secondary-200 shadow-soft">
        <div className="p-6 border-b border-secondary-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Icon name="Activity" size={20} color="var(--color-primary)" strokeWidth={2} />
              <h2 className="text-lg font-semibold text-text-primary">Recent Activity</h2>
            </div>
            <button className="text-sm text-primary hover:text-primary-700 font-medium transition-smooth">
              View All
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center">
                  <Icon name={activity.icon} size={14} className={activity.color} strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary">{activity.action}</p>
                  <p className="text-xs text-text-secondary">{activity.details}</p>
                  <p className="text-xs text-text-secondary mt-1">{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>

          {recentActivities.length === 0 && (
            <div className="text-center py-8">
              <Icon name="Clock" size={32} color="var(--color-secondary-400)" strokeWidth={1.5} className="mx-auto mb-2" />
              <p className="text-sm text-text-secondary">No recent activity</p>
            </div>
          )}
        </div>
      </div>

      {/* Health Tips Card */}
      <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg border border-primary-200 p-6">
        <div className="flex items-start space-x-3">
          <Icon name="Heart" size={20} color="var(--color-primary)" strokeWidth={2} />
          <div>
            <h3 className="text-sm font-semibold text-primary-700 mb-2">Daily Health Tip</h3>
            <p className="text-sm text-primary-600 mb-3">
              Taking medications at consistent times each day helps maintain steady levels in your bloodstream and improves effectiveness.
            </p>
            <button className="text-xs text-primary-700 hover:text-primary-800 font-medium transition-smooth">
              Learn More →
            </button>
          </div>
        </div>
      </div>

      {/* Emergency Quick Access */}
      <div className="bg-error-50 border border-error-200 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <Icon name="AlertTriangle" size={20} color="var(--color-error)" strokeWidth={2} />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-error-700">Emergency</h3>
            <p className="text-xs text-error-600">Quick access to emergency contacts</p>
          </div>
          <button className="bg-error text-white px-3 py-1.5 rounded-md text-xs font-medium hover:bg-red-600 transition-smooth focus:outline-none focus:ring-2 focus:ring-error-500 focus:ring-offset-2">
            Call 911
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;