import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, query, getDocs, orderBy, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Album, Photo } from '../types';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

const DokumentasiPage = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [albumPhotos, setAlbumPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const q = query(collection(db, 'albums'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setAlbums(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Album)));
      setLoading(false);
    };
    fetchData();
  }, []);

  const openAlbum = async (album: Album) => {
    setSelectedAlbum(album);
    setLoading(true);
    const q = query(collection(db, 'photos'), where('albumId', '==', album.id), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    setAlbumPhotos(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Photo)));
    setLoading(false);
  };

  return (
    <div className="py-20 px-8 max-w-7xl mx-auto min-h-screen">
      <AnimatePresence mode="wait">
        {!selectedAlbum ? (
          <motion.div 
            key="albums"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-center mb-12">
              <div className="text-[0.75rem] tracking-[0.3em] uppercase text-accent2 mb-3 opacity-80">Galeri</div>
              <h2 className="font-serif text-[clamp(1.8rem,4vw,2.8rem)] font-semibold text-text mb-4">Dokumentasi Kegiatan</h2>
              <div className="w-16 h-[2px] bg-gradient-to-r from-accent to-transparent mx-auto"></div>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {albums.length > 0 ? albums.map((a) => (
                  <motion.div 
                    key={a.id}
                    onClick={() => openAlbum(a)}
                    className="bg-surface border border-border rounded-[24px] overflow-hidden group cursor-pointer hover:border-accent hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="w-full aspect-[4/3] bg-bg3 flex items-center justify-center overflow-hidden">
                      <ImageIcon className="w-12 h-12 text-text3 opacity-20" />
                    </div>
                    <div className="p-8">
                      <h3 className="font-serif text-xl font-semibold text-text mb-2 group-hover:text-gold transition-colors">{a.nama}</h3>
                      <p className="text-text3 text-[0.85rem] line-clamp-2">{a.desc || 'Dokumentasi kegiatan angkatan.'}</p>
                    </div>
                  </motion.div>
                )) : (
                  <div className="col-span-full py-20 text-center text-text3 text-sm italic">Belum ada album dokumentasi.</div>
                )}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="album-detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <button 
              onClick={() => setSelectedAlbum(null)}
              className="mb-8 px-4 py-2 border border-border rounded-lg text-text text-sm flex items-center gap-2 hover:border-accent hover:text-accent2 transition-all"
            >
              <ChevronLeft className="w-4 h-4" /> Kembali ke Galeri
            </button>
            
            <header className="mb-12">
              <h2 className="font-serif text-4xl text-text mb-3">{selectedAlbum.nama}</h2>
              <p className="text-text3 text-[0.95rem]">{selectedAlbum.desc}</p>
              <div className="w-20 h-1 bg-accent mt-4"></div>
            </header>

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {albumPhotos.length > 0 ? albumPhotos.map((p, idx) => (
                  <motion.div 
                    key={p.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => setLightboxIndex(idx)}
                    className="aspect-square bg-bg3 rounded-[18px] overflow-hidden relative group cursor-pointer"
                  >
                    <img src={p.url} alt="Dokumentasi" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Maximize2 className="text-white w-6 h-6" />
                    </div>
                  </motion.div>
                )) : (
                  <div className="col-span-full py-20 text-center text-text3 text-sm italic">Album ini belum memiliki foto.</div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[5000] bg-black/95 flex flex-col items-center justify-center p-8"
          >
            <button 
              onClick={() => setLightboxIndex(null)}
              className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            
            <div className="relative w-full max-w-5xl aspect-auto flex items-center justify-center">
              <button 
                onClick={() => setLightboxIndex(prev => prev! > 0 ? prev! - 1 : albumPhotos.length - 1)}
                className="absolute left-0 text-white/30 hover:text-white transition-all bg-white/5 p-4 rounded-full"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              
              <img 
                src={albumPhotos[lightboxIndex].url} 
                className="max-h-[80vh] max-w-full object-contain rounded-lg shadow-2xl" 
                alt="Lightbox" 
              />

              <button 
                onClick={() => setLightboxIndex(prev => prev! < albumPhotos.length - 1 ? prev! + 1 : 0)}
                className="absolute right-0 text-white/30 hover:text-white transition-all bg-white/5 p-4 rounded-full"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </div>
            
            <div className="mt-8 text-white/50 text-sm tracking-widest uppercase">
              {lightboxIndex + 1} / {albumPhotos.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ImageIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
    <circle cx="8.5" cy="8.5" r="1.5"/>
    <polyline points="21 15 16 10 5 21"/>
  </svg>
);

export default DokumentasiPage;
