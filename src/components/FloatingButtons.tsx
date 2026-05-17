import React, { useState, useRef } from 'react';
import { MessageCircle, Music, Play, Pause } from 'lucide-react';
import { cn } from '../lib/utils';

export const FloatingButtons = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.log("User interaction required"));
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <>
      <a 
        href="https://wa.me/6281234567890" 
        target="_blank" 
        rel="noopener"
        className="fixed bottom-8 right-8 w-14 h-14 bg-[#25d366] text-white rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 z-[500]"
        title="WhatsApp Admin"
      >
        <MessageCircle className="w-7 h-7" />
      </a>

      <button 
        onClick={toggleMusic}
        className={cn(
          "fixed bottom-24 right-8 w-11 h-11 bg-surface border border-border text-text2 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 z-[500]",
          isPlaying && "text-gold border-gold"
        )}
        title="Musik Sholawat"
      >
        {isPlaying ? <Pause className="w-5 h-5" /> : <Music className="w-5 h-5" />}
      </button>

      <audio 
        ref={audioRef}
        loop 
        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" // Placeholder music
      />
    </>
  );
};
