import { MapPin, Eye, Camera } from 'lucide-react';
import { Eyebrow } from '../ui/Eyebrow';
import { Section } from '../ui/Section';

const steps = [
  {
    num: '1',
    icon: MapPin,
    title: 'Browse Nearby Spots',
    desc: 'Explore the map and find photo spots around you.',
  },
  {
    num: '2',
    icon: Eye,
    title: 'Open a Spot',
    desc: 'See photos other people have taken at that location.',
  },
  {
    num: '3',
    icon: Camera,
    title: 'Share Your Shot',
    desc: 'Upload your photos and add them to the spot for others to see.',
  },
];

export function HowItWorks() {
  return (
    <Section id="how-it-works" className="py-20 sm:py-28">
      <div className="reveal mx-auto max-w-2xl text-center">
        <Eyebrow>How It Works</Eyebrow>
        <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
          Open the app. Find a spot.
          <br />
          <span className="text-gradient-neon">See what's been shot.</span>
        </h2>
      </div>

      <div className="mt-14 grid gap-6 sm:grid-cols-3">
        {steps.map((s, i) => (
          <div
            key={s.num}
            className="reveal group relative glass-card glass-card-hover rounded-2xl p-7"
            data-reveal-delay={i * 120}
          >
            {/* Hover light leak */}
            <div className="pointer-events-none absolute -top-12 left-1/2 h-24 w-24 -translate-x-1/2 rounded-full bg-accent-400/0 blur-2xl transition-all duration-500 group-hover:bg-accent-400/12" />

            {/* Number badge */}
            <div className="relative mb-5 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent-400 to-cyan-500 text-sm font-extrabold text-ink-950 shadow-glow-sm transition-transform duration-300 group-hover:scale-110">
                {s.num}
              </span>
              <s.icon size={20} className="text-white/40 transition-colors group-hover:text-cyan-400" strokeWidth={1.8} />
            </div>
            <h3 className="text-lg font-bold text-white transition-colors group-hover:text-accent-300">{s.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-white/55">{s.desc}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
