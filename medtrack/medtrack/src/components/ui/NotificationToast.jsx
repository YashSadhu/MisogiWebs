import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import notificationSystem from '../../utils/notificationSystem';
import { logMedicationAdherence } from '../../utils/medicationStorage';

const NotificationToast = ({ 
  message, 
  type = 'info', 
  duration = 5000, 
  onClose,
  isVisible = false,
  medication = null,
  scheduledTime = null
}) => {
  const [show, setShow] = useState(isVisible);

  useEffect(() => {
    setShow(isVisible);
  }, [isVisible]);

  useEffect(() => {
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, duration]);

  const handleClose = () => {
    setShow(false);
    setTimeout(() => {
      if (onClose) onClose();
    }, 300);
  };

  const handleMedicationAction = async (action) => {
    if (medication && medication.id) {
      try {
        if (action === 'taken') {
          logMedicationAdherence(medication.id, 'taken');
          // Show success notification
          setTimeout(() => {
            notificationSystem.triggerNotificationCallbacks({
              id: Date.now(),
              type: 'success',
              title: 'Medication Logged',
              message: `${medication.name} marked as taken`,
              timestamp: new Date()
            });
          }, 500);
        } else if (action === 'missed') {
          logMedicationAdherence(medication.id, 'missed');
        }
        
        handleClose();
      } catch (error) {
        console.error('Error logging medication:', error);
      }
    }
  };

  const getToastConfig = () => {
    switch (type) {
      case 'success':
        return {
          bgColor: 'bg-success-50',
          borderColor: 'border-success-500',
          textColor: 'text-success-700',
          icon: 'CheckCircle',
          iconColor: 'text-success-500'
        };
      case 'warning':
        return {
          bgColor: 'bg-warning-50',
          borderColor: 'border-warning-500',
          textColor: 'text-warning-700',
          icon: 'AlertTriangle',
          iconColor: 'text-warning-500'
        };
      case 'error':
        return {
          bgColor: 'bg-error-50',
          borderColor: 'border-error-500',
          textColor: 'text-error-700',
          icon: 'AlertCircle',
          iconColor: 'text-error-500'
        };
      case 'medication': case'reminder': case'followup':
        return {
          bgColor: 'bg-primary-50',
          borderColor: 'border-primary-500',
          textColor: 'text-primary-700',
          icon: 'Pill',
          iconColor: 'text-primary-500'
        };
      case 'missed':
        return {
          bgColor: 'bg-error-50',
          borderColor: 'border-error-500',
          textColor: 'text-error-700',
          icon: 'XCircle',
          iconColor: 'text-error-500'
        };
      default:
        return {
          bgColor: 'bg-secondary-50',
          borderColor: 'border-secondary-300',
          textColor: 'text-secondary-700',
          icon: 'Info',
          iconColor: 'text-secondary-500'
        };
    }
  };

  const config = getToastConfig();
  const showMedicationActions = ['medication', 'reminder', 'followup'].includes(type) && medication;

  if (!show) return null;

  return (
    <div className={`
      fixed top-20 right-4 md:top-24 md:right-6 z-1100 max-w-sm w-full
      transform transition-all duration-300 ease-smooth
      ${show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
    `}>
      <div className={`
        ${config.bgColor} ${config.borderColor} border-l-4 rounded-lg shadow-elevated p-4
      `}>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Icon 
              name={config.icon} 
              size={20} 
              className={config.iconColor}
              strokeWidth={2}
            />
          </div>
          
          <div className="ml-3 flex-1">
            <p className={`text-sm font-medium ${config.textColor} mb-2`}>
              {message}
            </p>
            
            {scheduledTime && (
              <p className={`text-xs ${config.textColor} opacity-75 mb-2`}>
                Scheduled for {scheduledTime}
              </p>
            )}
            
            {showMedicationActions && (
              <div className="flex space-x-2 mt-2">
                <button
                  onClick={() => handleMedicationAction('taken')}
                  className="bg-success text-white px-3 py-1 rounded text-xs font-medium hover:bg-emerald-700 transition-smooth focus:outline-none focus:ring-2 focus:ring-success focus:ring-offset-1"
                >
                  Mark Taken
                </button>
                <button
                  onClick={() => handleMedicationAction('missed')}
                  className="bg-secondary-100 text-secondary-700 px-3 py-1 rounded text-xs font-medium hover:bg-secondary-200 transition-smooth focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:ring-offset-1"
                >
                  Mark Missed
                </button>
              </div>
            )}
          </div>
          
          <div className="ml-4 flex-shrink-0">
            <button
              onClick={handleClose}
              className={`
                inline-flex rounded-md p-1.5 transition-smooth
                ${config.textColor} hover:bg-white hover:bg-opacity-20
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
              `}
              aria-label="Close notification"
            >
              <Icon name="X" size={16} strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const NotificationToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    // Listen for real-time notifications from the notification system
    const handleNotification = (notification) => {
      addToast(
        notification.message || notification.title,
        notification.type,
        notification.type === 'medication' ? 0 : 5000, // Keep medication notifications until user acts
        notification.medication,
        notification.scheduledTime
      );
    };

    notificationSystem.addNotificationCallback(handleNotification);

    return () => {
      notificationSystem.removeNotificationCallback(handleNotification);
    };
  }, []);

  const addToast = (message, type = 'info', duration = 5000, medication = null, scheduledTime = null) => {
    const id = Date.now();
    const newToast = { id, message, type, duration, medication, scheduledTime };
    
    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Expose methods for manual toast creation
  window.showToast = addToast;

  return (
    <div className="fixed top-0 right-0 z-1100 pointer-events-none">
      {toasts.map((toast, index) => (
        <div 
          key={toast.id}
          className="pointer-events-auto"
          style={{ 
            transform: `translateY(${index * 80}px)`,
            transition: 'transform 0.3s ease-smooth'
          }}
        >
          <NotificationToast
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            isVisible={true}
            medication={toast.medication}
            scheduledTime={toast.scheduledTime}
            onClose={() => removeToast(toast.id)}
          />
        </div>
      ))}
    </div>
  );
};

export { NotificationToast, NotificationToastContainer };
export default NotificationToast;