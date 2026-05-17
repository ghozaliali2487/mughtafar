import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, Users, Image as ImageIcon, MessageSquare, FileText, 
  Settings as SettingsIcon, LogOut, Plus, Trash2, Edit2, Shield,
  ChevronRight, Save, X, Camera, Crown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { auth, db, googleProvider } from '../lib/firebase';
import { signInWithPopup, signOut } from 'firebase/auth';
import { 
  collection, getDocs, addDoc, updateDoc, deleteDoc, 
  doc, onSnapshot, query, orderBy, serverTimestamp 
} from 'firebase/firestore';
import { cn, handleFirestoreError, OperationType } from '../lib/utils';
import { Anggota, Album, Quote, Artikel, Pengurus, Settings } from '../types';

type Section = 'dashboard' | 'anggota' | 'dokumentasi' | 'quotes' | 'artikel' | 'pengurus' | 'pengaturan';

const AdminPage = () => {
  const { user, isAdmin, loading } = useAuth();
  const [activeSection, setActiveSection] = useState<Section>('dashboard');
  const [counts, setCounts] = useState({ anggota: 0, foto: 0, artikel: 0, quotes: 0 });
  
  // Data States
  const [anggota, setAnggota] = useState<Anggota[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [artikels, setArtikels] = useState<Artikel[]>([]);
  const [pengurus, setPengurus] = useState<Pengurus[]>([]);
  const [settings, setSettings] = useState<Settings>({});

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  useEffect(() => {
    if (!isAdmin) return;

    // Real-time listeners
    const unsub = [
      onSnapshot(collection(db, 'anggota'), (snap) => {
        setAnggota(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Anggota)));
        setCounts(prev => ({ ...prev, anggota: snap.size }));
      }),
      onSnapshot(collection(db, 'artikels'), (snap) => {
        setArtikels(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Artikel)));
        setCounts(prev => ({ ...prev, artikel: snap.size }));
      }),
      onSnapshot(collection(db, 'quotes'), (snap) => {
        setQuotes(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Quote)));
        setCounts(prev => ({ ...prev, quotes: snap.size }));
      }),
      onSnapshot(collection(db, 'albums'), (snap) => {
        setAlbums(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Album)));
      }),
      onSnapshot(collection(db, 'pengurus'), (snap) => {
        setPengurus(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Pengurus)));
      })
    ];

    return () => unsub.forEach(fn => fn());
  }, [isAdmin]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen bg-bg"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div></div>;

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg px-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-surface border border-border rounded-[20px] p-10 w-full max-w-md text-center shadow-2xl">
          <div className="w-16 h-16 bg-gradient-to-br from-accent to-accent3 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Shield className="text-white w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl text-text mb-2">Admin Access</h2>
          <p className="text-text3 text-sm mb-8">Halaman ini hanya untuk admin Angkatan Mughtafar.</p>
          
          <button 
            onClick={handleLogin}
            className="w-full py-3 bg-accent text-white rounded-xl font-medium transition-all hover:bg-accent2"
          >
            Masuk dengan Google
          </button>
          
          {user && !isAdmin && (
            <p className="mt-4 text-danger text-xs">
              Email <b>{user.email}</b> tidak memiliki akses admin.
            </p>
          )}
        </motion.div>
      </div>
    );
  }

  const sections = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'anggota', name: 'Anggota', icon: Users },
    { id: 'dokumentasi', name: 'Dokumentasi', icon: ImageIcon },
    { id: 'quotes', name: 'Quotes', icon: MessageSquare },
    { id: 'artikel', name: 'Artikel', icon: FileText },
    { id: 'pengurus', name: 'Pengurus', icon: Crown },
    { id: 'pengaturan', name: 'Pengaturan', icon: SettingsIcon },
  ];

  return (
    <div className="flex min-h-screen bg-bg">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-bg2 hidden md:flex flex-col sticky top-[70px] h-[calc(100vh-70px)]">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-border">
            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-white font-arabic text-lg">م</div>
            <div>
              <div className="font-serif text-sm text-text">Mughtafar</div>
              <div className="text-[0.65rem] text-text3 uppercase tracking-widest">Admin Control</div>
            </div>
          </div>
          
          <nav className="space-y-1">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id as Section)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200",
                  activeSection === s.id ? "bg-surface2 text-accent2 shadow-sm" : "text-text2 hover:bg-surface2/50"
                )}
              >
                <s.icon className="w-4 h-4" />
                {s.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-border">
          <button 
            onClick={() => signOut(auth)}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-danger hover:bg-danger/10 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeSection === 'dashboard' && (
              <div>
                <header className="flex justify-between items-center mb-10">
                  <h2 className="font-serif text-3xl text-text">Dashboard Overview</h2>
                  <div className="flex gap-4">
                    <button onClick={() => window.open('/', '_blank')} className="px-4 py-2 bg-surface border border-border text-text rounded-lg text-sm hover:border-accent">Lihat Web</button>
                  </div>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                  {[
                    { icon: Users, num: counts.anggota, label: 'Anggota', color: 'text-blue-400' },
                    { icon: ImageIcon, num: counts.foto, label: 'Total Foto', color: 'text-purple-400' },
                    { icon: FileText, num: counts.artikel, label: 'Artikel', color: 'text-orange-400' },
                    { icon: MessageSquare, num: counts.quotes, label: 'Quotes', color: 'text-green-400' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-surface border border-border p-8 rounded-[20px] transition-all hover:border-border2">
                      <stat.icon className={cn("w-6 h-6 mb-4", stat.color)} />
                      <div className="font-serif text-4xl font-semibold text-text mb-1">{stat.num}</div>
                      <div className="text-[0.7rem] text-text3 uppercase tracking-widest">{stat.label}</div>
                    </div>
                  ))}
                </div>

                <div className="bg-surface border border-border rounded-[20px] p-8">
                  <h3 className="font-serif text-xl text-text mb-4">Selamat Datang, Admin!</h3>
                  <p className="text-text2 text-sm leading-relaxed max-w-2xl">
                    Panel ini memungkinkan Anda mengelola seluruh konten website Angkatan Mughtafar secara real-time. 
                    Setiap perubahan yang Anda simpan akan langsung terlihat oleh pengunjung website.
                  </p>
                </div>
              </div>
            )}

            {activeSection === 'anggota' && <AnggotaManager items={anggota} />}
            {activeSection === 'quotes' && <QuoteManager items={quotes} />}
            {activeSection === 'artikel' && <ArtikelManager items={artikels} />}
            {activeSection === 'dokumentasi' && <AlbumManager items={albums} />}
            {activeSection === 'pengurus' && <PengurusManager items={pengurus} />}
            {/* ... other sections to be implemented */}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

// --- Sub-Components for Management ---

const AnggotaManager = ({ items }: { items: Anggota[] }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Partial<Anggota> | null>(null);
  const [formData, setFormData] = useState<Partial<Anggota>>({});

  const save = async () => {
    try {
      const { id, ...data } = formData;
      if (editItem?.id) {
        await updateDoc(doc(db, 'anggota', editItem.id), data);
      } else {
        await addDoc(collection(db, 'anggota'), data);
      }
      setIsModalOpen(false);
      setFormData({});
      setEditItem(null);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'anggota');
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Hapus anggota ini?')) return;
    await deleteDoc(doc(db, 'anggota', id));
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, foto: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <header className="flex justify-between items-center mb-8">
        <h2 className="font-serif text-3xl text-text">Kelola Anggota</h2>
        <button onClick={() => { setEditItem(null); setFormData({}); setIsModalOpen(true); }} className="px-4 py-2 bg-accent text-white rounded-lg text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Tambah Anggota
        </button>
      </header>

      <div className="bg-surface border border-border rounded-[20px] overflow-hidden overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-bg2 border-b border-border text-[0.7rem] uppercase tracking-widest text-text3">
            <tr>
              <th className="px-6 py-4">Foto</th>
              <th className="px-6 py-4">Nama</th>
              <th className="px-6 py-4">Kelas</th>
              <th className="px-6 py-4">Kamar</th>
              <th className="px-6 py-4">Aksi</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-border">
            {items.map(item => (
              <tr key={item.id} className="hover:bg-surface2/30 transition-colors">
                <td className="px-6 py-4">
                  {item.foto ? <img src={item.foto} className="w-10 h-10 rounded-full object-cover border border-border" /> : <div className="w-10 h-10 bg-bg3 rounded-full flex items-center justify-center text-xs opacity-50">?</div>}
                </td>
                <td className="px-6 py-4 font-medium text-text">{item.nama}</td>
                <td className="px-6 py-4 text-text2">{item.kelas}</td>
                <td className="px-6 py-4 text-text3">{item.kamar}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => { setEditItem(item); setFormData(item); setIsModalOpen(true); }} className="p-2 text-text3 hover:text-accent2"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => remove(item.id)} className="p-2 text-text3 hover:text-danger"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-bg2 border border-border rounded-[20px] w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-border flex justify-between items-center bg-surface">
              <h3 className="font-serif text-xl">{editItem ? 'Edit' : 'Tambah'} Anggota</h3>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-text3" /></button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-[0.7rem] uppercase text-text3 mb-2">Foto Anggota</label>
                <div onClick={() => document.getElementById('file-input')?.click()} className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:bg-surface2 transition-all">
                  {formData.foto ? (
                    <img src={formData.foto} className="mx-auto w-24 h-24 rounded-full object-cover mb-4" />
                  ) : (
                    <Camera className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  )}
                  <p className="text-xs text-text2">Klik untuk pilih foto</p>
                </div>
                <input id="file-input" type="file" hidden accept="image/*" onChange={handleFile} />
              </div>
              <input 
                type="text" 
                placeholder="Nama Lengkap" 
                className="w-full bg-surface border border-border p-3 rounded-xl outline-none focus:border-accent text-sm"
                value={formData.nama || ''}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="text" 
                  placeholder="Kelas (contoh: 6A)" 
                  className="w-full bg-surface border border-border p-3 rounded-xl outline-none focus:border-accent text-sm"
                  value={formData.kelas || ''}
                  onChange={(e) => setFormData({ ...formData, kelas: e.target.value })}
                />
                <input 
                  type="text" 
                  placeholder="Kamar" 
                  className="w-full bg-surface border border-border p-3 rounded-xl outline-none focus:border-accent text-sm"
                  value={formData.kamar || ''}
                  onChange={(e) => setFormData({ ...formData, kamar: e.target.value })}
                />
              </div>
              <textarea 
                placeholder="Motto Hidup" 
                className="w-full bg-surface border border-border p-3 rounded-xl outline-none focus:border-accent text-sm min-h-[80px]"
                value={formData.motto || ''}
                onChange={(e) => setFormData({ ...formData, motto: e.target.value })}
              />
            </div>
            <div className="p-6 bg-surface border-t border-border flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-2 rounded-lg text-sm text-text3 hover:text-text">Batal</button>
              <button onClick={save} className="px-6 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent2">Simpan</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

// ... Repeat similar structures for QuoteManager, ArtikelManager, AlbumManager, PengurusManager ...
// For brevity, I'll include the Quote and Artikel ones as they are simpler.

const QuoteManager = ({ items }: { items: Quote[] }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Partial<Quote> | null>(null);
  const [formData, setFormData] = useState<Partial<Quote>>({});

  const save = async () => {
    try {
      const { id, ...data } = formData;
      if (editItem?.id) {
        await updateDoc(doc(db, 'quotes', editItem.id), data as any);
      } else {
        await addDoc(collection(db, 'quotes'), data);
      }
      setIsModalOpen(false);
      setFormData({});
      setEditItem(null);
    } catch (err) { handleFirestoreError(err, OperationType.WRITE, 'quotes'); }
  };

  return (
    <div>
      <header className="flex justify-between items-center mb-8">
        <h2 className="font-serif text-3xl text-text">Kelola Quotes</h2>
        <button onClick={() => { setEditItem(null); setFormData({}); setIsModalOpen(true); }} className="px-4 py-2 bg-accent text-white rounded-lg text-sm flex items-center gap-2"><Plus className="w-4 h-4" /> Tambah Quote</button>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map(q => (
          <div key={q.id} className="bg-surface border border-border p-6 rounded-[20px] relative">
            <p className="font-serif italic text-text2 mb-4 leading-relaxed">"{q.text}"</p>
            <div className="text-[0.8rem] text-accent2">— {q.author || 'Anonim'}</div>
            <div className="absolute top-4 right-4 flex gap-2">
              <button onClick={() => { setEditItem(q); setFormData(q); setIsModalOpen(true); }} className="p-1.5 text-text3 hover:text-accent"><Edit2 className="w-3.5 h-3.5" /></button>
              <button onClick={() => deleteDoc(doc(db, 'quotes', q.id))} className="p-1.5 text-text3 hover:text-danger"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-bg2 border border-border rounded-[20px] w-full max-w-lg shadow-2xl">
            <div className="p-6 border-b border-border bg-surface"><h3 className="font-serif text-xl">Tambah Quote</h3></div>
            <div className="p-6 space-y-4">
              <textarea placeholder="Tulis quote di sini..." className="w-full bg-surface border border-border p-4 rounded-xl outline-none focus:border-accent text-sm min-h-[120px]" value={formData.text || ''} onChange={e => setFormData({...formData, text: e.target.value})} />
              <input type="text" placeholder="Penulis" className="w-full bg-surface border border-border p-3 rounded-xl outline-none focus:border-accent text-sm" value={formData.author || ''} onChange={e => setFormData({...formData, author: e.target.value})} />
            </div>
            <div className="p-6 bg-surface border-t border-border flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-2 rounded-lg text-sm text-text3">Batal</button>
              <button onClick={save} className="px-6 py-2 bg-accent text-white rounded-lg text-sm font-medium">Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ArtikelManager = ({ items }: { items: Artikel[] }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Partial<Artikel> | null>(null);
  const [formData, setFormData] = useState<Partial<Artikel>>({});

  const save = async () => {
    try {
      const { id, ...rest } = formData;
      const data = {
        ...rest,
        createdAt: editItem?.id ? (editItem as Artikel).createdAt : serverTimestamp(),
        date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
      };
      if (editItem?.id) {
        await updateDoc(doc(db, 'artikels', editItem.id), data as any);
      } else {
        await addDoc(collection(db, 'artikels'), data);
      }
      setIsModalOpen(false);
      setFormData({});
      setEditItem(null);
    } catch (err) { handleFirestoreError(err, OperationType.WRITE, 'artikels'); }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, cover: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <header className="flex justify-between items-center mb-8">
        <h2 className="font-serif text-3xl text-text">Kelola Artikel</h2>
        <button onClick={() => { setEditItem(null); setFormData({}); setIsModalOpen(true); }} className="px-4 py-2 bg-accent text-white rounded-lg text-sm flex items-center gap-2"><Plus className="w-4 h-4" /> Tambah Artikel</button>
      </header>
      <div className="bg-surface border border-border rounded-[20px] overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-bg2 border-b border-border text-[0.7rem] uppercase tracking-widest text-text3">
            <tr>
              <th className="px-6 py-4">Judul</th>
              <th className="px-6 py-4">Kategori</th>
              <th className="px-6 py-4">Penulis</th>
              <th className="px-6 py-4">Aksi</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-border">
            {items.map(item => (
              <tr key={item.id} className="hover:bg-surface2/30 transition-colors">
                <td className="px-6 py-4 font-medium text-text">{item.judul}</td>
                <td className="px-6 py-4 text-accent2">{item.kat}</td>
                <td className="px-6 py-4 text-text3">{item.penulis}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => { setEditItem(item); setFormData(item); setIsModalOpen(true); }} className="p-2 hover:text-accent"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => deleteDoc(doc(db, 'artikels', item.id))} className="p-2 hover:text-danger"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-bg2 border border-border rounded-[20px] w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="p-6 bg-surface border-b border-border flex justify-between items-center">
              <h3 className="font-serif text-xl">Kelola Artikel</h3>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-text3" /></button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-[0.7rem] uppercase text-text3 mb-2">Cover Image</label>
                <div onClick={() => document.getElementById('cover-input')?.click()} className="border-2 border-dashed border-border rounded-xl aspect-video flex items-center justify-center cursor-pointer hover:bg-surface2 overflow-hidden">
                  {formData.cover ? <img src={formData.cover} className="w-full h-full object-cover" /> : <Camera className="w-8 h-8 opacity-20" />}
                </div>
                <input id="cover-input" type="file" hidden accept="image/*" onChange={handleFile} />
              </div>
              <input type="text" placeholder="Judul Artikel" className="w-full bg-surface border border-border p-3 rounded-xl outline-none" value={formData.judul || ''} onChange={e => setFormData({...formData, judul: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Penulis" className="w-full bg-surface border border-border p-3 rounded-xl outline-none" value={formData.penulis || ''} onChange={e => setFormData({...formData, penulis: e.target.value})} />
                <select className="w-full bg-surface border border-border p-3 rounded-xl outline-none" value={formData.kat || ''} onChange={e => setFormData({...formData, kat: e.target.value})}>
                  <option value="">Pilih Kategori</option>
                  <option value="Islami">Islami</option>
                  <option value="Motivasi">Motivasi</option>
                  <option value="Santri">Santri</option>
                </select>
              </div>
              <textarea placeholder="Isi Artikel (Mendukung HTML dasar)" className="w-full bg-surface border border-border p-3 rounded-xl outline-none min-h-[200px]" value={formData.isi || ''} onChange={e => setFormData({...formData, isi: e.target.value})} />
            </div>
            <div className="p-6 bg-surface border-t border-border flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-2 rounded-lg text-sm text-text3">Batal</button>
              <button onClick={save} className="px-6 py-2 bg-accent text-white rounded-lg text-sm font-medium">Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AlbumManager = ({ items }: { items: Album[] }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Partial<Album> | null>(null);
  const [formData, setFormData] = useState<Partial<Album>>({});
  const [uploading, setUploading] = useState(false);

  const save = async () => {
    try {
      const { id, ...data } = formData;
      const finalData = { ...data, createdAt: serverTimestamp() };
      if (editItem?.id) {
        await updateDoc(doc(db, 'albums', editItem.id), finalData as any);
      } else {
        await addDoc(collection(db, 'albums'), finalData);
      }
      setIsModalOpen(false);
      setFormData({});
      setEditItem(null);
    } catch (err) { handleFirestoreError(err, OperationType.WRITE, 'albums'); }
  };

  const handlePhotos = async (e: React.ChangeEvent<HTMLInputElement>, albumId: string) => {
    const files = e.target.files;
    if (!files) return;
    setUploading(true);
    for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onloadend = async () => {
            await addDoc(collection(db, 'photos'), { 
                albumId, 
                url: reader.result as string, 
                createdAt: serverTimestamp() 
            });
        };
        reader.readAsDataURL(files[i]);
    }
    setUploading(false);
  };

  return (
    <div>
      <header className="flex justify-between items-center mb-8">
        <h2 className="font-serif text-3xl text-text">Kelola Dokumentasi</h2>
        <button onClick={() => { setEditItem(null); setFormData({}); setIsModalOpen(true); }} className="px-4 py-2 bg-accent text-white rounded-lg text-sm flex items-center gap-2"><Plus className="w-4 h-4" /> Buat Album</button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(album => (
          <div key={album.id} className="bg-surface border border-border rounded-[20px] p-6 group">
            <h3 className="font-serif text-xl text-text mb-2">{album.nama}</h3>
            <p className="text-text3 text-xs mb-6 line-clamp-2">{album.desc}</p>
            
            <div className="flex items-center justify-between border-t border-border pt-4">
              <div className="flex gap-2">
                <button onClick={() => { setEditItem(album); setFormData(album); setIsModalOpen(true); }} className="p-2 text-text3 hover:text-accent"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => deleteDoc(doc(db, 'albums', album.id))} className="p-2 text-text3 hover:text-danger"><Trash2 className="w-4 h-4" /></button>
              </div>
              <label className="cursor-pointer">
                <span className="text-[0.7rem] bg-accent/10 text-accent px-3 py-1.5 rounded-full font-medium hover:bg-accent hover:text-white transition-all">
                  + Upload Foto
                </span>
                <input type="file" multiple hidden accept="image/*" onChange={(e) => handlePhotos(e, album.id)} />
              </label>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-bg2 border border-border rounded-[20px] w-full max-w-md shadow-2xl overflow-hidden">
             <div className="p-6 bg-surface border-b border-border"><h3 className="font-serif text-xl">Album Baru</h3></div>
             <div className="p-6 space-y-4">
                <input type="text" placeholder="Nama Album" className="w-full bg-surface border border-border p-3 rounded-xl outline-none" value={formData.nama || ''} onChange={e => setFormData({...formData, nama: e.target.value})} />
                <textarea placeholder="Deskripsi Singkat" className="w-full bg-surface border border-border p-3 rounded-xl outline-none min-h-[100px]" value={formData.desc || ''} onChange={e => setFormData({...formData, desc: e.target.value})} />
             </div>
             <div className="p-6 bg-surface border-t border-border flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-2 rounded-lg text-sm text-text3">Batal</button>
              <button onClick={save} className="px-6 py-2 bg-accent text-white rounded-lg text-sm font-medium">Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const PengurusManager = ({ items }: { items: Pengurus[] }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Partial<Pengurus> | null>(null);
  const [formData, setFormData] = useState<Partial<Pengurus>>({});

  const save = async () => {
    try {
      const { id, ...data } = formData;
      if (editItem?.id) {
        await updateDoc(doc(db, 'pengurus', editItem.id), data as any);
      } else {
        await addDoc(collection(db, 'pengurus'), data);
      }
      setIsModalOpen(false);
      setFormData({});
      setEditItem(null);
    } catch (err) { handleFirestoreError(err, OperationType.WRITE, 'pengurus'); }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, foto: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <header className="flex justify-between items-center mb-8">
        <h2 className="font-serif text-3xl text-text">Tim Pengurus</h2>
        <button onClick={() => { setEditItem(null); setFormData({}); setIsModalOpen(true); }} className="px-4 py-2 bg-accent text-white rounded-lg text-sm flex items-center gap-2"><Plus className="w-4 h-4" /> Tambah Pengurus</button>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map(p => (
          <div key={p.id} className="bg-surface border border-border p-6 rounded-[24px] text-center relative group">
            <div className="w-20 h-20 rounded-full bg-bg3 mx-auto mb-4 overflow-hidden">
               {p.foto && <img src={p.foto} className="w-full h-full object-cover" />}
            </div>
            <h4 className="font-serif text-text">{p.nama}</h4>
            <div className="text-[0.65rem] text-accent2 uppercase tracking-widest">{p.jabatan}</div>
            <div className="mt-4 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
               <button onClick={() => { setEditItem(p); setFormData(p); setIsModalOpen(true); }} className="p-2 hover:text-accent"><Edit2 className="w-4 h-4" /></button>
               <button onClick={() => deleteDoc(doc(db, 'pengurus', p.id))} className="p-2 hover:text-danger"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>

       {isModalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-bg2 border border-border rounded-[20px] w-full max-w-md shadow-2xl overflow-hidden">
             <div className="p-6 bg-surface border-b border-border text-center">
                <div onClick={() => document.getElementById('p-foto')?.click()} className="w-24 h-24 rounded-full bg-bg3 mx-auto mb-2 border-2 border-dashed border-border flex items-center justify-center cursor-pointer">
                  {formData.foto ? <img src={formData.foto} className="w-full h-full rounded-full object-cover" /> : <Camera className="w-8 h-8 opacity-20" />}
                </div>
                <input id="p-foto" type="file" hidden accept="image/*" onChange={handleFile} />
                <h3 className="font-serif text-xl">Data Pengurus</h3>
             </div>
             <div className="p-6 space-y-4">
                <input type="text" placeholder="Nama Lengkap" className="w-full bg-surface border border-border p-3 rounded-xl outline-none" value={formData.nama || ''} onChange={e => setFormData({...formData, nama: e.target.value})} />
                <input type="text" placeholder="Jabatan" className="w-full bg-surface border border-border p-3 rounded-xl outline-none" value={formData.jabatan || ''} onChange={e => setFormData({...formData, jabatan: e.target.value})} />
             </div>
             <div className="p-6 bg-surface border-t border-border flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-2 rounded-lg text-sm text-text3">Batal</button>
              <button onClick={save} className="px-6 py-2 bg-accent text-white rounded-lg text-sm font-medium">Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
