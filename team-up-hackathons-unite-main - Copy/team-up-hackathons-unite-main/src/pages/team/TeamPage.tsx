import React from 'react';
import { useParams } from 'react-router-dom';
import TeamDashboard from '@/components/team/TeamDashboard';
import { toast } from 'sonner';

const TeamPage = () => {
  const { teamId } = useParams();

  // Sample data for demonstration
  const sampleTeam = {
    id: teamId || '1',
    name: 'Team Innovators',
    description: 'A team focused on building innovative solutions using cutting-edge technologies.',
    projectIdea: 'Building an AI-powered project management tool',
    techStack: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'TensorFlow'],
    members: [
      {
        id: '1',
        name: 'John Doe',
        role: 'Team Lead',
        avatar: 'https://github.com/shadcn.png',
        skills: ['Frontend', 'React', 'TypeScript'],
        status: 'online' as const
      },
      {
        id: '2',
        name: 'Jane Smith',
        role: 'Backend Developer',
        avatar: 'https://github.com/shadcn.png',
        skills: ['Backend', 'Node.js', 'MongoDB'],
        status: 'away' as const
      },
      {
        id: '3',
        name: 'Mike Johnson',
        role: 'AI Engineer',
        avatar: 'https://github.com/shadcn.png',
        skills: ['AI/ML', 'Python', 'TensorFlow'],
        status: 'offline' as const
      }
    ],
    milestones: [
      {
        id: '1',
        title: 'Project Setup',
        deadline: new Date('2024-04-01'),
        status: 'completed' as const,
        progress: 100
      },
      {
        id: '2',
        title: 'Core Features Development',
        deadline: new Date('2024-04-15'),
        status: 'in-progress' as const,
        progress: 60
      },
      {
        id: '3',
        title: 'AI Integration',
        deadline: new Date('2024-04-30'),
        status: 'pending' as const,
        progress: 0
      }
    ],
    activities: [
      {
        id: '1',
        type: 'commit' as const,
        user: 'John Doe',
        action: 'pushed changes to main branch',
        timestamp: new Date('2024-03-20T10:00:00'),
        details: 'Added authentication system'
      },
      {
        id: '2',
        type: 'milestone' as const,
        user: 'Jane Smith',
        action: 'completed milestone',
        timestamp: new Date('2024-03-19T15:30:00'),
        details: 'Project Setup completed'
      },
      {
        id: '3',
        type: 'comment' as const,
        user: 'Mike Johnson',
        action: 'commented on PR',
        timestamp: new Date('2024-03-18T09:15:00'),
        details: 'Great work on the UI components!'
      }
    ],
    progress: 45
  };

  const handleMemberAction = (memberId: string, action: string) => {
    toast.info(`Action ${action} triggered for member ${memberId}`);
  };

  const handleMilestoneUpdate = (milestoneId: string, status: string) => {
    toast.info(`Milestone ${milestoneId} status updated to ${status}`);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <TeamDashboard
        team={sampleTeam}
        onMemberAction={handleMemberAction}
        onMilestoneUpdate={handleMilestoneUpdate}
      />
    </div>
  );
};

export default TeamPage; 