import { useState } from 'react';
import { Joystick } from 'react-joystick-component';
import { useStore } from '@/store';
import { Shirt, User, Upload, Box, CheckCircle2, ChevronDown, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import WearablePreview from './WearablePreview';

import defaultObject from '@assets/object_0_1766404645511.glb?url';

// Mock preview data
const WEARABLE_ITEMS = [
  {
    id: 'default',
    name: 'Default Wearable',
    url: defaultObject,
    isDefault: true
  }
];

export default function Interface() {
  const { 
    setRotationVelocity, 
    setAvatarUrl, 
    setWearableUrl, 
    avatarUrl, 
    wearableUrl,
    hasUploadedAvatar,
    hasUploadedWearable,
    resetCamera
  } = useStore();
  
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingWearable, setIsUploadingWearable] = useState(false);
  const [openWearables, setOpenWearables] = useState(false);

  const handleJoystickMove = (event: any) => {
    if (event.x !== undefined) {
      setRotationVelocity(event.x);
    }
  };

  const handleJoystickStop = () => {
    setRotationVelocity(0);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'wearable') => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (type === 'avatar') setIsUploadingAvatar(true);
    else setIsUploadingWearable(true);

    setTimeout(() => {
      const url = URL.createObjectURL(file);
      if (type === 'avatar') {
        setAvatarUrl(url, true);
        setIsUploadingAvatar(false);
        toast.success("Avatar updated successfully", {
          description: file.name,
          icon: <CheckCircle2 className="text-green-500" />
        });
      } else {
        setWearableUrl(url, true);
        setIsUploadingWearable(false);
        toast.success("Wearable equipped successfully", {
          description: file.name,
          icon: <CheckCircle2 className="text-green-500" />
        });
      }
    }, 800);
  };

  const handleSelectWearable = (url: string | null) => {
    setWearableUrl(url);
  };

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
              <SheetHeader className="p-8 pb-4">
                <SheetTitle className="text-3xl font-display font-bold text-white tracking-widest uppercase italic">
                  Wardrobe
                </SheetTitle>
                <p className="text-gray-500 text-[10px] font-mono tracking-[0.3em] uppercase">Control Panel v2.9.2</p>
              </SheetHeader>
              
              <ScrollArea className="flex-1 px-8">
                <div className="space-y-10 py-4">
                  {/* Avatar Section */}
                  <section className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-primary">
                        <User size={20} className="animate-pulse" />
                        <h3 className="font-display text-lg font-bold uppercase tracking-widest">Base Body</h3>
                      </div>
                      {hasUploadedAvatar && !isUploadingAvatar && <CheckCircle2 size={16} className="text-green-500" />}
                    </div>
                    
                    <div className="group relative">
                      <Label 
                        htmlFor="avatar-upload" 
                        className={`flex flex-col items-center justify-center gap-4 h-36 border-2 border-dashed rounded-2xl transition-all cursor-pointer ${isUploadingAvatar ? 'border-primary bg-primary/10 animate-pulse' : 'border-white/10 hover:border-primary/50 hover:bg-white/5'}`}
                      >
                        <Upload size={32} className={`${isUploadingAvatar ? 'text-primary' : 'text-gray-500'} transition-colors`} />
                        <div className="text-center">
                          <span className="text-sm font-bold block">{isUploadingAvatar ? 'PROCESSING...' : 'UPLOAD AVATAR'}</span>
                          <span className="text-[10px] text-gray-500 font-mono">.GLB / .PLY SUPPORTED</span>
                        </div>
                        <Input 
                          id="avatar-upload" 
                          type="file" 
                          accept=".glb,.gltf,.ply" 
                          className="hidden" 
                          onChange={(e) => handleFileUpload(e, 'avatar')}
                          disabled={isUploadingAvatar}
                        />
                      </Label>
                    </div>
                  </section>

                  <Separator className="bg-white/5" />

                  {/* Wearables Section */}
                  <section className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-primary">
                        <Box size={20} className="animate-pulse" />
                        <h3 className="font-display text-lg font-bold uppercase tracking-widest">Loadout</h3>
                      </div>
                      {hasUploadedWearable && !isUploadingWearable && <CheckCircle2 size={16} className="text-green-500" />}
                    </div>

                    {/* Wearables Preview Gallery */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-gray-500">
                        Available Items
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {WEARABLE_ITEMS.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => handleSelectWearable(item.url)}
                            className="text-left transition-all group"
                          >
                            <WearablePreview 
                              url={item.url}
                              isSelected={wearableUrl === item.url}
                            />
                            <div className="mt-2">
                              <div className="font-mono font-bold uppercase tracking-wider text-xs group-hover:text-primary transition-colors">
                                {item.name}
                              </div>
                              <div className="text-[10px] text-gray-400 font-mono">
                                {item.isDefault ? 'DEFAULT PREVIEW' : 'CUSTOM'}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="group relative pt-2">
                      <Label 
                        htmlFor="wearable-upload" 
                        className={`flex flex-col items-center justify-center gap-4 h-36 border-2 border-dashed rounded-2xl transition-all cursor-pointer ${isUploadingWearable ? 'border-primary bg-primary/10 animate-pulse' : 'border-white/10 hover:border-primary/50 hover:bg-white/5'}`}
                      >
                        <Upload size={32} className={`${isUploadingWearable ? 'text-primary' : 'text-gray-500'} transition-colors`} />
                        <div className="text-center">
                          <span className="text-sm font-bold block">{isUploadingWearable ? 'PROCESSING...' : 'UPLOAD WEARABLE'}</span>
                          <span className="text-[10px] text-gray-500 font-mono">.GLB / .PLY SUPPORTED</span>
                        </div>
                        <Input 
                          id="wearable-upload" 
                          type="file" 
                          accept=".glb,.gltf,.ply" 
                          className="hidden" 
                          onChange={(e) => handleFileUpload(e, 'wearable')}
                          disabled={isUploadingWearable}
                        />
                      </Label>
                    </div>
                  </section>

                  {/* Telemetry Card */}
                  <div className="mt-8 p-6 bg-primary/5 rounded-2xl border border-primary/20 space-y-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                    <div className="flex justify-between text-[10px] font-mono text-primary italic relative">
                      <span>SYNC ENGINE</span>
                      <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"/> ONLINE</span>
                    </div>
                    <div className="space-y-1">
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full w-[85%] bg-primary" />
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-400 leading-relaxed font-mono uppercase tracking-tighter">
                      Systems operational. Dynamic asset injection ready for deployment.
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
          <h1 className="text-4xl font-display font-bold text-white uppercase tracking-tighter italic">
            Virtual <span className="text-primary">Fit</span>
          </h1>
          <div className="flex items-center justify-end gap-2">
            <p className="text-[10px] text-gray-600 font-mono tracking-[0.4em] uppercase">GRID-COORD: 42.7.99</p>
          </div>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="flex justify-between items-end pointer-events-auto">
        <div className="mb-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="w-1 h-8 bg-primary/20 rounded-full overflow-hidden">
                <div className="w-full h-1/2 bg-primary animate-bounce" />
              </div>
              <div className="text-[10px] text-gray-500 font-mono uppercase tracking-[0.2em]">Signal Strength</div>
            </div>
            <div className="text-[10px] text-primary/40 font-mono tabular-nums uppercase">
              Lat: 22ms | Fr: 60fps
            </div>
          </div>
        </div>
        
        <div className="relative group p-4">
          <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <div className="relative bg-black/60 backdrop-blur-2xl rounded-full p-4 border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.8)] ring-1 ring-white/5">
             <Joystick 
                size={110} 
                stickColor="hsl(35, 100%, 60%)" 
                baseColor="rgba(255,255,255,0.02)" 
                move={handleJoystickMove} 
                stop={handleJoystickStop}
              />
          </div>
          <div className="absolute -bottom-8 w-full text-center">
            <span className="text-[10px] text-primary/40 font-mono uppercase tracking-[0.5em] font-black group-hover:text-primary transition-colors">Orbit Engine</span>
          </div>
        </div>
      </div>
    </div>
  );
}
