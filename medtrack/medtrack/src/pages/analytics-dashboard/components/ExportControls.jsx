import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const ExportControls = ({ onExport, isExporting }) => {
  const [showExportMenu, setShowExportMenu] = useState(false);

  const exportOptions = [
    {
      type: 'pdf',
      label: 'Export PDF Report',
      icon: 'FileText',
      description: 'Comprehensive report with charts and analysis'
    },
    {
      type: 'csv',
      label: 'Export CSV Data',
      icon: 'Download',
      description: 'Raw data for external analysis'
    }
  ];

  const handleExport = async (type) => {
    setShowExportMenu(false);
    await onExport(type);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowExportMenu(!showExportMenu)}
        disabled={isExporting}
        className={`
          flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg transition-smooth
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
          ${isExporting
            ? 'bg-secondary-100 text-secondary-500 cursor-not-allowed' :'bg-primary text-white hover:bg-primary-700'
          }
        `}
      >
        {isExporting ? (
          <>
            <Icon name="Loader2" size={16} className="animate-spin" />
            <span>Exporting...</span>
          </>
        ) : (
          <>
            <Icon name="Download" size={16} />
            <span>Export</span>
            <Icon name="ChevronDown" size={14} />
          </>
        )}
      </button>

      {showExportMenu && !isExporting && (
        <div className="absolute right-0 mt-2 w-64 bg-surface rounded-lg shadow-elevated border border-secondary-200 py-2 z-50">
          <div className="px-4 py-2 border-b border-secondary-200">
            <h4 className="text-sm font-semibold text-text-primary">Export Options</h4>
            <p className="text-xs text-text-secondary">Choose your preferred format</p>
          </div>
          
          {exportOptions.map((option) => (
            <button
              key={option.type}
              onClick={() => handleExport(option.type)}
              className="w-full flex items-start space-x-3 px-4 py-3 text-left hover:bg-secondary-50 transition-smooth"
            >
              <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon name={option.icon} size={16} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary">{option.label}</p>
                <p className="text-xs text-text-secondary">{option.description}</p>
              </div>
            </button>
          ))}
          
          <div className="border-t border-secondary-200 mt-2 pt-2 px-4">
            <div className="flex items-center space-x-2 text-xs text-text-secondary">
              <Icon name="Info" size={12} />
              <span>Reports include last 30 days of data</span>
            </div>
          </div>
        </div>
      )}

      {/* Overlay to close menu */}
      {showExportMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowExportMenu(false)}
        ></div>
      )}
    </div>
  );
};

export default ExportControls;