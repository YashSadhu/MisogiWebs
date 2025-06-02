import React, { useState } from 'react';
import { Bell, Calendar, Download, Shield } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { requestNotificationPermission } from '../utils/notificationUtils';
import { generateGoogleCalendarURL } from '../utils/notificationUtils';
import { useMedication } from '../context/MedicationContext';
import { getCurrentDate } from '../utils/dateUtils';

const Settings: React.FC = () => {
  const { medications } = useMedication();
  const [notificationsEnabled, setNotificationsEnabled] = useState(Notification.permission === 'granted');
  const [calendarEnabled, setCalendarEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState(15); // minutes before
  
  const handleRequestNotifications = async () => {
    const granted = await requestNotificationPermission();
    setNotificationsEnabled(granted);
  };
  
  const handleCalendarSync = () => {
    // For demonstration purposes only
    setCalendarEnabled(!calendarEnabled);
  };
  
  const handleExportToCalendar = () => {
    // Create calendar links for medications
    const links: string[] = [];
    
    medications.forEach(medication => {
      medication.timeSlots.forEach(timeSlot => {
        const link = generateGoogleCalendarURL(
          medication.name,
          medication.dose,
          getCurrentDate(),
          timeSlot,
          'DAILY'
        );
        links.push(link);
      });
    });
    
    // Open the first link in a new tab
    if (links.length > 0) {
      window.open(links[0], '_blank');
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your preferences and account settings</p>
      </div>
      
      {/* Notifications Settings */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="mr-2" size={20} />
            Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">In-app Notifications</h3>
                <p className="text-sm text-gray-500">Receive reminders when it's time to take your medications</p>
              </div>
              <div className="flex items-center">
                <button
                  onClick={handleRequestNotifications}
                  className={`relative inline-flex items-center h-6 rounded-full w-11 ${
                    notificationsEnabled ? 'bg-indigo-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                      notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Google Calendar Integration</h3>
                <p className="text-sm text-gray-500">Sync your medication schedule with Google Calendar</p>
              </div>
              <div className="flex items-center">
                <button
                  onClick={handleCalendarSync}
                  className={`relative inline-flex items-center h-6 rounded-full w-11 ${
                    calendarEnabled ? 'bg-indigo-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                      calendarEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Reminder Time</h3>
              <div className="flex items-center space-x-4">
                <Input
                  type="number"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(parseInt(e.target.value))}
                  min={0}
                  max={60}
                  className="w-24"
                />
                <span className="text-gray-600">minutes before scheduled dose</span>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                leftIcon={<Calendar size={16} />}
                onClick={handleExportToCalendar}
              >
                Export to Google Calendar
              </Button>
              <p className="mt-2 text-xs text-gray-500">
                This will create calendar events for your medication schedule
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Account Settings */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="mr-2" size={20} />
            Account Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Profile Information</h3>
              <div className="space-y-4">
                <Input
                  label="Full Name"
                  defaultValue="Demo User"
                />
                <Input
                  label="Email Address"
                  type="email"
                  defaultValue="user@example.com"
                />
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Password</h3>
              <div className="space-y-4">
                <Input
                  label="Current Password"
                  type="password"
                  placeholder="••••••••"
                />
                <Input
                  label="New Password"
                  type="password"
                  placeholder="••••••••"
                />
                <Input
                  label="Confirm New Password"
                  type="password"
                  placeholder="••••••••"
                />
                <Button>
                  Update Password
                </Button>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Data Management</h3>
              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  leftIcon={<Download size={16} />}
                >
                  Export All Data
                </Button>
                <Button variant="danger">
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;