/**
 * Fixed full-viewport animated background: drifting gradient blobs,
 * panning map grid, topographic contour layer, and film grain.
 * Sits behind all content at z-0.
 */
export function AnimatedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Base */}
      <div className="absolute inset-0 bg-ink-950" />

      {/* Panning grid */}
      <div className="absolute inset-0 map-grid-pan opacity-30" />

      {/* Topographic contours */}
      <div className="absolute inset-0 topo-bg opacity-[0.07]" />

      {/* Drifting gradient blobs */}
      <div className="absolute -top-32 left-[10%] h-[500px] w-[500px] rounded-full bg-accent-500/8 blur-[120px] animate-drift-1" />
      <div className="absolute top-[30%] right-[5%] h-[400px] w-[400px] rounded-full bg-cyan-500/8 blur-[100px] animate-drift-2" />
      <div className="absolute bottom-[10%] left-[30%] h-[450px] w-[450px] rounded-full bg-accent-600/6 blur-[110px] animate-drift-3" />

      {/* Film grain */}
      <div className="absolute inset-0 grain opacity-[0.03] mix-blend-overlay" />

      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink-950/40" />
    </div>
  );
}
