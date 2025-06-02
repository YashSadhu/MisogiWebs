import { create } from 'zustand';
import { Team, JoinRequest, TeamMember } from '@/types/teamTypes';

interface TeamStore {
  // Teams
  availableTeams: Team[];
  userTeams: Team[];
  joinRequests: JoinRequest[];
  sentRequests: string[];
  
  // Actions
  createTeam: (team: Omit<Team, 'id' | 'createdAt'>) => Promise<Team>;
  joinTeam: (teamId: string) => Promise<void>;
  joinTeamWithCode: (code: string) => Promise<void>;
  cancelJoinRequest: (teamId: string) => Promise<void>;
  acceptJoinRequest: (requestId: string) => Promise<void>;
  rejectJoinRequest: (requestId: string) => Promise<void>;
  leaveTeam: (teamId: string) => Promise<void>;
  updateTeam: (teamId: string, updates: Partial<Team>) => Promise<Team>;
  getTeamByInviteCode: (inviteCode: string) => Promise<Team | null>;
  calculateSkillMatch: (userSkills: string[], teamSkills: string[]) => number;
  
  // Loading states
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

// Mock user skills for demonstration
const currentUserSkills = ['React', 'TypeScript', 'Node.js'];

export const useTeamStore = create<TeamStore>((set, get) => ({
  availableTeams: [],
  userTeams: [],
  joinRequests: [],
  sentRequests: [],
  isLoading: false,
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  createTeam: async (teamData) => {
    get().setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newTeam: Team = {
      ...teamData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      inviteCode: `TEAM${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      isOwner: true,
      teamStatus: 'Active',
      pendingRequests: 0,
      currentMembers: 1, // Creator is first member
    };
    
    set(state => ({
      userTeams: [newTeam, ...state.userTeams],
      isLoading: false
    }));
    
    return newTeam;
  },
  
  joinTeam: async (teamId: string) => {
    get().setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      set(state => ({
        sentRequests: [...state.sentRequests, teamId],
        isLoading: false
      }));
    } catch (error) {
      get().setLoading(false);
      throw error;
    }
  },
  
  joinTeamWithCode: async (code: string) => {
    get().setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In a real app, this would validate the code and join the team
      get().setLoading(false);
    } catch (error) {
      get().setLoading(false);
      throw error;
    }
  },
  
  cancelJoinRequest: async (teamId) => {
    get().setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Remove from sent requests
    set(state => ({
      sentRequests: state.sentRequests.filter(id => id !== teamId),
      isLoading: false
    }));
  },
  
  acceptJoinRequest: async (requestId) => {
    get().setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const request = get().joinRequests.find(req => req.id === requestId);
    if (!request) {
      get().setLoading(false);
      return;
    }
    
    // Update team members and remove request
    set(state => ({
      joinRequests: state.joinRequests.filter(req => req.id !== requestId),
      userTeams: state.userTeams.map(team => {
        if (team.id === request.teamId) {
          return {
            ...team,
            currentMembers: team.currentMembers + 1,
            pendingRequests: (team.pendingRequests || 0) - 1
          };
        }
        return team;
      }),
      isLoading: false
    }));
  },
  
  rejectJoinRequest: async (requestId) => {
    get().setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const request = get().joinRequests.find(req => req.id === requestId);
    if (!request) {
      get().setLoading(false);
      return;
    }
    
    // Remove request and update pending count
    set(state => ({
      joinRequests: state.joinRequests.filter(req => req.id !== requestId),
      userTeams: state.userTeams.map(team => {
        if (team.id === request.teamId) {
          return {
            ...team,
            pendingRequests: (team.pendingRequests || 0) - 1
          };
        }
        return team;
      }),
      isLoading: false
    }));
  },
  
  leaveTeam: async (teamId) => {
    get().setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Remove team from user teams if not owner
    set(state => ({
      userTeams: state.userTeams.filter(team => 
        team.id !== teamId || team.isOwner
      ),
      isLoading: false
    }));
  },
  
  updateTeam: async (teamId, updates) => {
    get().setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update team
    let updatedTeam: Team | null = null;
    
    set(state => {
      const updatedTeams = state.userTeams.map(team => {
        if (team.id === teamId) {
          updatedTeam = { ...team, ...updates };
          return updatedTeam;
        }
        return team;
      });
      
      return {
        userTeams: updatedTeams,
        isLoading: false
      };
    });
    
    return updatedTeam!;
  },
  
  getTeamByInviteCode: async (inviteCode) => {
    get().setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find team with matching invite code
    const team = get().availableTeams.find(team => team.inviteCode === inviteCode);
    
    get().setLoading(false);
    return team || null;
  },
  
  calculateSkillMatch: (userSkills, teamSkills) => {
    if (!userSkills.length || !teamSkills.length) return 0;
    
    const matchingSkills = userSkills.filter(skill => 
      teamSkills.some(teamSkill => 
        teamSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(teamSkill.toLowerCase())
      )
    );
    
    return Math.round((matchingSkills.length / teamSkills.length) * 100);
  }
}));