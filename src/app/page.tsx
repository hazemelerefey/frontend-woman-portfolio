'use client';

import { useState } from 'react';
import Preloader from '@/components/Preloader';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import WorksSection from '@/components/WorksSection';
import CompareSection from '@/components/CompareSection';
import CalcSection from '@/components/CalcSection';
import LinksBar from '@/components/LinksBar';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import MobileMenu from '@/components/MobileMenu';
import RetroPdfModal from '@/components/RetroPdfModal';

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <Preloader />
      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <RetroPdfModal />

      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--black)' }}>
        <Header onMenuOpen={() => setMenuOpen(true)} />

        <main id="home" style={{ flex: 1 }}>
          <HeroSection />
          <AboutSection />
          <WorksSection />
          <CompareSection />
          <CalcSection />
          <LinksBar />
          <ContactForm />
          <Footer />
        </main>
      </div>
    </>
  );
}
