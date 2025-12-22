import { create } from 'zustand';

// Import assets using Vite's ?url suffix to get the correct path during development/build
import defaultPerson from '@assets/person_0_1766404645511.glb?url';
import defaultObject from '@assets/object_0_1766404645511.glb?url';

interface AppState {
  avatarUrl: string | null;
  wearableUrl: string | null;
  rotationVelocity: number;
  
  setAvatarUrl: (url: string | null) => void;
  setWearableUrl: (url: string | null) => void;
  setRotationVelocity: (velocity: number) => void;
}

export const useStore = create<AppState>((set) => ({
  avatarUrl: defaultPerson,
  wearableUrl: defaultObject,
  rotationVelocity: 0,
  
  setAvatarUrl: (url) => set({ avatarUrl: url }),
  setWearableUrl: (url) => set({ wearableUrl: url }),
  setRotationVelocity: (velocity) => set({ rotationVelocity: velocity }),
}));
