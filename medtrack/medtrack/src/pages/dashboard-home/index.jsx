import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';
import TodaysMedications from './components/TodaysMedications';
import QuickStats from './components/QuickStats';
import AdherenceHeatmap from './components/AdherenceHeatmap';
import WeeklyTrends from './components/WeeklyTrends';
import MostMissedMedications from './components/MostMissedMedications';
import QuickActions from './components/QuickActions';

const DashboardHome = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedProfile, setSelectedProfile] = useState('primary');

  // Mock user profiles
  const userProfiles = [
    { id: 'primary', name: 'Dr. Sarah Wilson', role: 'Primary User' },
    { id: 'john', name: 'John Wilson', role: 'Family Member' },
    { id: 'emma', name: 'Emma Wilson', role: 'Child' }
  ];

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const formatCurrentTime = () => {
    return currentTime.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatCurrentDate = () => {
    return currentTime.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
                Good {currentTime.getHours() < 12 ? 'Morning' : currentTime.getHours() < 17 ? 'Afternoon' : 'Evening'}!
              </h1>
              <p className="text-text-secondary">
                {formatCurrentDate()} • {formatCurrentTime()}
              </p>
            </div>
            
            {/* Profile Switcher */}
            <div className="mt-4 sm:mt-0">
              <select
                value={selectedProfile}
                onChange={(e) => setSelectedProfile(e.target.value)}
                className="bg-surface border border-secondary-200 rounded-lg px-4 py-2 text-sm font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-smooth"
              >
                {userProfiles.map((profile) => (
                  <option key={profile.id} value={profile.id}>
                    {profile.name} ({profile.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Welcome Message */}
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Icon name="Heart" size={20} color="var(--color-primary)" strokeWidth={2} />
              <div>
                <h3 className="text-sm font-medium text-primary-700 mb-1">
                  Stay on Track Today
                </h3>
                <p className="text-sm text-primary-600">
                  You have 3 medications scheduled for today. Keep up the great work with your 94% adherence rate this week!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Today's Medications */}
          <div className="lg:col-span-5">
            <TodaysMedications selectedProfile={selectedProfile} />
          </div>

          {/* Center Column - Charts and Analytics */}
          <div className="lg:col-span-4 space-y-6">
            <AdherenceHeatmap selectedProfile={selectedProfile} />
            <WeeklyTrends selectedProfile={selectedProfile} />
          </div>

          {/* Right Column - Quick Stats and Actions */}
          <div className="lg:col-span-3 space-y-6">
            <QuickStats selectedProfile={selectedProfile} />
            <QuickActions selectedProfile={selectedProfile} />
          </div>
        </div>

        {/* Bottom Section - Most Missed Medications */}
        <div className="mt-8">
          <MostMissedMedications selectedProfile={selectedProfile} />
        </div>

        {/* Emergency Contact Banner */}
        <div className="mt-8 bg-error-50 border border-error-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <Icon name="Phone" size={20} color="var(--color-error)" strokeWidth={2} />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-error-700 mb-1">
                Emergency Contact
              </h3>
              <p className="text-sm text-error-600">
                If you experience any adverse reactions, contact your healthcare provider immediately or call 911.
              </p>
            </div>
            <button className="bg-error text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-smooth focus:outline-none focus:ring-2 focus:ring-error-500 focus:ring-offset-2">
              Call Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;