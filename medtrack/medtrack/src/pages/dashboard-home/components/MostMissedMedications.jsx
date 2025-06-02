import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const MostMissedMedications = ({ selectedProfile }) => {
  const [timeRange, setTimeRange] = useState('month');

  // Mock data for most missed medications
  const missedMedicationsData = {
    week: [
      {
        id: 1,
        name: "Vitamin D3",
        category: "Supplement",
        missedCount: 3,
        totalDoses: 7,
        missedPercentage: 43,
        reasons: ["Forgot", "Away from home", "Forgot"],
        color: "bg-secondary-500",
        recommendations: [
          "Set a daily alarm for 9:00 AM",
          "Keep a backup bottle in your car",
          "Use the medication reminder app"
        ]
      },
      {
        id: 2,
        name: "Atorvastatin",
        category: "Cholesterol",
        missedCount: 2,
        totalDoses: 7,
        missedPercentage: 29,
        reasons: ["Forgot", "Fell asleep early"],
        color: "bg-warning-500",
        recommendations: [
          "Move dose time to earlier in evening",
          "Set bedtime routine reminder",
          "Keep medication by bedside"
        ]
      },
      {
        id: 3,
        name: "Metformin",
        category: "Diabetes",
        missedCount: 1,
        totalDoses: 14,
        missedPercentage: 7,
        reasons: ["Forgot lunch dose"],
        color: "bg-primary-500",
        recommendations: [
          "Set lunch alarm on phone",
          "Keep medication in work bag",
          "Ask colleague to remind you"
        ]
      }
    ],
    month: [
      {
        id: 1,
        name: "Vitamin D3",
        category: "Supplement",
        missedCount: 12,
        totalDoses: 30,
        missedPercentage: 40,
        reasons: ["Forgot", "Away from home", "Ran out"],
        color: "bg-secondary-500",
        recommendations: [
          "Set up automatic refill reminders",
          "Use a pill organizer",
          "Set multiple daily alarms"
        ]
      },
      {
        id: 2,
        name: "Atorvastatin",
        category: "Cholesterol",
        missedCount: 8,
        totalDoses: 30,
        missedPercentage: 27,
        reasons: ["Forgot", "Fell asleep early", "Side effects"],
        color: "bg-warning-500",
        recommendations: [
          "Discuss side effects with doctor",
          "Move to morning dose",
          "Use medication tracking app"
        ]
      },
      {
        id: 3,
        name: "Lisinopril",
        category: "Blood Pressure",
        missedCount: 5,
        totalDoses: 30,
        missedPercentage: 17,
        reasons: ["Forgot", "Traveled", "Pharmacy delay"],
        color: "bg-accent-500",
        recommendations: [
          "Set up travel medication kit",
          "Order refills 1 week early",
          "Use pharmacy auto-refill service"
        ]
      }
    ]
  };

  const [selectedMedication, setSelectedMedication] = useState(null);
  const currentData = missedMedicationsData[timeRange];

  const getMissedSeverity = (percentage) => {
    if (percentage >= 30) return { level: 'high', color: 'text-error-600', bg: 'bg-error-50' };
    if (percentage >= 15) return { level: 'medium', color: 'text-warning-600', bg: 'bg-warning-50' };
    return { level: 'low', color: 'text-accent-600', bg: 'bg-accent-50' };
  };

  const getSeverityIcon = (level) => {
    switch (level) {
      case 'high': return 'AlertTriangle';
      case 'medium': return 'AlertCircle';
      default: return 'Info';
    }
  };

  return (
    <div className="bg-surface rounded-lg border border-secondary-200 shadow-soft">
      <div className="p-6 border-b border-secondary-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Icon name="AlertTriangle" size={20} color="var(--color-warning-500)" strokeWidth={2} />
            <h2 className="text-lg font-semibold text-text-primary">Most Missed Medications</h2>
          </div>
          
          <div className="bg-secondary-100 rounded-lg p-1">
            <button
              onClick={() => setTimeRange('week')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-smooth ${
                timeRange === 'week' ?'bg-surface text-primary shadow-soft' :'text-secondary-600 hover:text-primary'
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setTimeRange('month')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-smooth ${
                timeRange === 'month' ?'bg-surface text-primary shadow-soft' :'text-secondary-600 hover:text-primary'
              }`}
            >
              This Month
            </button>
          </div>
        </div>

        {currentData.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="CheckCircle" size={48} color="var(--color-accent-500)" strokeWidth={1.5} className="mx-auto mb-4" />
            <h3 className="text-lg font-medium text-text-primary mb-2">Great Job!</h3>
            <p className="text-text-secondary">No missed medications this {timeRange}. Keep up the excellent work!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {currentData.map((medication, index) => {
              const severity = getMissedSeverity(medication.missedPercentage);
              
              return (
                <div
                  key={medication.id}
                  className={`border rounded-lg p-4 transition-smooth hover:shadow-soft cursor-pointer ${severity.bg} border-opacity-50`}
                  onClick={() => setSelectedMedication(selectedMedication === medication.id ? null : medication.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      {/* Rank Badge */}
                      <div className="flex-shrink-0 w-8 h-8 bg-secondary-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-secondary-700">#{index + 1}</span>
                      </div>

                      {/* Medication Color Indicator */}
                      <div className={`w-4 h-4 rounded-full ${medication.color} flex-shrink-0 mt-1`}></div>
                      
                      {/* Medication Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-text-primary">{medication.name}</h3>
                            <p className="text-sm text-text-secondary">{medication.category}</p>
                          </div>
                          
                          <div className="text-right">
                            <div className={`flex items-center space-x-1 ${severity.color}`}>
                              <Icon name={getSeverityIcon(severity.level)} size={16} strokeWidth={2} />
                              <span className="font-bold text-lg">{medication.missedPercentage}%</span>
                            </div>
                            <p className="text-xs text-text-secondary">
                              {medication.missedCount} of {medication.totalDoses} missed
                            </p>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-secondary-200 rounded-full h-2 mb-2">
                          <div 
                            className={`h-2 rounded-full ${
                              severity.level === 'high' ? 'bg-error-500' :
                              severity.level === 'medium' ? 'bg-warning-500' : 'bg-accent-500'
                            }`}
                            style={{ width: `${medication.missedPercentage}%` }}
                          ></div>
                        </div>

                        {/* Common Reasons */}
                        <div className="flex flex-wrap gap-1">
                          {medication.reasons.slice(0, 3).map((reason, idx) => (
                            <span 
                              key={idx}
                              className="inline-block bg-secondary-100 text-secondary-700 text-xs px-2 py-1 rounded-full"
                            >
                              {reason}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <Icon 
                      name={selectedMedication === medication.id ? "ChevronUp" : "ChevronDown"} 
                      size={16} 
                      className="text-secondary-400 ml-2 flex-shrink-0"
                      strokeWidth={2} 
                    />
                  </div>

                  {/* Expanded Recommendations */}
                  {selectedMedication === medication.id && (
                    <div className="mt-4 pt-4 border-t border-secondary-200">
                      <h4 className="text-sm font-semibold text-text-primary mb-3">
                        <Icon name="Lightbulb" size={16} className="inline mr-2" strokeWidth={2} />
                        Personalized Recommendations
                      </h4>
                      <div className="space-y-2">
                        {medication.recommendations.map((recommendation, idx) => (
                          <div key={idx} className="flex items-start space-x-2">
                            <Icon name="Check" size={14} className="text-accent-500 mt-0.5 flex-shrink-0" strokeWidth={2} />
                            <span className="text-sm text-text-secondary">{recommendation}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-4 flex space-x-2">
                        <button className="bg-primary text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-primary-700 transition-smooth focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                          Set Reminders
                        </button>
                        <button className="bg-secondary-100 text-secondary-700 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-secondary-200 transition-smooth focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:ring-offset-2">
                          Adjust Schedule
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="p-6 bg-secondary-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="Target" size={16} color="var(--color-primary)" strokeWidth={2} />
            <span className="text-sm font-medium text-text-primary">
              Goal: Reduce missed doses by 50% this month
            </span>
          </div>
          <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-smooth focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
            View Full Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default MostMissedMedications;