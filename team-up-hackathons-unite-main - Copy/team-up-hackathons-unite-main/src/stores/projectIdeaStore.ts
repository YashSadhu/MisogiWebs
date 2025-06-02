import { create } from 'zustand';
import { ProjectIdea, ProjectComment } from '@/types/teamTypes';

interface ProjectIdeaStore {
  // Data
  projectIdeas: ProjectIdea[];
  userVotes: Record<string, boolean>; // ideaId -> hasVoted
  
  // Actions
  addIdea: (idea: Omit<ProjectIdea, 'id' | 'createdAt' | 'votes' | 'comments'>) => Promise<ProjectIdea>;
  updateIdea: (ideaId: string, updates: Partial<ProjectIdea>) => Promise<ProjectIdea>;
  deleteIdea: (ideaId: string) => Promise<void>;
  voteForIdea: (ideaId: string) => Promise<void>;
  removeVote: (ideaId: string) => Promise<void>;
  addComment: (ideaId: string, comment: Omit<ProjectComment, 'id' | 'createdAt'>) => Promise<ProjectComment>;
  deleteComment: (commentId: string) => Promise<void>;
  
  // Loading state
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useProjectIdeaStore = create<ProjectIdeaStore>((set, get) => ({
  projectIdeas: [],
  userVotes: {},
  isLoading: false,
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  addIdea: async (ideaData) => {
    get().setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newIdea: ProjectIdea = {
      ...ideaData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      votes: 0,
      comments: []
    };
    
    set(state => ({
      projectIdeas: [newIdea, ...state.projectIdeas],
      isLoading: false
    }));
    
    return newIdea;
  },
  
  updateIdea: async (ideaId, updates) => {
    get().setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let updatedIdea: ProjectIdea | null = null;
    
    set(state => {
      const updatedIdeas = state.projectIdeas.map(idea => {
        if (idea.id === ideaId) {
          updatedIdea = { ...idea, ...updates };
          return updatedIdea;
        }
        return idea;
      });
      
      return {
        projectIdeas: updatedIdeas,
        isLoading: false
      };
    });
    
    return updatedIdea!;
  },
  
  deleteIdea: async (ideaId) => {
    get().setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    set(state => ({
      projectIdeas: state.projectIdeas.filter(idea => idea.id !== ideaId),
      isLoading: false
    }));
  },
  
  voteForIdea: async (ideaId) => {
    get().setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    set(state => {
      const updatedIdeas = state.projectIdeas.map(idea => {
        if (idea.id === ideaId) {
          return { ...idea, votes: idea.votes + 1 };
        }
        return idea;
      });
      
      return {
        projectIdeas: updatedIdeas,
        userVotes: { ...state.userVotes, [ideaId]: true },
        isLoading: false
      };
    });
  },
  
  removeVote: async (ideaId) => {
    get().setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    set(state => {
      const updatedIdeas = state.projectIdeas.map(idea => {
        if (idea.id === ideaId) {
          return { ...idea, votes: Math.max(0, idea.votes - 1) };
        }
        return idea;
      });
      
      const newUserVotes = { ...state.userVotes };
      delete newUserVotes[ideaId];
      
      return {
        projectIdeas: updatedIdeas,
        userVotes: newUserVotes,
        isLoading: false
      };
    });
  },
  
  addComment: async (ideaId, commentData) => {
    get().setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newComment: ProjectComment = {
      ...commentData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date()
    };
    
    set(state => {
      const updatedIdeas = state.projectIdeas.map(idea => {
        if (idea.id === ideaId) {
          return {
            ...idea,
            comments: [newComment, ...idea.comments]
          };
        }
        return idea;
      });
      
      return {
        projectIdeas: updatedIdeas,
        isLoading: false
      };
    });
    
    return newComment;
  },
  
  deleteComment: async (commentId) => {
    get().setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    set(state => {
      const updatedIdeas = state.projectIdeas.map(idea => {
        return {
          ...idea,
          comments: idea.comments.filter(comment => comment.id !== commentId)
        };
      });
      
      return {
        projectIdeas: updatedIdeas,
        isLoading: false
      };
    });
  }
}));