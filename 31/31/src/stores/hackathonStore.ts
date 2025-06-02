import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface HackathonStore {
  savedHackathons: string[];
  isLoading: boolean;
  saveHackathon: (hackathonId: string) => void;
  unsaveHackathon: (hackathonId: string) => void;
  isHackathonSaved: (hackathonId: string) => boolean;
}

export const useHackathonStore = create<HackathonStore>()(
  persist(
    (set, get) => ({
      savedHackathons: [],
      isLoading: false,

      saveHackathon: (hackathonId: string) => {
        set((state) => ({
          savedHackathons: [...state.savedHackathons, hackathonId]
        }));
      },

      unsaveHackathon: (hackathonId: string) => {
        set((state) => ({
          savedHackathons: state.savedHackathons.filter(id => id !== hackathonId)
        }));
      },

      isHackathonSaved: (hackathonId: string) => {
        return get().savedHackathons.includes(hackathonId);
      }
    }),
    {
      name: 'hackathon-storage',
    }
  )
); 