import { create } from 'zustand';

// Import default assets
import defaultPerson from '@assets/person_0_1766404645511.glb?url';
import defaultObject from '@assets/object_0_1766404645511.glb?url';

interface AppState {
  avatarUrl: string | null;
  wearableUrl: string | null;
  rotationVelocity: number;
  hasUploadedAvatar: boolean;
  hasUploadedWearable: boolean;
  
  setAvatarUrl: (url: string | null, isUpload?: boolean) => void;
  setWearableUrl: (url: string | null, isUpload?: boolean) => void;
  setRotationVelocity: (velocity: number) => void;
}

export const useStore = create<AppState>((set) => ({
  avatarUrl: defaultPerson,
  wearableUrl: defaultObject,
  rotationVelocity: 0,
  hasUploadedAvatar: false,
  hasUploadedWearable: false,
  
  setAvatarUrl: (url, isUpload = false) => set({ 
    avatarUrl: url, 
    hasUploadedAvatar: isUpload 
  }),
  setWearableUrl: (url, isUpload = false) => set({ 
    wearableUrl: url, 
    hasUploadedWearable: isUpload 
  }),
  setRotationVelocity: (velocity) => set({ rotationVelocity: velocity }),
}));
