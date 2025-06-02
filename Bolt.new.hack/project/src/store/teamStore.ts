import { create } from 'zustand';
import { Team, ProjectIdea, User, TeamMember } from '../types';
import useAuthStore from './authStore';

interface TeamState {
  teams: Team[];
  currentTeam: Team | null;
  userSuggestions: User[];
  isLoading: boolean;
  error: string | null;
  fetchTeams: () => Promise<void>;
  fetchTeamById: (id: string) => Promise<void>;
  createTeam: (name: string, description: string, hackathonId: string) => Promise<void>;
  joinTeam: (inviteCode: string) => Promise<void>;
  getUserSuggestions: (teamId: string) => Promise<User[]>;
  inviteUser: (teamId: string, userId: string) => Promise<void>;
  createProjectIdea: (teamId: string, title: string, description: string, techStack: string[]) => Promise<void>;
  updateProjectIdea: (ideaId: string, data: Partial<ProjectIdea>) => Promise<void>;
  addComment: (ideaId: string, content: string) => Promise<void>;
  addEndorsement: (ideaId: string) => Promise<void>;
  clearError: () => void;
}

const useTeamStore = create<TeamState>((set, get) => ({
  teams: [],
  currentTeam: null,
  userSuggestions: [],
  isLoading: false,
  error: null,

  fetchTeams: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockTeams: Team[] = [
        {
          id: '1',
          name: 'AI Innovators',
          description: 'Building cutting-edge AI solutions',
          hackathonId: '1',
          ownerId: '1',
          members: [
            {
              userId: '1',
              role: 'owner',
              joinedAt: new Date().toISOString(),
              user: useAuthStore.getState().user!
            }
          ],
          inviteCode: 'AI123',
          createdAt: new Date().toISOString()
        }
      ];
      
      set({ teams: mockTeams, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch teams', isLoading: false });
    }
  },

  fetchTeamById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const team = get().teams.find(t => t.id === id);
      if (!team) throw new Error('Team not found');
      
      set({ currentTeam: team, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch team', isLoading: false });
    }
  },

  createTeam: async (name, description, hackathonId) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = useAuthStore.getState().user;
      if (!user) throw new Error('User not authenticated');
      
      const newTeam: Team = {
        id: `team-${Date.now()}`,
        name,
        description,
        hackathonId,
        ownerId: user.id,
        members: [
          {
            userId: user.id,
            role: 'owner',
            joinedAt: new Date().toISOString(),
            user
          }
        ],
        inviteCode: `TEAM${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        createdAt: new Date().toISOString()
      };
      
      set(state => ({
        teams: [...state.teams, newTeam],
        currentTeam: newTeam,
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'Failed to create team', isLoading: false });
    }
  },

  joinTeam: async (inviteCode) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = useAuthStore.getState().user;
      if (!user) throw new Error('User not authenticated');
      
      const team = get().teams.find(t => t.inviteCode === inviteCode);
      if (!team) throw new Error('Invalid invite code');
      
      if (team.members.some(m => m.userId === user.id)) {
        throw new Error('You are already a member of this team');
      }
      
      const updatedTeam: Team = {
        ...team,
        members: [
          ...team.members,
          {
            userId: user.id,
            role: 'member',
            joinedAt: new Date().toISOString(),
            user
          }
        ]
      };
      
      set(state => ({
        teams: state.teams.map(t => t.id === team.id ? updatedTeam : t),
        currentTeam: updatedTeam,
        isLoading: false
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to join team', isLoading: false });
    }
  },

  getUserSuggestions: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockSuggestions: User[] = [
        {
          id: '2',
          name: 'Alice Johnson',
          email: 'alice@example.com',
          bio: 'Full-stack developer',
          skills: [
            { name: 'React', level: 'advanced' },
            { name: 'Node.js', level: 'intermediate' }
          ],
          interests: ['Web Development', 'AI'],
          avatarUrl: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
          createdAt: new Date().toISOString()
        },
        {
          id: '3',
          name: 'Bob Smith',
          email: 'bob@example.com',
          bio: 'AI enthusiast',
          skills: [
            { name: 'Python', level: 'advanced' },
            { name: 'Machine Learning', level: 'advanced' }
          ],
          interests: ['AI', 'Data Science'],
          avatarUrl: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
          createdAt: new Date().toISOString()
        }
      ];
      
      set({ userSuggestions: mockSuggestions, isLoading: false });
      return mockSuggestions;
    } catch (error) {
      set({ error: 'Failed to fetch user suggestions', isLoading: false });
      return [];
    }
  },

  inviteUser: async (teamId, userId) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      set({ isLoading: false });
    } catch (error) {
      set({ error: 'Failed to invite user', isLoading: false });
    }
  },

  createProjectIdea: async (teamId, title, description, techStack) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newIdea: ProjectIdea = {
        id: `idea-${Date.now()}`,
        teamId,
        title,
        description,
        techStack,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        comments: [],
        endorsements: []
      };
      
      const currentTeam = get().currentTeam;
      if (!currentTeam) throw new Error('Team not found');
      
      const updatedTeam = {
        ...currentTeam,
        projectIdea: newIdea
      };
      
      set(state => ({
        teams: state.teams.map(t => t.id === teamId ? updatedTeam : t),
        currentTeam: updatedTeam,
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'Failed to create project idea', isLoading: false });
    }
  },

  updateProjectIdea: async (ideaId, data) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const currentTeam = get().currentTeam;
      if (!currentTeam?.projectIdea) throw new Error('Project idea not found');
      
      const updatedIdea = {
        ...currentTeam.projectIdea,
        ...data,
        updatedAt: new Date().toISOString()
      };
      
      const updatedTeam = {
        ...currentTeam,
        projectIdea: updatedIdea
      };
      
      set(state => ({
        teams: state.teams.map(t => t.id === currentTeam.id ? updatedTeam : t),
        currentTeam: updatedTeam,
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'Failed to update project idea', isLoading: false });
    }
  },

  addComment: async (ideaId, content) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = useAuthStore.getState().user;
      if (!user) throw new Error('User not authenticated');
      
      const currentTeam = get().currentTeam;
      if (!currentTeam?.projectIdea) throw new Error('Project idea not found');
      
      const newComment = {
        id: `comment-${Date.now()}`,
        projectIdeaId: ideaId,
        userId: user.id,
        content,
        createdAt: new Date().toISOString(),
        user
      };
      
      const updatedIdea = {
        ...currentTeam.projectIdea,
        comments: [...currentTeam.projectIdea.comments, newComment]
      };
      
      const updatedTeam = {
        ...currentTeam,
        projectIdea: updatedIdea
      };
      
      set(state => ({
        teams: state.teams.map(t => t.id === currentTeam.id ? updatedTeam : t),
        currentTeam: updatedTeam,
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'Failed to add comment', isLoading: false });
    }
  },

  addEndorsement: async (ideaId) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = useAuthStore.getState().user;
      if (!user) throw new Error('User not authenticated');
      
      const currentTeam = get().currentTeam;
      if (!currentTeam?.projectIdea) throw new Error('Project idea not found');
      
      const newEndorsement = {
        id: `endorsement-${Date.now()}`,
        projectIdeaId: ideaId,
        userId: user.id,
        createdAt: new Date().toISOString(),
        user
      };
      
      const updatedIdea = {
        ...currentTeam.projectIdea,
        endorsements: [...currentTeam.projectIdea.endorsements, newEndorsement]
      };
      
      const updatedTeam = {
        ...currentTeam,
        projectIdea: updatedIdea
      };
      
      set(state => ({
        teams: state.teams.map(t => t.id === currentTeam.id ? updatedTeam : t),
        currentTeam: updatedTeam,
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'Failed to add endorsement', isLoading: false });
    }
  },

  clearError: () => set({ error: null })
}));

export default useTeamStore;