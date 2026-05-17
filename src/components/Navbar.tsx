import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Settings, Menu, X, Sun, Moon } from 'lucide-react';
import { cn } from '../lib/utils';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
  };

  const navLinks = [
    { name: 'Beranda', path: '/' },
    { name: 'Anggota', path: '/anggota' },
    { name: 'Dokumentasi', path: '/dokumentasi' },
    { name: 'Quotes', path: '/quotes' },
    { name: 'Artikel', path: '/artikel' },
    { name: 'Tentang', path: '/tentang' },
  ];

  return (
    <>
      <nav 
        id="navbar" 
        className={cn(
          "fixed top-0 left-0 right-0 z-[1000] h-[70px] flex items-center justify-between px-8 transition-all duration-300",
          isScrolled ? "bg-surface backdrop-blur-3xl border-b border-border shadow-lg" : "bg-transparent"
        )}
      >
        <NavLink to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center">
            <svg viewBox="0 0 100 130" xmlns="http://www.w3.org/2000/svg" className="w-9 h-9 fill-accent2 transition-colors duration-300 hover:fill-gold">
              <path d="M50 5 C50 5, 30 25, 28 48 C26 60, 32 68, 38 72 C34 60, 40 50, 50 45 C44 58, 46 70, 54 78 C58 82, 58 90, 54 97 C62 90, 66 78, 62 65 C68 70, 72 80, 70 92 C76 82, 76 68, 68 55 C72 60, 72 68, 68 78 C72 65, 70 48, 60 35 C68 42, 72 52, 70 65 C74 55, 72 38, 62 25 C56 14, 50 5, 50 5 Z"/>
              <path d="M42 80 C38 90, 36 100, 40 112 C42 118, 48 122, 50 122 C52 122, 44 115, 44 105 C44 95, 48 88, 52 82 C48 84, 44 86, 42 80 Z"/>
              <path d="M34 55 C28 62, 25 72, 28 85 C30 78, 34 70, 40 65 C36 65, 32 62, 34 55 Z"/>
            </svg>
          </div>
          <span className="font-serif text-xl font-semibold text-text">Mughtafar</span>
        </NavLink>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <NavLink 
              key={link.path}
              to={link.path}
              className={({ isActive }) => cn(
                "px-3.5 py-2 rounded-lg text-[0.85rem] transition-all duration-200 text-text2 hover:bg-surface2 hover:text-accent2",
                isActive && "text-accent2 bg-surface2 font-medium"
              )}
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={toggleTheme}
            className="w-9 h-9 rounded-lg border border-border bg-surface2 text-text2 flex items-center justify-center transition-all duration-200 hover:text-gold hover:border-gold2"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <NavLink 
            to="/admin"
            className="w-9 h-9 rounded-lg border border-border bg-surface2 text-text3 flex items-center justify-center transition-all duration-200 hover:text-accent2 hover:border-accent2"
          >
            <Settings className="w-4 h-4" />
          </NavLink>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden w-9 h-9 flex items-center justify-center text-text2"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      <div className={cn(
        "fixed top-[70px] left-0 right-0 bg-surface backdrop-blur-3xl border-b border-border p-4 z-[999] transition-all duration-300 md:hidden",
        isMobileMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
      )}>
        {navLinks.map((link) => (
          <NavLink 
            key={link.path}
            to={link.path}
            onClick={() => setIsMobileMenuOpen(false)}
            className={({ isActive }) => cn(
              "block px-4 py-3 rounded-lg text-sm mb-1 transition-all duration-200 text-text2 hover:bg-surface2 hover:text-accent2",
              isActive && "text-accent2 bg-surface2 font-medium"
            )}
          >
            {link.name}
          </NavLink>
        ))}
        <NavLink 
          to="/admin"
          onClick={() => setIsMobileMenuOpen(false)}
          className="block px-4 py-3 rounded-lg text-sm text-text3 hover:bg-surface2 hover:text-accent2"
        >
          ⚙ Admin Panel
        </NavLink>
      </div>
    </>
  );
};
