import React from 'react';
import Icon from '../AppIcon';

const LoadingSpinner = ({ size = 'medium', color = 'primary' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8',
    xlarge: 'w-12 h-12'
  };

  const colorClasses = {
    primary: 'text-primary',
    secondary: 'text-secondary-500',
    white: 'text-white'
  };

  return (
    <div className={`${sizeClasses[size]} ${colorClasses[color]} animate-spin`}>
      <Icon name="Loader2" size="100%" strokeWidth={2} />
    </div>
  );
};

const LoadingOverlay = ({ 
  isLoading = false, 
  message = 'Loading...', 
  type = 'overlay',
  size = 'medium',
  className = ''
}) => {
  if (!isLoading) return null;

  // Inline loading indicator
  if (type === 'inline') {
    return (
      <div className={`flex items-center justify-center space-x-3 py-8 ${className}`}>
        <LoadingSpinner size={size} />
        <span className="text-sm font-medium text-text-secondary">{message}</span>
      </div>
    );
  }

  // Button loading state
  if (type === 'button') {
    return (
      <div className="flex items-center justify-center space-x-2">
        <LoadingSpinner size="small" color="white" />
        <span>{message}</span>
      </div>
    );
  }

  // Component overlay
  if (type === 'component') {
    return (
      <div className={`absolute inset-0 bg-surface bg-opacity-80 flex items-center justify-center z-10 rounded-lg ${className}`}>
        <div className="flex flex-col items-center space-y-3">
          <LoadingSpinner size={size} />
          <span className="text-sm font-medium text-text-secondary">{message}</span>
        </div>
      </div>
    );
  }

  // Full overlay (default)
  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-1200 ${className}`}>
      <div className="bg-surface rounded-xl p-8 shadow-elevated max-w-sm w-full mx-4">
        <div className="flex flex-col items-center space-y-4">
          <LoadingSpinner size="xlarge" />
          <div className="text-center">
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              {type === 'pdf' ? 'Generating Report' : 'Processing'}
            </h3>
            <p className="text-sm text-text-secondary">{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Specialized loading components for different contexts
const MedicationLoadingCard = () => (
  <div className="bg-surface rounded-lg border border-secondary-200 p-4 animate-pulse">
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 bg-secondary-200 rounded-lg"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-secondary-200 rounded w-3/4"></div>
        <div className="h-3 bg-secondary-200 rounded w-1/2"></div>
      </div>
    </div>
  </div>
);

const AnalyticsLoadingChart = () => (
  <div className="bg-surface rounded-lg border border-secondary-200 p-6 animate-pulse">
    <div className="space-y-4">
      <div className="h-6 bg-secondary-200 rounded w-1/3"></div>
      <div className="space-y-3">
        <div className="h-32 bg-secondary-200 rounded"></div>
        <div className="flex space-x-4">
          <div className="h-4 bg-secondary-200 rounded flex-1"></div>
          <div className="h-4 bg-secondary-200 rounded flex-1"></div>
          <div className="h-4 bg-secondary-200 rounded flex-1"></div>
        </div>
      </div>
    </div>
  </div>
);

const CalendarLoadingGrid = () => (
  <div className="bg-surface rounded-lg border border-secondary-200 p-4 animate-pulse">
    <div className="space-y-4">
      <div className="h-6 bg-secondary-200 rounded w-1/4"></div>
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 35 }).map((_, index) => (
          <div key={index} className="h-8 bg-secondary-200 rounded"></div>
        ))}
      </div>
    </div>
  </div>
);

// Context-specific loading states
const DashboardLoading = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <MedicationLoadingCard key={index} />
      ))}
    </div>
    <AnalyticsLoadingChart />
  </div>
);

const AnalyticsLoading = () => (
  <div className="space-y-6">
    {Array.from({ length: 2 }).map((_, index) => (
      <AnalyticsLoadingChart key={index} />
    ))}
  </div>
);

const CalendarLoading = () => (
  <div className="space-y-6">
    <CalendarLoadingGrid />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <MedicationLoadingCard />
      <MedicationLoadingCard />
    </div>
  </div>
);

export {
  LoadingOverlay,
  LoadingSpinner,
  MedicationLoadingCard,
  AnalyticsLoadingChart,
  CalendarLoadingGrid,
  DashboardLoading,
  AnalyticsLoading,
  CalendarLoading
};

export default LoadingOverlay;