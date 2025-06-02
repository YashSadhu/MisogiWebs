import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Users } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Alert from '../ui/Alert';

interface JoinTeamFormValues {
  inviteCode: string;
}

const joinTeamSchema = z.object({
  inviteCode: z.string().min(4, 'Invite code must be at least 4 characters')
});

interface JoinTeamFormProps {
  onSubmit: (data: JoinTeamFormValues) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  onClearError: () => void;
}

const JoinTeamForm: React.FC<JoinTeamFormProps> = ({
  onSubmit,
  isLoading,
  error,
  onClearError
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<JoinTeamFormValues>({
    resolver: zodResolver(joinTeamSchema),
    defaultValues: {
      inviteCode: ''
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
          label="Invite Code"
          type="text"
          id="inviteCode"
          leftIcon={<Users className="h-4 w-4" />}
          error={errors.inviteCode?.message}
          placeholder="Enter team invite code"
          {...register('inviteCode')}
        />
        <p className="mt-2 text-sm text-gray-500">
          Enter the invite code you received from a team owner to join their team.
        </p>
      </div>
      
      <div>
        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isLoading}
        >
          Join Team
        </Button>
      </div>
    </form>
  );
};

export default JoinTeamForm;