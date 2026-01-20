import { create } from 'zustand';

// Import default assets
import defaultPerson from '@assets/person_0_1766404645511.glb?url';

interface Position {
  x: number;
  y: number;
  z: number;
}

interface AppState {
  avatarUrl: string | null;
  wearableUrl: string | null;
  rotationVelocity: number;
  hasUploadedAvatar: boolean;
  hasUploadedWearable: boolean;
  shouldResetCamera: boolean;
  wearablePosition: Position;
  shouldMerge: boolean;
  isDragging: boolean;
  selectedObjectId: string | null;
  
  setAvatarUrl: (url: string | null, isUpload?: boolean) => void;
  setWearableUrl: (url: string | null, isUpload?: boolean) => void;
  setRotationVelocity: (velocity: number) => void;
  resetCamera: () => void;
  setWearablePosition: (position: Position) => void;
  resetWearablePosition: () => void;
  setShouldMerge: (value: boolean) => void;
  setIsDragging: (value: boolean) => void;
  setSelectedObjectId: (id: string | null) => void;
}

export const useStore = create<AppState>((set) => ({
  avatarUrl: defaultPerson,
  wearableUrl: null,
  rotationVelocity: 0,
  hasUploadedAvatar: false,
  hasUploadedWearable: false,
  shouldResetCamera: false,
  wearablePosition: { x: 0, y: 0, z: 0 },
  shouldMerge: false,
  isDragging: false,
  selectedObjectId: null,
  
  setAvatarUrl: (url, isUpload = false) => set({ 
    avatarUrl: url, 
    hasUploadedAvatar: isUpload 
  }),
  setWearableUrl: (url, isUpload = false) => set({ 
    wearableUrl: url, 
    hasUploadedWearable: isUpload,
    wearablePosition: { x: 0, y: 0, z: 0 },
    selectedObjectId: null
  }),
  setRotationVelocity: (velocity) => set({ rotationVelocity: velocity }),
  resetCamera: () => {
    set({ shouldResetCamera: true });
    setTimeout(() => set({ shouldResetCamera: false }), 100);
  },
  setWearablePosition: (position) => set({ wearablePosition: position }),
  resetWearablePosition: () => set({ wearablePosition: { x: 0, y: 0, z: 0 } }),
  setShouldMerge: (value) => set({ shouldMerge: value }),
  setIsDragging: (value) => set({ isDragging: value }),
  setSelectedObjectId: (id) => set({ selectedObjectId: id }),
}));
