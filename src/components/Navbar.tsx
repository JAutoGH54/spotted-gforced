import { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';
import { Button } from './ui/Button';
import { CTA_CONFIG } from '../lib/cta';

interface NavbarProps {
  onCtaClick: () => void;
}

export function Navbar({ onCtaClick }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-white/10 bg-ink-950/80 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-8">
        {/* Logo */}
        <a href="#top" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent-400 to-cyan-500 shadow-glow-sm transition-transform duration-300 hover:scale-110">
            <MapPin size={17} className="text-ink-950" strokeWidth={2.5} />
          </span>
          <span className="text-lg font-extrabold tracking-tight text-white">
            Spotted
          </span>
        </a>

        {/* Links */}
        <div className="hidden items-center gap-8 md:flex">
          <a
            href="#how-it-works"
            className="text-sm font-medium text-white/60 transition-colors hover:text-white"
          >
            How It Works
          </a>
          <a
            href="#app-preview"
            className="text-sm font-medium text-white/60 transition-colors hover:text-white"
          >
            App Preview
          </a>
        </div>

        {/* CTA */}
        <Button onClick={onCtaClick} className="px-5 py-2.5 text-sm">
          {CTA_CONFIG.LAUNCHED ? CTA_CONFIG.LAUNCH_LABEL : CTA_CONFIG.PRE_LAUNCH_LABEL}
        </Button>
      </nav>
    </header>
  );
}
