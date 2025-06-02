interface TeamMember {
  id: string;
  name: string;
  username: string;
  avatar: string;
  role: string;
  skills: string[];
  isOnline?: boolean;
  joinedAt: Date;
}

interface Team {
  id: string;
  name: string;
  hackathonId: string;
  hackathonName: string;
  description: string;
  projectIdea?: string;
  techStack: string[];
  requiredSkills: string[];
  currentMembers: number;
  maxMembers: number;
  members: TeamMember[];
  teamLead: string;
  teamLeadId: string;
  teamLeadAvatar?: string;
  location?: string;
  inviteCode?: string;
  teamStatus?: 'Active' | 'Pending' | 'Completed';
  isFull?: boolean;
  isOwner?: boolean;
  isRequestSent?: boolean;
  pendingRequests?: number;
  skillMatchPercentage?: number;
  createdAt: Date;
}

interface JoinRequest {
  id: string;
  teamId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  userSkills: string[];
  message?: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
}

interface ProjectIdea {
  id: string;
  teamId: string;
  title: string;
  description: string;
  techTags: string[];
  category: string;
  votes: number;
  createdBy: string;
  createdAt: Date;
  comments: ProjectComment[];
}

interface ProjectComment {
  id: string;
  ideaId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: Date;
}

export type { TeamMember, Team, JoinRequest, ProjectIdea, ProjectComment };