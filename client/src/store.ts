import { create } from 'zustand';

interface AppState {
  avatarUrl: string | null;
  wearableUrl: string | null;
  rotationVelocity: number;
  
  setAvatarUrl: (url: string | null) => void;
  setWearableUrl: (url: string | null) => void;
  setRotationVelocity: (velocity: number) => void;
}

// Initial state with absolute paths from the root to ensure they are found by Vite
export const useStore = create<AppState>((set) => ({
  avatarUrl: '/attached_assets/person_0_1766404645511.glb',
  wearableUrl: '/attached_assets/object_0_1766404645511.glb',
  rotationVelocity: 0,
  
  setAvatarUrl: (url) => set({ avatarUrl: url }),
  setWearableUrl: (url) => set({ wearableUrl: url }),
  setRotationVelocity: (velocity) => set({ rotationVelocity: velocity }),
}));
