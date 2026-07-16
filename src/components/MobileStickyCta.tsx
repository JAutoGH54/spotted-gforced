import { Button } from './ui/Button';
import { CTA_CONFIG } from '../lib/cta';

interface MobileStickyCtaProps {
  onCtaClick: () => void;
}

/**
 * Mobile-only sticky bottom bar. Hidden on desktop (md+).
 */
export function MobileStickyCta({ onCtaClick }: MobileStickyCtaProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink-950/90 px-4 py-3 backdrop-blur-xl md:hidden">
      <Button onClick={onCtaClick} className="w-full py-3 text-sm">
        {CTA_CONFIG.LAUNCHED ? CTA_CONFIG.LAUNCH_LABEL : CTA_CONFIG.PRE_LAUNCH_LABEL}
      </Button>
    </div>
  );
}
