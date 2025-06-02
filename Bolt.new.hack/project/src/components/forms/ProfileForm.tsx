import React, { useState } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Plus, X } from 'lucide-react';
import { ProfileFormValues, Skill } from '../../types';
import Input from '../ui/Input';
import Button from '../ui/Button';
import useAuthStore from '../../store/authStore';
import Alert from '../ui/Alert';

const skillLevels = ['beginner', 'intermediate', 'advanced'] as const;

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  bio: z.string().max(300, 'Bio cannot exceed 300 characters'),
  skills: z.array(
    z.object({
      name: z.string().min(1, 'Skill name is required'),
      level: z.enum(skillLevels, {
        errorMap: () => ({ message: 'Please select a skill level' })
      })
    })
  ),
  interests: z.array(z.string()).min(1, 'Add at least one interest')
});

interface ProfileFormProps {
  onSuccess?: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ onSuccess }) => {
  const { user, updateProfile, isLoading, error, clearError } = useAuthStore();
  const [newInterest, setNewInterest] = useState('');
  
  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      bio: user?.bio || '',
      skills: user?.skills || [],
      interests: user?.interests || []
    }
  });
  
  const {
    fields: skillFields,
    append: appendSkill,
    remove: removeSkill
  } = useFieldArray({
    control,
    name: 'skills'
  });
  
  const {
    fields: interestFields,
    append: appendInterest,
    remove: removeInterest
  } = useFieldArray({
    control,
    name: 'interests'
  });
  
  const handleAddInterest = () => {
    if (newInterest.trim()) {
      appendInterest(newInterest.trim());
      setNewInterest('');
    }
  };
  
  const onSubmit = async (data: ProfileFormValues) => {
    try {
      await updateProfile(data);
      if (onSuccess) onSuccess();
    } catch (error) {
      // Error handling is done in the store
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <Alert variant="error" onClose={clearError}>
          {error}
        </Alert>
      )}
      
      <div>
        <Input
          label="Name"
          type="text"
          id="name"
          leftIcon={<User className="h-4 w-4" />}
          error={errors.name?.message}
          {...register('name')}
        />
      </div>
      
      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
          Bio
        </label>
        <textarea
          id="bio"
          rows={3}
          className={`w-full px-3 py-2 bg-white border rounded-md text-sm
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
            ${errors.bio ? 'border-red-500' : 'border-gray-300'}`}
          {...register('bio')}
        />
        {errors.bio && (
          <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
        )}
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Skills
          </label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => appendSkill({ name: '', level: 'beginner' })}
          >
            Add Skill
          </Button>
        </div>
        
        {skillFields.length === 0 && (
          <p className="text-sm text-gray-500 mb-2">No skills added yet. Add your first skill!</p>
        )}
        
        {skillFields.map((field, index) => (
          <div key={field.id} className="flex items-start space-x-2 mb-2">
            <div className="flex-1">
              <Input
                placeholder="Skill name"
                error={errors.skills?.[index]?.name?.message}
                {...register(`skills.${index}.name`)}
              />
            </div>
            
            <div className="flex-1">
              <Controller
                control={control}
                name={`skills.${index}.level`}
                render={({ field }) => (
                  <select
                    className={`w-full px-3 py-2 bg-white border rounded-md text-sm
                      focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                      ${errors.skills?.[index]?.level ? 'border-red-500' : 'border-gray-300'}`}
                    {...field}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                )}
              />
              {errors.skills?.[index]?.level && (
                <p className="mt-1 text-sm text-red-600">{errors.skills[index].level?.message}</p>
              )}
            </div>
            
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeSkill(index)}
              className="mt-1"
            >
              <X className="h-4 w-4 text-gray-500" />
            </Button>
          </div>
        ))}
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Interests
          </label>
        </div>
        
        <div className="flex space-x-2 mb-2">
          <Input
            placeholder="Add an interest"
            value={newInterest}
            onChange={(e) => setNewInterest(e.target.value)}
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleAddInterest}
          >
            Add
          </Button>
        </div>
        
        {errors.interests && (
          <p className="mt-1 text-sm text-red-600">{errors.interests.message}</p>
        )}
        
        {interestFields.length === 0 && (
          <p className="text-sm text-gray-500 mb-2">No interests added yet. Add your first interest!</p>
        )}
        
        <div className="flex flex-wrap gap-2 mt-2">
          {interestFields.map((field, index) => (
            <div key={field.id} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm flex items-center">
              <span>{field.value}</span>
              <button
                type="button"
                onClick={() => removeInterest(index)}
                className="ml-2 text-indigo-600 hover:text-indigo-800"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isLoading}
        >
          Save Profile
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;