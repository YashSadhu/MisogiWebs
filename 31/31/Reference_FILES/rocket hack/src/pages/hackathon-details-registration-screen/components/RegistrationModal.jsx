import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import SkillSelector from './SkillSelector';

const RegistrationModal = ({ isOpen, onClose, onSubmit, hackathonTitle }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    skills: [],
    teamPreference: 'join-later',
    experience: '',
    motivation: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.skills.length === 0) {
      newErrors.skills = 'Please select at least one skill';
    }

    if (!formData.experience.trim()) {
      newErrors.experience = 'Experience level is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
        <div className="sticky top-0 bg-background border-b border-border p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-text-primary">Register for Hackathon</h2>
            <p className="text-sm text-text-secondary mt-1">{hackathonTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface rounded-lg transition-colors"
            aria-label="Close registration modal"
          >
            <Icon name="X" size={20} className="text-text-tertiary" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-text-primary">Personal Information</h3>
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
                  errors.name ? 'border-error' : 'border-border'
                }`}
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-error flex items-center">
                  <Icon name="AlertCircle" size={14} className="mr-1" />
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
                  errors.email ? 'border-error' : 'border-border'
                }`}
                placeholder="Enter your email address"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-error flex items-center">
                  <Icon name="AlertCircle" size={14} className="mr-1" />
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Skills & Technologies *
            </label>
            <SkillSelector
              selectedSkills={formData.skills}
              onChange={(skills) => handleInputChange('skills', skills)}
              error={errors.skills}
            />
            {errors.skills && (
              <p className="mt-1 text-sm text-error flex items-center">
                <Icon name="AlertCircle" size={14} className="mr-1" />
                {errors.skills}
              </p>
            )}
          </div>

          {/* Experience Level */}
          <div>
            <label htmlFor="experience" className="block text-sm font-medium text-text-primary mb-2">
              Experience Level *
            </label>
            <select
              id="experience"
              value={formData.experience}
              onChange={(e) => handleInputChange('experience', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${
                errors.experience ? 'border-error' : 'border-border'
              }`}
            >
              <option value="">Select your experience level</option>
              <option value="beginner">Beginner (0-1 years)</option>
              <option value="intermediate">Intermediate (2-4 years)</option>
              <option value="advanced">Advanced (5+ years)</option>
              <option value="expert">Expert (10+ years)</option>
            </select>
            {errors.experience && (
              <p className="mt-1 text-sm text-error flex items-center">
                <Icon name="AlertCircle" size={14} className="mr-1" />
                {errors.experience}
              </p>
            )}
          </div>

          {/* Team Preference */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-3">
              Team Preference
            </label>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="teamPreference"
                  value="create-team"
                  checked={formData.teamPreference === 'create-team'}
                  onChange={(e) => handleInputChange('teamPreference', e.target.value)}
                  className="mr-3 text-primary focus:ring-primary"
                />
                <div>
                  <span className="text-text-primary font-medium">Create a new team</span>
                  <p className="text-sm text-text-secondary">I want to lead a team and recruit members</p>
                </div>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="teamPreference"
                  value="join-team"
                  checked={formData.teamPreference === 'join-team'}
                  onChange={(e) => handleInputChange('teamPreference', e.target.value)}
                  className="mr-3 text-primary focus:ring-primary"
                />
                <div>
                  <span className="text-text-primary font-medium">Join an existing team</span>
                  <p className="text-sm text-text-secondary">I want to join a team that needs my skills</p>
                </div>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="teamPreference"
                  value="join-later"
                  checked={formData.teamPreference === 'join-later'}
                  onChange={(e) => handleInputChange('teamPreference', e.target.value)}
                  className="mr-3 text-primary focus:ring-primary"
                />
                <div>
                  <span className="text-text-primary font-medium">Decide later</span>
                  <p className="text-sm text-text-secondary">I'll figure out team formation after registration</p>
                </div>
              </label>
            </div>
          </div>

          {/* Motivation */}
          <div>
            <label htmlFor="motivation" className="block text-sm font-medium text-text-primary mb-2">
              Why do you want to participate? (Optional)
            </label>
            <textarea
              id="motivation"
              value={formData.motivation}
              onChange={(e) => handleInputChange('motivation', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              placeholder="Tell us about your motivation and what you hope to achieve..."
            />
          </div>

          {/* Terms and Conditions */}
          <div className="p-4 bg-surface rounded-lg">
            <div className="flex items-start space-x-3">
              <Icon name="Info" size={16} className="text-primary mt-0.5 flex-shrink-0" />
              <div className="text-sm text-text-secondary">
                <p className="mb-2">By registering, you agree to:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Follow the hackathon code of conduct</li>
                  <li>Respect intellectual property rights</li>
                  <li>Participate in good faith and collaborate respectfully</li>
                  <li>Allow organizers to use your project for promotional purposes</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-border rounded-lg text-text-secondary hover:bg-surface transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Icon name="Loader2" size={16} className="animate-spin mr-2" />
                  Registering...
                </>
              ) : (
                'Register Now'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationModal;