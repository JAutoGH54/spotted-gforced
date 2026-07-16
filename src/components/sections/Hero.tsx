import { Button } from '../ui/Button';
import { Eyebrow } from '../ui/Eyebrow';
import { HeroPhone } from '../PhoneMockup';
import { CTA_CONFIG } from '../../lib/cta';

interface HeroProps {
  onCtaClick: () => void;
}

export function Hero({ onCtaClick }: HeroProps) {
  const ctaLabel = CTA_CONFIG.LAUNCHED
    ? CTA_CONFIG.LAUNCH_LABEL
    : CTA_CONFIG.PRE_LAUNCH_LABEL;

  return (
    <section id="top" className="relative overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-24">
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-8">
        {/* Left: copy */}
        <div>
          <div className="reveal" data-reveal-delay="0">
            <Eyebrow>Photo spots, mapped</Eyebrow>
          </div>
          <h1
            className="reveal mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl"
            data-reveal-delay="120"
          >
            Find the spots
            <br />
            worth shooting at.
          </h1>
          <p
            className="reveal mt-5 max-w-md text-base leading-relaxed text-white/60 sm:text-lg"
            data-reveal-delay="240"
          >
            Explore a map of photo spots, see what people have shot there, and discover where the car community is getting their best pictures.
          </p>
          <div className="reveal mt-8" data-reveal-delay="360">
            <Button onClick={onCtaClick} className="px-7 py-3.5 text-base">
              {ctaLabel}
            </Button>
            <p className="mt-3 text-sm text-white/40">
              Coming soon on iOS and Android.
            </p>
          </div>
        </div>

        {/* Right: phone mockup */}
        <div className="reveal flex justify-center lg:justify-end" data-reveal-delay="300">
          <div className="relative w-full max-w-[280px] sm:max-w-[320px]">
            {/* Breathing glow behind phone */}
            <div className="absolute inset-0 -z-10 scale-125 rounded-full bg-accent-500/20 blur-[80px] animate-breathe" />

            {/* Floating accent particles */}
            <div className="absolute -left-6 top-1/4 h-2 w-2 rounded-full bg-accent-400/60 blur-[1px] animate-float" />
            <div className="absolute -right-4 top-1/2 h-1.5 w-1.5 rounded-full bg-cyan-400/50 blur-[1px] animate-float" style={{ animationDelay: '2s' }} />
            <div className="absolute left-1/3 -bottom-2 h-1.5 w-1.5 rounded-full bg-accent-300/40 blur-[1px] animate-float" style={{ animationDelay: '4s' }} />

            {/* Phone with float + slight oscillation */}
            <div className="animate-float">
              <div className="animate-oscillate">
                <HeroPhone />
              </div>
            </div>

            {/* Floor reflection glow */}
            <div className="absolute -bottom-8 left-1/2 h-12 w-3/4 -translate-x-1/2 rounded-full bg-accent-500/10 blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
