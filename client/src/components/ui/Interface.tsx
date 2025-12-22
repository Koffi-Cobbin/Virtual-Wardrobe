import { useState } from 'react';
import { Joystick } from 'react-joystick-component';
import { useStore } from '@/store';
import { motion, AnimatePresence } from 'framer-motion';
import { Shirt, User, Upload, Box } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

export default function Interface() {
  const { setRotationVelocity, setAvatarUrl, setWearableUrl, avatarUrl, wearableUrl } = useStore();

  const handleJoystickMove = (event: any) => {
    if (event.x !== undefined) {
      // Map x component to rotation velocity
      // Joystick x is usually -1 to 1 (or similar based on size)
      // We invert it if needed depending on desired direction
      setRotationVelocity(event.x);
    }
  };

  const handleJoystickStop = () => {
    setRotationVelocity(0);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'wearable') => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (type === 'avatar') setAvatarUrl(url);
      else setWearableUrl(url);
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6">
      
      {/* Header / Nav */}
      <div className="flex justify-between items-start pointer-events-auto">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline" className="rounded-full w-12 h-12 bg-black/40 backdrop-blur border-white/10 hover:bg-primary/20 hover:border-primary/50 transition-all duration-300">
              <Shirt className="w-6 h-6 text-white" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px] border-r border-white/10 bg-black/90 backdrop-blur-xl text-white">
            <SheetHeader className="mb-6">
              <SheetTitle className="text-2xl font-display font-bold text-white tracking-wider uppercase">
                Fitting Room
              </SheetTitle>
              <p className="text-gray-400 text-sm">Customize your loadout</p>
            </SheetHeader>
            
            <ScrollArea className="h-[calc(100vh-120px)] pr-4">
              <div className="space-y-8">
                {/* Avatar Section */}
                <section>
                  <div className="flex items-center gap-2 mb-4 text-primary">
                    <User size={18} />
                    <h3 className="font-semibold uppercase tracking-widest text-sm">Avatar</h3>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-primary/30 transition-colors">
                    <Label htmlFor="avatar-upload" className="cursor-pointer block text-center p-4 border-2 border-dashed border-white/10 rounded hover:bg-white/5 transition-colors">
                      <div className="flex flex-col items-center gap-2">
                        <Upload size={24} className="text-gray-400" />
                        <span className="text-sm font-medium">Upload .glb / .ply</span>
                      </div>
                      <Input 
                        id="avatar-upload" 
                        type="file" 
                        accept=".glb,.gltf,.ply" 
                        className="hidden" 
                        onChange={(e) => handleFileUpload(e, 'avatar')}
                      />
                    </Label>
                    {avatarUrl && (
                      <div className="mt-3 text-xs text-green-400 flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-green-400"></div>
                        Model Loaded
                      </div>
                    )}
                  </div>
                </section>

                <Separator className="bg-white/10" />

                {/* Wearables Section */}
                <section>
                  <div className="flex items-center gap-2 mb-4 text-primary">
                    <Box size={18} />
                    <h3 className="font-semibold uppercase tracking-widest text-sm">Wearable</h3>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-primary/30 transition-colors">
                     <Label htmlFor="wearable-upload" className="cursor-pointer block text-center p-4 border-2 border-dashed border-white/10 rounded hover:bg-white/5 transition-colors">
                      <div className="flex flex-col items-center gap-2">
                        <Upload size={24} className="text-gray-400" />
                        <span className="text-sm font-medium">Upload .glb / .ply</span>
                      </div>
                      <Input 
                        id="wearable-upload" 
                        type="file" 
                        accept=".glb,.gltf,.ply" 
                        className="hidden" 
                        onChange={(e) => handleFileUpload(e, 'wearable')}
                      />
                    </Label>
                     {wearableUrl && (
                      <div className="mt-3 text-xs text-green-400 flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-green-400"></div>
                        Wearable Equipped
                      </div>
                    )}
                  </div>
                </section>

                {/* Instructions */}
                <div className="p-4 bg-blue-500/10 rounded-lg text-xs text-blue-200 border border-blue-500/20">
                  <p className="font-bold mb-1">PRO TIP:</p>
                  Use the joystick to rotate your character. Drag anywhere else to orbit the camera.
                </div>
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
        
        {/* Title Overlay */}
        <div className="text-right">
          <h1 className="text-3xl font-display font-bold text-white uppercase tracking-tighter">
            System <span className="text-primary">V-01</span>
          </h1>
          <p className="text-xs text-gray-500 font-mono tracking-widest">VIRTUAL FITTING PROTOCOL</p>
        </div>
      </div>

      {/* Footer / Controls */}
      <div className="flex justify-between items-end pointer-events-auto">
        <div className="hidden md:block text-[10px] text-gray-600 font-mono">
          COORD: {Math.random().toFixed(4)} / {Math.random().toFixed(4)}<br/>
          STATUS: ONLINE
        </div>
        
        <div className="relative">
          {/* Joystick Wrapper */}
          <div className="bg-black/20 backdrop-blur-sm rounded-full p-2 border border-white/5">
             <Joystick 
                size={100} 
                stickColor="hsl(35, 100%, 60%)" 
                baseColor="rgba(0,0,0,0.5)" 
                move={handleJoystickMove} 
                stop={handleJoystickStop}
              />
          </div>
          <div className="absolute -bottom-6 w-full text-center text-[10px] text-gray-400 font-mono uppercase tracking-widest">
            Rotate
          </div>
        </div>
      </div>
    </div>
  );
}
