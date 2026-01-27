import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shirt, CheckCircle2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

type ViewState = "login" | "forgot-password" | "reset-success";

export default function Login() {
  const [, setLocation] = useLocation();
  const [view, setView] = useState<ViewState>("login");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });

  const [delightMessage, setDelightMessage] = useState("");

  useEffect(() => {
    const messages = [
      "Your outfits are waiting.",
      "Let’s try something new today."
    ];
    setDelightMessage(messages[Math.floor(Math.random() * messages.length)]);
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      toast.success("Welcome back!", {
        description: "Login successful",
        icon: <CheckCircle2 className="text-green-500" />
      });
      setLocation("/room");
    }, 1000);
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setView("reset-success");
    }, 1000);
  };

  if (view === "reset-success") {
    return (
      <div className="min-h-screen w-full bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <Card className="w-full max-w-md bg-black/40 backdrop-blur-3xl border-white/10 shadow-2xl relative z-10 text-center py-12 px-6">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-white mb-4">Check your inbox</CardTitle>
          <CardDescription className="text-gray-400 text-sm leading-relaxed mb-8">
            We sent you a link to reopen your room.
          </CardDescription>
          <Button 
            variant="ghost" 
            className="text-primary hover:text-primary hover:bg-primary/10 font-mono text-xs uppercase tracking-widest"
            onClick={() => setView("login")}
          >
            Back to login
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-md z-10 space-y-8">
        <div className="text-center space-y-3">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-black border border-white/10 rounded-xl flex items-center justify-center shadow-2xl">
              <Shirt className="w-6 h-6 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight">
            {view === "login" ? "Welcome back" : "Reset your password"}
          </h1>
          <p className="text-gray-500 text-sm font-medium">
            {view === "login" ? "Your room is just the way you left it." : "We’ll help you get back into your room."}
          </p>
          {view === "login" && delightMessage && (
            <p className="text-primary/60 text-[10px] font-mono uppercase tracking-[0.2em] animate-in fade-in slide-in-from-bottom-1 duration-1000">
              “{delightMessage}”
            </p>
          )}
        </div>

        <Card className="bg-black/40 backdrop-blur-3xl border-white/10 shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />
          
          <CardContent className="pt-8">
            {view === "login" ? (
              <form onSubmit={handleLoginSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-[10px] font-mono uppercase tracking-widest text-gray-500 ml-1">Username</Label>
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
                  <div className="flex items-center justify-between ml-1">
                    <Label htmlFor="password" className="text-[10px] font-mono uppercase tracking-widest text-gray-500">Access Key</Label>
                    <button 
                      type="button"
                      onClick={() => setView("forgot-password")}
                      className="text-[10px] font-mono text-gray-600 hover:text-primary transition-colors uppercase tracking-widest"
                    >
                      Forgot password?
                    </button>
                  </div>
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
                  {isLoading ? "AUTHORIZING..." : "Enter your room"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleResetSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[10px] font-mono uppercase tracking-widest text-gray-500 ml-1">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="YOUR@EMAIL.COM"
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-700 h-12 focus:ring-primary/20 focus:border-primary/40 transition-all font-mono uppercase"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-primary/20"
                  disabled={isLoading}
                >
                  {isLoading ? "SENDING..." : "Send reset link"}
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="w-full text-gray-500 hover:text-white hover:bg-white/5 font-mono text-[10px] uppercase tracking-widest"
                  onClick={() => setView("login")}
                >
                  <ArrowLeft className="mr-2 h-3 w-3" />
                  Back to login
                </Button>
              </form>
            )}
          </CardContent>
          
          {view === "login" && (
            <CardFooter className="pb-8 pt-0 flex flex-col gap-4">
              <div className="w-full flex items-center gap-4">
                <div className="h-px flex-1 bg-white/5" />
                <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">Or</span>
                <div className="h-px flex-1 bg-white/5" />
              </div>
              
              <Button variant="outline" className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10 font-mono text-[10px] uppercase tracking-widest h-12 transition-all">
                Continue with Google
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
