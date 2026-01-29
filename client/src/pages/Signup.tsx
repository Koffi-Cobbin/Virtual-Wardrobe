import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shirt, CheckCircle2, ShieldCheck, CreditCard, Trash2, ArrowLeft, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  general?: string;
}

export default function Signup() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState({
    username: false,
    email: false,
    password: false,
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

  // Client-side validation
  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case "username":
        if (!value.trim()) return "Username is required";
        if (value.length < 3) return "Username must be at least 3 characters";
        if (value.length > 20) return "Username must be less than 20 characters";
        if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
          return "Only letters, numbers, underscores, and hyphens allowed";
        }
        break;

      case "email":
        if (!value.trim()) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return "Please enter a valid email address";
        }
        break;

      case "password":
        if (!value) return "Password is required";
        if (value.length < 8) return "Password must be at least 8 characters";
        if (!/\d/.test(value)) return "Password must contain at least one number";
        if (!/[a-zA-Z]/.test(value)) return "Password must contain at least one letter";
        break;
    }
    return undefined;
  };

  const handleBlur = (field: keyof typeof touched) => {
    setTouched({ ...touched, [field]: true });
    const error = validateField(field, formData[field]);
    setErrors({ ...errors, [field]: error });
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [field]: value });

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({ username: true, email: true, password: true });

    // Validate all fields
    const newErrors: FormErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key as keyof typeof formData]);
      if (error) {
        newErrors[key as keyof FormErrors] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          setErrors(data.errors);

          // Show specific error messages
          if (data.errors.username) {
            toast.error(data.errors.username);
          } else if (data.errors.email) {
            toast.error(data.errors.email);
          } else if (data.errors.general) {
            toast.error(data.errors.general);
          } else {
            toast.error("Please check the form for errors");
          }
        } else {
          toast.error(data.message || "Signup failed. Please try again.");
        }
        return;
      }

      // Success
      toast.success("Welcome to DrapeRoom!", {
        description: "Your personal space is ready.",
        icon: <CheckCircle2 className="text-green-500" />
      });

      // Store user data if needed (consider using proper auth state management)
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      // Redirect to room
      setTimeout(() => {
        setLocation("/room");
      }, 500);

    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
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
                {/* Username Field */}
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-[10px] font-mono uppercase tracking-widest text-gray-500 ml-1">
                    Username
                  </Label>
                  <Input
                    id="username"
                    placeholder="CHOOSE_A_NAME"
                    className={`bg-white/5 border-white/10 text-white placeholder:text-gray-700 h-12 focus:ring-primary/20 focus:border-primary/40 transition-all font-mono uppercase ${
                      touched.username && errors.username ? "border-red-500/50 focus:border-red-500" : ""
                    }`}
                    value={formData.username}
                    onChange={(e) => handleChange("username", e.target.value)}
                    onBlur={() => handleBlur("username")}
                    required
                    disabled={isLoading}
                  />
                  {touched.username && errors.username && (
                    <div className="flex items-center gap-1 text-red-400 text-xs ml-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.username}</span>
                    </div>
                  )}
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[10px] font-mono uppercase tracking-widest text-gray-500 ml-1">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="HELLO@DRAPEROOM.COM"
                    className={`bg-white/5 border-white/10 text-white placeholder:text-gray-700 h-12 focus:ring-primary/20 focus:border-primary/40 transition-all font-mono uppercase ${
                      touched.email && errors.email ? "border-red-500/50 focus:border-red-500" : ""
                    }`}
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    onBlur={() => handleBlur("email")}
                    required
                    disabled={isLoading}
                  />
                  {touched.email && errors.email && (
                    <div className="flex items-center gap-1 text-red-400 text-xs ml-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.email}</span>
                    </div>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-[10px] font-mono uppercase tracking-widest text-gray-500 ml-1">
                    Access Key
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className={`bg-white/5 border-white/10 text-white placeholder:text-gray-700 h-12 focus:ring-primary/20 focus:border-primary/40 transition-all font-mono ${
                      touched.password && errors.password ? "border-red-500/50 focus:border-red-500" : ""
                    }`}
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    onBlur={() => handleBlur("password")}
                    required
                    disabled={isLoading}
                  />
                  {touched.password && errors.password && (
                    <div className="flex items-center gap-1 text-red-400 text-xs ml-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.password}</span>
                    </div>
                  )}
                  {!errors.password && formData.password && (
                    <p className="text-gray-600 text-xs ml-1">
                      Min. 8 characters with at least one letter and number
                    </p>
                  )}
                </div>

                {/* Submit Button */}
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

              <Button 
                variant="outline" 
                className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10 font-mono text-[10px] uppercase tracking-widest h-12 transition-all"
                disabled={isLoading}
              >
                Continue with Google
              </Button>

              <div className="mt-5 text-center">
                <p className="text-gray-500 text-[10px] font-mono uppercase tracking-widest mb-1">Already have a room?</p>
                <button 
                  onClick={() => setLocation("/login")}
                  className="text-primary hover:underline font-bold uppercase tracking-widest text-xs"
                  disabled={isLoading}
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