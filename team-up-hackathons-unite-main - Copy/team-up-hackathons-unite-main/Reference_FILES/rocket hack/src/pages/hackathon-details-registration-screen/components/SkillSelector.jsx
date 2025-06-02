import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const SkillSelector = ({ selectedSkills, onChange, error }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const availableSkills = [
    'JavaScript', 'Python', 'React', 'Node.js', 'Machine Learning',
    'Data Science', 'UI/UX Design', 'Mobile Development', 'DevOps',
    'Blockchain', 'AI/ML', 'Cloud Computing', 'Cybersecurity',
    'Game Development', 'IoT', 'AR/VR', 'Backend Development',
    'Frontend Development', 'Full Stack', 'Database Management'
  ];

  const filteredSkills = availableSkills.filter(skill =>
    skill.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedSkills.includes(skill)
  );

  const handleSkillToggle = (skill) => {
    if (selectedSkills.includes(skill)) {
      onChange(selectedSkills.filter(s => s !== skill));
    } else {
      onChange([...selectedSkills, skill]);
    }
  };

  const removeSkill = (skillToRemove) => {
    onChange(selectedSkills.filter(skill => skill !== skillToRemove));
  };

  return (
    <div className="relative">
      {/* Selected Skills Display */}
      {selectedSkills.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {selectedSkills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center px-3 py-1 bg-primary-light text-primary text-sm rounded-full"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="ml-2 hover:text-primary-hover"
                aria-label={`Remove ${skill}`}
              >
                <Icon name="X" size={14} />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Dropdown Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-3 py-2 border rounded-lg text-left flex items-center justify-between focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
          error ? 'border-error' : 'border-border'
        }`}
      >
        <span className={selectedSkills.length > 0 ? 'text-text-primary' : 'text-text-tertiary'}>
          {selectedSkills.length > 0 
            ? `${selectedSkills.length} skill${selectedSkills.length > 1 ? 's' : ''} selected`
            : 'Select your skills'
          }
        </span>
        <Icon name={isOpen ? "ChevronUp" : "ChevronDown"} size={16} className="text-text-tertiary" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-background border border-border rounded-lg shadow-lg max-h-64 overflow-hidden">
          {/* Search Input */}
          <div className="p-3 border-b border-border">
            <div className="relative">
              <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary" />
              <input
                type="text"
                placeholder="Search skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-border rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          {/* Skills List */}
          <div className="max-h-48 overflow-y-auto">
            {filteredSkills.length > 0 ? (
              <div className="p-2">
                {filteredSkills.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => handleSkillToggle(skill)}
                    className="w-full text-left px-3 py-2 hover:bg-surface rounded-md transition-colors flex items-center justify-between"
                  >
                    <span className="text-text-primary">{skill}</span>
                    {selectedSkills.includes(skill) && (
                      <Icon name="Check" size={16} className="text-primary" />
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-text-secondary">
                {searchTerm ? 'No skills found matching your search' : 'No more skills available'}
              </div>
            )}
          </div>

          {/* Close Button */}
          <div className="p-3 border-t border-border">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-full px-3 py-2 bg-surface text-text-primary rounded-md hover:bg-gray-200 transition-colors text-sm"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillSelector;