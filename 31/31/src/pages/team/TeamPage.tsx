
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TeamDashboard from '@/components/team/TeamDashboard';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabaseTeamStore } from '@/stores/supabaseTeamStore';
import Navigation from '@/components/Navigation';

const TeamPage = () => {
  const { teamId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Redirect to auth if not logged in
    if (!user) {
      navigate('/auth');
      return;
    }
    
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [user, navigate]);
  
  // Silent handlers for all required props
  const handleUpdateProfile = async (data: any) => {
    console.log('Update profile:', data);
  };

  const handleAddSkill = async (skill: any) => {
    console.log('Add skill:', skill);
  };

  const handleRemoveSkill = async (skillName: string) => {
    console.log('Remove skill:', skillName);
  };

  const handleAddProject = async (project: any) => {
    console.log('Add project:', project);
  };

  const handleAddExperience = async (experience: any) => {
    console.log('Add experience:', experience);
  };

  const handleUpdateMemberRole = async (memberId: string, role: string) => {
    console.log('Update member role:', memberId, role);
  };

  const handleUpdateMemberPermissions = async (memberId: string, permissions: any) => {
    console.log('Update member permissions:', memberId, permissions);
  };

  const handleRemoveMember = async (memberId: string) => {
    console.log('Remove member:', memberId);
  };

  const handleAddTask = async (task: any) => {
    console.log('Add task:', task);
  };

  const handleUpdateTaskStatus = async (taskId: string, status: string) => {
    console.log('Update task status:', taskId, status);
  };

  const handleUpdateTaskProgress = async (taskId: string, progress: number) => {
    console.log('Update task progress:', taskId, progress);
  };

  const handleDeleteTask = async (taskId: string) => {
    console.log('Delete task:', taskId);
  };

  const handleUploadFile = async (file: File): Promise<string> => {
    console.log('Upload file:', file);
    return 'mock-file-url';
  };

  const handleDeleteFile = async (fileId: string) => {
    console.log('Delete file:', fileId);
  };

  const handleShareFile = async (fileId: string, userIds: string[]) => {
    console.log('Share file:', fileId, userIds);
  };

  const handleDownloadFile = async (fileId: string) => {
    console.log('Download file:', fileId);
  };

  const handleSendMessage = async (message: any) => {
    console.log('Send message:', message);
  };

  const handleTaskCreate = async (task: any) => {
    console.log('Create task:', task);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8 space-y-6">
          <Skeleton className="h-12 w-[250px]" />
          <Skeleton className="h-[400px] w-full rounded-lg" />
        </div>
      </div>
    );
  }
  
  // If no team id is provided in URL, show error
  if (!teamId) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <h2 className="text-xl font-semibold">Team Not Found</h2>
                <p className="text-gray-500">The team you're looking for doesn't exist or you don't have access.</p>
                <button 
                  onClick={() => navigate('/teams')} 
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Go to Teams
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <TeamDashboard
      teamId={teamId}
      userId={user?.id || 'current-user-123'}
      onUpdateProfile={handleUpdateProfile}
      onAddSkill={handleAddSkill}
      onRemoveSkill={handleRemoveSkill}
      onAddProject={handleAddProject}
      onAddExperience={handleAddExperience}
      onUpdateMemberRole={handleUpdateMemberRole}
      onUpdateMemberPermissions={handleUpdateMemberPermissions}
      onRemoveMember={handleRemoveMember}
      onAddTask={handleAddTask}
      onUpdateTaskStatus={handleUpdateTaskStatus}
      onUpdateTaskProgress={handleUpdateTaskProgress}
      onDeleteTask={handleDeleteTask}
      onUploadFile={handleUploadFile}
      onDeleteFile={handleDeleteFile}
      onShareFile={handleShareFile}
      onDownloadFile={handleDownloadFile}
      onSendMessage={handleSendMessage}
      onTaskCreate={handleTaskCreate}
    />
  );
};

export default TeamPage;
