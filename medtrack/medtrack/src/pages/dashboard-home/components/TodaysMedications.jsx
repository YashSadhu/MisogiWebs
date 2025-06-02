import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';
import { useMedicationData } from '../../../hooks/useMedicationData';

const TodaysMedications = ({ selectedProfile }) => {
  const { getTodaysMedications, logAdherence, isLoading } = useMedicationData();
  const [todaysMedications, setTodaysMedications] = useState([]);

  useEffect(() => {
    // Update today's medications data
    const updateTodaysMedications = () => {
      const medications = getTodaysMedications();
      setTodaysMedications(medications);
    };

    updateTodaysMedications();

    // Update every minute to reflect status changes
    const interval = setInterval(updateTodaysMedications, 60000);

    return () => clearInterval(interval);
  }, [getTodaysMedications]);

  const handleMarkTaken = async (medication) => {
    const currentTime = new Date().toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    try {
      await logAdherence(medication.id, 'taken');
      
      // Update local state immediately
      setTodaysMedications(prev => prev.map(med => 
        med.id === medication.id && med.scheduledTime === medication.scheduledTime
          ? { ...med, status: 'taken', takenAt: currentTime }
          : med
      ));

      // Show success toast
      if (window.showToast) {
        window.showToast(`${medication.name} marked as taken`, 'success', 3000);
      }
    } catch (error) {
      console.error('Error marking medication as taken:', error);
      if (window.showToast) {
        window.showToast('Error logging medication. Please try again.', 'error', 5000);
      }
    }
  };

  const handleMarkMissed = async (medication) => {
    try {
      await logAdherence(medication.id, 'missed');
      
      // Update local state immediately
      setTodaysMedications(prev => prev.map(med => 
        med.id === medication.id && med.scheduledTime === medication.scheduledTime
          ? { ...med, status: 'missed' }
          : med
      ));

      // Show notification
      if (window.showToast) {
        window.showToast(`${medication.name} marked as missed`, 'warning', 3000);
      }
    } catch (error) {
      console.error('Error marking medication as missed:', error);
      if (window.showToast) {
        window.showToast('Error logging medication. Please try again.', 'error', 5000);
      }
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'taken':
        return { icon: 'CheckCircle', color: 'text-accent-500' };
      case 'upcoming':
        return { icon: 'Clock', color: 'text-primary-500' };
      case 'pending':
        return { icon: 'AlertCircle', color: 'text-warning-500' };
      case 'missed':
        return { icon: 'XCircle', color: 'text-error-500' };
      default:
        return { icon: 'Circle', color: 'text-secondary-400' };
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'taken':
        return 'Taken';
      case 'upcoming':
        return 'Upcoming';
      case 'pending':
        return 'Due Now';
      case 'missed':
        return 'Missed';
      default:
        return 'Unknown';
    }
  };

  const sortedMedications = [...todaysMedications].sort((a, b) => {
    const statusOrder = { 'pending': 0, 'upcoming': 1, 'taken': 2, 'missed': 3 };
    return statusOrder[a.status] - statusOrder[b.status];
  });

  if (isLoading) {
    return (
      <div className="bg-surface rounded-lg border border-secondary-200 shadow-soft">
        <div className="p-6 border-b border-secondary-200">
          <div className="flex items-center space-x-3">
            <Icon name="Pill" size={24} color="var(--color-primary)" strokeWidth={2} />
            <h2 className="text-xl font-semibold text-text-primary">Today's Medications</h2>
          </div>
        </div>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="border rounded-lg p-4">
                <div className="flex items-start space-x-4">
                  <div className="w-4 h-4 bg-secondary-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-secondary-200 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-secondary-200 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-lg border border-secondary-200 shadow-soft">
      <div className="p-6 border-b border-secondary-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Icon name="Pill" size={24} color="var(--color-primary)" strokeWidth={2} />
            <h2 className="text-xl font-semibold text-text-primary">Today's Medications</h2>
          </div>
          <span className="text-sm text-text-secondary">
            {todaysMedications.filter(med => med.status === 'taken').length} of {todaysMedications.length} taken
          </span>
        </div>
      </div>

      <div className="p-6">
        {todaysMedications.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="Calendar" size={48} className="text-secondary-400 mx-auto mb-4" strokeWidth={1} />
            <h3 className="text-lg font-medium text-text-primary mb-2">No medications scheduled</h3>
            <p className="text-text-secondary">Add medications to track your daily schedule.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedMedications.map((medication) => {
              const statusConfig = getStatusIcon(medication.status);
              
              return (
                <div
                  key={`${medication.id}-${medication.scheduledTime}`}
                  className={`
                    border rounded-lg p-4 transition-smooth
                    ${medication.status === 'pending' ?'border-warning-300 bg-warning-50' 
                      : medication.status === 'missed' ?'border-error-300 bg-error-50' :'border-secondary-200 bg-surface hover:bg-secondary-50'
                    }
                  `}
                >
                  <div className="flex items-start space-x-4">
                    {/* Medication Color Indicator */}
                    <div className={`w-4 h-4 rounded-full ${medication.color || 'bg-primary-500'} flex-shrink-0 mt-1`}></div>
                    
                    {/* Medication Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-text-primary">{medication.name}</h3>
                          <p className="text-sm text-text-secondary">{medication.dosage} • {medication.category}</p>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <Icon name={statusConfig.icon} size={16} className={statusConfig.color} strokeWidth={2} />
                          <span className={`font-medium ${statusConfig.color}`}>
                            {getStatusText(medication.status)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-text-secondary">
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center space-x-1">
                              <Icon name="Clock" size={14} strokeWidth={2} />
                              <span>{medication.scheduledTime}</span>
                            </span>
                            {medication.takenAt && (
                              <span className="flex items-center space-x-1 text-accent-600">
                                <Icon name="Check" size={14} strokeWidth={2} />
                                <span>Taken at {medication.takenAt}</span>
                              </span>
                            )}
                          </div>
                          {medication.instructions && (
                            <p className="mt-1 text-xs">{medication.instructions}</p>
                          )}
                        </div>

                        {/* Action Buttons */}
                        {medication.status !== 'taken' && (
                          <div className="flex space-x-2">
                            {medication.status !== 'missed' && (
                              <button
                                onClick={() => handleMarkTaken(medication)}
                                className="bg-accent text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-emerald-700 transition-smooth focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2"
                              >
                                Mark Taken
                              </button>
                            )}
                            <button
                              onClick={() => handleMarkMissed(medication)}
                              className="bg-secondary-100 text-secondary-700 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-secondary-200 transition-smooth focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:ring-offset-2"
                            >
                              Mark Missed
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Add Medication Button */}
        <div className="mt-6 pt-4 border-t border-secondary-200">
          <button className="w-full bg-primary-50 border-2 border-dashed border-primary-300 rounded-lg p-4 text-primary-600 hover:bg-primary-100 hover:border-primary-400 transition-smooth focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
            <div className="flex items-center justify-center space-x-2">
              <Icon name="Plus" size={20} strokeWidth={2} />
              <span className="font-medium">Add New Medication</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodaysMedications;