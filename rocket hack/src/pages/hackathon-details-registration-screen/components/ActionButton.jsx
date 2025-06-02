import React from 'react';
import Icon from '../../../components/AppIcon';

const ActionButton = ({ isRegistered, isDeadlinePassed, isFull, onClick }) => {
  const getButtonConfig = () => {
    if (isRegistered) {
      return {
        text: 'Registered',
        icon: 'CheckCircle',
        className: 'bg-success text-white cursor-default',
        disabled: true
      };
    }

    if (isDeadlinePassed) {
      return {
        text: 'Registration Closed',
        icon: 'Lock',
        className: 'bg-text-tertiary text-white cursor-not-allowed',
        disabled: true
      };
    }

    if (isFull) {
      return {
        text: 'Event Full',
        icon: 'Users',
        className: 'bg-warning text-white cursor-not-allowed',
        disabled: true
      };
    }

    return {
      text: 'Register Now',
      icon: 'UserPlus',
      className: 'bg-primary text-white hover:bg-primary-hover',
      disabled: false
    };
  };

  const config = getButtonConfig();

  return (
    <button
      onClick={config.disabled ? undefined : onClick}
      disabled={config.disabled}
      className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${config.className}`}
    >
      <Icon name={config.icon} size={20} />
      <span>{config.text}</span>
    </button>
  );
};

export default ActionButton;