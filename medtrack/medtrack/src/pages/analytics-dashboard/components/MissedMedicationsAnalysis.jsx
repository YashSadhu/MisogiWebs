import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const MissedMedicationsAnalysis = ({ data, title }) => {
  const [sortBy, setSortBy] = useState('missedPercentage');
  const [sortOrder, setSortOrder] = useState('desc');

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'improving':
        return { icon: 'TrendingDown', color: 'text-success', bg: 'bg-success-50' };
      case 'worsening':
        return { icon: 'TrendingUp', color: 'text-error', bg: 'bg-error-50' };
      default:
        return { icon: 'Minus', color: 'text-text-secondary', bg: 'bg-secondary-50' };
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Diabetes': 'bg-blue-100 text-blue-800',
      'Blood Pressure': 'bg-green-100 text-green-800',
      'Cholesterol': 'bg-yellow-100 text-yellow-800',
      'Vitamins': 'bg-purple-100 text-purple-800',
      'Heart': 'bg-red-100 text-red-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const sortedData = [...data].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    }
    return aValue < bValue ? 1 : -1;
  });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="bg-surface rounded-lg border border-secondary-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-warning-50 rounded-lg flex items-center justify-center">
            <Icon name="AlertTriangle" size={20} className="text-warning-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
            <p className="text-sm text-text-secondary">Identify patterns in missed medications</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm border border-secondary-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="missedPercentage">Sort by Miss Rate</option>
            <option value="missedCount">Sort by Miss Count</option>
            <option value="name">Sort by Name</option>
          </select>
          
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="p-2 text-text-secondary hover:text-primary hover:bg-primary-50 rounded-lg transition-smooth"
          >
            <Icon name={sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown'} size={16} />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {sortedData.map((medication, index) => {
          const trend = getTrendIcon(medication.trend);
          
          return (
            <div
              key={medication.id}
              className="bg-secondary-50 rounded-lg p-4 hover:bg-secondary-100 transition-smooth"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-primary-100 rounded-full text-sm font-bold text-primary">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary">{medication.name}</h4>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(medication.category)}`}>
                      {medication.category}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full ${trend.bg}`}>
                    <Icon name={trend.icon} size={14} className={trend.color} />
                    <span className={`text-xs font-medium ${trend.color}`}>
                      {medication.trend}
                    </span>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg font-bold text-error">
                      {medication.missedPercentage.toFixed(1)}%
                    </div>
                    <div className="text-xs text-text-secondary">
                      {medication.missedCount}/{medication.totalDoses} missed
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs text-text-secondary mb-1">
                  <span>Adherence Rate</span>
                  <span>{(100 - medication.missedPercentage).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-secondary-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${100 - medication.missedPercentage}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Common missed times */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Icon name="Clock" size={14} className="text-text-secondary" />
                  <span className="text-sm text-text-secondary">Most missed:</span>
                  <div className="flex space-x-1">
                    {medication.commonMissedTimes.map((time, timeIndex) => (
                      <span
                        key={timeIndex}
                        className="px-2 py-1 bg-warning-100 text-warning-800 rounded text-xs font-medium"
                      >
                        {time}
                      </span>
                    ))}
                  </div>
                </div>
                
                <button className="text-primary hover:text-primary-700 text-sm font-medium transition-smooth">
                  View Details
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Statistics */}
      <div className="mt-6 pt-6 border-t border-secondary-200">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-text-primary">
              {(data.reduce((sum, med) => sum + med.missedPercentage, 0) / data.length).toFixed(1)}%
            </div>
            <div className="text-sm text-text-secondary">Average Miss Rate</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-text-primary">
              {data.reduce((sum, med) => sum + med.missedCount, 0)}
            </div>
            <div className="text-sm text-text-secondary">Total Missed Doses</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-text-primary">
              {data.filter(med => med.trend === 'improving').length}
            </div>
            <div className="text-sm text-text-secondary">Improving Medications</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissedMedicationsAnalysis;