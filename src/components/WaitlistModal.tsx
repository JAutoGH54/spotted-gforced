import { useEffect, useState, type FormEvent } from 'react';
import { X, Check, Mail } from 'lucide-react';
import { Button } from './ui/Button';

interface WaitlistModalProps {
  open: boolean;
  onClose: () => void;
}

export function WaitlistModal({ open, onClose }: WaitlistModalProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  // Lock body scroll while open + close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  // Reset when closed
  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setStatus('idle');
        setEmail('');
        setError('');
      }, 300);
      return () => clearTimeout(t);
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Client-side validation
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
    // Mocked success — swap for real backend call later
    setTimeout(() => setStatus('success'), 800);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Join the waitlist"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-ink-950/80 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-ink-800/90 p-6 shadow-phone animate-fade-up">
        <div className="pointer-events-none absolute -top-20 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-accent-400/20 blur-3xl animate-breathe" />

        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full p-2 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {status === 'success' ? (
          <div className="relative flex flex-col items-center py-8 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-accent-400 to-cyan-500 shadow-glow">
              <Check size={30} className="text-ink-950" strokeWidth={3} />
            </div>
            <h3 className="text-2xl font-bold text-white">You're on the list</h3>
            <p className="mt-2 text-sm text-white/60">
              We'll let you know as soon as Spotted launches on iOS and Android.
            </p>
            <Button variant="secondary" onClick={onClose} className="mt-6">
              Done
            </Button>
          </div>
        ) : (
          <div className="relative">
            <div className="mb-1 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent-400 to-cyan-500">
                <Mail size={16} className="text-ink-950" />
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white">Join the waitlist</h3>
            <p className="mt-2 text-sm text-white/60">
              Be first to know when Spotted drops. No spam, just the launch.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === 'error') setStatus('idle');
                }}
                placeholder="you@email.com"
                className="w-full rounded-xl border border-white/10 bg-ink-900/60 px-4 py-3.5 text-white placeholder-white/30 outline-none transition-colors focus:border-accent-400/60 focus:ring-2 focus:ring-accent-400/20"
                aria-label="Email address"
                autoFocus
              />
              {error && <p className="text-sm text-red-400">{error}</p>}
              <Button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-3.5 text-base"
              >
                {status === 'loading' ? 'Joining...' : 'Join the Waitlist'}
              </Button>
            </form>

            <p className="mt-4 text-center text-xs text-white/40">
              Coming soon on iOS and Android.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
