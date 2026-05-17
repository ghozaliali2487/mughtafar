/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FloatingButtons } from './components/FloatingButtons';

import Home from './pages/Home';
import AnggotaPage from './pages/Anggota';
import DokumentasiPage from './pages/Dokumentasi';
import QuotesPage from './pages/Quotes';
import ArtikelPage from './pages/Artikel';
import TentangPage from './pages/Tentang';
import AdminPage from './pages/Admin';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-[70px]">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/anggota" element={<AnggotaPage />} />
            <Route path="/dokumentasi" element={<DokumentasiPage />} />
            <Route path="/quotes" element={<QuotesPage />} />
            <Route path="/artikel" element={<ArtikelPage />} />
            <Route path="/tentang" element={<TentangPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </main>
        <Footer />
        <FloatingButtons />
      </div>
    </Router>
  );
}

export default App;
