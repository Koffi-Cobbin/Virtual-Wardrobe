import { useState, useRef } from 'react';
import { Joystick } from 'react-joystick-component';
import { useStore } from '@/store';
import { Shirt, User, Upload, Box, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

export default function Interface() {
  const { setRotationVelocity, setAvatarUrl, setWearableUrl, avatarUrl, wearableUrl } = useStore();
  const [activeTab, setActiveTab] = useState<'avatar' | 'wearable'>('avatar');

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
    if (file) {
      // Create a blob URL for the uploaded file
      const url = URL.createObjectURL(file);
      if (type === 'avatar') {
        setAvatarUrl(url);
      } else {
        setWearableUrl(url);
      }
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6">
      
      {/* Header / Nav */}
      <div className="flex justify-between items-start pointer-events-auto">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline" className="rounded-full w-14 h-14 bg-black/60 backdrop-blur-xl border-white/10 hover:bg-primary hover:text-primary-foreground transition-all duration-500 shadow-2xl group">
              <Shirt className="w-7 h-7 group-hover:scale-110 transition-transform" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[320px] sm:w-[420px] border-r border-white/10 bg-black/95 backdrop-blur-2xl text-white p-0">
            <div className="h-full flex flex-col">
              <SheetHeader className="p-8 pb-4">
                <SheetTitle className="text-3xl font-display font-bold text-white tracking-widest uppercase italic">
                  Wardrobe
                </SheetTitle>
                <p className="text-gray-500 text-xs font-mono tracking-widest">PERSONALIZATION INTERFACE V.2</p>
              </SheetHeader>
              
              <ScrollArea className="flex-1 px-8">
                <div className="space-y-10 py-4">
                  {/* Avatar Section */}
                  <section className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-primary">
                        <User size={20} />
                        <h3 className="font-display text-lg font-bold uppercase tracking-widest">Base Body</h3>
                      </div>
                      {avatarUrl && <Check size={16} className="text-green-500" />}
                    </div>
                    
                    <div className="group relative">
                      <Label 
                        htmlFor="avatar-upload" 
                        className="flex flex-col items-center justify-center gap-4 h-32 border-2 border-dashed border-white/10 rounded-xl hover:border-primary/50 hover:bg-white/5 transition-all cursor-pointer group-hover:shadow-[0_0_20px_rgba(245,158,11,0.1)]"
                      >
                        <Upload size={28} className="text-gray-500 group-hover:text-primary transition-colors" />
                        <div className="text-center">
                          <span className="text-sm font-bold block">REPLACE AVATAR</span>
                          <span className="text-[10px] text-gray-500 font-mono">GLB / PLY SUPPORTED</span>
                        </div>
                        <Input 
                          id="avatar-upload" 
                          type="file" 
                          accept=".glb,.gltf,.ply" 
                          className="hidden" 
                          onChange={(e) => handleFileUpload(e, 'avatar')}
                        />
                      </Label>
                    </div>
                  </section>

                  <Separator className="bg-white/5" />

                  {/* Wearables Section */}
                  <section className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-primary">
                        <Box size={20} />
                        <h3 className="font-display text-lg font-bold uppercase tracking-widest">Equipable</h3>
                      </div>
                      {wearableUrl && <Check size={16} className="text-green-500" />}
                    </div>

                    <div className="group relative">
                      <Label 
                        htmlFor="wearable-upload" 
                        className="flex flex-col items-center justify-center gap-4 h-32 border-2 border-dashed border-white/10 rounded-xl hover:border-primary/50 hover:bg-white/5 transition-all cursor-pointer group-hover:shadow-[0_0_20px_rgba(245,158,11,0.1)]"
                      >
                        <Upload size={28} className="text-gray-500 group-hover:text-primary transition-colors" />
                        <div className="text-center">
                          <span className="text-sm font-bold block">LOAD WEARABLE</span>
                          <span className="text-[10px] text-gray-500 font-mono">GLB / PLY SUPPORTED</span>
                        </div>
                        <Input 
                          id="wearable-upload" 
                          type="file" 
                          accept=".glb,.gltf,.ply" 
                          className="hidden" 
                          onChange={(e) => handleFileUpload(e, 'wearable')}
                        />
                      </Label>
                    </div>
                  </section>

                  {/* Status Card */}
                  <div className="mt-8 p-6 bg-primary/5 rounded-xl border border-primary/20 space-y-2">
                    <div className="flex justify-between text-[10px] font-mono text-primary/60 italic">
                      <span>SYNC STATUS</span>
                      <span>ACTIVE</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full w-2/3 bg-primary animate-pulse" />
                    </div>
                    <p className="text-[10px] text-gray-400 leading-relaxed font-mono mt-4 uppercase">
                      Load your assets to visualize real-time fit and aesthetics.
                    </p>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </SheetContent>
        </Sheet>
        
        {/* Title Overlay */}
        <div className="text-right">
          <h1 className="text-4xl font-display font-bold text-white uppercase tracking-tighter italic">
            Visual <span className="text-primary">Fit</span>
          </h1>
          <div className="flex items-center justify-end gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
            <p className="text-[10px] text-gray-500 font-mono tracking-[0.2em] uppercase">Engine v2.5.0</p>
          </div>
        </div>
      </div>

      {/* Footer / Controls */}
      <div className="flex justify-between items-end pointer-events-auto">
        <div className="mb-4">
          <div className="flex flex-col gap-1">
            <div className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">System Telemetry</div>
            <div className="h-[1px] w-32 bg-white/10" />
            <div className="text-[10px] text-primary font-mono tabular-nums uppercase">
              R-VEL: {(Math.random() * 100).toFixed(2)}
            </div>
          </div>
        </div>
        
        <div className="relative group">
          <div className="absolute -inset-4 bg-primary/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="relative bg-black/40 backdrop-blur-xl rounded-full p-3 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
             <Joystick 
                size={100} 
                stickColor="hsl(35, 100%, 60%)" 
                baseColor="rgba(255,255,255,0.03)" 
                move={handleJoystickMove} 
                stop={handleJoystickStop}
              />
          </div>
          <div className="absolute -bottom-8 w-full text-center">
            <span className="text-[10px] text-primary/60 font-mono uppercase tracking-[0.3em] font-bold">Rotation Axis</span>
          </div>
        </div>
      </div>
    </div>
  );
}
