import React from 'react';
import { Medication, DoseLog } from '../../types';
import { useMedication } from '../../context/MedicationContext';

interface MissedDosesTableProps {
  medications: Medication[];
  logs: DoseLog[];
}

const MissedDosesTable: React.FC<MissedDosesTableProps> = ({ medications, logs }) => {
  const { categories } = useMedication();

  // Calculate missed doses for each medication
  const medicationStats = medications.map(medication => {
    const medLogs = logs.filter(log => log.medicationId === medication.id);
    const totalDoses = medLogs.length;
    const missedDoses = medLogs.filter(log => log.status === 'missed').length;
    const missedRate = totalDoses > 0 ? (missedDoses / totalDoses) * 100 : 0;
    
    const category = categories.find(cat => cat.id === medication.categoryId);
    
    return {
      id: medication.id,
      name: medication.name,
      dose: medication.dose,
      category: category?.name || 'Uncategorized',
      totalDoses,
      missedDoses,
      missedRate,
    };
  });

  // Sort by missed rate (highest first)
  const sortedStats = [...medicationStats].sort((a, b) => b.missedRate - a.missedRate);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Medication
            </th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Missed Doses
            </th>
            <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total Doses
            </th>
            <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Missed Rate
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedStats.map((stat) => (
            <tr key={stat.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{stat.name}</div>
                <div className="text-sm text-gray-500">{stat.dose}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{stat.category}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                {stat.missedDoses}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                {stat.totalDoses}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <div className={`text-sm font-medium ${
                  stat.missedRate > 20
                    ? 'text-red-600'
                    : stat.missedRate > 10
                    ? 'text-amber-600'
                    : 'text-emerald-600'
                }`}>
                  {stat.missedRate.toFixed(1)}%
                </div>
              </td>
            </tr>
          ))}
          
          {sortedStats.length === 0 && (
            <tr>
              <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                No missed doses data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MissedDosesTable;