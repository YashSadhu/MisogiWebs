import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Users } from 'lucide-react';
import { TeamFormValues, Hackathon } from '../../types';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Alert from '../ui/Alert';

const teamSchema = z.object({
  name: z.string().min(3, 'Team name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Description cannot exceed 500 characters'),
  hackathonId: z.string().min(1, 'Please select a hackathon')
});

interface TeamFormProps {
  hackathons: Hackathon[];
  onSubmit: (data: TeamFormValues) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  onClearError: () => void;
}

const TeamForm: React.FC<TeamFormProps> = ({
  hackathons,
  onSubmit,
  isLoading,
  error,
  onClearError
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<TeamFormValues>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      name: '',
      description: '',
      hackathonId: ''
    }
  });
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <Alert variant="error" onClose={onClearError}>
          {error}
        </Alert>
      )}
      
      <div>
        <Input
          label="Team Name"
          type="text"
          id="name"
          leftIcon={<Users className="h-4 w-4" />}
          error={errors.name?.message}
          {...register('name')}
        />
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Team Description
        </label>
        <textarea
          id="description"
          rows={4}
          className={`w-full px-3 py-2 bg-white border rounded-md text-sm
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
            ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Describe your team and what you're looking for in team members"
          {...register('description')}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="hackathonId" className="block text-sm font-medium text-gray-700 mb-1">
          Hackathon
        </label>
        <select
          id="hackathonId"
          className={`w-full px-3 py-2 bg-white border rounded-md text-sm
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
            ${errors.hackathonId ? 'border-red-500' : 'border-gray-300'}`}
          {...register('hackathonId')}
        >
          <option value="">Select a hackathon</option>
          {hackathons.map((hackathon) => (
            <option key={hackathon.id} value={hackathon.id}>
              {hackathon.title}
            </option>
          ))}
        </select>
        {errors.hackathonId && (
          <p className="mt-1 text-sm text-red-600">{errors.hackathonId.message}</p>
        )}
      </div>
      
      <div>
        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isLoading}
        >
          Create Team
        </Button>
      </div>
    </form>
  );
};

export default TeamForm;