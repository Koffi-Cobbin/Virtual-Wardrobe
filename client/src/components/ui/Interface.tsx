import { useState, useEffect } from 'react';
import { useStore } from '@/store';
import { Shirt, User, Upload, Box, CheckCircle2, Zap, Combine, Trash2, XCircle, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import WearablePreview from './WearablePreview';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';

import defaultObject from '/assets/wearables/default_wearable.glb?url';

interface WearableItem {
  id: string;
  name: string;
  url: string;
  isDefault: boolean;
  isValid?: boolean;
  isLoaded?: boolean;
}

// Helper function to validate GLTF rig compatibility
async function validateGLTFRig(file: File): Promise<{ isValid: boolean; message: string; url?: string }> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      const blob = new Blob([reader.result as ArrayBuffer], { 
        type: 'model/gltf-binary'
      });
      
      const url = URL.createObjectURL(blob);
      const finalUrl = `${url}#.glb`;
      const loader = new GLTFLoader();
      
      loader.load(
        finalUrl,
        (gltf) => {
          try {
            // Check if model has valid geometry
            let hasGeometry = false;
            let hasSkeleton = false;
            let meshCount = 0;
            
            gltf.scene.traverse((child) => {
              if (child instanceof THREE.Mesh) {
                hasGeometry = true;
                meshCount++;
              }
              if (child instanceof THREE.SkinnedMesh) {
                hasSkeleton = true;
              }
            });
            
            if (!hasGeometry) {
              resolve({
                isValid: false,
                message: 'No valid geometry found in model'
              });
              URL.revokeObjectURL(url);
              return;
            }
            
            // Basic validation passed
            resolve({
              isValid: true,
              message: `Valid model with ${meshCount} mesh${meshCount > 1 ? 'es' : ''}${hasSkeleton ? ' (rigged)' : ''}`,
              url: finalUrl
            });
          } catch (err) {
            resolve({
              isValid: false,
              message: 'Invalid model structure'
            });
            URL.revokeObjectURL(url);
          }
        },
        undefined,
        () => {
          resolve({
            isValid: false,
            message: 'Failed to load GLB file'
          });
          URL.revokeObjectURL(url);
        }
      );
    };
    
    reader.onerror = () => {
      resolve({
        isValid: false,
        message: 'Failed to read file'
      });
    };
    
    reader.readAsArrayBuffer(file);
  });
}

export default function Interface() {
  const { 
    setAvatarUrl, 
    removeWearable,
    avatarUrl, 
    hasUploadedAvatar,
    resetCamera,
    resetWearableTransform,
    setShouldMerge,
    isMerged,
    unmerge,
    selectedObjectId,
    savedLooks,
    deleteSavedLook
  } = useStore();

  // Mock auth check - in real app would come from useAuth
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
      }
    }
  }, []);
  
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingWearable, setIsUploadingWearable] = useState(false);
  const [wearableItems, setWearableItems] = useState<WearableItem[]>([
    {
      id: 'dress1',
      name: 'Dress 1',
      url: '/assets/wearables/dress1.glb',
      isDefault: true,
      isValid: true,
      isLoaded: false
    },
    {
      id: 'dress2',
      name: 'Dress 2',
      url: '/assets/wearables/dress2.glb',
      isDefault: true,
      isValid: true,
      isLoaded: false
    },
    {
      id: 'trouser',
      name: 'Trouser',
      url: '/assets/wearables/trouser.glb',
      isDefault: true,
      isValid: true,
      isLoaded: false
    },
    {
      id: 'default',
      name: 'Default Wearable',
      url: defaultObject,
      isDefault: true,
      isValid: true,
      isLoaded: false
    }
  ]);

  // Track loaded wearables
  const loadedWearables = wearableItems.filter(item => item.isLoaded);

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);

    // Validate file extension - only accept .glb
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (extension !== 'glb') {
      toast.error("Invalid file format", {
        description: "Only .GLB files are supported"
      });
      setIsUploadingAvatar(false);
      return;
    }

    // Create blob URL with .glb extension enforced
    const reader = new FileReader();
    reader.onload = () => {
      const blob = new Blob([reader.result as ArrayBuffer], { 
        type: 'model/gltf-binary'
      });
      
      const baseUrl = URL.createObjectURL(blob);
      const finalUrl = `${baseUrl}#.glb`;
      
      setAvatarUrl(finalUrl, true);
      setIsUploadingAvatar(false);
      toast.success("Avatar updated successfully", {
        description: file.name,
        icon: <CheckCircle2 className="text-green-500" />
      });
    };

    reader.onerror = () => {
      toast.error("Failed to read file", {
        description: "Please try again with a different file"
      });
      setIsUploadingAvatar(false);
    };

    reader.readAsArrayBuffer(file);
    
    // Reset file input
    event.target.value = '';
  };

  const handleWearableUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingWearable(true);

    // Validate file extension - only accept .glb
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (extension !== 'glb') {
      toast.error("Invalid file format", {
        description: "Only .GLB files are supported"
      });
      setIsUploadingWearable(false);
      return;
    }

    // Validate the GLB file
    const validation = await validateGLTFRig(file);
    
    if (!validation.isValid) {
      toast.error("Incompatible model", {
        description: validation.message,
        icon: <XCircle className="text-red-500" />
      });
      setIsUploadingWearable(false);
      event.target.value = '';
      return;
    }

    // Add to wearable items list
    const newWearable: WearableItem = {
      id: `wearable-${Date.now()}`,
      name: file.name.replace('.glb', ''),
      url: validation.url!,
      isDefault: false,
      isValid: true,
      isLoaded: false
    };

    setWearableItems(prev => [...prev, newWearable]);
    setIsUploadingWearable(false);
    
    toast.success("Wearable uploaded successfully", {
      description: validation.message,
      icon: <CheckCircle2 className="text-green-500" />
    });
    
    // Reset file input
    event.target.value = '';
  };

  const handleLoadWearable = (item: WearableItem) => {
    // Check if already loaded
    if (item.isLoaded) {
      toast.error("Wearable already loaded", {
        description: "Remove it from scene first"
      });
      return;
    }

    // Check merge state
    if (isMerged) {
      toast.error("Cannot load while merged", {
        description: "Unmerge models first"
      });
      return;
    }

    // Mark as loaded
    setWearableItems(prev => 
      prev.map(w => w.id === item.id ? { ...w, isLoaded: true } : w)
    );

    // Add to the store's loadedWearables Map
    useStore.getState().addWearable(item.id, item.url, item.name);
    
    toast.success(`${item.name} loaded`, {
      icon: <CheckCircle2 className="text-primary" size={16} />
    });
  };

  const handleUnloadWearable = (item: WearableItem) => {
    if (!item.isLoaded) {
      toast.error("Wearable not loaded");
      return;
    }

    if (isMerged) {
      toast.error("Cannot unload while merged", {
        description: "Unmerge models first"
      });
      return;
    }

    // Mark as unloaded in local state
    setWearableItems(prev => 
      prev.map(w => w.id === item.id ? { ...w, isLoaded: false } : w)
    );

    // Call the store's removeWearable with the specific ID
    removeWearable(item.id);

    toast.success(`${item.name} removed from scene`, {
      icon: <Trash2 className="text-orange-500" size={16} />
    });
  };

  const handleDeleteWearable = (item: WearableItem) => {
    if (item.isDefault) {
      toast.error("Cannot delete default wearable");
      return;
    }

    if (item.isLoaded) {
      toast.error("Cannot delete loaded wearable", {
        description: "Unload it from scene first"
      });
      return;
    }

    // Remove from list
    setWearableItems(prev => prev.filter(w => w.id !== item.id));
    
    // Revoke blob URL to free memory
    URL.revokeObjectURL(item.url);
    
    toast.success("Wearable deleted permanently", {
      icon: <Trash2 className="text-red-500" size={16} />
    });
  };

  const handleMergeMeshes = () => {
    if (!avatarUrl) {
      toast.error("Load avatar first", {
        description: "Avatar is required for merging"
      });
      return;
    }

    if (loadedWearables.length === 0) {
      toast.error("Load at least one wearable", {
        description: "You need wearables to merge"
      });
      return;
    }

    if (isMerged) {
      toast.error("Models are already merged", {
        description: "Unmerge them first"
      });
      return;
    }

    setShouldMerge(true);
    toast.success(`Merging avatar with ${loadedWearables.length} wearable${loadedWearables.length > 1 ? 's' : ''}...`, {
      icon: <Combine className="text-primary" size={16} />
    });
  };

  const handleUnmergeMeshes = () => {
    if (!isMerged) {
      toast.error("Models are not merged");
      return;
    }
    unmerge();
    toast.success("Models separated successfully", {
      icon: <Zap className="text-primary" size={16} />
    });
  };

  const handleUnloadAll = () => {
    if (isMerged) {
      toast.error("Cannot unload while merged", {
        description: "Unmerge models first"
      });
      return;
    }

    if (loadedWearables.length === 0) {
      toast.error("No wearables loaded");
      return;
    }

    // Unload all
    setWearableItems(prev => 
      prev.map(w => ({ ...w, isLoaded: false }))
    );

    useStore.getState().clearAllWearables();

    toast.success(`Unloaded ${loadedWearables.length} wearable${loadedWearables.length > 1 ? 's' : ''}`, {
      icon: <Trash2 className="text-orange-500" size={16} />
    });
  };

  const [avatarItems, setAvatarItems] = useState([
    { id: 'male', name: 'Male Avatar', url: '/assets/avatars/default_avatar.glb' },
    { id: 'female', name: 'Female Avatar', url: '/assets/avatars/female_avatar_1.glb' }
  ]);

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6">
      
      {/* Header / Nav */}
      <div className="flex justify-between items-start pointer-events-auto gap-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline" className="rounded-full w-14 h-14 bg-black/80 backdrop-blur-2xl border-white/10 hover:bg-primary hover:text-primary-foreground transition-all duration-500 shadow-2xl group active:scale-95">
              <Shirt className="w-7 h-7 group-hover:scale-110 transition-transform" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[320px] sm:w-[420px] border-r border-white/10 bg-black/95 backdrop-blur-3xl text-white p-0">
            <div className="h-full flex flex-col">
              <SheetHeader className="p-8 pb-4 text-left">
                <SheetTitle className="text-3xl font-bold text-white tracking-tight">
                  {user ? (
                    <>Welcome back, <span style={{ color: '#FFAD33' }}>{user.username}</span></>
                  ) : (
                    <>Drape<span style={{ color: '#FFAD33' }}>Room</span></>
                  )}
                </SheetTitle>
                <p className="text-gray-500 text-[10px] font-mono tracking-[0.3em] uppercase">
                  {user ? "Your personal fitting room" : "Your style. Your fits. Your space."}
                </p>
              </SheetHeader>
              
              <ScrollArea className="flex-1 px-8">
                <div className="space-y-10 py-4">
                  {/* Avatar Section */}
                  <section className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-primary">
                        <User size={20} className="animate-pulse" />
                        <h3 className="font-display text-lg font-bold uppercase tracking-widest">Mirror view</h3>
                      </div>
                      {hasUploadedAvatar && !isUploadingAvatar && <CheckCircle2 size={16} className="text-green-500" />}
                    </div>
                    
                    {user ? (
                      <div className="group relative">
                        <Label 
                          htmlFor="avatar-upload" 
                          className={`flex flex-col items-center justify-center gap-4 h-36 border-2 border-dashed rounded-2xl transition-all cursor-pointer ${isUploadingAvatar ? 'border-primary bg-primary/10 animate-pulse' : 'border-white/10 hover:border-primary/50 hover:bg-white/5'}`}
                        >
                          <Upload size={32} className={`${isUploadingAvatar ? 'text-primary' : 'text-gray-500'} transition-colors`} />
                          <div className="text-center">
                            <span className="text-sm font-bold block">{isUploadingAvatar ? 'PROCESSING...' : 'UPLOAD AVATAR'}</span>
                            <span className="text-[10px] text-gray-500 font-mono">.GLB ONLY</span>
                          </div>
                          <Input 
                            id="avatar-upload" 
                            type="file" 
                            accept=".glb" 
                            className="hidden" 
                            onChange={handleAvatarUpload}
                            disabled={isUploadingAvatar}
                          />
                        </Label>
                      </div>
                    ) : (
                      <div className="p-6 rounded-2xl border border-dashed border-white/10 bg-white/5 flex flex-col items-center text-center gap-3">
                        <User size={32} className="text-gray-500 opacity-50" />
                        <div className="space-y-1">
                          <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Restricted Access</p>
                          <p className="text-[10px] text-gray-500 font-mono leading-relaxed">
                            PLEASE <a href="/auth" className="text-primary hover:underline">LOGIN</a> OR <a href="/auth" className="text-primary hover:underline">SIGNUP</a> TO UPLOAD CUSTOM MODELS
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Avatar Preview Grid */}
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      {avatarItems.map((item) => (
                        <div 
                          key={item.id}
                          className="relative cursor-pointer group/avatar"
                          onClick={() => setAvatarUrl(item.url, false)}
                        >
                          <WearablePreview 
                            url={item.url}
                            isSelected={avatarUrl === item.url}
                          />
                          <div className="mt-2 text-center">
                            <div className="font-mono font-bold uppercase tracking-wider text-[10px] text-primary truncate">
                              {item.name}
                            </div>
                            {avatarUrl === item.url && (
                              <div className="text-[8px] text-primary font-mono flex items-center justify-center gap-1 mt-1">
                                <CheckCircle2 size={8} />
                                <span>ACTIVE</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {hasUploadedAvatar && avatarUrl && !avatarItems.some(a => a.url === avatarUrl) && (
                      <div className="mt-4">
                        <div className="text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-2">
                          Current Uploaded Avatar
                        </div>
                        <div className="relative cursor-default group/avatar">
                          <WearablePreview 
                            url={avatarUrl}
                            isSelected={true}
                          />
                          <div className="mt-2 flex items-center justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="font-mono font-bold uppercase tracking-wider text-xs text-primary truncate">
                                Custom Avatar
                              </div>
                              <div className="text-[10px] text-gray-400 font-mono flex items-center gap-1.5 flex-wrap">
                                <CheckCircle2 size={10} className="text-primary" />
                                <span>ACTIVE AVATAR</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </section>

                  <Separator className="bg-white/5" />

                  {/* Saved Looks Section */}
                  <section className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-primary">
                        <CheckCircle2 size={20} className="animate-pulse" />
                        <h3 className="font-display text-lg font-bold uppercase tracking-widest">Saved looks</h3>
                      </div>
                      <div className="text-[10px] font-mono text-gray-500">
                        {savedLooks.length} SAVED
                      </div>
                    </div>

                    <ScrollArea className="h-[250px] pr-4">
                      {savedLooks.length === 0 ? (
                        <div className="p-8 border border-dashed border-white/5 rounded-2xl text-center">
                          <p className="text-[10px] font-mono text-gray-600 uppercase">No looks saved yet</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-4">
                          {savedLooks.map((look) => (
                            <div key={look.id} className="group/look relative">
                              <div 
                                className="cursor-pointer"
                                onClick={() => setAvatarUrl(look.url, true)}
                              >
                                <WearablePreview 
                                  url={look.url}
                                  isSelected={avatarUrl === look.url}
                                />
                                <div className="mt-2 text-center">
                                  <div className="font-mono font-bold uppercase tracking-wider text-[10px] text-primary truncate">
                                    {look.name}
                                  </div>
                                </div>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteSavedLook(look.id);
                                }}
                                className="absolute top-1 right-1 p-1 bg-black/60 rounded-md opacity-0 group-hover/look:opacity-100 transition-opacity hover:text-red-500"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </ScrollArea>
                  </section>

                  <Separator className="bg-white/5" />

                  {/* Wearables Section */}
                  <section className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-primary">
                        <Box size={20} className="animate-pulse" />
                        <h3 className="font-display text-lg font-bold uppercase tracking-widest">Add to room</h3>
                      </div>
                      <div className="text-[10px] font-mono text-gray-500 space-x-2">
                        <span className="text-primary">{loadedWearables.length} LOADED</span>
                        <span>/</span>
                        <span>{wearableItems.length} TOTAL</span>
                      </div>
                    </div>

                    {user ? (
                      <div className="group relative">
                        <Label 
                          htmlFor="wearable-upload" 
                          className={`flex flex-col items-center justify-center gap-4 h-32 border-2 border-dashed rounded-2xl transition-all cursor-pointer ${isUploadingWearable ? 'border-primary bg-primary/10 animate-pulse' : 'border-white/10 hover:border-primary/50 hover:bg-white/5'}`}
                        >
                          <Upload size={28} className={`${isUploadingWearable ? 'text-primary' : 'text-gray-500'} transition-colors`} />
                          <div className="text-center">
                            <span className="text-sm font-bold block">{isUploadingWearable ? 'VALIDATING...' : 'Switch outfits'}</span>
                            <span className="text-[10px] text-gray-500 font-mono">.GLB ONLY</span>
                          </div>
                          <Input 
                            id="wearable-upload" 
                            type="file" 
                            accept=".glb" 
                            className="hidden" 
                            onChange={handleWearableUpload}
                            disabled={isUploadingWearable}
                          />
                        </Label>
                      </div>
                    ) : (
                      <div className="p-6 rounded-2xl border border-dashed border-white/10 bg-white/5 flex flex-col items-center text-center gap-3">
                        <Box size={28} className="text-gray-500 opacity-50" />
                        <div className="space-y-1">
                          <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Restricted Access</p>
                          <p className="text-[10px] text-gray-500 font-mono leading-relaxed">
                            LOGIN TO EXPAND YOUR WARDROBE WITH CUSTOM ASSETS
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Wearables List */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-gray-500">
                        <span>Try another room</span>
                        {wearableItems.length > 1 && (
                          <span className="text-primary">{wearableItems.length - 1} Custom</span>
                        )}
                      </div>
                      
                      <ScrollArea className="h-[400px] pr-4">
                        <div className="grid grid-cols-2 gap-4">
                          {wearableItems.map((item) => (
                            <div
                              key={item.id}
                              className="group/item relative"
                            >
                              <div
                                className="w-full text-left transition-all"
                              >
                                <div 
                                  className="relative cursor-pointer"
                                  onClick={() => {
                                    if (!isMerged) {
                                      item.isLoaded ? handleUnloadWearable(item) : handleLoadWearable(item);
                                    }
                                  }}
                                >
                                  <WearablePreview 
                                    url={item.url}
                                    isSelected={!!item.isLoaded}
                                  />
                                  
                                  {/* Menu Button */}
                                  <div className="absolute top-2 right-2 z-10">
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <button
                                          className="p-1.5 rounded-md bg-black/60 backdrop-blur-sm border border-white/10 hover:bg-black/80 hover:border-primary/50 transition-all pointer-events-auto"
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          <MoreVertical size={14} className="text-white" />
                                        </button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end" className="w-48 bg-black/95 backdrop-blur-xl border-white/10">
                                        {/* Load/Unload */}
                                        <DropdownMenuItem
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            item.isLoaded ? handleUnloadWearable(item) : handleLoadWearable(item);
                                          }}
                                          disabled={isMerged}
                                          className="text-primary hover:text-primary hover:bg-primary/10 cursor-pointer disabled:opacity-50"
                                        >
                                          {item.isLoaded ? (
                                            <>
                                              <Trash2 size={14} className="mr-2" />
                                              Unload from Scene
                                            </>
                                          ) : (
                                            <>
                                              <CheckCircle2 size={14} className="mr-2" />
                                              Load to Scene
                                            </>
                                          )}
                                        </DropdownMenuItem>
                                        
                                        <DropdownMenuSeparator className="bg-white/10" />
                                        
                                        {/* Delete */}
                                        <DropdownMenuItem
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteWearable(item);
                                          }}
                                          disabled={item.isDefault || item.isLoaded}
                                          className="text-red-500 hover:text-red-400 hover:bg-red-500/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                          <Trash2 size={14} className="mr-2" />
                                          {item.isDefault ? 'Cannot Delete Default' : item.isLoaded ? 'Unload First' : 'Delete Permanently'}
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                </div>
                                
                                <div className="mt-2 text-center">
                                  <div className="font-mono font-bold uppercase tracking-wider text-[10px] text-white truncate">
                                    {item.name}
                                  </div>
                                  <div className="flex items-center justify-center gap-1.5 mt-1">
                                    {item.isLoaded ? (
                                      <div className="flex items-center gap-1 text-[8px] text-primary font-mono">
                                        <CheckCircle2 size={8} />
                                        <span>LOADED</span>
                                      </div>
                                    ) : (
                                      <div className="flex items-center gap-1 text-[8px] text-gray-500 font-mono">
                                        <Box size={8} />
                                        <span>READY</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </section>

                  <Separator className="bg-white/5" />

                  {/* Controls Section */}
                  <section className="space-y-3">
                    <h3 className="font-display text-sm font-bold uppercase tracking-widest text-primary">Controls</h3>
                    
                    <Button 
                      onClick={() => {
                        if (selectedObjectId && selectedObjectId !== 'avatar') {
                          resetWearableTransform(selectedObjectId);
                          toast.success("Transform reset", {
                            icon: <Zap className="text-primary" size={16} />
                          });
                        } else {
                          toast.error("Select a wearable first");
                        }
                      }}
                      className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg h-10 font-mono uppercase tracking-wider text-xs transition-all"
                      disabled={isMerged || !selectedObjectId || selectedObjectId === 'avatar'}
                    >
                      <Zap size={16} className="mr-2" />
                      Reset Transform
                    </Button>
                  </section>

                  {/* Telemetry Card */}
                  <div className="mt-8 p-6 bg-primary/5 rounded-2xl border border-primary/20 space-y-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                    <div className="flex justify-between text-[10px] font-mono text-primary italic relative">
                      <span>SYNC ENGINE</span>
                      <span className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"/> 
                        {isMerged ? 'MERGED' : 'ONLINE'}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full transition-all ${isMerged ? 'w-full bg-green-500' : 'w-[85%] bg-primary'}`} />
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-400 leading-relaxed font-mono uppercase tracking-tighter">
                      {isMerged 
                        ? 'Models merged into single geometry. Unmerge to edit separately.'
                        : 'Drag models in 3D space. Merge to combine geometry.'}
                    </p>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </SheetContent>
        </Sheet>

        {/* Re-center Camera Button */}
        <Button 
          onClick={() => {
            resetCamera();
            toast.success("Scene re-centered", { 
              icon: <Zap className="text-primary" size={16} />
            });
          }}
          variant="outline" 
          className="rounded-full h-14 px-6 bg-black/80 backdrop-blur-2xl border-white/10 hover:bg-primary hover:text-primary-foreground transition-all duration-500 shadow-2xl group active:scale-95 flex items-center gap-2"
        >
          <Zap className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-mono uppercase tracking-wider hidden sm:inline">Reset</span>
        </Button>
        
        {/* HUD Overlay */}
        <div className="text-right flex-1">
          <h1 className="text-4xl font-display font-bold text-white tracking-tighter italic">
            Drape<span style={{ color: '#FFAD33' }}>Room</span>
          </h1>
          <div className="flex items-center justify-end gap-2">
            <p className="text-[10px] text-gray-600 font-mono tracking-[0.4em] uppercase">DRAG TO MOVE</p>
          </div>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="flex justify-end items-end pointer-events-auto">
        <div className="mb-4 flex flex-col items-end gap-2">
          {loadedWearables.length > 0 && !isMerged && (
            <Button 
              onClick={handleUnloadAll}
              variant="outline"
              className="bg-black/60 hover:bg-red-500/20 text-red-400 border-red-500/30 rounded-lg h-10 px-4 font-mono uppercase tracking-wider text-xs transition-all backdrop-blur-xl"
            >
              <Trash2 size={14} className="mr-2" />
              Unload All ({loadedWearables.length})
            </Button>
          )}
          
          {!isMerged ? (
            <Button 
              onClick={handleMergeMeshes}
              className="bg-primary/20 hover:bg-primary/40 text-primary border border-primary/50 rounded-xl h-14 px-6 font-mono uppercase tracking-wider text-sm transition-all backdrop-blur-2xl shadow-2xl active:scale-95"
              disabled={!avatarUrl || loadedWearables.length === 0}
            >
              <Combine size={20} className="mr-2" />
              Save this look
            </Button>
          ) : (
            <Button 
              onClick={handleUnmergeMeshes}
              className="bg-red-500/20 hover:bg-red-500/40 text-red-500 border border-red-500/50 rounded-xl h-14 px-6 font-mono uppercase tracking-wider text-sm transition-all backdrop-blur-2xl shadow-2xl active:scale-95"
            >
              <Combine size={20} className="mr-2" />
              Mirror view
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}