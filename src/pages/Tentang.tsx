import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Pengurus } from '../types';

const TentangPage = () => {
  const [pengurus, setPengurus] = useState<Pengurus[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const q = query(collection(db, 'pengurus'));
      const snap = await getDocs(q);
      setPengurus(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Pengurus)));
    };
    fetchData();
  }, []);

  return (
    <div className="py-20 px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <div className="text-[0.75rem] tracking-[0.3em] uppercase text-accent2 mb-3 opacity-80">Profil</div>
        <h2 className="font-serif text-[clamp(1.8rem,4vw,2.8rem)] font-semibold text-text mb-4">Tentang Kami</h2>
        <div className="w-16 h-[2px] bg-gradient-to-r from-accent to-transparent mx-auto"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface border border-border rounded-[30px] p-12 text-center mb-20 relative overflow-hidden"
      >
        <div className="font-arabic text-5xl text-gold opacity-10 absolute -top-4 -right-4 select-none">مُغتفَر</div>
        <div className="font-arabic text-5xl text-gold mb-6 tracking-widest">مُغتفَر</div>
        <h2 className="font-serif text-3xl font-semibold text-text mb-2">Angkatan Mughtafar</h2>
        <p className="font-serif italic text-gold2 text-xl mb-4">Ana Kheir Ente Kheir</p>
        <p className="text-text3 text-sm tracking-widest uppercase mb-10">Salafiyah Pasuruan</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left max-w-4xl mx-auto border-t border-border pt-12">
          <div>
            <h3 className="font-serif text-xl text-text mb-6 flex items-center gap-3">
              <span className="text-gold text-2xl">🌟</span> Visi
            </h3>
            <p className="text-text2 text-[0.92rem] leading-relaxed">
              Menjadi angkatan pondok pesantren yang berprestasi, berakhlak mulia, dan menjadi teladan bagi generasi berikutnya dalam mengemban nilai-nilai Islam Ahlussunnah wal Jamaah.
            </p>
          </div>
          <div>
            <h3 className="font-serif text-xl text-text mb-6 flex items-center gap-3">
              <span className="text-gold text-2xl">🎯</span> Misi
            </h3>
            <ul className="space-y-4 text-text2 text-[0.92rem]">
              <li className="flex gap-3">
                <span className="text-accent2">✦</span>
                Menguatkan ukhuwah antar anggota angkatan
              </li>
              <li className="flex gap-3">
                <span className="text-accent2">✦</span>
                Meningkatkan kualitas ilmu dan amal
              </li>
              <li className="flex gap-3">
                <span className="text-accent2">✦</span>
                Menjaga nama baik almamater
              </li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Makna Slogan */}
      <section className="mb-20">
        <div className="bg-gradient-to-br from-bg2 to-surface border border-border2 rounded-[30px] p-12 text-center shadow-xl">
          <div className="text-[0.7rem] uppercase tracking-widest text-accent2 mb-6">Makna Slogan</div>
          <div className="font-arabic text-4xl text-gold mb-8 leading-relaxed tracking-wider">أنا خير أنت خير</div>
          <h3 className="font-serif text-3xl text-text mb-6">Ana Kheir Ente Kheir</h3>
          <p className="text-text2 leading-loose text-lg max-w-3xl mx-auto italic">
            "Slogan ini mengandung filosofi mendalam bahwa kebaikan itu menular. Ketika setiap individu menjaga kebaikan dirinya sendiri, maka kebaikan tersebut akan memancar dan mempengaruhi orang-orang di sekitarnya."
          </p>
        </div>
      </section>

      {/* Pengurus */}
      <section>
        <div className="text-center mb-12">
          <div className="text-[0.75rem] tracking-[0.3em] uppercase text-accent2 mb-3 opacity-80">Kepengurusan</div>
          <h2 className="font-serif text-[clamp(1.8rem,4vw,2.5rem)] font-semibold text-text mb-4">Tim Pengurus</h2>
          <div className="w-16 h-[2px] bg-gradient-to-r from-accent to-transparent mx-auto"></div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {pengurus.length > 0 ? pengurus.map((p) => (
            <motion.div 
              key={p.id}
              whileHover={{ y: -5 }}
              className="bg-surface border border-border p-8 rounded-[24px] text-center transition-all duration-300 hover:border-accent hover:shadow-lg"
            >
              <div className="w-24 h-24 rounded-full bg-bg3 mx-auto mb-6 overflow-hidden border-2 border-border2 ring-4 ring-bg2 group-hover:border-accent transition-all duration-300">
                {p.foto ? (
                  <img src={p.foto} alt={p.nama} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-accent text-3xl font-serif">{p.nama[0]}</div>
                )}
              </div>
              <h4 className="font-serif text-lg text-text mb-1">{p.nama}</h4>
              <p className="text-[0.75rem] text-accent2 font-medium tracking-wide uppercase">{p.jabatan}</p>
            </motion.div>
          )) : (
            <div className="col-span-full py-12 text-center text-text3 text-sm italic">Data pengurus belum tersedia.</div>
          )}
        </div>
      </section>
    </div>
  );
};

export default TentangPage;
