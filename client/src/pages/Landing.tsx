import React, { useState, useEffect } from "react";
import { Menu, X, ArrowRight, DoorOpen, User, LogIn, UserPlus, LogOut, Compass, BookOpen, UserCircle } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

// Mock auth hook since we couldn't find use-auth.tsx
// In a real app, this would come from a proper auth context
const useAuth = () => {
  return { user: null, isLoading: false };
};

export default function Landing() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-black text-white min-h-screen font-sans">
      {/* Navigation */}
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? "bg-black/90 backdrop-blur-sm" : "bg-transparent"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-12 lg:px-24">
          <div className="flex items-center justify-between h-20">
            <div className="flex-shrink-0 flex items-center h-full">
              <h1 className="text-3xl font-bold tracking-tight leading-none">
                <span className="text-white">Drape</span>
                <span style={{ color: "#FFAD33" }}>Room</span>
              </h1>
            </div>

            {/* Side Navigation Trigger */}
            <div className="flex items-center h-full">
              <Sheet>
                <SheetTrigger asChild>
                  <button 
                    className="hover:opacity-80 transition-opacity cursor-pointer flex items-center justify-center"
                    style={{
                      padding: 0,
                      background: 'transparent',
                      border: 'none',
                      height: '32px',
                      width: '32px'
                    }}
                  >
                    <svg 
                      width="32"    
                      height="32"   
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="#FFAD33" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                  </button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-[320px] sm:w-[420px] border-l border-white/10 bg-black/95 backdrop-blur-3xl text-white p-0"
                >
                  <div className="h-full flex flex-col">
                    <SheetHeader className="p-8 pb-4 text-left">
                      <p className="sr-only">Navigation Menu</p>
                      <p className="text-gray-500 text-[10px] font-mono tracking-[0.3em] uppercase">
                        Menu
                      </p>
                    </SheetHeader>

                    <div className="flex-1 px-8 py-4 space-y-2">
                      <a
                        href="/room"
                        className="flex items-center gap-3 hover:text-white py-3 transition-colors text-xl font-medium"
                        style={{ color: "#999" }}
                      >
                        <DoorOpen size={24} />
                        Enter your room
                      </a>
                      <a
                        href="#explore"
                        className="flex items-center gap-3 hover:text-white py-3 transition-colors text-xl font-medium"
                        style={{ color: "#999" }}
                      >
                        <Compass size={24} />
                        Explore
                      </a>
                      <a
                        href="#fit-guide"
                        className="flex items-center gap-3 hover:text-white py-3 transition-colors text-xl font-medium"
                        style={{ color: "#999" }}
                      >
                        <BookOpen size={24} />
                        Fit Guide
                      </a>

                      <div className="pt-4">
                        <div className="h-px bg-white/10 w-full mb-4 mt-2" />
                        
                        {!user ? (
                          <>
                            <a
                              href="/login"
                              className="flex items-center gap-3 hover:text-white py-3 transition-colors text-xl font-medium"
                              style={{ color: "#999" }}
                            >
                              <LogIn size={24} />
                              Login
                            </a>
                            <a
                              href="/signup"
                              className="flex items-center gap-3 hover:text-white py-3 transition-colors text-xl font-medium"
                              style={{ color: "#999" }}
                            >
                              <UserPlus size={24} />
                              Signup
                            </a>
                          </>
                        ) : (
                          <>
                            <a
                              href="/profile"
                              className="flex items-center gap-3 hover:text-white py-3 transition-colors text-xl font-medium"
                              style={{ color: "#999" }}
                            >
                              <UserCircle size={24} />
                              Profile
                            </a>
                            <button
                              onClick={() => { /* Logout logic */ }}
                              className="flex items-center gap-3 hover:text-white py-3 transition-colors text-xl font-medium w-full text-left"
                              style={{ color: "#999" }}
                            >
                              <LogOut size={24} />
                              Logout
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="p-8 mt-auto border-t border-white/5">
                      <p className="text-xs text-gray-600 font-mono uppercase tracking-widest">
                        &copy; 2026 DrapeRoom Technologies
                      </p>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center overflow-hidden">
        {/* Video Background - Positioned Right */}
        <div className="absolute inset-0 z-0 flex justify-end lg:pr-[5%]">
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/20 to-transparent z-10"></div>
          <div className="h-full aspect-[9/16] relative">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
              <source src="/videos/hero_portrait.mp4" type="video/mp4" />
            </video>
          </div>
        </div>

        {/* Hero Content - Centered Container for better alignment */}
        <div className="relative z-20 px-4 sm:px-12 lg:px-24 w-full max-w-7xl mx-auto flex justify-start">
          <div className="max-w-2xl">
            <div className="mb-6">
              <h2 className="text-xs sm:text-sm font-medium tracking-widest uppercase mb-2">
                Step into Drape<span style={{ color: "#FFAD33" }}>Room</span>
              </h2>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
              Where your style comes alive.
            </h1>

            <p className="text-base sm:text-lg text-gray-300 mb-6 leading-relaxed">
              Try on outfits, mix looks, and see how they fit on your avatar in 3D
              <br /> — before you buy.
            </p>

            <p className="text-xl sm:text-2xl md:text-3xl font-bold mb-10 tracking-tight">
              <span style={{ color: "#FFAD33" }}>See it.</span>{" "}
              <span className="text-white">Love it.</span>{" "}
              <span style={{ color: "#FFAD33" }}>Wear it.</span>
            </p>

            {/* CTA Button */}
            <div className="flex justify-start">
              <button
                onClick={() => (window.location.href = "/room")}
                className="group relative inline-flex items-center justify-center gap-3 px-6 py-3 text-sm font-medium border-2 rounded-lg transition-all duration-300 overflow-hidden"
                style={{
                  borderColor: "#FFAD33",
                  backgroundColor: "transparent",
                  color: "#fff",
                  minWidth: "180px",
                }}
                onMouseEnter={(e) => {
                  setIsButtonHovered(true);
                  e.currentTarget.style.borderColor = "#fff";
                  e.currentTarget.style.color = "#FFAD33";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  setIsButtonHovered(false);
                  e.currentTarget.style.borderColor = "#FFAD33";
                  e.currentTarget.style.color = "#fff";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {/* Text - fades out on hover */}
                <span
                  className={`relative z-10 transition-opacity duration-300 ${
                    isButtonHovered ? "opacity-0" : "opacity-100"
                  }`}
                >
                  Enter your room
                </span>

                {/* Animation Container - shows on hover */}
                <div
                  className={`absolute inset-0 flex items-center justify-center gap-2 transition-opacity duration-300 ${
                    isButtonHovered ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {/* Person Icon - walks toward door */}
                  <User
                    className={`transition-all duration-700 ${
                      isButtonHovered
                        ? "translate-x-0 opacity-100"
                        : "-translate-x-12 opacity-0"
                    }`}
                    size={18}
                    style={{ color: "#FFAD33" }}
                  />

                  {/* Door Icon - opens */}
                  <DoorOpen
                    className={`transition-all duration-500 ${
                      isButtonHovered
                        ? "opacity-100 rotate-0 scale-100"
                        : "opacity-0 rotate-12 scale-75"
                    }`}
                    size={18}
                    style={{ color: "#FFAD33" }}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
