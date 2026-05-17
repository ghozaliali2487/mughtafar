import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Artikel } from '../types';

const ArtikelPage = () => {
  const [artikels, setArtikels] = useState<Artikel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const q = query(collection(db, 'artikels'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Artikel));
      setArtikels(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="py-20 px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <div className="text-[0.75rem] tracking-[0.3em] uppercase text-accent2 mb-3 opacity-80">Blog</div>
        <h2 className="font-serif text-[clamp(1.8rem,4vw,2.8rem)] font-semibold text-text mb-4">Artikel & Tulisan</h2>
        <div className="w-16 h-[2px] bg-gradient-to-r from-accent to-transparent mx-auto"></div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {artikels.length > 0 ? artikels.map((a, idx) => (
            <motion.div 
              key={a.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-surface border border-border rounded-[20px] overflow-hidden group hover:border-gold/30 transition-all duration-300"
            >
              <div className="w-full aspect-[16/10] bg-bg3 overflow-hidden">
                {a.cover ? (
                  <img src={a.cover} alt={a.judul} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl opacity-20 bg-gradient-to-br from-bg2 to-bg3">📝</div>
                )}
              </div>
              <div className="p-8">
                <div className="text-[0.65rem] tracking-[0.15em] uppercase text-accent font-semibold mb-3">{a.kat || 'Umum'}</div>
                <h3 className="font-serif text-xl font-semibold text-text mb-4 leading-snug group-hover:text-gold transition-colors">{a.judul}</h3>
                <div className="flex items-center gap-3 pt-6 border-t border-border text-[0.75rem] text-text3">
                  <span className="font-medium text-text2 uppercase tracking-wider">{a.penulis || 'Tim Mughtafar'}</span>
                  <span>•</span>
                  <span>{a.date || 'Lama'}</span>
                </div>
              </div>
            </motion.div>
          )) : (
            <div className="col-span-full text-center py-20 text-text3 text-sm italic">Belum ada artikel yang ditambahkan.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default ArtikelPage;
