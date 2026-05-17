import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, limit, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Anggota, Artikel } from '../types';

const Home = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ anggota: 0, foto: 0, artikel: 0, pengunjung: 0 });
  const [latestArtikels, setLatestArtikels] = useState<Artikel[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // Basic stats
      const anggotaSnap = await getDocs(collection(db, 'anggota'));
      const artikelSnap = await getDocs(collection(db, 'artikels'));
      const photosSnap = await getDocs(collection(db, 'photos'));
      
      setStats({
        anggota: anggotaSnap.size,
        artikel: artikelSnap.size,
        foto: photosSnap.size,
        pengunjung: Math.floor(Math.random() * 1000) + 500 // Placeholder for visitors
      });

      // Latest articles
      const artikelsQuery = query(collection(db, 'artikels'), orderBy('createdAt', 'desc'), limit(3));
      const artikelsSnap = await getDocs(artikelsQuery);
      setLatestArtikels(artikelsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Artikel)));
    };
    fetchData();
  }, []);

  return (
    <div id="page-beranda">
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden -mt-[70px]">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,15,13,0.4)_0%,rgba(10,15,13,0.7)_50%,rgba(10,15,13,0.95)_100%),url('https://images.unsplash.com/photo-1585036156171-384164a8c675?w=1920&q=80')] bg-center bg-cover bg-no-repeat"></div>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center max-w-2xl p-8"
        >
          <div className="font-arabic text-3xl text-gold opacity-90 mb-4 tracking-wider">السّلام عليكم</div>
          <h1 className="font-serif text-[clamp(3rem,8vw,6rem)] font-semibold text-white tracking-widest leading-none mb-2 drop-shadow-2xl">MUGHTAFAR</h1>
          <div className="font-serif text-[clamp(1rem,3vw,1.5rem)] font-normal italic text-gold2 tracking-[0.15em] mb-2">Ana Kheir Ente Kheir</div>
          <div className="text-[0.85rem] tracking-[0.3em] uppercase text-text2 mb-10 opacity-80">Salafiyah Pasuruan</div>
          
          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <button 
              onClick={() => navigate('/anggota')}
              className="px-8 py-3 bg-accent text-white rounded-xl font-medium transition-all duration-200 hover:bg-accent2 hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(74,148,88,0.3)]"
            >
              Lihat Anggota
            </button>
            <button 
              onClick={() => navigate('/dokumentasi')}
              className="px-8 py-3 bg-transparent text-text border border-border2 rounded-xl transition-all duration-200 hover:border-accent hover:text-accent2 hover:-translate-y-0.5"
            >
              Dokumentasi
            </button>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-surface2 border border-border rounded-full text-[0.78rem] text-text3">
            <span>👁</span><span>{stats.pengunjung}</span> pengunjung
          </div>
        </motion.div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 cursor-pointer">
          <span className="text-[0.7rem] tracking-[0.2em] uppercase text-text2">Scroll</span>
          <div className="w-[1px] h-10 bg-gradient-to-b from-accent2 to-transparent animate-[scrollLine_2s_ease-in-out_infinite]"></div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-20 px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12 flex flex-col items-center">
          <div className="text-[0.75rem] tracking-[0.3em] uppercase text-accent2 mb-3 opacity-80">Statistik</div>
          <h2 className="font-serif text-[clamp(1.8rem,4vw,2.8rem)] font-semibold text-text mb-4">Angkatan Mughtafar</h2>
          <div className="w-16 h-[2px] bg-gradient-to-r from-accent to-transparent"></div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: '👥', num: stats.anggota, label: 'Anggota' },
            { icon: '📸', num: stats.foto, label: 'Foto' },
            { icon: '📝', num: stats.artikel, label: 'Artikel' },
            { icon: '🌐', num: stats.pengunjung, label: 'Pengunjung' }
          ].map((s, idx) => (
            <motion.div 
              key={idx}
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              className="bg-surface border border-border rounded-[20px] p-8 text-center relative overflow-hidden transition-all duration-300 hover:border-border2 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(74,148,88,0.15)]"
            >
              <div className="text-2xl mb-3 opacity-70">{s.icon}</div>
              <div className="font-serif text-4xl font-semibold text-accent2 leading-none">{s.num}</div>
              <div className="text-[0.8rem] text-text3 mt-2 tracking-widest uppercase">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ABOUT PREVIEW */}
      <section className="bg-bg2 border-y border-border py-20 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div whileInView={{ opacity: 1, x: 0 }} initial={{ opacity: 0, x: -30 }}>
            <div className="text-[0.75rem] tracking-[0.3em] uppercase text-accent2 mb-3 opacity-80">Tentang Kami</div>
            <h2 className="font-serif text-[clamp(1.8rem,4vw,2.8rem)] font-semibold text-text mb-4">Angkatan <span className="text-gold">Mughtafar</span></h2>
            <div className="w-12 h-[2px] bg-accent mb-6"></div>
            <p className="text-text2 leading-loose text-[0.9rem] mb-8">
              Angkatan Mughtafar merupakan angkatan pondok pesantren Salafiyah Pasuruan yang lahir dari semangat dan tekad para santri yang luar biasa. 
              Dengan slogan "Ana Kheir Ente Kheir" — Aku baik, kamu pun baik — kami percaya bahwa kebaikan setiap individu adalah fondasi kebaikan bersama.
            </p>
            <button 
              onClick={() => navigate('/tentang')}
              className="px-4 py-2 border border-border bg-transparent text-text font-serif italic text-sm transition-all duration-200 hover:border-accent hover:text-accent2"
            >
              Selengkapnya →
            </button>
          </motion.div>
          <motion.div 
            whileInView={{ opacity: 1, x: 0 }} 
            initial={{ opacity: 0, x: 30 }}
            className="bg-surface border border-border rounded-[20px] p-10 text-center"
          >
            <div className="font-arabic text-3xl text-gold mb-4 tracking-wider leading-relaxed">أنا خير أنت خير</div>
            <p className="font-serif italic text-text2 text-xl mb-2">"Ana Kheir Ente Kheir"</p>
            <p className="text-text3 text-[0.85rem]">Aku Baik, Engkau Pun Baik</p>
          </motion.div>
        </div>
      </section>

      {/* ARTICLES PREVIEW */}
      <section className="py-20 px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12 flex flex-col items-center">
          <div className="text-[0.75rem] tracking-[0.3em] uppercase text-accent2 mb-3 opacity-80">Blog</div>
          <h2 className="font-serif text-[clamp(1.8rem,4vw,2.8rem)] font-semibold text-text mb-4">Artikel Terbaru</h2>
          <div className="w-16 h-[2px] bg-gradient-to-r from-accent to-transparent"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestArtikels.length > 0 ? latestArtikels.map((a) => (
            <motion.div 
              key={a.id}
              onClick={() => navigate(`/artikel/${a.id}`)}
              className="bg-surface border border-border rounded-[20px] overflow-hidden cursor-pointer transition-all duration-300 hover:border-border2 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="w-full aspect-video bg-bg3 overflow-hidden flex items-center justify-center">
                {a.cover ? <img src={a.cover} alt={a.judul} className="w-full h-full object-cover" /> : <div className="text-3xl opacity-30">📝</div>}
              </div>
              <div className="p-6">
                <div className="text-[0.7rem] tracking-wider uppercase text-accent2 mb-2">{a.kat || 'Umum'}</div>
                <h3 className="font-serif text-lg font-semibold text-text mb-3 leading-tight">{a.judul}</h3>
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border text-[0.75rem] text-text3">
                  <span>{a.penulis || 'Tim Mughtafar'}</span>
                  <span>•</span>
                  <span>{a.date || 'Baru ini'}</span>
                </div>
              </div>
            </motion.div>
          )) : (
            <div className="col-span-full text-center py-20 text-text3 text-sm italic">Belum ada artikel yang ditambahkan.</div>
          )}
        </div>
        
        <div className="text-center mt-12">
          <button 
            onClick={() => navigate('/artikel')}
            className="px-6 py-2.5 border border-border bg-transparent text-text transition-all duration-200 hover:border-accent hover:text-accent2"
          >
            Lihat Semua Artikel →
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
