import React, { useEffect, useState } from 'react';
import { Calendar, Clock, Award, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useMedication } from '../context/MedicationContext';
import { useLog } from '../context/LogContext';
import { formatTime, getCurrentDate, isUpcomingTime, isOverdueTime, calculateAdherence } from '../utils/dateUtils';
import { requestNotificationPermission, scheduleLocalNotifications } from '../utils/notificationUtils';

const Dashboard: React.FC = () => {
  const { medications, isLoading: medsLoading } = useMedication();
  const { logs, addLog, isLoading: logsLoading } = useLog();
  const [currentDate, setCurrentDate] = useState(getCurrentDate());
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // Request notification permissions and set up notifications
  useEffect(() => {
    const setupNotifications = async () => {
      const permissionGranted = await requestNotificationPermission();
      setNotificationsEnabled(permissionGranted);
      
      if (permissionGranted && medications.length > 0) {
        scheduleLocalNotifications(
          medications.map(med => ({
            id: med.id,
            name: med.name,
            dose: med.dose,
            timeSlots: med.timeSlots,
          }))
        );
      }
    };
    
    setupNotifications();
  }, [medications]);

  // Update the current date every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(getCurrentDate());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // Get today's scheduled medications
  const getTodayMedications = () => {
    const today = new Date().toISOString().split('T')[0];
    
    return medications.filter(med => {
      const startDate = new Date(med.startDate);
      const endDate = new Date(med.endDate);
      const todayDate = new Date(today);
      
      return startDate <= todayDate && endDate >= todayDate;
    });
  };

  // Get upcoming doses (within the next hour)
  const getUpcomingDoses = () => {
    const todayMeds = getTodayMedications();
    const upcoming: { medication: typeof medications[0]; timeSlot: string }[] = [];
    
    todayMeds.forEach(med => {
      med.timeSlots.forEach(timeSlot => {
        if (isUpcomingTime(timeSlot)) {
          upcoming.push({ medication: med, timeSlot });
        }
      });
    });
    
    return upcoming;
  };

  // Get overdue doses (within the last 4 hours)
  const getOverdueDoses = () => {
    const todayMeds = getTodayMedications();
    const overdue: { medication: typeof medications[0]; timeSlot: string }[] = [];
    
    todayMeds.forEach(med => {
      med.timeSlots.forEach(timeSlot => {
        if (isOverdueTime(timeSlot)) {
          // Check if this dose has already been logged
          const isDoseLogged = logs.some(log => {
            const logDate = new Date(log.scheduled).toISOString().split('T')[0];
            const logTime = new Date(log.scheduled).toTimeString().slice(0, 5);
            return logDate === currentDate && logTime === timeSlot && log.medicationId === med.id;
          });
          
          if (!isDoseLogged) {
            overdue.push({ medication: med, timeSlot });
          }
        }
      });
    });
    
    return overdue;
  };

  // Calculate today's adherence
  const calculateTodayAdherence = () => {
    const todayLogs = logs.filter(log => {
      const logDate = new Date(log.scheduled).toISOString().split('T')[0];
      return logDate === currentDate;
    });
    
    const totalScheduled = todayLogs.length;
    const totalTaken = todayLogs.filter(log => log.status === 'taken' || log.status === 'late').length;
    
    return calculateAdherence(totalTaken, totalScheduled);
  };

  // Mark a dose as taken
  const markDoseTaken = async (medicationId: string, timeSlot: string) => {
    const now = new Date();
    const scheduled = new Date();
    const [hours, minutes] = timeSlot.split(':').map(Number);
    scheduled.setHours(hours, minutes, 0, 0);
    
    // Determine if the dose is late (more than 15 minutes after scheduled time)
    const diffMs = now.getTime() - scheduled.getTime();
    const diffMinutes = diffMs / (1000 * 60);
    const status = diffMinutes > 15 ? 'late' : 'taken';
    
    await addLog({
      medicationId,
      timestamp: now.toISOString(),
      scheduled: scheduled.toISOString(),
      status,
    });
  };

  // Handle loading state
  if (medsLoading || logsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const upcomingDoses = getUpcomingDoses();
  const overdueDoses = getOverdueDoses();
  const todayAdherence = calculateTodayAdherence();
  const streakCount = 3; // This would be calculated in a real app

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Track your medications and stay on schedule</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-white">
              <Calendar className="mr-2" size={20} />
              Today's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{getTodayMedications().length}</div>
            <p className="text-indigo-100">medications scheduled</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-teal-500 to-teal-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-white">
              <Clock className="mr-2" size={20} />
              Upcoming
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{upcomingDoses.length}</div>
            <p className="text-teal-100">doses in the next hour</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-white">
              <Award className="mr-2" size={20} />
              Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{streakCount} days</div>
            <p className="text-amber-100">perfect adherence</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-white">
              <Award className="mr-2" size={20} />
              Today's Adherence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{todayAdherence}%</div>
            <p className="text-emerald-100">of doses taken</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Upcoming Doses */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Doses</h2>
        {upcomingDoses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingDoses.map((dose, index) => (
              <Card key={`upcoming-${index}`}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">
                        {dose.medication.name}
                      </h3>
                      <p className="text-gray-600">{dose.medication.dose}</p>
                      <div className="flex items-center mt-2 text-indigo-600">
                        <Clock size={16} className="mr-1" />
                        <span>{formatTime(dose.timeSlot)}</span>
                      </div>
                    </div>
                    <Button
                      onClick={() => markDoseTaken(dose.medication.id, dose.timeSlot)}
                      variant="primary"
                    >
                      Mark as Taken
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-6">
              <p className="text-gray-600 text-center">No upcoming doses in the next hour</p>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Overdue Doses */}
      {overdueDoses.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Overdue Doses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {overdueDoses.map((dose, index) => (
              <Card key={`overdue-${index}`} className="border-l-4 border-red-500">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center">
                        <AlertCircle size={16} className="text-red-500 mr-2" />
                        <h3 className="font-semibold text-lg text-gray-900">
                          {dose.medication.name}
                        </h3>
                      </div>
                      <p className="text-gray-600">{dose.medication.dose}</p>
                      <div className="flex items-center mt-2 text-red-600">
                        <Clock size={16} className="mr-1" />
                        <span>{formatTime(dose.timeSlot)} (Overdue)</span>
                      </div>
                    </div>
                    <Button
                      onClick={() => markDoseTaken(dose.medication.id, dose.timeSlot)}
                      variant="warning"
                    >
                      Mark as Taken
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {/* Notifications Permission */}
      {!notificationsEnabled && (
        <Card className="mb-8 bg-gray-50">
          <CardContent className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-amber-100 p-3 rounded-full mr-4">
                  <AlertCircle size={24} className="text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Enable Notifications</h3>
                  <p className="text-gray-600">Stay on track with medication reminders</p>
                </div>
              </div>
              <Button
                onClick={() => requestNotificationPermission().then(setNotificationsEnabled)}
                variant="outline"
              >
                Enable
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;