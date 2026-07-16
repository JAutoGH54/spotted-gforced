import { useState } from 'react';
import { useScrollReveal, useScrollProgress } from './hooks/useScrollReveal';
import { AnimatedBackground } from './components/AnimatedBackground';
import { Navbar } from './components/Navbar';
import { Hero } from './components/sections/Hero';
import { Benefits } from './components/sections/Benefits';
import { AppPreview } from './components/sections/AppPreview';
import { HowItWorks } from './components/sections/HowItWorks';
import { Community } from './components/sections/Community';
import { FinalCTA } from './components/sections/FinalCTA';
import { Footer } from './components/Footer';
import { MobileStickyCta } from './components/MobileStickyCta';
import { WaitlistModal } from './components/WaitlistModal';

function App() {
  const [modalOpen, setModalOpen] = useState(false);
  useScrollReveal();
  useScrollProgress();

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-ink-950 page-fade-in">
      {/* Scroll progress bar */}
      <div className="fixed inset-x-0 top-0 z-[60] h-0.5 bg-transparent">
        <div
          id="scroll-progress"
          className="h-full w-0 bg-gradient-to-r from-accent-400 to-cyan-400 transition-[width] duration-75 ease-out"
        />
      </div>

      <AnimatedBackground />

      <div className="relative z-10">
        <Navbar onCtaClick={() => setModalOpen(true)} />

        <main>
          <Hero onCtaClick={() => setModalOpen(true)} />
          <Benefits />
          <AppPreview />
          <HowItWorks />
          <Community />
          <FinalCTA />
        </main>

        <Footer />
        <MobileStickyCta onCtaClick={() => setModalOpen(true)} />
      </div>

      <WaitlistModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}

export default App;
