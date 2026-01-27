import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shirt, CheckCircle2, ShieldCheck, CreditCard, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function Signup() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [microcopyIndex, setMicrocopyIndex] = useState(0);
  const microcopy = [
    { text: "No credit card required", icon: <CreditCard className="w-3 h-3" /> },
    { text: "Your data stays private", icon: <ShieldCheck className="w-3 h-3" /> },
    { text: "Delete your room anytime", icon: <Trash2 className="w-3 h-3" /> },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setMicrocopyIndex((prev) => (prev + 1) % microcopy.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      toast.success("Welcome to DrapeRoom!", {
        description: "Your personal space is ready.",
        icon: <CheckCircle2 className="text-green-500" />
      });
      setLocation("/room");
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full bg-black flex flex-col items-center justify-center px-[var(--space-md)] relative overflow-hidden font-sans">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-5xl z-10 grid grid-cols-1 md:grid-cols-2 gap-[var(--space-xl)] items-center py-[var(--space-xl)] animate-view-transition">
        {/* Left Column: Header Content */}
        <div className="text-left space-y-[var(--space-lg)]">
          <div className="flex justify-start mb-[var(--space-md)]">
            <div className="w-12 h-12 bg-black border border-white/10 rounded-xl flex items-center justify-center shadow-2xl">
              <Shirt className="w-6 h-6 text-primary" />
            </div>
          </div>
          
          <div className="space-y-[var(--space-sm)]">
            <h1 className="text-5xl sm:text-6xl font-bold text-white tracking-tight leading-[1.1]">
              Create your <br />Drape<span className="text-primary">Room</span>
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed max-w-md">
              Your personal space to try outfits, explore fits, and discover your style in high-fidelity 3D.
            </p>
          </div>
          
          <div className="h-8 flex items-center justify-start overflow-hidden">
            <div 
              key={microcopyIndex}
              className="flex items-center gap-[var(--space-sm)] text-primary/80 text-xs font-mono uppercase tracking-[0.3em] animate-in slide-in-from-bottom-2 fade-in duration-500"
            >
              {microcopy[microcopyIndex].icon}
              <span>{microcopy[microcopyIndex].text}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Card Form */}
        <Card className="bg-black/40 backdrop-blur-3xl border-white/10 shadow-2xl overflow-hidden relative max-w-md mx-auto md:ml-auto md:mr-0">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />
          
          <CardContent className="pt-[var(--space-xl)]">
            <form onSubmit={handleSignupSubmit} className="space-y-[var(--space-lg)]">
              <div className="space-y-[var(--space-xs)]">
                <Label htmlFor="username" className="text-[10px] font-mono uppercase tracking-widest text-gray-500 ml-1">Username</Label>
                <Input
                  id="username"
                  placeholder="CHOOSE_A_NAME"
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-700 h-12 focus:ring-primary/20 focus:border-primary/40 transition-all font-mono uppercase"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-[var(--space-xs)]">
                <Label htmlFor="email" className="text-[10px] font-mono uppercase tracking-widest text-gray-500 ml-1">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="HELLO@DRAPEROOM.COM"
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-700 h-12 focus:ring-primary/20 focus:border-primary/40 transition-all font-mono uppercase"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-[var(--space-xs)]">
                <Label htmlFor="password" className="text-[10px] font-mono uppercase tracking-widest text-gray-500 ml-1">Access Key</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-700 h-12 focus:ring-primary/20 focus:border-primary/40 transition-all font-mono"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-primary/20"
                disabled={isLoading}
              >
                {isLoading ? "CREATING..." : "Create my room"}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="pb-[var(--space-xl)] pt-0 flex flex-col gap-[var(--space-lg)]">
            <div className="w-full flex items-center gap-[var(--space-lg)]">
              <div className="h-px flex-1 bg-white/5" />
              <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">Or</span>
              <div className="h-px flex-1 bg-white/5" />
            </div>
            
            <Button variant="outline" className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10 font-mono text-[10px] uppercase tracking-widest h-12 transition-all">
              Continue with Google
            </Button>

            <div className="mt-[var(--space-xl)] text-center">
              <p className="text-gray-500 text-[10px] font-mono uppercase tracking-widest mb-[var(--space-2xs)]">Already have a room?</p>
              <button 
                onClick={() => setLocation("/login")}
                className="text-primary hover:underline font-bold uppercase tracking-widest text-xs"
              >
                Enter your room
              </button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
