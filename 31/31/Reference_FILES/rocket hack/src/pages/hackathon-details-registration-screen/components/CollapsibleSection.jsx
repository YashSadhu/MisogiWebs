import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const CollapsibleSection = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-background rounded-lg border border-border overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 text-left flex items-center justify-between hover:bg-surface transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset"
        aria-expanded={isOpen}
        aria-controls={`section-${title.replace(/\s+/g, '-').toLowerCase()}`}
      >
        <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
        <Icon 
          name={isOpen ? "ChevronUp" : "ChevronDown"} 
          size={20} 
          className="text-text-tertiary transition-transform duration-200"
        />
      </button>
      
      {isOpen && (
        <div 
          id={`section-${title.replace(/\s+/g, '-').toLowerCase()}`}
          className="px-6 pb-6 border-t border-border"
        >
          <div className="pt-4">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default CollapsibleSection;