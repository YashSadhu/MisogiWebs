import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const TroubleshootingSection = () => {
  const [expandedItem, setExpandedItem] = useState(null);

  const troubleshootingItems = [
    {
      id: 1,
      title: "Calendar events are not appearing",
      category: "Sync Issues",
      severity: "high",
      symptoms: ["No events in calendar", "Sync shows success but no events", "Events missing for some medications"],
      solutions: [
        "Check if the correct calendar is selected in sync settings",
        "Verify calendar permissions in Google Calendar settings",
        "Try disconnecting and reconnecting your Google account",
        "Ensure the selected calendar is visible in your Google Calendar app",
        "Check if events are being created in a different time zone"
      ],
      preventive: "Enable automatic sync and check calendar visibility settings regularly"
    },
    {
      id: 2,
      title: "Sync keeps failing with connection errors",
      category: "Connection",
      severity: "high",
      symptoms: ["Frequent sync failures", "Connection timeout errors", "Authentication errors"],
      solutions: [
        "Check your internet connection stability",
        "Clear browser cache and cookies for Google services",
        "Disable browser extensions that might block calendar access",
        "Try syncing from a different device or browser",
        "Revoke and re-grant calendar permissions in Google Account settings"
      ],
      preventive: "Maintain stable internet connection and keep browser updated"
    },
    {
      id: 3,
      title: "Duplicate events are being created",
      category: "Sync Issues",
      severity: "medium",
      symptoms: ["Multiple events for same medication", "Events not updating when schedule changes", "Old events not being deleted"],
      solutions: [
        "Check conflict resolution settings in Advanced Options",
        "Clear existing medication events manually from calendar",
        "Disable and re-enable automatic sync",
        "Use 'Update existing events' option in conflict resolution",
        "Perform a manual sync after clearing duplicates"
      ],
      preventive: "Set conflict resolution to \'Update existing events\' and avoid manual calendar edits"
    },
    {
      id: 4,
      title: "Reminders are not working properly",
      category: "Notifications",
      severity: "medium",
      symptoms: ["No reminder notifications", "Reminders at wrong times", "Some medications not triggering reminders"],
      solutions: [
        "Check notification settings in your Google Calendar app",
        "Verify reminder timing settings in Advanced Options",
        "Ensure calendar app has notification permissions on your device",
        "Check if Do Not Disturb mode is affecting notifications",
        "Verify time zone settings match between MedTracker and Google Calendar"
      ],
      preventive: "Regularly check notification permissions and time zone settings"
    },
    {
      id: 5,
      title: "Events appear in wrong time zone",
      category: "Time Zone",
      severity: "low",
      symptoms: ["Medication times shifted by hours", "Events at incorrect times", "Reminders at wrong times"],
      solutions: [
        "Check time zone settings in Google Calendar",
        "Verify your device's time zone is correct",
        "Update time zone in MedTracker profile settings",
        "Clear and recreate calendar events with correct time zone",
        "Ensure automatic time zone detection is enabled"
      ],
      preventive: "Keep time zone settings consistent across all devices and applications"
    },
    {
      id: 6,
      title: "Cannot connect to Google Calendar",
      category: "Authentication",
      severity: "high",
      symptoms: ["Authentication popup blocked", "Login fails repeatedly", "Permission denied errors"],
      solutions: [
        "Allow popups for MedTracker in browser settings",
        "Clear browser cache and try again",
        "Disable ad blockers temporarily during connection",
        "Try connecting in incognito/private browsing mode",
        "Check if Google account has two-factor authentication enabled",
        "Ensure Google Calendar API is not blocked by firewall"
      ],
      preventive: "Keep browser updated and allow necessary permissions for calendar integration"
    }
  ];

  const getSeverityConfig = (severity) => {
    switch (severity) {
      case 'high':
        return {
          color: 'text-error-600',
          bgColor: 'bg-error-50',
          borderColor: 'border-error-200',
          icon: 'AlertCircle'
        };
      case 'medium':
        return {
          color: 'text-warning-600',
          bgColor: 'bg-warning-50',
          borderColor: 'border-warning-200',
          icon: 'AlertTriangle'
        };
      case 'low':
        return {
          color: 'text-secondary-600',
          bgColor: 'bg-secondary-50',
          borderColor: 'border-secondary-200',
          icon: 'Info'
        };
      default:
        return {
          color: 'text-secondary-600',
          bgColor: 'bg-secondary-50',
          borderColor: 'border-secondary-200',
          icon: 'HelpCircle'
        };
    }
  };

  const toggleExpanded = (id) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  return (
    <div className="bg-surface rounded-lg border border-secondary-200 shadow-soft p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Icon name="HelpCircle" size={24} className="text-primary" strokeWidth={2} />
        <div>
          <h2 className="text-lg font-semibold text-text-primary">Troubleshooting Guide</h2>
          <p className="text-sm text-text-secondary">Common issues and solutions for calendar integration</p>
        </div>
      </div>

      {/* Quick Help */}
      <div className="mb-6 p-4 bg-primary-50 rounded-lg border border-primary-200">
        <div className="flex items-start space-x-3">
          <Icon name="Lightbulb" size={20} className="text-primary mt-0.5" strokeWidth={2} />
          <div>
            <h3 className="text-sm font-medium text-primary mb-2">Quick Help</h3>
            <p className="text-sm text-primary mb-3">
              Most sync issues can be resolved by disconnecting and reconnecting your Google Calendar account.
            </p>
            <button className="text-sm font-medium text-primary hover:text-primary-700 transition-smooth">
              Try Reconnecting Now →
            </button>
          </div>
        </div>
      </div>

      {/* Troubleshooting Items */}
      <div className="space-y-4">
        {troubleshootingItems.map((item) => {
          const config = getSeverityConfig(item.severity);
          const isExpanded = expandedItem === item.id;

          return (
            <div key={item.id} className={`border rounded-lg ${config.borderColor}`}>
              <button
                onClick={() => toggleExpanded(item.id)}
                className="w-full p-4 text-left hover:bg-secondary-50 transition-smooth focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <Icon 
                      name={config.icon} 
                      size={20} 
                      className={config.color}
                      strokeWidth={2}
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-sm font-medium text-text-primary">{item.title}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          item.severity === 'high' ? 'bg-error-100 text-error-700' :
                          item.severity === 'medium'? 'bg-warning-100 text-warning-700' : 'bg-secondary-100 text-secondary-700'
                        }`}>
                          {item.severity} priority
                        </span>
                      </div>
                      <p className="text-xs text-text-secondary">{item.category}</p>
                    </div>
                  </div>
                  <Icon 
                    name="ChevronDown" 
                    size={16} 
                    className={`text-secondary-600 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                  />
                </div>
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 border-t border-secondary-200">
                  {/* Symptoms */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-text-primary mb-2">Symptoms</h4>
                    <ul className="space-y-1">
                      {item.symptoms.map((symptom, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <Icon name="Minus" size={12} className="text-secondary-600 mt-1" />
                          <span className="text-sm text-text-secondary">{symptom}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Solutions */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-text-primary mb-2">Solutions</h4>
                    <ol className="space-y-2">
                      {item.solutions.map((solution, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="flex-shrink-0 w-5 h-5 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs font-medium">
                            {index + 1}
                          </span>
                          <span className="text-sm text-text-secondary">{solution}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Prevention */}
                  <div className="p-3 bg-success-50 rounded-lg border border-success-200">
                    <div className="flex items-start space-x-2">
                      <Icon name="Shield" size={16} className="text-success-600 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-success-700 mb-1">Prevention</h4>
                        <p className="text-sm text-success-600">{item.preventive}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Contact Support */}
      <div className="mt-6 pt-6 border-t border-secondary-200">
        <div className="text-center">
          <h3 className="text-sm font-medium text-text-primary mb-2">Still need help?</h3>
          <p className="text-sm text-text-secondary mb-4">
            If you're still experiencing issues, our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-700 transition-smooth focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
              <Icon name="MessageCircle" size={16} className="inline mr-2" />
              Contact Support
            </button>
            <button className="px-4 py-2 border border-secondary-300 text-secondary-700 rounded-lg font-medium hover:bg-secondary-50 transition-smooth focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:ring-offset-2">
              <Icon name="FileText" size={16} className="inline mr-2" />
              View Documentation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TroubleshootingSection;