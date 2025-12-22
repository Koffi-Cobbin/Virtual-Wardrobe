import { create } from 'zustand';

interface AppState {
  avatarUrl: string | null;
  wearableUrl: string | null;
  rotationVelocity: number;
  
  setAvatarUrl: (url: string) => void;
  setWearableUrl: (url: string) => void;
  setRotationVelocity: (velocity: number) => void;
}

export const useStore = create<AppState>((set) => ({
  avatarUrl: null,
  wearableUrl: null,
  rotationVelocity: 0,
  
  setAvatarUrl: (url) => set({ avatarUrl: url }),
  setWearableUrl: (url) => set({ wearableUrl: url }),
  setRotationVelocity: (velocity) => set({ rotationVelocity: velocity }),
}));
