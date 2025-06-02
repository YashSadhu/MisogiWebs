import React from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, X, Lightbulb } from 'lucide-react';
import { ProjectIdeaFormValues } from '../../types';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Alert from '../ui/Alert';

const projectIdeaSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000, 'Description cannot exceed 2000 characters'),
  techStack: z.array(z.string()).min(1, 'Add at least one technology')
});

interface ProjectIdeaFormProps {
  onSubmit: (data: ProjectIdeaFormValues) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  onClearError: () => void;
  initialValues?: Partial<ProjectIdeaFormValues>;
}

const ProjectIdeaForm: React.FC<ProjectIdeaFormProps> = ({
  onSubmit,
  isLoading,
  error,
  onClearError,
  initialValues
}) => {
  const [newTech, setNewTech] = React.useState('');
  
  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<ProjectIdeaFormValues>({
    resolver: zodResolver(projectIdeaSchema),
    defaultValues: {
      title: initialValues?.title || '',
      description: initialValues?.description || '',
      techStack: initialValues?.techStack || []
    }
  });
  
  const {
    fields: techStackFields,
    append: appendTech,
    remove: removeTech
  } = useFieldArray({
    control,
    name: 'techStack'
  });
  
  const handleAddTech = () => {
    if (newTech.trim()) {
      appendTech(newTech.trim());
      setNewTech('');
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <Alert variant="error" onClose={onClearError}>
          {error}
        </Alert>
      )}
      
      <div>
        <Input
          label="Project Title"
          type="text"
          id="title"
          leftIcon={<Lightbulb className="h-4 w-4" />}
          error={errors.title?.message}
          {...register('title')}
        />
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Project Description
        </label>
        <textarea
          id="description"
          rows={6}
          className={`w-full px-3 py-2 bg-white border rounded-md text-sm
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
            ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Describe your project idea in detail. What problem does it solve? What are the main features?"
          {...register('description')}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Tech Stack
          </label>
        </div>
        
        <div className="flex space-x-2 mb-2">
          <Input
            placeholder="Add a technology"
            value={newTech}
            onChange={(e) => setNewTech(e.target.value)}
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleAddTech}
          >
            Add
          </Button>
        </div>
        
        {errors.techStack && (
          <p className="mt-1 text-sm text-red-600">{errors.techStack.message}</p>
        )}
        
        {techStackFields.length === 0 && (
          <p className="text-sm text-gray-500 mb-2">No technologies added yet. Add your first technology!</p>
        )}
        
        <div className="flex flex-wrap gap-2 mt-2">
          {techStackFields.map((field, index) => (
            <div key={field.id} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm flex items-center">
              <span>{field.value}</span>
              <button
                type="button"
                onClick={() => removeTech(index)}
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
          {initialValues ? 'Update Project Idea' : 'Create Project Idea'}
        </Button>
      </div>
    </form>
  );
};

export default ProjectIdeaForm;