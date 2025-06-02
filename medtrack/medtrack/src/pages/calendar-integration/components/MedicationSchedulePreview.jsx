import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const MedicationSchedulePreview = ({ medications, selectedCalendar, availableCalendars }) => {
  const [previewFormat, setPreviewFormat] = useState('detailed');
  const [selectedMedication, setSelectedMedication] = useState(medications[0]);

  const formatOptions = [
    { id: 'simple', label: 'Simple', example: 'Take Lisinopril 10mg' },
    { id: 'detailed', label: 'Detailed', example: 'Medication Reminder: Take Lisinopril 10mg at 8:00 AM' },
    { id: 'custom', label: 'Custom', example: '💊 Lisinopril (10mg) - Heart Health' }
  ];

  const generateEventTitle = (medication, format) => {
    switch (format) {
      case 'simple':
        return `Take ${medication.name} ${medication.dosage}`;
      case 'detailed':
        return `Medication Reminder: Take ${medication.name} ${medication.dosage}`;
      case 'custom':
        return `💊 ${medication.name} (${medication.dosage}) - ${medication.category}`;
      default:
        return `Take ${medication.name} ${medication.dosage}`;
    }
  };

  const generateEventDescription = (medication) => {
    return `Medication: ${medication.name}
Dosage: ${medication.dosage}
Category: ${medication.category}
Scheduled times: ${medication.times.join(', ')}

This is an automated reminder from MedTracker. Please take your medication as prescribed.`;
  };

  const selectedCalendarInfo = availableCalendars.find(cal => cal.id === selectedCalendar);

  return (
    <div className="bg-surface rounded-lg border border-secondary-200 shadow-soft p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-text-primary">Calendar Preview</h2>
        <div className="flex items-center space-x-2">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: selectedCalendarInfo?.color }}
          ></div>
          <span className="text-sm text-text-secondary">{selectedCalendarInfo?.name}</span>
        </div>
      </div>

      {/* Format Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-text-primary mb-3">
          Event Title Format
        </label>
        <div className="space-y-2">
          {formatOptions.map((option) => (
            <label key={option.id} className="flex items-start space-x-3 cursor-pointer">
              <input
                type="radio"
                name="format"
                value={option.id}
                checked={previewFormat === option.id}
                onChange={(e) => setPreviewFormat(e.target.value)}
                className="mt-1 w-4 h-4 text-primary border-secondary-300 focus:ring-primary-500"
              />
              <div className="flex-1">
                <div className="text-sm font-medium text-text-primary">{option.label}</div>
                <div className="text-sm text-text-secondary">{option.example}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Medication Selection for Preview */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-text-primary mb-3">
          Preview Medication
        </label>
        <select
          value={selectedMedication.id}
          onChange={(e) => setSelectedMedication(medications.find(m => m.id === parseInt(e.target.value)))}
          className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-smooth"
        >
          {medications.map((med) => (
            <option key={med.id} value={med.id}>
              {med.name} - {med.dosage}
            </option>
          ))}
        </select>
      </div>

      {/* Calendar Event Preview */}
      <div className="border border-secondary-200 rounded-lg p-4 bg-secondary-50">
        <div className="flex items-start space-x-3">
          <div 
            className="w-4 h-4 rounded mt-1 flex-shrink-0"
            style={{ backgroundColor: selectedCalendarInfo?.color }}
          ></div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-text-primary mb-1">
              {generateEventTitle(selectedMedication, previewFormat)}
            </div>
            <div className="text-sm text-text-secondary mb-2">
              {selectedMedication.times.map((time, index) => (
                <span key={index} className="inline-flex items-center space-x-1 mr-3">
                  <Icon name="Clock" size={12} />
                  <span>{time}</span>
                </span>
              ))}
            </div>
            <div className="text-xs text-text-secondary">
              <Icon name="Calendar" size={12} className="inline mr-1" />
              {selectedCalendarInfo?.name}
            </div>
          </div>
          <div className="flex-shrink-0">
            <Icon name="Bell" size={16} className="text-warning-500" />
          </div>
        </div>
        
        {/* Event Description Preview */}
        <div className="mt-4 pt-4 border-t border-secondary-200">
          <div className="text-xs font-medium text-text-primary mb-2">Event Description:</div>
          <div className="text-xs text-text-secondary whitespace-pre-line">
            {generateEventDescription(selectedMedication)}
          </div>
        </div>
      </div>

      {/* Reminder Settings Preview */}
      <div className="mt-6 pt-6 border-t border-secondary-200">
        <h3 className="text-sm font-medium text-text-primary mb-3">Reminder Settings</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">15 minutes before</span>
            <Icon name="Smartphone" size={14} className="text-primary" />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">5 minutes before</span>
            <Icon name="Bell" size={14} className="text-primary" />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">At dose time</span>
            <Icon name="AlertCircle" size={14} className="text-primary" />
          </div>
        </div>
      </div>

      {/* Daily Schedule Preview */}
      <div className="mt-6 pt-6 border-t border-secondary-200">
        <h3 className="text-sm font-medium text-text-primary mb-3">Today's Schedule Preview</h3>
        <div className="space-y-2">
          {medications
            .filter(med => med.enabled)
            .flatMap(med => 
              med.times.map(time => ({
                time,
                medication: med,
                title: generateEventTitle(med, previewFormat)
              }))
            )
            .sort((a, b) => a.time.localeCompare(b.time))
            .map((event, index) => (
              <div key={index} className="flex items-center space-x-3 p-2 rounded border border-secondary-200">
                <div className="text-sm font-medium text-text-primary w-16">
                  {event.time}
                </div>
                <div 
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: selectedCalendarInfo?.color }}
                ></div>
                <div className="flex-1 text-sm text-text-secondary truncate">
                  {event.title}
                </div>
                <Icon name="Bell" size={12} className="text-warning-500" />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MedicationSchedulePreview;