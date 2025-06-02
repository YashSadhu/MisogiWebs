import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Icon from 'components/AppIcon';

const WeeklyTrends = ({ selectedProfile }) => {
  const [chartType, setChartType] = useState('line');
  const [timeRange, setTimeRange] = useState('week');

  // Mock weekly adherence data
  const weeklyData = [
    { day: 'Mon', adherence: 100, doses: 4, taken: 4, missed: 0 },
    { day: 'Tue', adherence: 75, doses: 4, taken: 3, missed: 1 },
    { day: 'Wed', adherence: 100, doses: 4, taken: 4, missed: 0 },
    { day: 'Thu', adherence: 50, doses: 4, taken: 2, missed: 2 },
    { day: 'Fri', adherence: 100, doses: 4, taken: 4, missed: 0 },
    { day: 'Sat', adherence: 100, doses: 4, taken: 4, missed: 0 },
    { day: 'Sun', adherence: 75, doses: 4, taken: 3, missed: 1 }
  ];

  // Mock monthly data
  const monthlyData = [
    { week: 'Week 1', adherence: 85, doses: 28, taken: 24, missed: 4 },
    { week: 'Week 2', adherence: 92, doses: 28, taken: 26, missed: 2 },
    { week: 'Week 3', adherence: 78, doses: 28, taken: 22, missed: 6 },
    { week: 'Week 4', adherence: 89, doses: 28, taken: 25, missed: 3 }
  ];

  const currentData = timeRange === 'week' ? weeklyData : monthlyData;
  const xAxisKey = timeRange === 'week' ? 'day' : 'week';

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-surface border border-secondary-200 rounded-lg shadow-elevated p-3">
          <p className="font-medium text-text-primary mb-2">{label}</p>
          <div className="space-y-1 text-sm">
            <div className="flex items-center justify-between space-x-4">
              <span className="text-text-secondary">Adherence:</span>
              <span className={`font-medium ${
                data.adherence >= 90 ? 'text-accent-600' : 
                data.adherence >= 75 ? 'text-warning-600' : 'text-error-600'
              }`}>
                {data.adherence}%
              </span>
            </div>
            <div className="flex items-center justify-between space-x-4">
              <span className="text-text-secondary">Taken:</span>
              <span className="font-medium text-accent-600">{data.taken}</span>
            </div>
            <div className="flex items-center justify-between space-x-4">
              <span className="text-text-secondary">Missed:</span>
              <span className="font-medium text-error-600">{data.missed}</span>
            </div>
            <div className="flex items-center justify-between space-x-4">
              <span className="text-text-secondary">Total:</span>
              <span className="font-medium text-text-primary">{data.doses}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const averageAdherence = currentData.reduce((sum, item) => sum + item.adherence, 0) / currentData.length;

  return (
    <div className="bg-surface rounded-lg border border-secondary-200 shadow-soft">
      <div className="p-6 border-b border-secondary-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Icon name="TrendingUp" size={20} color="var(--color-primary)" strokeWidth={2} />
            <h2 className="text-lg font-semibold text-text-primary">Adherence Trends</h2>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Time Range Toggle */}
            <div className="bg-secondary-100 rounded-lg p-1">
              <button
                onClick={() => setTimeRange('week')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-smooth ${
                  timeRange === 'week' ?'bg-surface text-primary shadow-soft' :'text-secondary-600 hover:text-primary'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setTimeRange('month')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-smooth ${
                  timeRange === 'month' ?'bg-surface text-primary shadow-soft' :'text-secondary-600 hover:text-primary'
                }`}
              >
                Month
              </button>
            </div>

            {/* Chart Type Toggle */}
            <div className="bg-secondary-100 rounded-lg p-1">
              <button
                onClick={() => setChartType('line')}
                className={`p-1 rounded-md transition-smooth ${
                  chartType === 'line' ?'bg-surface text-primary shadow-soft' :'text-secondary-600 hover:text-primary'
                }`}
                title="Line Chart"
              >
                <Icon name="TrendingUp" size={16} strokeWidth={2} />
              </button>
              <button
                onClick={() => setChartType('bar')}
                className={`p-1 rounded-md transition-smooth ${
                  chartType === 'bar' ?'bg-surface text-primary shadow-soft' :'text-secondary-600 hover:text-primary'
                }`}
                title="Bar Chart"
              >
                <Icon name="BarChart3" size={16} strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-text-primary">{Math.round(averageAdherence)}%</p>
            <p className="text-xs text-text-secondary">Average Adherence</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-accent-600">
              {currentData.reduce((sum, item) => sum + item.taken, 0)}
            </p>
            <p className="text-xs text-text-secondary">Doses Taken</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-error-600">
              {currentData.reduce((sum, item) => sum + item.missed, 0)}
            </p>
            <p className="text-xs text-text-secondary">Doses Missed</p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-6">
        <div className="h-64" aria-label={`${timeRange} adherence ${chartType} chart`}>
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'line' ? (
              <LineChart data={currentData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis 
                  dataKey={xAxisKey} 
                  stroke="#64748B"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#64748B"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="adherence" 
                  stroke="var(--color-primary)" 
                  strokeWidth={3}
                  dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: 'var(--color-primary)', strokeWidth: 2 }}
                />
              </LineChart>
            ) : (
              <BarChart data={currentData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis 
                  dataKey={xAxisKey} 
                  stroke="#64748B"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#64748B"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="adherence" 
                  fill="var(--color-primary)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Performance Indicator */}
        <div className="mt-4 pt-4 border-t border-secondary-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon 
                name={averageAdherence >= 90 ? "TrendingUp" : averageAdherence >= 75 ? "Minus" : "TrendingDown"} 
                size={16} 
                className={
                  averageAdherence >= 90 ? "text-accent-500" : 
                  averageAdherence >= 75 ? "text-warning-500" : "text-error-500"
                }
                strokeWidth={2} 
              />
              <span className="text-sm font-medium text-text-primary">
                {averageAdherence >= 90 ? "Excellent Performance" : 
                 averageAdherence >= 75 ? "Good Performance" : "Needs Improvement"}
              </span>
            </div>
            <span className="text-xs text-text-secondary">
              {timeRange === 'week' ? 'This Week' : 'This Month'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyTrends;