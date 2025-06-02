import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/AppIcon';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="text-center p-8 max-w-md">
        <div className="flex justify-center items-center mb-6">
          <div className="w-24 h-24 bg-primary bg-opacity-10 rounded-full flex items-center justify-center">
            <Icon name="AlertTriangle" size={48} className="text-primary" />
          </div>
        </div>
        <div className="flex flex-col gap-2 text-center mb-6">
          <h1 className="text-4xl font-bold text-text-primary">404</h1>
          <h2 className="text-xl font-medium text-text-primary">Page Not Found</h2>
          <p className="text-text-secondary text-base">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        <div className="flex justify-center items-center">
          <Link
            to="/hackathon-listings-screen"
            className="bg-primary hover:bg-primary-hover text-white font-medium py-3 px-6 rounded-lg flex items-center gap-2 transition-colors duration-200 shadow-sm"
          >
            <Icon name="Home" size={18} color="#fff" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;