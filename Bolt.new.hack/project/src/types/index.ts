// User related types
export interface User {
  id: string;
  name: string;
  email: string;
  bio?: string;
  skills: Skill[];
  interests: string[];
  avatarUrl?: string;
  createdAt: string;
}

export interface Skill {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced';
}

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ProfileFormValues {
  name: string;
  bio: string;
  skills: Skill[];
  interests: string[];
}

// Hackathon related types
export interface Hackathon {
  id: string;
  title: string;
  theme: string;
  description: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  prizes: string[];
  tags: string[];
  maxTeamSize: number;
  minTeamSize: number;
  imageUrl?: string;
}

// Team related types
export interface Team {
  id: string;
  name: string;
  description: string;
  hackathonId: string;
  ownerId: string;
  members: TeamMember[];
  inviteCode: string;
  projectIdea?: ProjectIdea;
  createdAt: string;
}

export interface TeamMember {
  userId: string;
  role: 'owner' | 'member';
  joinedAt: string;
  user: User;
}

export interface TeamFormValues {
  name: string;
  description: string;
  hackathonId: string;
}

// Project idea related types
export interface ProjectIdea {
  id: string;
  teamId: string;
  title: string;
  description: string;
  techStack: string[];
  createdAt: string;
  updatedAt: string;
  comments: ProjectComment[];
  endorsements: ProjectEndorsement[];
}

export interface ProjectComment {
  id: string;
  projectIdeaId: string;
  userId: string;
  content: string;
  createdAt: string;
  user: User;
}

export interface ProjectEndorsement {
  id: string;
  projectIdeaId: string;
  userId: string;
  createdAt: string;
  user: User;
}

export interface ProjectIdeaFormValues {
  title: string;
  description: string;
  techStack: string[];
}

// Auth state
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}