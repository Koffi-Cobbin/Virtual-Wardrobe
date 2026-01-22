import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, DoorOpen, User, House } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

export default function Landing() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-black text-white min-h-screen font-sans">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/90 backdrop-blur-sm' : 'bg-transparent'}`}>
        <div className="max-w-full mx-auto px-4 sm:px-12 lg:px-16">
          <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <h1 className="text-3xl font-bold tracking-tight">
              <span className="text-white">Drape</span>
              <span style={{ color: '#FFAD33' }}>Room</span>
            </h1>
          </div>

            {/* Side Navigation Trigger */}
            <div>
              <Sheet>
                <SheetTrigger asChild>
                  <Button size="icon" variant="ghost" className="hover:text-white transition-colors p-0 h-auto w-auto bg-transparent border-none">
                    <House className="w-[140px] h-[140px]" style={{ color: '#999', width: '140px', height: '140px' }} />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[320px] sm:w-[420px] border-l border-white/10 bg-black/95 backdrop-blur-3xl text-white p-0">
                  <div className="h-full flex flex-col">
                    <SheetHeader className="p-8 pb-4 text-left">
                      <p className="sr-only">Navigation Menu</p>
                      <p className="text-gray-500 text-[10px] font-mono tracking-[0.3em] uppercase">
                        Menu
                      </p>
                    </SheetHeader>
                    
                    <div className="flex-1 px-8 py-4 space-y-6">
                      <a href="#apparel-fit" className="block hover:text-white py-2 transition-colors text-xl font-medium" style={{ color: '#999' }}>
                        Apparel Fit
                      </a>
                      <a href="#safety" className="block hover:text-white py-2 transition-colors text-xl font-medium" style={{ color: '#999' }}>
                        Safety
                      </a>
                      <a href="#ergonomics" className="block hover:text-white py-2 transition-colors text-xl font-medium" style={{ color: '#999' }}>
                        Ergonomics
                      </a>
                      <a href="#company" className="block hover:text-white py-2 transition-colors text-xl font-medium" style={{ color: '#999' }}>
                        Company
                      </a>
                      <a href="#contact" className="block hover:text-white py-2 transition-colors text-xl font-medium" style={{ color: '#999' }}>
                        Contact
                      </a>
                      
                      <div className="pt-8">
                        <Button 
                          onClick={() => window.location.href = "/room"}
                          className="w-full py-6 text-lg font-bold rounded-xl"
                          style={{ backgroundColor: '#FFAD33', color: 'black' }}
                        >
                          Enter Fitting Room
                        </Button>
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
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 z-10"></div>
          <div className="w-full h-full bg-gradient-to-br from-gray-900 via-black to-black">
            {/* Animated background effect simulating video */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse" style={{ backgroundColor: 'rgba(255, 173, 51, 0.2)' }}></div>
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse" style={{ backgroundColor: 'rgba(255, 173, 51, 0.1)', animationDelay: '1s' }}></div>
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-20 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="mb-6">
            <h2 className="text-sm sm:text-base font-medium tracking-widest uppercase mb-2">
              Step into Drape<span style={{ color: '#FFAD33' }}>Room</span>
            </h2>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-8 tracking-tight">
            Where your style comes alive.
          </h1>

          <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Try on outfits, mix looks, and see how they fit on your avatar in 3D<br /> — before you buy.
          </p>

          <p className="text-2xl sm:text-3xl md:text-4xl font-bold mb-12 tracking-tight">
            <span style={{ color: '#FFAD33' }}>See it.</span>{' '}
            <span className="text-white">Love it.</span>{' '}
            <span style={{ color: '#FFAD33' }}>Wear it.</span>
          </p>

          {/* CTA Button */}
          <div className="flex justify-center">
            <button
              onClick={() => window.location.href = "/room"}
              className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-medium border-2 rounded-lg transition-all duration-300 overflow-hidden"
              style={{ 
                borderColor: '#FFAD33',
                backgroundColor: 'transparent',
                color: '#fff',
                minWidth: '220px'
              }}
              onMouseEnter={(e) => {
                setIsButtonHovered(true);
                e.currentTarget.style.borderColor = '#fff';
                e.currentTarget.style.color = '#FFAD33';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                setIsButtonHovered(false);
                e.currentTarget.style.borderColor = '#FFAD33';
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {/* Text - fades out on hover */}
              <span 
                className={`relative z-10 transition-opacity duration-300 ${
                  isButtonHovered ? 'opacity-0' : 'opacity-100'
                }`}
              >
                Enter Your Room
              </span>

              {/* Animation Container - shows on hover */}
              <div 
                className={`absolute inset-0 flex items-center justify-center gap-2 transition-opacity duration-300 ${
                  isButtonHovered ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {/* Person Icon - walks toward door */}
                <User 
                  className={`transition-all duration-700 ${
                    isButtonHovered 
                      ? 'translate-x-0 opacity-100' 
                      : '-translate-x-12 opacity-0'
                  }`}
                  size={20}
                  style={{ color: '#FFAD33' }}
                />

                {/* Door Icon - opens */}
                <DoorOpen 
                  className={`transition-all duration-500 ${
                    isButtonHovered 
                      ? 'opacity-100 rotate-0 scale-100' 
                      : 'opacity-0 rotate-12 scale-75'
                  }`}
                  size={20}
                  style={{ color: '#FFAD33' }}
                />
              </div>
            </button>
          </div>
        </div>

      </section>
    </div>
  );
}