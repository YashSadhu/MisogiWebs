import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Bell, Users, Code2, Calendar, Activity, MessageSquare, FileText, Settings, ChevronRight, Clock, Zap, Award, Target, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import ProfileManagement from './ProfileManagement';
import TeamRoleManagement from './TeamRoleManagement';
import TaskManagement from './TaskManagement';
import FileSharing from './FileSharing';
import TeamChat from './TeamChat';
import { useSupabaseTeamStore } from '@/stores/supabaseTeamStore';
import Navigation from '@/components/Navigation';

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
  const [activeTab, setActiveTab] = useState('overview');
  const [team, setTeam] = useState<any>(null);
  const { fetchUserTeams, userTeams } = useSupabaseTeamStore();
  
  // Fetch team data
  useEffect(() => {
    const loadTeam = async () => {
      setIsLoading(true);
      await fetchUserTeams();
      
      // Find the current team in userTeams
      const currentTeam = userTeams.find(t => t.id === teamId);
      if (currentTeam) {
        setTeam(currentTeam);
      }
      
      setIsLoading(false);
    };
    
    loadTeam();
  }, [teamId, fetchUserTeams]);

  // Mock data for quick display
  const dummyTeam = {
    name: "Web3 Builders",
    description: "Creating decentralized solutions for the future of finance.",
    hackathon: { title: "Web3 Future Builder", start_date: "2024-09-10", end_date: "2024-09-12" },
    tech_stack: ["Solidity", "React", "Web3.js", "Ethereum"],
    looking_for_skills: ["Blockchain Developer", "Frontend Developer"],
    members: [
      { id: "1", user: { username: "teamlead", full_name: "Team Leader", avatar_url: "https://i.pravatar.cc/150?img=32" }, role: "leader" },
      { id: "2", user: { username: "member1", full_name: "Team Member 1", avatar_url: "https://i.pravatar.cc/150?img=33" }, role: "member" },
    ],
    member_count: 2,
    max_members: 5
  };
  
  const teamData = team || dummyTeam;
  
  // Simple stats for the overview
  const stats = [
    { label: "Team Members", value: teamData.member_count, icon: <Users className="h-4 w-4" />, color: "bg-blue-50" },
    { label: "Available Slots", value: teamData.max_members - teamData.member_count, icon: <Users className="h-4 w-4" />, color: "bg-green-50" },
    { label: "Days Until Hackathon", value: "10", icon: <Calendar className="h-4 w-4" />, color: "bg-purple-50" },
    { label: "Tasks Completed", value: "5", icon: <CheckCircle className="h-4 w-4" />, color: "bg-amber-50" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-12 w-[250px]" />
            <Skeleton className="h-[300px] w-full" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Team Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{teamData.name}</h1>
                <p className="text-gray-600 mt-1">{teamData.description}</p>
                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Hackathon: {teamData.hackathon?.title || "Unnamed Hackathon"}</span>
                  <span className="mx-2">•</span>
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{teamData.hackathon?.start_date ? format(new Date(teamData.hackathon.start_date), 'MMM d, yyyy') : "TBD"}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm">
                  <Users className="h-4 w-4 mr-2" /> Invite Member
                </Button>
                <Button size="sm">
                  <Settings className="h-4 w-4 mr-2" /> Settings
                </Button>
              </div>
            </div>
            
            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <Card key={index} className={`${stat.color} border-none`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                        <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                      </div>
                      <div className="p-2 rounded-full bg-white">
                        {stat.icon}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Main Content */}
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 w-full">
                <TabsTrigger value="overview" className="text-sm">
                  <Activity className="h-4 w-4 mr-2" /> Overview
                </TabsTrigger>
                <TabsTrigger value="members" className="text-sm">
                  <Users className="h-4 w-4 mr-2" /> Members
                </TabsTrigger>
                <TabsTrigger value="tasks" className="text-sm">
                  <Target className="h-4 w-4 mr-2" /> Tasks
                </TabsTrigger>
                <TabsTrigger value="files" className="text-sm">
                  <FileText className="h-4 w-4 mr-2" /> Files
                </TabsTrigger>
                <TabsTrigger value="chat" className="text-sm">
                  <MessageSquare className="h-4 w-4 mr-2" /> Chat
                </TabsTrigger>
              </TabsList>
              
              {/* Overview content */}
              <TabsContent value="overview" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Team Members</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {teamData.members?.slice(0, 4).map((member: any) => (
                          <div key={member.id} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={member.user?.avatar_url} alt={member.user?.username} />
                                <AvatarFallback>{member.user?.username?.slice(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div className="ml-3">
                                <p className="font-medium">{member.user?.full_name || member.user?.username}</p>
                                <p className="text-xs text-gray-500">{member.role}</p>
                              </div>
                            </div>
                            {member.role === "leader" && (
                              <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">Leader</Badge>
                            )}
                          </div>
                        ))}
                      </div>
                      {teamData.members?.length > 4 && (
                        <Button variant="ghost" size="sm" className="mt-4 w-full">
                          View All Members
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Technology Stack</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {teamData.tech_stack?.map((tech: string, index: number) => (
                          <Badge key={index} className="bg-blue-100 text-blue-800 hover:bg-blue-200">{tech}</Badge>
                        ))}
                        {(!teamData.tech_stack || teamData.tech_stack.length === 0) && (
                          <p className="text-sm text-gray-500">No technologies added yet</p>
                        )}
                      </div>
                      
                      <div className="mt-6">
                        <h4 className="text-sm font-semibold mb-2">Looking For:</h4>
                        <div className="flex flex-wrap gap-2">
                          {teamData.looking_for_skills?.map((skill: string, index: number) => (
                            <Badge key={index} className="bg-purple-100 text-purple-800 hover:bg-purple-200">{skill}</Badge>
                          ))}
                          {(!teamData.looking_for_skills || teamData.looking_for_skills.length === 0) && (
                            <p className="text-sm text-gray-500">Not looking for any specific skills</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="members" className="mt-6">
                <TeamRoleManagement
                  teamId={teamId}
                  onUpdateMemberRole={onUpdateMemberRole}
                  onUpdateMemberPermissions={onUpdateMemberPermissions}
                  onRemoveMember={onRemoveMember}
                />
              </TabsContent>
              
              <TabsContent value="tasks" className="mt-6">
                <TaskManagement
                  teamId={teamId}
                  onAddTask={onAddTask}
                  onUpdateTaskStatus={onUpdateTaskStatus}
                  onUpdateTaskProgress={onUpdateTaskProgress}
                  onDeleteTask={onDeleteTask}
                />
              </TabsContent>
              
              <TabsContent value="files" className="mt-6">
                <FileSharing
                  teamId={teamId}
                  onUploadFile={onUploadFile}
                  onDeleteFile={onDeleteFile}
                  onShareFile={onShareFile}
                  onDownloadFile={onDownloadFile}
                />
              </TabsContent>
              
              <TabsContent value="chat" className="mt-6">
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
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamDashboard; 