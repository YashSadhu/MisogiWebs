import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const FilterControls = ({ filters, onFiltersChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const skillOptions = [
    "React", "Node.js", "Python", "JavaScript", "TypeScript",
    "MongoDB", "PostgreSQL", "Machine Learning", "AI", "Blockchain",
    "Unity", "C#", "Java", "Go", "Vue.js", "Angular"
  ];

  const handleSkillMatchChange = (value) => {
    onFiltersChange({
      ...filters,
      skillMatch: parseInt(value)
    });
  };

  const handleAvailableSlotsChange = (checked) => {
    onFiltersChange({
      ...filters,
      availableSlots: checked
    });
  };

  const handleSkillToggle = (skill) => {
    const updatedSkills = filters.skills.includes(skill)
      ? filters.skills.filter(s => s !== skill)
      : [...filters.skills, skill];
    
    onFiltersChange({
      ...filters,
      skills: updatedSkills
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      skillMatch: 0,
      availableSlots: false,
      skills: []
    });
  };

  const hasActiveFilters = filters.skillMatch > 0 || filters.availableSlots || filters.skills.length > 0;

  return (
    <div className="bg-background border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon name="Filter" size={16} className="text-text-secondary" />
          <span className="font-medium text-text-primary">Filters</span>
          {hasActiveFilters && (
            <span className="px-2 py-0.5 bg-primary bg-opacity-10 text-primary text-xs rounded-full">
              Active
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs text-text-secondary hover:text-text-primary transition-colors"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-surface rounded transition-colors"
          >
            <Icon 
              name={isExpanded ? "ChevronUp" : "ChevronDown"} 
              size={16} 
              className="text-text-secondary" 
            />
          </button>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2 mb-3">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={filters.availableSlots}
            onChange={(e) => handleAvailableSlotsChange(e.target.checked)}
            className="rounded border-border text-primary focus:ring-primary focus:ring-2"
          />
          <span className="text-text-secondary">Available slots only</span>
        </label>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="space-y-4 pt-3 border-t border-border">
          {/* Skill Match Percentage */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Minimum Skill Match: {filters.skillMatch}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              step="10"
              value={filters.skillMatch}
              onChange={(e) => handleSkillMatchChange(e.target.value)}
              className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-text-secondary mt-1">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Skills Filter */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Required Skills
            </label>
            <div className="flex flex-wrap gap-2">
              {skillOptions.map((skill) => (
                <button
                  key={skill}
                  onClick={() => handleSkillToggle(skill)}
                  className={`px-2 py-1 text-xs rounded-md border transition-colors ${
                    filters.skills.includes(skill)
                      ? 'bg-primary text-white border-primary' :'bg-surface text-text-secondary border-border hover:border-primary hover:text-primary'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
            {filters.skills.length > 0 && (
              <p className="text-xs text-text-secondary mt-2">
                Showing teams that need: {filters.skills.join(', ')}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterControls;