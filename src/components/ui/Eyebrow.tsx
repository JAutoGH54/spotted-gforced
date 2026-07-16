import { type ReactNode } from 'react';

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent-300">
      <span className="h-px w-6 bg-gradient-to-r from-accent-400 to-cyan-400" />
      {children}
    </span>
  );
}
