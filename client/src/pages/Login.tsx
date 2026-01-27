import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shirt, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";

export default function Login() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock login for frontend prototype
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Welcome back!", {
        description: "Login successful",
        icon: <CheckCircle2 className="text-green-500" />
      });
      setLocation("/");
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-md z-10 space-y-8">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-black border border-white/10 rounded-2xl flex items-center justify-center shadow-2xl">
              <Shirt className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight">
            Drape<span className="text-primary">Room</span>
          </h1>
          <p className="text-gray-500 text-xs font-mono tracking-[0.3em] uppercase">
            Virtual Fit Identity
          </p>
        </div>

        <Card className="bg-black/40 backdrop-blur-3xl border-white/10 shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />
          
          <CardHeader className="space-y-1 pt-8">
            <CardTitle className="text-2xl font-bold text-white text-center uppercase tracking-wider font-mono">Access Portal</CardTitle>
            <CardDescription className="text-gray-500 text-center font-mono text-[10px] uppercase tracking-widest">
              Enter credentials to sync wardrobe
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400 ml-1">Username</Label>
                <Input
                  id="username"
                  placeholder="IDENTITY_ID"
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-700 h-12 focus:ring-primary/20 focus:border-primary/40 transition-all font-mono uppercase"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400 ml-1">Access Key</Label>
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
                {isLoading ? "AUTHORIZING..." : "INITIATE SESSION"}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="pb-8 pt-0 flex flex-col gap-4">
            <div className="w-full flex items-center gap-4">
              <div className="h-px flex-1 bg-white/5" />
              <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">Or Secure Login</span>
              <div className="h-px flex-1 bg-white/5" />
            </div>
            
            <div className="grid grid-cols-2 gap-3 w-full">
              <Button variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10 font-mono text-[10px] uppercase tracking-widest h-10">
                Google
              </Button>
              <Button variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10 font-mono text-[10px] uppercase tracking-widest h-10">
                GitHub
              </Button>
            </div>
          </CardFooter>
        </Card>
        
        <div className="text-center">
          <button className="text-[10px] font-mono text-gray-500 hover:text-primary transition-colors uppercase tracking-[0.2em]">
            Request New Access →
          </button>
        </div>
      </div>
    </div>
  );
}
