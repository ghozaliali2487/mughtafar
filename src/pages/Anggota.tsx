import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Anggota } from '../types';

const AnggotaPage = () => {
  const [anggota, setAnggota] = useState<Anggota[]>([]);
  const [filteredAnggota, setFilteredAnggota] = useState<Anggota[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterKelas, setFilterKelas] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const q = query(collection(db, 'anggota'));
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Anggota));
      setAnggota(data);
      setFilteredAnggota(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const results = anggota.filter(a => 
      (a.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
       a.alamat?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterKelas === '' || a.kelas === filterKelas)
    );
    setFilteredAnggota(results);
  }, [searchTerm, filterKelas, anggota]);

  const uniqueClasses = Array.from(new Set(anggota.map(a => a.kelas).filter(Boolean)));

  return (
    <div className="py-20 px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <div className="text-[0.75rem] tracking-[0.3em] uppercase text-accent2 mb-3 opacity-80">Komunitas</div>
        <h2 className="font-serif text-[clamp(1.8rem,4vw,2.8rem)] font-semibold text-text mb-4">Anggota Angkatan</h2>
        <div className="w-16 h-[2px] bg-gradient-to-r from-accent to-transparent mx-auto"></div>
      </div>

      <div className="flex flex-wrap gap-4 mb-12 items-center">
        <input 
          type="text" 
          placeholder="Cari anggota..." 
          className="flex-grow min-w-[200px] px-4 py-2.5 bg-surface border border-border rounded-xl text-text text-sm transition-all focus:border-accent outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select 
          className="px-4 py-2.5 bg-surface border border-border rounded-xl text-text text-sm transition-all focus:border-accent outline-none cursor-pointer"
          value={filterKelas}
          onChange={(e) => setFilterKelas(e.target.value)}
        >
          <option value="">Semua Kelas</option>
          {uniqueClasses.map(k => <option key={k} value={k}>{k}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAnggota.length > 0 ? filteredAnggota.map((a) => (
            <motion.div 
              key={a.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-surface border border-border rounded-[20px] overflow-hidden transition-all duration-300 hover:border-accent hover:-translate-y-1 group"
            >
              <div className="w-full aspect-square bg-bg3 relative overflow-hidden">
                {a.foto ? (
                  <img src={a.foto} alt={a.nama} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-serif text-5xl font-semibold text-accent opacity-30">
                    {a.nama[0]}
                  </div>
                )}
              </div>
              <div className="p-6 text-center">
                <div className="font-serif text-lg font-semibold text-text mb-1">{a.nama}</div>
                <div className="text-[0.8rem] text-accent2 mb-1">{a.kelas} {a.kamar && `· ${a.kamar}`}</div>
                {a.address && <div className="text-[0.75rem] text-text3 mb-3">{a.address}</div>}
                
                {a.motto && (
                  <div className="pt-4 border-t border-border mt-3 text-[0.8rem] text-text3 italic leading-relaxed">
                    "{a.motto}"
                  </div>
                )}
              </div>
            </motion.div>
          )) : (
            <div className="col-span-full text-center py-20">
              <div className="text-4xl mb-4 opacity-20">👥</div>
              <p className="text-text3 text-sm italic">Anggota tidak ditemukan.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AnggotaPage;
