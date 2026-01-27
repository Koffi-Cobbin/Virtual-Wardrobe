import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shirt, CheckCircle2, ShieldCheck, CreditCard, Trash2, ArrowLeft } from "lucide-react";
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
  }, [microcopy.length]);

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
    <div className="fixed inset-0 bg-black font-sans overflow-y-auto overflow-x-hidden no-scrollbar">
      {/* Back to Home Button */}
      <div className="absolute top-6 left-6 z-20">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setLocation("/")}
          className="text-gray-500 hover:text-white uppercase tracking-widest text-[10px]"
        >
          <ArrowLeft className="mr-2 h-3 w-3" />
          Home
        </Button>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="flex flex-col items-center justify-center min-h-full px-4 py-12 relative z-10 w-full">
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-[var(--space-xl)] items-center animate-view-transition">
          {/* Left Column: Header Content */}
          <div className="w-full text-center md:text-center flex flex-col items-center md:items-center space-y-4 sm:space-y-[var(--space-md)]">
            
            <div className="w-12 h-12 bg-black border border-white/10 rounded-xl flex items-center justify-center shadow-2xl">
              <Shirt className="w-6 h-6 text-primary" />
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
                Create your Drape<span style={{ color: '#FFAD33' }}>Room</span>
              </h1>
              <p className="text-base sm:text-lg text-gray-500 max-w-sm mx-auto md:mx-auto px-4 sm:px-0">
                
                Your personal space to try outfits, explore fits, and discover your style in high-fidelity 3D.
              </p>
            </div>

            <div className="h-8 flex items-center justify-center md:justify-start overflow-hidden">
              <div 
                key={microcopyIndex}
                className="flex items-center gap-2 text-primary/80 text-xs font-mono uppercase tracking-[0.3em] animate-in slide-in-from-bottom-2 fade-in duration-500"
              >
                {microcopy[microcopyIndex].icon}
                <span>{microcopy[microcopyIndex].text}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Card Form */}
          <Card className="bg-black/40 backdrop-blur-3xl border-white/10 shadow-2xl overflow-hidden relative w-full">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />

            <CardContent className="pt-6 sm:pt-[var(--space-xl)]">
              <form onSubmit={handleSignupSubmit} className="space-y-5">
                <div className="space-y-2">
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
                <div className="space-y-2">
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
                <div className="space-y-2">
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

            <CardFooter className="pb-6 pt-0 flex flex-col gap-5">
              <div className="w-full flex items-center gap-4">
                <div className="h-px flex-1 bg-white/5" />
                <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">Or</span>
                <div className="h-px flex-1 bg-white/5" />
              </div>

              <Button variant="outline" className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10 font-mono text-[10px] uppercase tracking-widest h-12 transition-all">
                Continue with Google
              </Button>

              <div className="mt-5 text-center">
                <p className="text-gray-500 text-[10px] font-mono uppercase tracking-widest mb-1">Already have a room?</p>
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
    </div>
  );
}
