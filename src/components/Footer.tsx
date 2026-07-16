import { MapPin, Instagram, Music2 } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-ink-950/50">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start sm:justify-between">
          {/* Logo + tagline */}
          <div className="text-center sm:text-left">
            <a href="#top" className="flex items-center justify-center gap-2 sm:justify-start">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent-400 to-cyan-500">
                <MapPin size={17} className="text-ink-950" strokeWidth={2.5} />
              </span>
              <span className="text-lg font-extrabold tracking-tight text-white">Spotted</span>
            </a>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/45">
              Spotted helps car enthusiasts find photo spots, see what people have shot there, and share their own pictures.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start sm:gap-10">
            {/* Social */}
            <div className="flex items-center gap-4">
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/50 transition-all hover:border-accent-400/30 hover:text-accent-400 hover:scale-110"
              >
                <Instagram size={17} />
              </a>
              <a
                href="#"
                aria-label="TikTok"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/50 transition-all hover:border-accent-400/30 hover:text-accent-400 hover:scale-110"
              >
                <Music2 size={17} />
              </a>
            </div>

            {/* Legal */}
            <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-white/50">
              <a href="#" className="transition-colors hover:text-white">Privacy</a>
              <a href="#" className="transition-colors hover:text-white">Terms</a>
              <a href="#" className="transition-colors hover:text-white">Contact</a>
            </nav>
          </div>
        </div>

        <div className="mt-10 border-t border-white/5 pt-6 text-center">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} Spotted. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
