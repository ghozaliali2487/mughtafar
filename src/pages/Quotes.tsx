import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Quote } from '../types';

const QuotesPage = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const q = query(collection(db, 'quotes'));
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Quote));
      setQuotes(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="py-20 px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <div className="text-[0.75rem] tracking-[0.3em] uppercase text-accent2 mb-3 opacity-80">Inspirasi</div>
        <h2 className="font-serif text-[clamp(1.8rem,4vw,2.8rem)] font-semibold text-text mb-4">Quotes & Mutiara Kata</h2>
        <div className="w-16 h-[2px] bg-gradient-to-r from-accent to-transparent mx-auto"></div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {quotes.length > 0 ? quotes.map((q, idx) => (
            <motion.div 
              key={q.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-surface border border-border rounded-[20px] p-10 relative group hover:border-gold/30 transition-all duration-300"
            >
              <div className="font-serif text-5xl text-accent opacity-20 absolute top-6 left-6 group-hover:opacity-40 transition-opacity">"</div>
              <p className="font-serif italic text-lg text-text leading-relaxed relative z-10 pt-4 mb-6">
                {q.text}
              </p>
              <div className="text-[0.8rem] text-accent2 font-medium racking-wider group-hover:text-gold tracking-widest transition-colors uppercase">
                — {q.author || 'Anonim'}
              </div>
            </motion.div>
          )) : (
            <div className="col-span-full text-center py-20 text-text3 text-sm italic">Belum ada quotes yang ditambahkan.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuotesPage;
