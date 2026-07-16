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
      <div className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/5 sm:grid-cols-3">
        {benefits.map((b, i) => (
          <div
            key={b.title}
            className="reveal group relative bg-ink-900/60 p-7 transition-all duration-300 hover:bg-ink-800/60 hover:-translate-y-0.5"
            data-reveal-delay={i * 100}
          >
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-accent-400/20 bg-accent-400/10 text-accent-400 transition-all duration-300 group-hover:scale-110 group-hover:shadow-glow-sm">
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
