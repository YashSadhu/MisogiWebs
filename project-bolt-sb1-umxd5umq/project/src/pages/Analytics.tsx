import React, { useState, useEffect } from 'react';
import { BarChart, Calendar, Download, Award } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import AdherenceChart from '../components/analytics/AdherenceChart';
import CalendarHeatmap from '../components/analytics/CalendarHeatmap';
import MissedDosesTable from '../components/analytics/MissedDosesTable';
import { useMedication } from '../context/MedicationContext';
import { useLog } from '../context/LogContext';
import { generateAdherenceReport } from '../utils/reportUtils';
import { downloadCSV, generateCSVData } from '../utils/reportUtils';

const Analytics: React.FC = () => {
  const { medications, isLoading: medsLoading } = useMedication();
  const { logs, isLoading: logsLoading } = useLog();
  const [adherenceData, setAdherenceData] = useState<ReturnType<typeof generateAdherenceReport> | null>(null);
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('week');

  // Generate adherence data when medications or logs change
  useEffect(() => {
    if (medications.length > 0 && logs.length > 0) {
      const report = generateAdherenceReport(medications, logs);
      setAdherenceData(report);
    }
  }, [medications, logs]);

  const handleExportCSV = () => {
    const csvData = generateCSVData(medications, logs);
    downloadCSV(csvData, 'medtrack_logs.csv');
  };

  if (medsLoading || logsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // If no data, show empty state
  if (medications.length === 0 || logs.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Track your medication adherence over time</p>
        </div>
        
        <Card>
          <CardContent className="py-12 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <BarChart size={32} className="text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Data Available</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Start logging your medications to see analytics and adherence tracking
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Track your medication adherence over time</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex space-x-2">
          <div className="flex rounded-md overflow-hidden border border-gray-300">
            <button
              onClick={() => setTimeframe('week')}
              className={`px-4 py-2 text-sm ${
                timeframe === 'week'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setTimeframe('month')}
              className={`px-4 py-2 text-sm ${
                timeframe === 'month'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setTimeframe('year')}
              className={`px-4 py-2 text-sm ${
                timeframe === 'year'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Year
            </button>
          </div>
          
          <Button
            variant="outline"
            leftIcon={<Download size={16} />}
            onClick={handleExportCSV}
          >
            Export
          </Button>
        </div>
      </div>
      
      {/* Overall Stats */}
      {adherenceData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-white">
                <Award className="mr-2" size={20} />
                Overall Adherence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{adherenceData.overallAdherence}%</div>
              <p className="text-indigo-100">of all doses taken</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Calendar className="mr-2" size={20} />
                Total Tracked
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-gray-900">
                {adherenceData.medicationAdherence.reduce((sum, med) => sum + med.totalDoses, 0)}
              </div>
              <p className="text-gray-600">doses tracked</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <BarChart className="mr-2" size={20} />
                Needs Attention
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-gray-900">
                {adherenceData.mostMissedMedication ? (
                  <span className="text-amber-600">{adherenceData.mostMissedMedication}</span>
                ) : (
                  <span className="text-emerald-600">None</span>
                )}
              </div>
              <p className="text-gray-600">most frequently missed</p>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Adherence Chart */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Adherence Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <AdherenceChart logs={logs} timeframe={timeframe} />
          </CardContent>
        </Card>
      </div>
      
      {/* Calendar Heatmap */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Adherence Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <CalendarHeatmap logs={logs} />
          </CardContent>
        </Card>
      </div>
      
      {/* Most Missed Medications */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Most Missed Medications</CardTitle>
          </CardHeader>
          <CardContent>
            <MissedDosesTable medications={medications} logs={logs} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;