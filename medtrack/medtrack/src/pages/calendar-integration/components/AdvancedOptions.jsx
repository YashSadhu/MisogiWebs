import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const AdvancedOptions = () => {
  const [reminderTiming, setReminderTiming] = useState(['15min', '5min']);
  const [conflictResolution, setConflictResolution] = useState('update');
  const [eventDuration, setEventDuration] = useState('15');
  const [includeDescription, setIncludeDescription] = useState(true);
  const [privateEvents, setPrivateEvents] = useState(false);

  const reminderOptions = [
    { id: '5min', label: '5 minutes before', value: 5 },
    { id: '15min', label: '15 minutes before', value: 15 },
    { id: '30min', label: '30 minutes before', value: 30 },
    { id: '1hour', label: '1 hour before', value: 60 },
    { id: '2hour', label: '2 hours before', value: 120 }
  ];

  const conflictOptions = [
    { id: 'update', label: 'Update existing events', description: 'Modify existing calendar events when schedules change' },
    { id: 'duplicate', label: 'Create new events', description: 'Keep old events and create new ones for changes' },
    { id: 'skip', label: 'Skip conflicts', description: 'Don\'t sync if conflicting events exist' }
  ];

  const handleReminderToggle = (reminderId) => {
    setReminderTiming(prev => 
      prev.includes(reminderId)
        ? prev.filter(id => id !== reminderId)
        : [...prev, reminderId]
    );
  };

  return (
    <div className="bg-surface rounded-lg border border-secondary-200 shadow-soft p-6">
      <h2 className="text-lg font-semibold text-text-primary mb-6">Advanced Options</h2>

      {/* Reminder Timing */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-text-primary mb-3">Reminder Timing</h3>
        <p className="text-xs text-text-secondary mb-4">
          Choose when to receive reminders before each dose
        </p>
        <div className="space-y-2">
          {reminderOptions.map((option) => (
            <label key={option.id} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={reminderTiming.includes(option.id)}
                onChange={() => handleReminderToggle(option.id)}
                className="w-4 h-4 text-primary border-secondary-300 rounded focus:ring-primary-500"
              />
              <span className="text-sm text-text-primary">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Event Duration */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-text-primary mb-3">
          Event Duration
        </label>
        <select
          value={eventDuration}
          onChange={(e) => setEventDuration(e.target.value)}
          className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-smooth"
        >
          <option value="5">5 minutes</option>
          <option value="15">15 minutes</option>
          <option value="30">30 minutes</option>
          <option value="60">1 hour</option>
        </select>
        <p className="mt-2 text-xs text-text-secondary">
          How long each medication event should appear in your calendar
        </p>
      </div>

      {/* Conflict Resolution */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-text-primary mb-3">Conflict Resolution</h3>
        <p className="text-xs text-text-secondary mb-4">
          How to handle changes to existing medication schedules
        </p>
        <div className="space-y-3">
          {conflictOptions.map((option) => (
            <label key={option.id} className="flex items-start space-x-3 cursor-pointer">
              <input
                type="radio"
                name="conflict"
                value={option.id}
                checked={conflictResolution === option.id}
                onChange={(e) => setConflictResolution(e.target.value)}
                className="mt-1 w-4 h-4 text-primary border-secondary-300 focus:ring-primary-500"
              />
              <div className="flex-1">
                <div className="text-sm font-medium text-text-primary">{option.label}</div>
                <div className="text-xs text-text-secondary">{option.description}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Additional Settings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-sm font-medium text-text-primary">Include Detailed Description</h3>
            <p className="text-xs text-text-secondary mt-1">
              Add medication details and instructions to calendar events
            </p>
          </div>
          <button
            onClick={() => setIncludeDescription(!includeDescription)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
              includeDescription ? 'bg-primary' : 'bg-secondary-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                includeDescription ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-sm font-medium text-text-primary">Private Events</h3>
            <p className="text-xs text-text-secondary mt-1">
              Mark medication events as private in shared calendars
            </p>
          </div>
          <button
            onClick={() => setPrivateEvents(!privateEvents)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
              privateEvents ? 'bg-primary' : 'bg-secondary-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                privateEvents ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Recurring Event Settings */}
      <div className="mt-6 pt-6 border-t border-secondary-200">
        <h3 className="text-sm font-medium text-text-primary mb-3">Recurring Event Management</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Icon name="RotateCcw" size={16} className="text-secondary-600" />
              <div>
                <div className="text-sm font-medium text-text-primary">Daily Recurrence</div>
                <div className="text-xs text-text-secondary">Create recurring daily events</div>
              </div>
            </div>
            <Icon name="Check" size={16} className="text-success-500" />
          </div>

          <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Icon name="Calendar" size={16} className="text-secondary-600" />
              <div>
                <div className="text-sm font-medium text-text-primary">End Date Management</div>
                <div className="text-xs text-text-secondary">Automatically end series when medication stops</div>
              </div>
            </div>
            <Icon name="Check" size={16} className="text-success-500" />
          </div>

          <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Icon name="AlertTriangle" size={16} className="text-secondary-600" />
              <div>
                <div className="text-sm font-medium text-text-primary">Exception Handling</div>
                <div className="text-xs text-text-secondary">Handle missed doses and schedule changes</div>
              </div>
            </div>
            <Icon name="Check" size={16} className="text-success-500" />
          </div>
        </div>
      </div>

      {/* Save Settings */}
      <div className="mt-6 pt-6 border-t border-secondary-200">
        <button className="w-full bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-smooth focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
          <div className="flex items-center justify-center space-x-2">
            <Icon name="Save" size={20} />
            <span>Save Advanced Settings</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default AdvancedOptions;