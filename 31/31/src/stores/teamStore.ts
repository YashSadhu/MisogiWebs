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
  isTeamMember: (teamId: string, userId: string) => boolean;
  
  // Loading states
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

// Mock user skills for demonstration
const currentUserSkills = ['React', 'TypeScript', 'Node.js', 'JavaScript', 'CSS'];
const currentUserId = 'current-user-123';

export const useTeamStore = create<TeamStore>((set, get) => ({
  availableTeams: [
    {
      id: 'team-1',
      name: 'AI Innovators',
      hackathonId: '1',
      hackathonName: 'AI Innovation Challenge 2024',
      description: 'Building next-gen AI tools for developers',
      projectIdea: 'An AI-powered code review assistant',
      techStack: ['React', 'Python', 'TensorFlow'],
      requiredSkills: ['Machine Learning', 'Python', 'React'],
      currentMembers: 3,
      maxMembers: 5,
      members: [
        {
          id: 'member-1',
          name: 'Alex Johnson',
          username: 'alexj',
          avatar: 'https://ui-avatars.com/api/?name=Alex+Johnson',
          role: 'Team Lead',
          skills: ['Python', 'TensorFlow'],
          joinedAt: new Date()
        }
      ],
      teamLead: 'Alex Johnson',
      teamLeadId: 'member-1',
      teamLeadAvatar: 'https://ui-avatars.com/api/?name=Alex+Johnson',
      inviteCode: 'AI2024XYZ',
      teamStatus: 'Active',
      createdAt: new Date(),
      skillMatchPercentage: 0 // Will be calculated
    },
    {
      id: 'team-2',
      name: 'Web3 Builders',
      hackathonId: '2',
      hackathonName: 'Web3 Future Builder',
      description: 'Decentralized applications for the future',
      techStack: ['Solidity', 'React', 'Web3.js'],
      requiredSkills: ['Blockchain', 'Smart Contracts', 'DeFi'],
      currentMembers: 2,
      maxMembers: 4,
      members: [
        {
          id: 'member-2',
          name: 'Sarah Chen',
          username: 'sarahc',
          avatar: 'https://ui-avatars.com/api/?name=Sarah+Chen',
          role: 'Team Lead',
          skills: ['Solidity', 'Blockchain'],
          joinedAt: new Date()
        }
      ],
      teamLead: 'Sarah Chen',
      teamLeadId: 'member-2',
      teamLeadAvatar: 'https://ui-avatars.com/api/?name=Sarah+Chen',
      inviteCode: 'WEB3ABC123',
      teamStatus: 'Active',
      createdAt: new Date(),
      skillMatchPercentage: 0 // Will be calculated
    }
  ],
  userTeams: [],
  joinRequests: [],
  sentRequests: [],
  isLoading: false,
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  isTeamMember: (teamId, userId) => {
    const { userTeams } = get();
    const team = userTeams.find(t => t.id === teamId);
    return team ? team.members.some(m => m.id === userId) || team.teamLeadId === userId : false;
  },
  
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
      currentMembers: 1,
      members: [
        {
          id: currentUserId,
          name: 'Current User',
          username: 'currentuser',
          avatar: 'https://ui-avatars.com/api/?name=Current+User',
          role: 'Team Lead',
          skills: currentUserSkills,
          joinedAt: new Date()
        }
      ],
      teamLeadId: currentUserId,
      teamLead: 'Current User',
      teamLeadAvatar: 'https://ui-avatars.com/api/?name=Current+User'
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
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const { availableTeams, userTeams } = get();
      const allTeams = [...availableTeams, ...userTeams];
      const teamToJoin = allTeams.find(team => team.inviteCode === code);
      
      if (!teamToJoin) {
        get().setLoading(false);
        throw new Error('Invalid invite code');
      }
      
      // Check if team is full
      if (teamToJoin.currentMembers >= teamToJoin.maxMembers) {
        get().setLoading(false);
        throw new Error('Team is full');
      }
      
      // Check if already a member
      if (get().isTeamMember(teamToJoin.id, currentUserId)) {
        get().setLoading(false);
        throw new Error('You are already a member of this team');
      }
      
      // Add user to team
      const newMember: TeamMember = {
        id: currentUserId,
        name: 'Current User',
        username: 'currentuser',
        avatar: 'https://ui-avatars.com/api/?name=Current+User',
        role: 'Member',
        skills: currentUserSkills,
        joinedAt: new Date()
      };
      
      const updatedTeam = {
        ...teamToJoin,
        members: [...teamToJoin.members, newMember],
        currentMembers: teamToJoin.currentMembers + 1,
        isOwner: false
      };
      
      set(state => ({
        userTeams: [updatedTeam, ...state.userTeams.filter(t => t.id !== teamToJoin.id)],
        availableTeams: state.availableTeams.filter(t => t.id !== teamToJoin.id),
        isLoading: false
      }));
      
    } catch (error) {
      get().setLoading(false);
      throw error;
    }
  },
  
  cancelJoinRequest: async (teamId) => {
    get().setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    set(state => ({
      sentRequests: state.sentRequests.filter(id => id !== teamId),
      isLoading: false
    }));
  },
  
  acceptJoinRequest: async (requestId) => {
    get().setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const request = get().joinRequests.find(req => req.id === requestId);
    if (!request) {
      get().setLoading(false);
      return;
    }
    
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
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const request = get().joinRequests.find(req => req.id === requestId);
    if (!request) {
      get().setLoading(false);
      return;
    }
    
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
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    set(state => ({
      userTeams: state.userTeams.filter(team => 
        team.id !== teamId || team.isOwner
      ),
      isLoading: false
    }));
  },
  
  updateTeam: async (teamId, updates) => {
    get().setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
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
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const { availableTeams, userTeams } = get();
    const allTeams = [...availableTeams, ...userTeams];
    const team = allTeams.find(team => team.inviteCode === inviteCode);
    
    get().setLoading(false);
    return team || null;
  },
  
  calculateSkillMatch: (userSkills, teamSkills) => {
    if (!userSkills.length || !teamSkills.length) return 0;
    
    const normalizedUserSkills = userSkills.map(skill => skill.toLowerCase());
    const normalizedTeamSkills = teamSkills.map(skill => skill.toLowerCase());
    
    // Calculate different types of matches
    const exactMatches = normalizedUserSkills.filter(skill => 
      normalizedTeamSkills.includes(skill)
    ).length;
    
    const partialMatches = normalizedUserSkills.filter(userSkill =>
      normalizedTeamSkills.some(teamSkill => 
        teamSkill.includes(userSkill) || userSkill.includes(teamSkill)
      )
    ).length;
    
    // Weight exact matches more heavily
    const matchScore = (exactMatches * 2 + partialMatches) / (teamSkills.length * 2);
    
    // Cap at 90% and ensure reasonable distribution
    const percentage = Math.min(Math.round(matchScore * 100), 90);
    
    // Add some randomization to prevent all teams having same score
    const variation = Math.floor(Math.random() * 10) - 5; // -5 to +5
    return Math.max(0, Math.min(90, percentage + variation));
  }
}));

// Initialize skill match percentages for available teams
setTimeout(() => {
  const store = useTeamStore.getState();
  const updatedTeams = store.availableTeams.map(team => ({
    ...team,
    skillMatchPercentage: store.calculateSkillMatch(currentUserSkills, team.requiredSkills)
  }));
  
  useTeamStore.setState({ availableTeams: updatedTeams });
}, 100);
