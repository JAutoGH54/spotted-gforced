import { MapPin, Clock, Heart } from 'lucide-react';
import { Eyebrow } from '../ui/Eyebrow';
import { Section } from '../ui/Section';
import { IMAGES } from '../../lib/images';

export function Community() {
  return (
    <Section className="py-20 sm:py-28">
      <div className="reveal mx-auto max-w-2xl text-center">
        <Eyebrow>Community</Eyebrow>
        <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
          Shot by the <span className="text-gradient-neon">community.</span>
        </h2>
      </div>

      {/* Grid on desktop, horizontal scroll on mobile */}
      <div className="reveal mt-12 flex gap-6 overflow-x-auto pb-4 no-scrollbar sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-3">
        {IMAGES.community.map((post, i) => (
          <article
            key={post.car}
            className="reveal group relative w-[280px] flex-shrink-0 overflow-hidden rounded-2xl glass-card glass-card-hover sm:w-auto"
            data-reveal-delay={i * 80}
          >
            {/* Photo */}
            <div className="relative h-44 overflow-hidden">
              <img
                src={post.img}
                alt={post.car}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-transparent" />
              <span className="shimmer absolute right-3 top-3 overflow-hidden rounded-full bg-ink-950/60 px-2.5 py-1 text-[10px] font-bold text-accent-300 backdrop-blur-md border border-white/5">
                Spotted
              </span>
            </div>

            {/* Info */}
            <div className="p-4.5">
              <h3 className="text-base font-bold text-white transition-colors group-hover:text-cyan-400">{post.car}</h3>
              <div className="mt-1.5 flex items-center gap-1.5 text-xs text-white/50">
                <MapPin size={11} className="text-accent-400" />
                <span>{post.location}</span>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3">
                <span className="text-xs text-white/40">{post.user}</span>
                <div className="flex items-center gap-3 text-xs text-white/40">
                  <span className="flex items-center gap-1">
                    <Clock size={11} />
                    {post.time}
                  </span>
                  <Heart size={13} className="text-white/30 transition-colors group-hover:text-accent-400 hover:scale-110" />
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
