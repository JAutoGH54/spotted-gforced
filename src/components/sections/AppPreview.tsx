import { Eyebrow } from '../ui/Eyebrow';
import { Section } from '../ui/Section';
import { MapDiscoveryScreen, SpotLocationScreen, PostsFeedScreen } from '../PhoneMockup';

export function AppPreview() {
  return (
    <Section id="app-preview" className="py-20 sm:py-28">
      <div className="reveal mx-auto max-w-2xl text-center">
        <Eyebrow>App Preview</Eyebrow>
        <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
          Every photo spot, on the map.
        </h2>
        <p className="mt-4 text-base text-white/55 sm:text-lg">
          Open Spotted to see where people are shooting and discover new photo spots around you.
        </p>
      </div>

      {/* Three phones with staggered float phases */}
      <div className="reveal mt-16 flex flex-wrap items-end justify-center gap-8 lg:flex-nowrap lg:gap-6">
        <div className="w-full max-w-[240px] sm:max-w-[260px] animate-float" style={{ animationDelay: '0s' }}>
          <MapDiscoveryScreen />
          <p className="mt-4 text-center text-sm font-semibold text-white/70">
            Map Discovery
          </p>
          <p className="text-center text-xs text-white/40">
            Browse photo spots around you
          </p>
        </div>
        <div className="w-full max-w-[240px] sm:max-w-[260px] animate-float lg:-translate-y-6" style={{ animationDelay: '2s' }}>
          <SpotLocationScreen />
          <p className="mt-4 text-center text-sm font-semibold text-white/70">
            Spot Details
          </p>
          <p className="text-center text-xs text-white/40">
            See photos taken there
          </p>
        </div>
        <div className="w-full max-w-[240px] sm:max-w-[260px] animate-float" style={{ animationDelay: '4s' }}>
          <PostsFeedScreen />
          <p className="mt-4 text-center text-sm font-semibold text-white/70">
            Recent Photos
          </p>
          <p className="text-center text-xs text-white/40">
            Latest community shots
          </p>
        </div>
      </div>
    </Section>
  );
}
