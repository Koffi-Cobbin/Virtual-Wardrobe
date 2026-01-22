import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, DoorOpen, User } from 'lucide-react';

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
    <div className="bg-black text-white min-h-screen">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/90 backdrop-blur-sm' : 'bg-transparent'}`}>
        <div className="max-w-full mx-auto px-10 sm:px-12 lg:px-16">
          <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold tracking-tight">
              <span className="text-white">Drape</span>
              <span style={{ color: '#FFAD33' }}>Room</span>
            </h1>
          </div>

            {/* Navigation links (hidden by default) */}
            <div className="hidden">
              <a href="#apparel-fit" className="hover:text-white transition-colors" style={{ color: '#999' }}>
                Apparel Fit
              </a>
              <a href="#safety" className="hover:text-white transition-colors" style={{ color: '#999' }}>
                Safety
              </a>
              <a href="#ergonomics" className="hover:text-white transition-colors" style={{ color: '#999' }}>
                Ergonomics
              </a>
              <a href="#company" className="hover:text-white transition-colors" style={{ color: '#999' }}>
                Company
              </a>
              <a href="#contact" className="hover:text-white transition-colors" style={{ color: '#999' }}>
                Contact
              </a>
            </div>

            {/* Hamburger menu button - visible on all screens */}
            <div>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="hover:text-white transition-colors"
                style={{ color: '#999' }}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Dropdown */}
        {isMenuOpen && (
          <div className="bg-black/95 backdrop-blur-sm">
            <div className="px-4 pt-2 pb-6 space-y-3 max-w-7xl mx-auto">
              <a href="#apparel-fit" className="block hover:text-white py-2 transition-colors text-lg" style={{ color: '#999' }}>
                Apparel Fit
              </a>
              <a href="#safety" className="block hover:text-white py-2 transition-colors text-lg" style={{ color: '#999' }}>
                Safety
              </a>
              <a href="#ergonomics" className="block hover:text-white py-2 transition-colors text-lg" style={{ color: '#999' }}>
                Ergonomics
              </a>
              <a href="#company" className="block hover:text-white py-2 transition-colors text-lg" style={{ color: '#999' }}>
                Company
              </a>
              <a href="#contact" className="block hover:text-white py-2 transition-colors text-lg" style={{ color: '#999' }}>
                Contact
              </a>
            </div>
          </div>
        )}
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