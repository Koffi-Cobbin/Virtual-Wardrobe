import { create } from 'zustand';

// Import default assets
import defaultPerson from '/assets/avatars/default_avatar.glb?url';

interface Position {
  x: number;
  y: number;
  z: number;
}

interface Rotation {
  x: number;
  y: number;
  z: number;
}

export interface LoadedWearable {
  id: string;
  url: string;
  name: string;
  position: Position;
  rotation: Rotation;
  isVisible: boolean;
}

interface AppState {
  avatarUrl: string | null;
  loadedWearables: Map<string, LoadedWearable>;
  rotationVelocity: number;
  hasUploadedAvatar: boolean;
  shouldResetCamera: boolean;
  shouldMerge: boolean;
  isMerged: boolean;
  isDragging: boolean;
  selectedObjectId: string | null;
  mergedWearableIds: string[];
  
  setAvatarUrl: (url: string | null, isUpload?: boolean) => void;
  addWearable: (id: string, url: string, name: string) => void;
  removeWearable: (id: string) => void;
  updateWearablePosition: (id: string, position: Position) => void;
  updateWearableRotation: (id: string, rotation: Rotation) => void;
  toggleWearableVisibility: (id: string) => void;
  resetWearableTransform: (id: string) => void;
  setRotationVelocity: (velocity: number) => void;
  resetCamera: () => void;
  setShouldMerge: (value: boolean) => void;
  setIsMerged: (value: boolean) => void;
  setIsDragging: (value: boolean) => void;
  setSelectedObjectId: (id: string | null) => void;
  unmerge: () => void;
  clearAllWearables: () => void;
  getLoadedWearable: (id: string) => LoadedWearable | undefined;
}

export const useStore = create<AppState>((set, get) => ({
  avatarUrl: defaultPerson,
  loadedWearables: new Map(),
  rotationVelocity: 0,
  hasUploadedAvatar: false,
  shouldResetCamera: false,
  shouldMerge: false,
  isMerged: false,
  isDragging: false,
  selectedObjectId: null,
  mergedWearableIds: [],
  
  setAvatarUrl: (url, isUpload = false) => set({ 
    avatarUrl: url, 
    hasUploadedAvatar: isUpload 
  }),
  
  addWearable: (id, url, name) => set((state) => {
    const newWearables = new Map(state.loadedWearables);
    newWearables.set(id, {
      id,
      url,
      name,
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      isVisible: true,
    });
    return { 
      loadedWearables: newWearables,
      selectedObjectId: id
    };
  }),
  
  removeWearable: (id) => set((state) => {
    const newWearables = new Map(state.loadedWearables);
    newWearables.delete(id);
    return { 
      loadedWearables: newWearables,
      selectedObjectId: state.selectedObjectId === id ? null : state.selectedObjectId,
      isMerged: false,
      mergedWearableIds: state.mergedWearableIds.filter(wid => wid !== id)
    };
  }),
  
  updateWearablePosition: (id, position) => set((state) => {
    const wearable = state.loadedWearables.get(id);
    if (!wearable) return state;
    
    const newWearables = new Map(state.loadedWearables);
    newWearables.set(id, { ...wearable, position });
    return { loadedWearables: newWearables };
  }),
  
  updateWearableRotation: (id, rotation) => set((state) => {
    const wearable = state.loadedWearables.get(id);
    if (!wearable) return state;
    
    const newWearables = new Map(state.loadedWearables);
    newWearables.set(id, { ...wearable, rotation });
    return { loadedWearables: newWearables };
  }),
  
  toggleWearableVisibility: (id) => set((state) => {
    const wearable = state.loadedWearables.get(id);
    if (!wearable) return state;
    
    const newWearables = new Map(state.loadedWearables);
    newWearables.set(id, { ...wearable, isVisible: !wearable.isVisible });
    return { loadedWearables: newWearables };
  }),
  
  resetWearableTransform: (id) => set((state) => {
    const wearable = state.loadedWearables.get(id);
    if (!wearable) return state;
    
    const newWearables = new Map(state.loadedWearables);
    newWearables.set(id, { 
      ...wearable, 
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 }
    });
    return { loadedWearables: newWearables };
  }),
  
  setRotationVelocity: (velocity) => set({ rotationVelocity: velocity }),
  
  resetCamera: () => {
    set({ shouldResetCamera: true });
    setTimeout(() => set({ shouldResetCamera: false }), 100);
  },
  
  setShouldMerge: (value) => set({ shouldMerge: value }),
  setIsMerged: (value) => set({ isMerged: value }),
  setIsDragging: (value) => set({ isDragging: value }),
  setSelectedObjectId: (id) => set({ selectedObjectId: id }),
  
  unmerge: () => set({ 
    isMerged: false,
    mergedWearableIds: []
  }),
  
  clearAllWearables: () => set({ 
    loadedWearables: new Map(),
    selectedObjectId: null,
    isMerged: false,
    mergedWearableIds: []
  }),
  
  getLoadedWearable: (id) => get().loadedWearables.get(id),
}));