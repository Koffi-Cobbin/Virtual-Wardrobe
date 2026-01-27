import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
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
    email: ""
  });

  const [delightMessage, setDelightMessage] = useState("");

  useEffect(() => {
    const messages = [
      "Your outfits are waiting.",
      "Let's try something new today."
    ];
    setDelightMessage(messages[Math.floor(Math.random() * messages.length)]);
  }, []);

  const handleLoginSubmit = (e: React.FormEvent) => {
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

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setView("reset-success");
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black font-sans overflow-y-auto overflow-x-hidden">
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

      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[420px] w-[420px] rounded-full bg-primary/10 blur-[120px]" />
      </div>

      {/* Reset success view */}
      {view === "reset-success" && (
        <div className="flex flex-col items-center justify-center min-h-full px-4 py-12 relative z-10 w-full">
          <Card className="relative z-10 w-full max-w-sm bg-black/40 backdrop-blur-3xl border-white/10 text-left animate-view-transition">
          <CardContent className="flex flex-col items-start gap-4 sm:gap-[var(--space-lg)] py-6 sm:py-[var(--space-xl)]">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/20">
              <CheckCircle2 className="h-7 w-7 text-primary" />
            </div>

            <div className="space-y-2 sm:space-y-[var(--space-xs)]">
              <CardTitle className="text-xl text-white">
                Check your inbox
              </CardTitle>
              <CardDescription className="text-gray-400 text-sm">
                We sent you a link to reopen your room.
              </CardDescription>
            </div>

            <Button
              variant="ghost"
              className="text-primary text-xs uppercase tracking-widest hover:bg-primary/10"
              onClick={() => setView("login")}
            >
              Back to login
            </Button>
          </CardContent>
        </Card>
        </div>
      )}

      {/* Login / Reset */}
      {view !== "reset-success" && (
        <div className="flex flex-col items-center justify-center min-h-full px-4 py-12 relative z-10 w-full">
          <div key={view} className="relative z-10 w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-[var(--space-xl)] items-center animate-view-transition">
          {/* Left Column: Header */}
          <div className="w-full text-center md:text-center flex flex-col items-center md:items-center space-y-4 sm:space-y-[var(--space-md)]">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-black/40">
              <Shirt className="h-5 w-5 text-primary" />
            </div>

            <div className="space-y-2 sm:space-y-[var(--space-xs)]">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
                {view === "login" ? "Welcome back" : "Reset your password"}
              </h1>

              <p className="text-base sm:text-lg text-gray-500 max-w-sm mx-auto md:mx-auto px-4 sm:px-0">
                {view === "login"
                  ? "Your room is just the way you left it. Step inside and continue your style journey."
                  : "We'll help you get back into your room in no time."}
              </p>
            </div>

            {view === "login" && delightMessage && (
              <p className="text-primary/60 text-xs uppercase tracking-[0.2em] font-mono border-l-2 border-primary/20 pl-4 py-1">
                "{delightMessage}"
              </p>
            )}
          </div>

          {/* Right Column: Card */}
          <Card className="bg-black/40 backdrop-blur-3xl border-white/10 shadow-2xl w-full">
            <CardContent className="space-y-5 sm:space-y-[var(--space-lg)] pt-6 sm:pt-[var(--space-lg)] pb-6">
              {view === "login" ? (
                <form onSubmit={handleLoginSubmit} className="space-y-5 sm:space-y-[var(--space-lg)]">
                  <div className="space-y-2 sm:space-y-[var(--space-2xs)]">
                    <Label className="text-[10px] uppercase tracking-widest text-gray-500 ml-1">
                      Username
                    </Label>
                    <Input
                      placeholder="IDENTITY_ID"
                      className="h-11 bg-white/5 border-white/10 text-white font-mono uppercase"
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2 sm:space-y-[var(--space-2xs)]">
                    <div className="flex justify-between ml-1">
                      <Label className="text-[10px] uppercase tracking-widest text-gray-500">
                        Access Key
                      </Label>
                      <button
                        type="button"
                        onClick={() => setView("forgot-password")}
                        className="text-[10px] uppercase tracking-widest text-gray-600 hover:text-primary"
                      >
                        Forgot?
                      </button>
                    </div>

                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="h-11 bg-white/5 border-white/10 text-white font-mono"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="h-11 w-full bg-primary uppercase tracking-widest"
                  >
                    {isLoading ? "AUTHORIZING..." : "Enter your room"}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleResetSubmit} className="space-y-5 sm:space-y-[var(--space-lg)]">
                  <div className="space-y-2 sm:space-y-[var(--space-2xs)]">
                    <Label className="text-[10px] uppercase tracking-widest text-gray-500 ml-1">
                      Email
                    </Label>
                    <Input
                      type="email"
                      placeholder="YOU@EMAIL.COM"
                      className="h-11 bg-white/5 border-white/10 text-white font-mono uppercase"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="h-11 w-full bg-primary uppercase tracking-widest"
                  >
                    {isLoading ? "SENDING..." : "Send reset link"}
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setView("login")}
                    className="w-full text-[10px] uppercase tracking-widest"
                  >
                    <ArrowLeft className="mr-2 h-3 w-3" />
                    Back to login
                  </Button>
                </form>
              )}
            </CardContent>

            {view === "login" && (
              <CardFooter className="flex flex-col gap-4 sm:gap-[var(--space-md)] pb-6 sm:pb-[var(--space-lg)]">
                <div className="flex items-center gap-3 sm:gap-[var(--space-sm)]">
                  <div className="h-px flex-1 bg-white/10" />
                  <span className="text-[10px] uppercase tracking-widest text-gray-600">
                    Or
                  </span>
                  <div className="h-px flex-1 bg-white/10" />
                </div>

                <Button
                  variant="outline"
                  className="h-11 w-full border-white/10 text-[10px] uppercase tracking-widest"
                >
                  Continue with Google
                </Button>

                <div className="text-center text-[10px] uppercase tracking-widest text-gray-500">
                  New to DrapeRoom?{" "}
                  <button
                    onClick={() => setLocation("/signup")}
                    className="text-primary font-bold hover:underline"
                  >
                    Create your room
                  </button>
                </div>
              </CardFooter>
            )}
          </Card>
        </div>
        </div>
      )}
    </div>
  );
}