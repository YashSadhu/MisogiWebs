import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const SyncSettings = ({ 
  medications, 
  selectedCalendar, 
  availableCalendars, 
  onCalendarChange, 
  autoSync, 
  onAutoSyncChange 
}) => {
  const [medicationSettings, setMedicationSettings] = useState(
    medications.reduce((acc, med) => ({
      ...acc,
      [med.id]: med.enabled
    }), {})
  );

  const handleMedicationToggle = (medicationId) => {
    setMedicationSettings(prev => ({
      ...prev,
      [medicationId]: !prev[medicationId]
    }));
  };

  const enabledCount = Object.values(medicationSettings).filter(Boolean).length;
  const totalCount = medications.length;

  return (
    <div className="bg-surface rounded-lg border border-secondary-200 shadow-soft p-6">
      <h2 className="text-lg font-semibold text-text-primary mb-6">Sync Settings</h2>

      {/* Calendar Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-text-primary mb-3">
          Target Calendar
        </label>
        <select
          value={selectedCalendar}
          onChange={(e) => onCalendarChange(e.target.value)}
          className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-smooth"
        >
          {availableCalendars.map((calendar) => (
            <option key={calendar.id} value={calendar.id}>
              {calendar.name}
            </option>
          ))}
        </select>
        <p className="mt-2 text-xs text-text-secondary">
          Choose which calendar to sync your medication reminders to
        </p>
      </div>

      {/* Auto Sync Toggle */}
      <div className="mb-6 p-4 bg-secondary-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-sm font-medium text-text-primary">Automatic Sync</h3>
            <p className="text-xs text-text-secondary mt-1">
              Automatically sync changes to your medication schedule
            </p>
          </div>
          <button
            onClick={() => onAutoSyncChange(!autoSync)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
              autoSync ? 'bg-primary' : 'bg-secondary-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                autoSync ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Medication Selection */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-text-primary">Medications to Sync</h3>
          <span className="text-xs text-text-secondary">
            {enabledCount} of {totalCount} selected
          </span>
        </div>

        <div className="space-y-3">
          {medications.map((medication) => (
            <div key={medication.id} className="flex items-center justify-between p-3 border border-secondary-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Icon name="Pill" size={20} color="var(--color-primary)" strokeWidth={2} />
                </div>
                <div>
                  <div className="text-sm font-medium text-text-primary">
                    {medication.name}
                  </div>
                  <div className="text-xs text-text-secondary">
                    {medication.dosage} • {medication.times.length} times daily
                  </div>
                  <div className="text-xs text-text-secondary">
                    {medication.times.join(', ')}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  medication.category === 'Heart Health' ? 'bg-red-100 text-red-700' :
                  medication.category === 'Diabetes' ? 'bg-blue-100 text-blue-700' :
                  medication.category === 'Supplements'? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'
                }`}>
                  {medication.category}
                </span>
                
                <button
                  onClick={() => handleMedicationToggle(medication.id)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                    medicationSettings[medication.id] ? 'bg-primary' : 'bg-secondary-300'
                  }`}
                >
                  <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                      medicationSettings[medication.id] ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex space-x-3">
        <button
          onClick={() => {
            const allEnabled = medications.reduce((acc, med) => ({
              ...acc,
              [med.id]: true
            }), {});
            setMedicationSettings(allEnabled);
          }}
          className="flex-1 px-4 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary-50 transition-smooth focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          Select All
        </button>
        
        <button
          onClick={() => {
            const allDisabled = medications.reduce((acc, med) => ({
              ...acc,
              [med.id]: false
            }), {});
            setMedicationSettings(allDisabled);
          }}
          className="flex-1 px-4 py-2 text-sm font-medium text-secondary-700 border border-secondary-300 rounded-lg hover:bg-secondary-50 transition-smooth focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:ring-offset-2"
        >
          Clear All
        </button>
      </div>

      {/* Sync Summary */}
      {enabledCount > 0 && (
        <div className="mt-6 p-4 bg-primary-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Info" size={16} className="text-primary" />
            <span className="text-sm font-medium text-primary">Sync Summary</span>
          </div>
          <div className="text-sm text-primary">
            {enabledCount} medication{enabledCount !== 1 ? 's' : ''} will create{' '}
            {medications
              .filter(med => medicationSettings[med.id])
              .reduce((total, med) => total + med.times.length, 0)}{' '}
            daily calendar events
          </div>
        </div>
      )}
    </div>
  );
};

export default SyncSettings;