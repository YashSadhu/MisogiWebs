import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/dashboard-home');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-primary-50 rounded-full flex items-center justify-center">
            <Icon name="AlertTriangle" size={48} color="var(--color-primary)" strokeWidth={1.5} />
          </div>
          <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-text-primary mb-4">Page Not Found</h2>
          <p className="text-text-secondary mb-8">
            The page you're looking for doesn't exist or has been moved. Let's get you back to managing your medications.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleGoHome}
            className="w-full bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-smooth focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <Icon name="Home" size={20} className="inline mr-2" />
            Go to Dashboard
          </button>
          
          <button
            onClick={() => navigate(-1)}
            className="w-full bg-secondary-100 text-secondary-700 px-6 py-3 rounded-lg font-medium hover:bg-secondary-200 transition-smooth focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:ring-offset-2"
          >
            <Icon name="ArrowLeft" size={20} className="inline mr-2" />
            Go Back
          </button>
        </div>

        <div className="mt-12 pt-8 border-t border-secondary-200">
          <p className="text-sm text-text-secondary">
            Need help? Contact support or check our help documentation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;