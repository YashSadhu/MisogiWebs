import React from 'react';
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SkillMatchIndicatorProps {
  percentage: number;
}

const SkillMatchIndicator = ({ percentage }: SkillMatchIndicatorProps) => {
  const getMatchColor = (percent: number) => {
    if (percent >= 80) return 'text-green-600';
    if (percent >= 60) return 'text-amber-500';
    return 'text-red-500';
  };

  const getMatchBgColor = (percent: number) => {
    if (percent >= 80) return 'bg-green-600';
    if (percent >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getMatchLabel = (percent: number) => {
    if (percent >= 80) return 'Excellent Match';
    if (percent >= 60) return 'Good Match';
    return 'Partial Match';
  };

  const getMatchIcon = (percent: number) => {
    if (percent >= 80) return <CheckCircle className={cn('h-4 w-4', getMatchColor(percent))} />;
    if (percent >= 60) return <AlertCircle className={cn('h-4 w-4', getMatchColor(percent))} />;
    return <XCircle className={cn('h-4 w-4', getMatchColor(percent))} />;
  };

  return (
    <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getMatchIcon(percentage)}
          <span className="text-sm font-medium text-gray-700">
            Skill Match: {getMatchLabel(percentage)}
          </span>
        </div>
        <span className={cn('text-sm font-semibold', getMatchColor(percentage))}>
          {percentage}%
        </span>
      </div>
      
      {/* Progress Bar */}
      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
        <div 
          className={cn('h-2 rounded-full transition-all duration-300', getMatchBgColor(percentage), 'bg-opacity-20')}
          style={{ width: `${percentage}%` }}
        >
          <div 
            className={cn('h-full rounded-full', getMatchBgColor(percentage))}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          ></div>
        </div>
      </div>
      
      <p className="text-xs text-gray-500 mt-1">
        Based on your profile skills and experience
      </p>
    </div>
  );
};

export default SkillMatchIndicator;