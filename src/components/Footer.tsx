import React from 'react';
import { NavLink } from 'react-router-dom';
import { Instagram, Facebook, Youtube } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-bg2 border-t border-border py-12 px-8 text-center mt-auto">
      <div className="inline-flex items-center gap-3 mb-6">
        <svg viewBox="0 0 100 130" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 fill-accent2">
          <path d="M50 5 C50 5, 30 25, 28 48 C26 60, 32 68, 38 72 C34 60, 40 50, 50 45 C44 58, 46 70, 54 78 C58 82, 58 90, 54 97 C62 90, 66 78, 62 65 C68 70, 72 80, 70 92 C76 82, 76 68, 68 55 C72 60, 72 68, 68 78 C72 65, 70 48, 60 35 C68 42, 72 52, 70 65 C74 55, 72 38, 62 25 C56 14, 50 5, 50 5 Z"/>
          <path d="M42 80 C38 90, 36 100, 40 112 C42 118, 48 122, 50 122 C52 122, 44 115, 44 105 C44 95, 48 88, 52 82 C48 84, 44 86, 42 80 Z"/>
          <path d="M34 55 C28 62, 25 72, 28 85 C30 78, 34 70, 40 65 C36 65, 32 62, 34 55 Z"/>
        </svg>
        <span className="font-serif text-2xl text-text">Mughtafar</span>
      </div>
      <div className="font-serif italic text-lg text-gold mb-1">Ana Kheir Ente Kheir</div>
      <div className="text-sm text-text3 mb-6">Salafiyah Pasuruan</div>
      
      <div className="flex items-center justify-center gap-3 mb-6">
        <a href="#" target="_blank" rel="noopener" className="w-10 h-10 rounded-full flex items-center justify-center bg-[#bc1888] text-white transition-transform duration-200 hover:scale-110">
          <Instagram className="w-5 h-5" />
        </a>
        <a href="#" target="_blank" rel="noopener" className="w-10 h-10 rounded-full flex items-center justify-center bg-[#1877f2] text-white transition-transform duration-200 hover:scale-110">
          <Facebook className="w-5 h-5" />
        </a>
        <a href="#" target="_blank" rel="noopener" className="w-10 h-10 rounded-full flex items-center justify-center bg-red-600 text-white transition-transform duration-200 hover:scale-110">
          <Youtube className="w-5 h-5" />
        </a>
      </div>

      <nav className="flex flex-wrap justify-center gap-2 mb-8">
        {['Beranda', 'Anggota', 'Dokumentasi', 'Quotes', 'Artikel', 'Tentang'].map((item) => (
          <NavLink 
            key={item}
            to={item === 'Beranda' ? '/' : `/${item.toLowerCase()}`}
            className="px-3 py-1 text-[0.82rem] text-text3 rounded-md transition-colors duration-200 hover:text-accent2"
          >
            {item}
          </NavLink>
        ))}
      </nav>

      <div className="text-[0.75rem] text-text3 border-t border-border pt-6 max-w-2xl mx-auto">
        © 2024 Angkatan Mughtafar — Salafiyah Pasuruan. Semua hak dilindungi.
      </div>
    </footer>
  );
};
