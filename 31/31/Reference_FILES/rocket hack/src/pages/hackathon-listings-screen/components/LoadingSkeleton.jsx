import React from 'react';

const LoadingSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-background border border-border rounded-lg shadow-sm overflow-hidden animate-pulse">
          {/* Image Skeleton */}
          <div className="h-48 bg-surface"></div>
          
          {/* Content Skeleton */}
          <div className="p-6">
            {/* Title and Description */}
            <div className="mb-4">
              <div className="h-5 bg-surface rounded mb-2"></div>
              <div className="h-4 bg-surface rounded w-3/4"></div>
            </div>

            {/* Tags */}
            <div className="flex gap-2 mb-4">
              <div className="h-6 bg-surface rounded w-16"></div>
              <div className="h-6 bg-surface rounded w-20"></div>
              <div className="h-6 bg-surface rounded w-14"></div>
            </div>

            {/* Details */}
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-surface rounded w-full"></div>
              <div className="h-4 bg-surface rounded w-2/3"></div>
              <div className="h-4 bg-surface rounded w-1/2"></div>
              <div className="h-4 bg-surface rounded w-3/4"></div>
            </div>

            {/* Deadline */}
            <div className="h-4 bg-surface rounded w-4/5 mb-4"></div>

            {/* Button */}
            <div className="h-10 bg-surface rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;