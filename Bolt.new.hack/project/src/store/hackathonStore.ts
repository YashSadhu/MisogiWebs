import { create } from 'zustand';
import { Hackathon } from '../types';

interface HackathonState {
  hackathons: Hackathon[];
  isLoading: boolean;
  error: string | null;
  fetchHackathons: () => Promise<void>;
  registerForHackathon: (hackathonId: string, userId: string) => Promise<void>;
}

export const useHackathonStore = create<HackathonState>((set) => ({
  hackathons: [],
  isLoading: false,
  error: null,

  fetchHackathons: async () => {
    set({ isLoading: true, error: null });
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll use mock data
      const mockHackathons: Hackathon[] = [
        {
          id: '1',
          title: 'Global AI Hackathon',
          theme: 'Artificial Intelligence for Social Good',
          startDate: '2025-06-15',
          endDate: '2025-06-17',
          registrationDeadline: '2025-06-10',
          prizes: ['$10,000 First Prize', '$5,000 Second Prize', '$2,500 Third Prize'],
          tags: ['AI', 'Machine Learning', 'Social Impact'],
          maxTeamSize: 4,
          description: 'Join us for a weekend of innovation and problem-solving using AI technologies to address pressing social challenges.',
          imageUrl: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        },
        {
          id: '2',
          title: 'Blockchain Revolution',
          theme: 'Decentralized Applications',
          startDate: '2025-07-20',
          endDate: '2025-07-22',
          registrationDeadline: '2025-07-15',
          prizes: ['$15,000 First Prize', '$7,500 Second Prize', '$3,000 Third Prize'],
          tags: ['Blockchain', 'Web3', 'DeFi'],
          maxTeamSize: 5,
          description: 'Build the next generation of decentralized applications that will shape the future of finance, governance, and digital ownership.',
          imageUrl: 'https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        },
        {
          id: '3',
          title: 'Climate Tech Challenge',
          theme: 'Technology Solutions for Climate Change',
          startDate: '2025-08-10',
          endDate: '2025-08-12',
          registrationDeadline: '2025-08-05',
          prizes: ['$12,000 First Prize', '$6,000 Second Prize', '$3,000 Third Prize'],
          tags: ['CleanTech', 'Sustainability', 'IoT'],
          maxTeamSize: 4,
          description: 'Develop innovative technological solutions to address climate change challenges and promote sustainability.',
          imageUrl: 'https://images.pexels.com/photos/2559941/pexels-photo-2559941.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        }
      ];
      
      set({ hackathons: mockHackathons, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch hackathons', isLoading: false });
    }
  },

  registerForHackathon: async (hackathonId, userId) => {
    set({ isLoading: true, error: null });
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate a successful registration
      console.log(`User ${userId} registered for hackathon ${hackathonId}`);
      set({ isLoading: false });
    } catch (error) {
      set({ error: 'Failed to register for hackathon', isLoading: false });
    }
  }
}));