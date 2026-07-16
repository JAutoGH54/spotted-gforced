import { MapPin, Camera, Share2 } from 'lucide-react';
import { Section } from '../ui/Section';

const benefits = [
  {
    icon: MapPin,
    title: 'Explore the Map',
    desc: 'Find photo spots, meet locations, and scenic places to shoot cars near you.',
  },
  {
    icon: Camera,
    title: 'See What\u2019s Been Shot',
    desc: 'Browse photos people have taken at each spot before you go.',
  },
  {
    icon: Share2,
    title: 'Share Your Spot',
    desc: 'Upload your photos and help others discover great shooting locations.',
  },
];

export function Benefits() {
  return (
    <Section className="py-16 sm:py-20">
      <div className="grid gap-6 sm:grid-cols-3">
        {benefits.map((b, i) => (
          <div
            key={b.title}
            className="reveal group relative glass-card glass-card-hover rounded-2xl p-7"
            data-reveal-delay={i * 100}
          >
            {/* Ambient card top light leak */}
            <div className="pointer-events-none absolute -top-10 left-1/2 h-20 w-20 -translate-x-1/2 rounded-full bg-accent-400/0 blur-2xl transition-all duration-500 group-hover:bg-accent-400/10" />

            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-accent-400/20 bg-accent-400/10 text-accent-400 transition-all duration-300 group-hover:scale-110 group-hover:bg-accent-400/15 group-hover:shadow-glow-sm">
              <b.icon size={20} strokeWidth={2} />
            </div>
            <h3 className="text-lg font-bold text-white">{b.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-white/55">{b.desc}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
