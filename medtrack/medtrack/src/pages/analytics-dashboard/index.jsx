import React, { useState, useMemo } from 'react';
import Icon from 'components/AppIcon';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { format, subDays } from 'date-fns';
import { useMedicationData } from '../../hooks/useMedicationData';

// Components
import DateRangeSelector from './components/DateRangeSelector';
import MetricsCard from './components/MetricsCard';
import AdherenceChart from './components/AdherenceChart';
import CalendarHeatmap from './components/CalendarHeatmap';
import MissedMedicationsAnalysis from './components/MissedMedicationsAnalysis';
import ExportControls from './components/ExportControls';

const AnalyticsDashboard = () => {
  const {
    stats,
    getAdherenceData,
    getMostMissed,
    getAdherenceByTimeOfDay,
    getMedicationCategories,
    isLoading
  } = useMedicationData();
  
  const [selectedDateRange, setSelectedDateRange] = useState('7days');
  const [selectedMedications, setSelectedMedications] = useState('all');
  const [isExporting, setIsExporting] = useState(false);

  // Calculate date range based on selection
  const dateRange = useMemo(() => {
    const today = new Date();
    let startDate;
    
    switch (selectedDateRange) {
      case '7days':
        startDate = subDays(today, 6);
        break;
      case '30days':
        startDate = subDays(today, 29);
        break;
      case '90days':
        startDate = subDays(today, 89);
        break;
      default:
        startDate = subDays(today, 6);
    }
    
    return { startDate, endDate: today };
  }, [selectedDateRange]);

  // Get real adherence data
  const adherenceData = useMemo(() => {
    return getAdherenceData(dateRange.startDate, dateRange.endDate);
  }, [getAdherenceData, dateRange]);

  // Get real weekly adherence data
  const weeklyAdherenceData = useMemo(() => {
    if (adherenceData.length === 0) return [];
    
    const weeks = [];
    const weeksCount = Math.ceil(adherenceData.length / 7);
    
    for (let i = 0; i < weeksCount; i++) {
      const weekStart = i * 7;
      const weekEnd = Math.min((i + 1) * 7, adherenceData.length);
      const weekData = adherenceData.slice(weekStart, weekEnd);
      
      const avgAdherence = weekData.length > 0 
        ? Math.round(weekData.reduce((sum, day) => sum + day.adherence, 0) / weekData.length)
        : 0;
      
      weeks.push({
        week: `Week ${i + 1}`,
        adherence: avgAdherence,
        target: 95
      });
    }
    
    return weeks;
  }, [adherenceData]);

  // Get real missed medications data
  const missedMedicationsData = useMemo(() => {
    return getMostMissed();
  }, [getMostMissed]);

  // Get real adherence by time of day
  const adherenceByTimeData = useMemo(() => {
    return getAdherenceByTimeOfDay();
  }, [getAdherenceByTimeOfDay]);

  // Get real medication categories
  const medicationCategoriesData = useMemo(() => {
    const categories = getMedicationCategories();
    const colors = ['#2563EB', '#059669', '#F59E0B', '#8B5CF6', '#EF4444', '#06B6D4'];
    
    return categories.map((category, index) => ({
      ...category,
      color: colors[index % colors.length]
    }));
  }, [getMedicationCategories]);

  // Mock medication categories for filter
  const medicationCategories = [
    { value: 'all', label: 'All Medications' },
    { value: 'diabetes', label: 'Diabetes' },
    { value: 'blood-pressure', label: 'Blood Pressure' },
    { value: 'cholesterol', label: 'Cholesterol' },
    { value: 'vitamins', label: 'Vitamins' }
  ];

  // Calculate improvement trend
  const improvementTrend = useMemo(() => {
    if (adherenceData.length < 7) return 0;
    
    const recentWeek = adherenceData.slice(-7);
    const previousWeek = adherenceData.slice(-14, -7);
    
    if (previousWeek.length === 0) return 0;
    
    const recentAvg = recentWeek.reduce((sum, day) => sum + day.adherence, 0) / recentWeek.length;
    const previousAvg = previousWeek.reduce((sum, day) => sum + day.adherence, 0) / previousWeek.length;
    
    return Math.round((recentAvg - previousAvg) * 10) / 10;
  }, [adherenceData]);

  // Get today's summary from real data
  const todaySummary = useMemo(() => {
    if (adherenceData.length === 0) return { taken: 0, total: 0, missed: 0, adherence: 0 };
    
    const today = adherenceData[adherenceData.length - 1];
    return {
      taken: today.takenDoses || 0,
      total: today.totalDoses || 0,
      missed: today.missedDoses || 0,
      adherence: today.adherence || 0
    };
  }, [adherenceData]);

  const handleDateRangeChange = (range) => {
    setSelectedDateRange(range);
  };

  const handleMedicationFilter = (medications) => {
    setSelectedMedications(medications);
  };

  const handleExport = async (type) => {
    setIsExporting(true);
    
    try {
      if (type === 'pdf') {
        // Generate PDF report with real data
        console.log('Exporting PDF report with real data...');
      } else if (type === 'csv') {
        // Export CSV with real adherence data
        const csvContent = generateCSVContent();
        downloadCSV(csvContent, `medication-adherence-${format(new Date(), 'yyyy-MM-dd')}.csv`);
      }
    } catch (error) {
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const generateCSVContent = () => {
    const headers = ['Date', 'Adherence Rate (%)', 'Total Doses', 'Taken Doses', 'Missed Doses'];
    const rows = adherenceData.map(day => [
      day.date,
      day.adherence,
      day.totalDoses,
      day.takenDoses,
      day.missedDoses
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const downloadCSV = (content, filename) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="animate-pulse">
            <div className="h-8 bg-secondary-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-secondary-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-surface rounded-lg border border-secondary-200 p-6">
                  <div className="h-4 bg-secondary-200 rounded w-2/3 mb-2"></div>
                  <div className="h-6 bg-secondary-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
                Analytics Dashboard
              </h1>
              <p className="text-text-secondary">
                Real-time medication adherence insights and trends
              </p>
            </div>
            
            <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-3">
              <ExportControls 
                onExport={handleExport}
                isExporting={isExporting}
              />
            </div>
          </div>

          {/* Filters Section */}
          <div className="bg-surface rounded-lg border border-secondary-200 p-4 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <DateRangeSelector
                selectedRange={selectedDateRange}
                onRangeChange={handleDateRangeChange}
              />
              
              <div className="flex flex-col sm:flex-row gap-3">
                <select
                  value={selectedMedications}
                  onChange={(e) => handleMedicationFilter(e.target.value)}
                  className="px-3 py-2 border border-secondary-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {medicationCategories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
                
                <button className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-primary bg-primary-50 border border-primary-200 rounded-lg hover:bg-primary-100 transition-smooth">
                  <Icon name="Filter" size={16} />
                  <span>Advanced Filters</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics Cards - Using Real Data */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricsCard
            title="Overall Adherence"
            value={`${stats.overallAdherence}%`}
            change={improvementTrend}
            changeType={improvementTrend >= 0 ? "positive" : "negative"}
            icon="TrendingUp"
            color="primary"
          />
          <MetricsCard
            title="Current Streak"
            value={`${stats.currentStreak} days`}
            subtitle="Consecutive days ≥80%"
            icon="Calendar"
            color="success"
          />
          <MetricsCard
            title="Total Taken"
            value={`${stats.totalTaken}`}
            subtitle="All time"
            icon="CheckCircle"
            color="accent"
          />
          <MetricsCard
            title="Total Missed"
            value={`${stats.totalMissed}`}
            subtitle="All time"
            icon="XCircle"
            color="error"
          />
        </div>

        {/* Main Analytics Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          {/* Weekly Adherence Chart */}
          <div className="xl:col-span-2">
            <AdherenceChart
              data={weeklyAdherenceData}
              title="Weekly Adherence Trends"
              type="weekly"
            />
          </div>

          {/* Daily Adherence Summary - Real Data */}
          <div className="bg-surface rounded-lg border border-secondary-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text-primary">Today's Summary</h3>
              <Icon name="Calendar" size={20} className="text-primary" />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-primary-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-success rounded-full"></div>
                  <span className="text-sm font-medium text-text-primary">Doses Taken</span>
                </div>
                <span className="text-lg font-bold text-success">{todaySummary.taken}/{todaySummary.total}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-warning-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-warning-500 rounded-full"></div>
                  <span className="text-sm font-medium text-text-primary">Missed Doses</span>
                </div>
                <span className="text-lg font-bold text-warning-500">{todaySummary.missed}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-secondary-500 rounded-full"></div>
                  <span className="text-sm font-medium text-text-primary">Adherence Rate</span>
                </div>
                <span className="text-lg font-bold text-text-primary">{todaySummary.adherence}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Heatmap - Real Data */}
        <div className="mb-8">
          <CalendarHeatmap
            data={adherenceData}
            title="Daily Adherence Calendar"
          />
        </div>

        {/* Missed Medications Analysis - Real Data */}
        {missedMedicationsData.length > 0 && (
          <div className="mb-8">
            <MissedMedicationsAnalysis
              data={missedMedicationsData}
              title="Most Commonly Missed Medications"
            />
          </div>
        )}

        {/* Additional Charts Row - Real Data */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Adherence by Time of Day - Real Data */}
          <div className="bg-surface rounded-lg border border-secondary-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-text-primary">Adherence by Time of Day</h3>
              <Icon name="Clock" size={20} className="text-primary" />
            </div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={adherenceByTimeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis 
                    dataKey="time" 
                    tick={{ fontSize: 12, fill: '#64748B' }}
                    axisLine={{ stroke: '#E2E8F0' }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#64748B' }}
                    axisLine={{ stroke: '#E2E8F0' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                    }}
                  />
                  <Bar dataKey="adherence" fill="#2563EB" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Medication Categories Distribution - Real Data */}
          <div className="bg-surface rounded-lg border border-secondary-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-text-primary">Medication Categories</h3>
              <Icon name="PieChart" size={20} className="text-primary" />
            </div>
            
            {medicationCategoriesData.length > 0 ? (
              <>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={medicationCategoriesData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        dataKey="value"
                      >
                        {medicationCategoriesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #E2E8F0',
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mt-4">
                  {medicationCategoriesData.map((category) => (
                    <div key={category.name} className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <span className="text-sm text-text-secondary">{category.name}</span>
                      <span className="text-sm font-medium text-text-primary">{category.value}%</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-64 flex items-center justify-center">
                <div className="text-center">
                  <Icon name="PieChart" size={48} className="text-secondary-400 mx-auto mb-4" strokeWidth={1} />
                  <p className="text-text-secondary">No medication data available</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;