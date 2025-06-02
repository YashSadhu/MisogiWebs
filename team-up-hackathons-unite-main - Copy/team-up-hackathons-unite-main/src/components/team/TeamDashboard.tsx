import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, Users, Code2, Calendar, Activity, Search, Filter, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import ProfileManagement from './ProfileManagement';
import TeamRoleManagement from './TeamRoleManagement';
import TaskManagement from './TaskManagement';
import FileSharing from './FileSharing';
import TeamChat from './TeamChat';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  skills: string[];
  status: 'online' | 'offline' | 'away';
}

interface ProjectMilestone {
  id: string;
  title: string;
  deadline: Date;
  status: 'completed' | 'in-progress' | 'pending';
  progress: number;
}

interface ActivityItem {
  id: string;
  type: 'commit' | 'comment' | 'milestone' | 'member';
  user: string;
  action: string;
  timestamp: Date;
  details?: string;
}

interface TeamDashboardProps {
  teamId: string;
  userId: string;
  onUpdateProfile: (data: any) => Promise<void>;
  onAddSkill: (skill: any) => Promise<void>;
  onRemoveSkill: (skillName: string) => Promise<void>;
  onAddProject: (project: any) => Promise<void>;
  onAddExperience: (experience: any) => Promise<void>;
  onUpdateMemberRole: (memberId: string, role: string) => Promise<void>;
  onUpdateMemberPermissions: (memberId: string, permissions: any) => Promise<void>;
  onRemoveMember: (memberId: string) => Promise<void>;
  onAddTask: (task: any) => Promise<void>;
  onUpdateTaskStatus: (taskId: string, status: string) => Promise<void>;
  onUpdateTaskProgress: (taskId: string, progress: number) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
  onUploadFile: (file: File) => Promise<string>;
  onDeleteFile: (fileId: string) => Promise<void>;
  onShareFile: (fileId: string, userIds: string[]) => Promise<void>;
  onDownloadFile: (fileId: string) => Promise<void>;
  onSendMessage: (message: any) => Promise<void>;
  onTaskCreate: (task: any) => Promise<void>;
}

const TeamDashboard = ({
  teamId,
  userId,
  onUpdateProfile,
  onAddSkill,
  onRemoveSkill,
  onAddProject,
  onAddExperience,
  onUpdateMemberRole,
  onUpdateMemberPermissions,
  onRemoveMember,
  onAddTask,
  onUpdateTaskStatus,
  onUpdateTaskProgress,
  onDeleteTask,
  onUploadFile,
  onDeleteFile,
  onShareFile,
  onDownloadFile,
  onSendMessage,
  onTaskCreate,
}: TeamDashboardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Team Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="roles">Roles</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
              <TabsTrigger value="chat">Chat</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <ProfileManagement
                userId={userId}
                onUpdateProfile={onUpdateProfile}
                onAddSkill={onAddSkill}
                onRemoveSkill={onRemoveSkill}
                onAddProject={onAddProject}
                onAddExperience={onAddExperience}
              />
            </TabsContent>

            <TabsContent value="roles">
              <TeamRoleManagement
                teamId={teamId}
                onUpdateMemberRole={onUpdateMemberRole}
                onUpdateMemberPermissions={onUpdateMemberPermissions}
                onRemoveMember={onRemoveMember}
              />
            </TabsContent>

            <TabsContent value="tasks">
              <TaskManagement
                teamId={teamId}
                onAddTask={onAddTask}
                onUpdateTaskStatus={onUpdateTaskStatus}
                onUpdateTaskProgress={onUpdateTaskProgress}
                onDeleteTask={onDeleteTask}
              />
            </TabsContent>

            <TabsContent value="files">
              <FileSharing
                teamId={teamId}
                onUploadFile={onUploadFile}
                onDeleteFile={onDeleteFile}
                onShareFile={onShareFile}
                onDownloadFile={onDownloadFile}
              />
            </TabsContent>

            <TabsContent value="chat">
              <TeamChat
                teamId={teamId}
                currentUser={{
                  id: userId,
                  name: 'Current User',
                  avatar: 'https://github.com/shadcn.png',
                }}
                onSendMessage={onSendMessage}
                onFileUpload={onUploadFile}
                onTaskCreate={onTaskCreate}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamDashboard; 