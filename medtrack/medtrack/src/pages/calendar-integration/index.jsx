import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';
import ConnectionStatus from './components/ConnectionStatus';
import MedicationSchedulePreview from './components/MedicationSchedulePreview';
import SyncSettings from './components/SyncSettings';
import AdvancedOptions from './components/AdvancedOptions';
import SyncHistory from './components/SyncHistory';
import TroubleshootingSection from './components/TroubleshootingSection';

const CalendarIntegration = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [syncStatus, setSyncStatus] = useState('idle');
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [selectedCalendar, setSelectedCalendar] = useState('primary');
  const [autoSync, setAutoSync] = useState(true);

  // Mock data for medications
  const medications = [
    {
      id: 1,
      name: "Lisinopril",
      dosage: "10mg",
      times: ["08:00", "20:00"],
      enabled: true,
      category: "Heart Health"
    },
    {
      id: 2,
      name: "Metformin",
      dosage: "500mg",
      times: ["07:30", "19:30"],
      enabled: true,
      category: "Diabetes"
    },
    {
      id: 3,
      name: "Vitamin D3",
      dosage: "1000 IU",
      times: ["09:00"],
      enabled: false,
      category: "Supplements"
    },
    {
      id: 4,
      name: "Atorvastatin",
      dosage: "20mg",
      times: ["21:00"],
      enabled: true,
      category: "Cholesterol"
    }
  ];

  const availableCalendars = [
    { id: 'primary', name: 'Primary Calendar', color: '#2563EB' },
    { id: 'health', name: 'Health & Wellness', color: '#059669' },
    { id: 'medications', name: 'Medications Only', color: '#DC2626' }
  ];

  const handleConnect = async () => {
    setSyncStatus('connecting');
    // Simulate API call
    setTimeout(() => {
      setIsConnected(true);
      setSyncStatus('connected');
      setLastSyncTime(new Date());
    }, 2000);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setSyncStatus('idle');
    setLastSyncTime(null);
  };

  const handleManualSync = async () => {
    if (!isConnected) return;
    
    setSyncStatus('syncing');
    // Simulate sync process
    setTimeout(() => {
      setSyncStatus('connected');
      setLastSyncTime(new Date());
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <Icon name="Calendar" size={24} color="var(--color-primary)" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-text-primary">Calendar Integration</h1>
              <p className="text-text-secondary">Sync your medication schedule with external calendars</p>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-2 lg:gap-8">
          {/* Left Panel - Preview */}
          <div className="space-y-6">
            <ConnectionStatus
              isConnected={isConnected}
              syncStatus={syncStatus}
              lastSyncTime={lastSyncTime}
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
              onManualSync={handleManualSync}
            />
            
            <MedicationSchedulePreview
              medications={medications}
              selectedCalendar={selectedCalendar}
              availableCalendars={availableCalendars}
            />
          </div>

          {/* Right Panel - Settings */}
          <div className="space-y-6">
            <SyncSettings
              medications={medications}
              selectedCalendar={selectedCalendar}
              availableCalendars={availableCalendars}
              onCalendarChange={setSelectedCalendar}
              autoSync={autoSync}
              onAutoSyncChange={setAutoSync}
            />
            
            <AdvancedOptions />
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden space-y-6">
          <ConnectionStatus
            isConnected={isConnected}
            syncStatus={syncStatus}
            lastSyncTime={lastSyncTime}
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
            onManualSync={handleManualSync}
          />

          <SyncSettings
            medications={medications}
            selectedCalendar={selectedCalendar}
            availableCalendars={availableCalendars}
            onCalendarChange={setSelectedCalendar}
            autoSync={autoSync}
            onAutoSyncChange={setAutoSync}
          />

          <MedicationSchedulePreview
            medications={medications}
            selectedCalendar={selectedCalendar}
            availableCalendars={availableCalendars}
          />

          <AdvancedOptions />
        </div>

        {/* Common Sections */}
        <div className="mt-8 space-y-6">
          <SyncHistory isConnected={isConnected} />
          <TroubleshootingSection />
        </div>
      </div>
    </div>
  );
};

export default CalendarIntegration;