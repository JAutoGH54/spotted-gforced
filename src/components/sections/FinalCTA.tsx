import { useState, type FormEvent } from 'react';
import { Check, Apple, Play } from 'lucide-react';
import { Button } from '../ui/Button';
import { Eyebrow } from '../ui/Eyebrow';
import { Section } from '../ui/Section';
import { CTA_CONFIG } from '../../lib/cta';

export function FinalCTA() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmed = email.trim();
    if (!trimmed) {
      setError('Please enter your email.');
      setStatus('error');
      return;
    }
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(trimmed)) {
      setError('Please enter a valid email address.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setTimeout(() => setStatus('success'), 800);
  };

  return (
    <Section className="py-24 sm:py-32">
      <div className="reveal relative overflow-hidden rounded-3xl border border-white/10 bg-ink-900/60 px-6 py-16 text-center sm:px-12 sm:py-20">
        {/* Breathing glow */}
        <div className="pointer-events-none absolute -top-32 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-accent-500/15 blur-[100px] animate-breathe" />
        <div className="pointer-events-none absolute inset-0 map-grid opacity-20" />

        <div className="relative">
          <Eyebrow>Get Started</Eyebrow>
          <h2 className="mx-auto mt-5 max-w-xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Find your next spot.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-base text-white/55 sm:text-lg">
            Discover photo spots near you and see what the car community is shooting.
          </p>

          {CTA_CONFIG.LAUNCHED ? (
            /* Post-launch: App Store + Google Play buttons */
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <StoreButton
                icon={<Apple size={22} />}
                top="Download on the"
                bottom="App Store"
                href={CTA_CONFIG.APP_STORE_URL}
              />
              <StoreButton
                icon={<Play size={20} className="fill-white" />}
                top="Get it on"
                bottom="Google Play"
                href={CTA_CONFIG.GOOGLE_PLAY_URL}
              />
            </div>
          ) : status === 'success' ? (
            <div className="mx-auto mt-8 flex max-w-sm flex-col items-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-accent-400 to-cyan-500 shadow-glow">
                <Check size={28} className="text-ink-950" strokeWidth={3} />
              </div>
              <p className="mt-4 text-lg font-bold text-white">You're on the list</p>
              <p className="mt-1 text-sm text-white/55">
                We'll let you know as soon as Spotted launches.
              </p>
            </div>
          ) : (
            /* Pre-launch: inline email form */
            <form
              onSubmit={handleSubmit}
              className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === 'error') setStatus('idle');
                }}
                placeholder="you@email.com"
                className="flex-1 rounded-full border border-white/10 bg-ink-800/60 px-5 py-3.5 text-white placeholder-white/30 outline-none transition-all duration-300 focus:border-accent-400/60 focus:ring-2 focus:ring-accent-400/20 focus:shadow-glow-sm"
                aria-label="Email address"
              />
              <Button
                type="submit"
                disabled={status === 'loading'}
                className="px-7 py-3.5 text-base"
              >
                {status === 'loading' ? 'Joining...' : CTA_CONFIG.PRE_LAUNCH_LABEL}
              </Button>
            </form>
          )}

          {error && (
            <p className="mt-3 text-sm text-red-400">{error}</p>
          )}

          {!CTA_CONFIG.LAUNCHED && status !== 'success' && (
            <p className="mt-4 text-xs text-white/40">
              Coming soon on iOS and Android.
            </p>
          )}
        </div>
      </div>
    </Section>
  );
}

function StoreButton({
  icon,
  top,
  bottom,
  href,
}: {
  icon: React.ReactNode;
  top: string;
  bottom: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="flex items-center gap-3 rounded-2xl border border-white/15 bg-ink-800/80 px-6 py-3.5 transition-all hover:border-white/30 hover:bg-ink-700/80 hover:-translate-y-0.5"
    >
      {icon}
      <div className="text-left">
        <p className="text-[10px] font-medium text-white/50">{top}</p>
        <p className="text-base font-bold text-white">{bottom}</p>
      </div>
    </a>
  );
}
