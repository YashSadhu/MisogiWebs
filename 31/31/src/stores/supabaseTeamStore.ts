import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';

interface Team {
  id: string;
  name: string;
  description?: string;
  hackathon_id: string;
  leader_id: string;
  invite_code?: string;
  tech_stack?: string[];
  looking_for_skills?: string[];
  max_members: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  hackathon?: {
    title: string;
    start_date: string;
    end_date: string;
  };
  leader?: {
    username: string;
    full_name?: string;
    avatar_url?: string;
  };
  members?: TeamMember[];
  member_count?: number;
  is_member?: boolean;
  is_leader?: boolean;
  has_pending_request?: boolean;
}

interface TeamMember {
  id: string;
  user_id: string;
  team_id: string;
  role: 'leader' | 'member';
  joined_at: string;
  user?: {
    username: string;
    full_name?: string;
    avatar_url?: string;
    skills?: string[];
  };
}

interface JoinRequest {
  id: string;
  team_id: string;
  user_id: string;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  user?: {
    username: string;
    full_name?: string;
    avatar_url?: string;
    skills?: string[];
  };
}

interface SupabaseTeamStore {
  teams: Team[];
  userTeams: Team[];
  joinRequests: JoinRequest[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchUserTeams: () => Promise<void>;
  fetchAvailableTeams: (hackathonId?: string) => Promise<void>;
  createTeam: (teamData: Partial<Team>) => Promise<Team | null>;
  joinTeamWithCode: (inviteCode: string) => Promise<boolean>;
  requestToJoinTeam: (teamId: string, message?: string) => Promise<boolean>;
  acceptJoinRequest: (requestId: string) => Promise<boolean>;
  rejectJoinRequest: (requestId: string) => Promise<boolean>;
  leaveTeam: (teamId: string) => Promise<boolean>;
  updateTeam: (teamId: string, updates: Partial<Team>) => Promise<boolean>;
  fetchTeamJoinRequests: (teamId: string) => Promise<void>;
  generateNewInviteCode: (teamId: string) => Promise<string | null>;
}

export const useSupabaseTeamStore = create<SupabaseTeamStore>((set, get) => ({
  teams: [],
  userTeams: [],
  joinRequests: [],
  isLoading: false,
  error: null,

  fetchUserTeams: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // First get the team IDs where user is a member
      const { data: memberTeams, error: memberError } = await supabase
        .from('team_members')
        .select('team_id')
        .eq('user_id', user.id);

      if (memberError) throw memberError;

      const teamIds = memberTeams?.map(mt => mt.team_id) || [];

      // Get teams where user is a member
      const { data: userTeamsData, error: teamsError } = await supabase
        .from('teams')
        .select(`
          *,
          hackathons!teams_hackathon_id_fkey(title, start_date, end_date),
          leader:profiles!teams_leader_id_fkey(username, full_name, avatar_url)
        `)
        .in('id', teamIds)
        .eq('is_active', true);

      if (teamsError) throw teamsError;

      // Get team members separately
      const { data: membersData } = await supabase
        .from('team_members')
        .select(`
          id,
          user_id,
          team_id,
          role,
          joined_at,
          user:profiles!team_members_user_id_fkey(username, full_name, avatar_url, skills)
        `)
        .in('team_id', teamIds);

      // Transform data with correct typing
      const transformedTeams = userTeamsData?.map(team => {
        // Handle leader data
        let leader: { username: string; full_name?: string; avatar_url?: string };
        if (Array.isArray(team.leader)) {
          leader = team.leader[0] || { username: 'Unknown' };
        } else {
          leader = team.leader || { username: 'Unknown' };
        }

        // Handle members data
        const members = membersData?.filter(member => member.team_id === team.id).map(member => {
          let user: { username: string; full_name?: string; avatar_url?: string; skills?: string[] };
          const memberUser = member.user as unknown as { username: string; full_name?: string; avatar_url?: string; skills?: string[] } | null;
          if (memberUser && typeof memberUser === 'object' && !('error' in memberUser)) {
            if (Array.isArray(memberUser)) {
              user = memberUser[0] || { username: 'Unknown' };
            } else {
              user = memberUser;
            }
          } else {
            user = { username: 'Unknown' };
          }

          return {
            id: member.id,
            user_id: member.user_id,
            team_id: member.team_id,
            role: member.role as 'leader' | 'member',
            joined_at: member.joined_at,
            user
          };
        }) || [];

        return {
          ...team,
          hackathon: team.hackathons,
          leader,
          members,
          member_count: members.length,
          is_member: true,
          is_leader: team.leader_id === user.id
        };
      }) || [];

      set({ userTeams: transformedTeams, isLoading: false });
    } catch (error: any) {
      console.error('Error in fetchUserTeams:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  fetchAvailableTeams: async (hackathonId?: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      let query = supabase
        .from('teams')
        .select(`
          *,
          hackathons!teams_hackathon_id_fkey(title, start_date, end_date),
          leader:profiles!teams_leader_id_fkey(username, full_name, avatar_url)
        `)
        .eq('is_active', true)
        .neq('leader_id', user.id);

      if (hackathonId) {
        query = query.eq('hackathon_id', hackathonId);
      }

      const { data: teamsData, error: teamsError } = await query;
      if (teamsError) throw teamsError;

      // Get team members separately
      const teamIds = teamsData?.map(team => team.id) || [];
      const { data: membersData } = await supabase
        .from('team_members')
        .select(`
          id,
          user_id,
          team_id,
          role,
          joined_at,
          user:profiles!team_members_user_id_fkey(username, full_name, avatar_url, skills)
        `)
        .in('team_id', teamIds);

      // Get join requests
      const { data: requestsData } = await supabase
        .from('team_join_requests')
        .select('team_id, user_id, status')
        .in('team_id', teamIds)
        .eq('user_id', user.id);

      // Transform data with correct typing
      const transformedTeams = teamsData?.map(team => {
        // Handle leader data
        let leader: { username: string; full_name?: string; avatar_url?: string };
        if (Array.isArray(team.leader)) {
          leader = team.leader[0] || { username: 'Unknown' };
        } else {
          leader = team.leader || { username: 'Unknown' };
        }

        // Handle members data
        const members = membersData?.filter(member => member.team_id === team.id).map(member => {
          let user: { username: string; full_name?: string; avatar_url?: string; skills?: string[] };
          const memberUser = member.user as unknown as { username: string; full_name?: string; avatar_url?: string; skills?: string[] } | null;
          if (memberUser && typeof memberUser === 'object' && !('error' in memberUser)) {
            if (Array.isArray(memberUser)) {
              user = memberUser[0] || { username: 'Unknown' };
            } else {
              user = memberUser;
            }
          } else {
            user = { username: 'Unknown' };
          }

          return {
            id: member.id,
            user_id: member.user_id,
            team_id: member.team_id,
            role: member.role as 'leader' | 'member',
            joined_at: member.joined_at,
            user
          };
        }) || [];

        return {
          ...team,
          hackathon: team.hackathons,
          leader,
          members,
          member_count: members.length,
          is_member: members.some(member => member.user_id === user.id),
          is_leader: false,
          has_pending_request: requestsData?.some(
            req => req.team_id === team.id && req.status === 'pending'
          )
        };
      }) || [];

      set({ teams: transformedTeams, isLoading: false });
    } catch (error: any) {
      console.error('Error in fetchAvailableTeams:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  createTeam: async (teamData: Partial<Team>) => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Check if user has a profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (profileError || !profile) {
        throw new Error('Please complete your profile before creating a team');
      }

      // Generate a simple invite code if RPC fails
      let inviteCode;
      try {
        const { data: generatedCode, error: codeError } = await supabase.rpc('generate_invite_code');
        if (codeError) throw codeError;
        inviteCode = generatedCode;
      } catch (error) {
        // Fallback to a simple random code
        inviteCode = `TEAM${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      }

      // Only include the fields that exist in the database table
      const teamToInsert = {
        name: teamData.name!,
        description: teamData.description,
        hackathon_id: teamData.hackathon_id,
        tech_stack: teamData.tech_stack,
        looking_for_skills: teamData.looking_for_skills,
        max_members: teamData.max_members || 4,
        leader_id: user.id,
        invite_code: inviteCode,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Insert the team with better error handling
      const { data: newTeam, error: teamError } = await supabase
        .from('teams')
        .insert(teamToInsert)
        .select()
        .single();

      if (teamError) {
        console.error('Team creation error:', teamError);
        throw new Error(`Failed to create team: ${teamError.message}`);
      }

      if (!newTeam || !newTeam.id) {
        throw new Error('Team was created but no ID was returned');
      }

      // Add creator as team member with leader role
      const { error: memberError } = await supabase
        .from('team_members')
        .insert({
          team_id: newTeam.id,
          user_id: user.id,
          role: 'leader',
          joined_at: new Date().toISOString()
        });

      if (memberError) {
        console.error('Team member creation error:', memberError);
        throw new Error(`Failed to add you as team leader: ${memberError.message}`);
      }

      // Create a complete team object with the necessary properties
      const completeTeam: Team = {
        ...newTeam,
        is_member: true,
        is_leader: true,
        member_count: 1,
        members: [{
          id: 'temp-id',
          user_id: user.id,
          team_id: newTeam.id,
          role: 'leader',
          joined_at: new Date().toISOString(),
          user: {
            username: user.email?.split('@')[0] || user.id,
            full_name: user.user_metadata?.full_name,
            avatar_url: user.user_metadata?.avatar_url
          }
        }]
      };

      // Update the store with the new team
      set(state => ({
        userTeams: [...state.userTeams, completeTeam],
        isLoading: false
      }));
      
      // Also refresh user teams in the background to get the latest data
      setTimeout(() => {
        get().fetchUserTeams();
      }, 500);
      
      return completeTeam;
    } catch (error: any) {
      console.error('Error in createTeam:', error);
      set({ error: error.message, isLoading: false });
      return null;
    }
  },

  joinTeamWithCode: async (inviteCode: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Find team by invite code
      const { data: team, error: teamError } = await supabase
        .from('teams')
        .select('id, max_members')
        .eq('invite_code', inviteCode)
        .eq('is_active', true)
        .single();

      if (teamError) throw new Error('Invalid invite code');

      // Check current member count
      const { count: memberCount, error: countError } = await supabase
        .from('team_members')
        .select('*', { count: 'exact' })
        .eq('team_id', team.id);

      if (countError) throw countError;

      // Check if team is full
      if ((memberCount || 0) >= team.max_members) {
        throw new Error('Team is full');
      }

      // Check if already a member
      const { data: existingMember } = await supabase
        .from('team_members')
        .select('id')
        .eq('team_id', team.id)
        .eq('user_id', user.id)
        .single();

      if (existingMember) {
        throw new Error('You are already a member of this team');
      }

      // Join team
      const { error: joinError } = await supabase
        .from('team_members')
        .insert({
          team_id: team.id,
          user_id: user.id,
          role: 'member'
        });

      if (joinError) throw joinError;

      // Refresh data
      await get().fetchUserTeams();
      await get().fetchAvailableTeams();
      set({ isLoading: false });
      return true;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  },

  requestToJoinTeam: async (teamId: string, message?: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('team_join_requests')
        .insert({
          team_id: teamId,
          user_id: user.id,
          message: message || null,
          status: 'pending'
        });

      if (error) throw error;

      // Refresh available teams
      await get().fetchAvailableTeams();
      set({ isLoading: false });
      return true;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  },

  acceptJoinRequest: async (requestId: string) => {
    set({ isLoading: true, error: null });
    try {
      // Get request details
      const { data: request, error: requestError } = await supabase
        .from('team_join_requests')
        .select('team_id, user_id')
        .eq('id', requestId)
        .single();

      if (requestError) throw requestError;

      // Add user to team
      const { error: memberError } = await supabase
        .from('team_members')
        .insert({
          team_id: request.team_id,
          user_id: request.user_id,
          role: 'member'
        });

      if (memberError) throw memberError;

      // Update request status
      const { error: updateError } = await supabase
        .from('team_join_requests')
        .update({ status: 'accepted' })
        .eq('id', requestId);

      if (updateError) throw updateError;

      // Refresh data
      await get().fetchTeamJoinRequests(request.team_id);
      set({ isLoading: false });
      return true;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  },

  rejectJoinRequest: async (requestId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('team_join_requests')
        .update({ status: 'rejected' })
        .eq('id', requestId);

      if (error) throw error;
      set({ isLoading: false });
      return true;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  },

  leaveTeam: async (teamId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('team_id', teamId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Refresh user teams
      await get().fetchUserTeams();
      set({ isLoading: false });
      return true;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  },

  updateTeam: async (teamId: string, updates: Partial<Team>) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('teams')
        .update(updates)
        .eq('id', teamId);

      if (error) throw error;

      // Refresh user teams
      await get().fetchUserTeams();
      set({ isLoading: false });
      return true;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  },

  fetchTeamJoinRequests: async (teamId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data: requests, error } = await supabase
        .from('team_join_requests')
        .select(`
          *,
          profiles(username, full_name, avatar_url, skills)
        `)
        .eq('team_id', teamId)
        .eq('status', 'pending');

      if (error) throw error;

      const transformedRequests = requests?.map(request => ({
        ...request,
        status: request.status as 'pending' | 'accepted' | 'rejected',
        user: request.profiles
      })) || [];

      set({ joinRequests: transformedRequests, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  generateNewInviteCode: async (teamId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.rpc('generate_invite_code');
      if (error) throw error;

      const newCode = data;
      const { error: updateError } = await supabase
        .from('teams')
        .update({ invite_code: newCode })
        .eq('id', teamId);

      if (updateError) throw updateError;

      // Refresh user teams
      await get().fetchUserTeams();
      set({ isLoading: false });
      return newCode;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return null;
    }
  }
}));
