import { type ReactNode } from 'react';
import { MapPin, Camera, MessageSquare, Navigation2, Heart, Search } from 'lucide-react';
import { IMAGES } from '../lib/images';

interface PhoneMockupProps {
  children?: ReactNode;
  className?: string;
}

/**
 * Base phone frame. Pass screen content as children.
 */
export function PhoneFrame({ children, className = '' }: PhoneMockupProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Outer frame */}
      <div className="relative aspect-[9/19] w-full overflow-hidden rounded-[2.5rem] border border-white/10 bg-ink-900 p-2 shadow-phone">
        {/* Notch */}
        <div className="absolute left-1/2 top-2 z-20 h-6 w-28 -translate-x-1/2 rounded-b-2xl bg-ink-950" />
        {/* Screen */}
        <div className="relative h-full w-full overflow-hidden rounded-[2rem] bg-ink-950">
          {children}
        </div>
      </div>
      {/* Side buttons */}
      <div className="absolute -right-1 top-24 h-12 w-1 rounded-l bg-white/10" />
      <div className="absolute -left-1 top-20 h-8 w-1 rounded-r bg-white/10" />
      <div className="absolute -left-1 top-32 h-8 w-1 rounded-r bg-white/10" />
    </div>
  );
}

/**
 * Hero phone: dark interactive map with markers + selected spot card.
 */
export function HeroPhone({ className = '' }: { className?: string }) {
  return (
    <PhoneFrame className={className}>
      <div className="flex h-full flex-col">
        {/* Status bar */}
        <div className="flex items-center justify-between px-5 pt-3 pb-1 text-[10px] font-medium text-white/70">
          <span>9:41</span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-accent-400" />
            <span className="h-2 w-2 rounded-full bg-accent-400" />
            <span className="h-2 w-2 rounded-full bg-white/30" />
          </span>
        </div>

        {/* Search bar */}
        <div className="px-3 pb-2">
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-ink-800/80 px-3 py-2">
            <Search size={13} className="text-white/40" />
            <span className="text-[11px] text-white/40">Search photo spots</span>
          </div>
        </div>

        {/* Map area */}
        <div className="relative flex-1 overflow-hidden scan-sweep">
          <div className="absolute inset-0 map-grid-fine bg-ink-900" />
          {/* Faux roads */}
          <div className="absolute left-0 top-1/3 h-px w-full bg-white/5" />
          <div className="absolute left-0 top-2/3 h-px w-full bg-white/5" />
          <div className="absolute left-1/4 top-0 h-full w-px bg-white/5" />
          <div className="absolute left-3/4 top-0 h-full w-px bg-white/5" />

          {/* Markers */}
          <MapMarker className="left-[22%] top-[28%]" />
          <MapMarker className="left-[68%] top-[40%]" active />
          <MapMarker className="left-[40%] top-[62%]" />
          <MapMarker className="left-[78%] top-[70%]" />

          {/* Selected spot card */}
          <div className="absolute bottom-3 left-3 right-3 overflow-hidden rounded-2xl border border-white/10 bg-ink-800/95 p-2.5 shadow-glow-sm backdrop-blur-md">
            <div className="flex gap-2.5">
              <img
                src={IMAGES.heroCar}
                alt="Photo spot"
                className="h-16 w-16 flex-shrink-0 rounded-xl object-cover"
                loading="lazy"
              />
              <div className="flex min-w-0 flex-col justify-center">
                <div className="flex items-center gap-1.5">
                  <MapPin size={11} className="text-accent-400" />
                  <span className="truncate text-xs font-bold text-white">
                    Downtown Garage
                  </span>
                  {/* Live indicator */}
                  <span className="ml-auto flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-live-dot" />
                    <span className="text-[9px] font-semibold text-cyan-400">live</span>
                  </span>
                </div>
                <p className="mt-0.5 text-[10px] text-white/50">
                  12 photos this week
                </p>
                <div className="mt-1 flex items-center gap-1 text-[10px] text-accent-300">
                  <Navigation2 size={9} />
                  <span>0.4 mi away</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom tab bar */}
        <div className="flex items-center justify-around border-t border-white/5 bg-ink-900 px-2 py-2.5">
          <TabIcon icon={<MapPin size={16} />} active />
          <TabIcon icon={<Camera size={16} />} />
          <TabIcon icon={<MessageSquare size={16} />} />
        </div>
      </div>
    </PhoneFrame>
  );
}

function MapMarker({ className = '', active = false }: { className?: string; active?: boolean }) {
  return (
    <div className={`absolute ${className}`}>
      {active && (
        <span className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-400/30 animate-pulse-marker" />
      )}
      <div
        className={`relative h-5 w-5 rounded-full border-2 border-ink-950 shadow-glow-sm ${
          active ? 'bg-accent-400' : 'bg-accent-500/70'
        }`}
      >
        <MapPin size={10} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-ink-950" />
      </div>
    </div>
  );
}

function TabIcon({ icon, active = false }: { icon: ReactNode; active?: boolean }) {
  return (
    <div
      className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${
        active ? 'bg-accent-400/15 text-accent-400' : 'text-white/40'
      }`}
    >
      {icon}
    </div>
  );
}

/**
 * App preview screen 1: Map discovery
 */
export function MapDiscoveryScreen() {
  return (
    <PhoneFrame>
      <div className="flex h-full flex-col">
        <div className="px-5 pt-3 pb-1 text-[10px] font-medium text-white/70">9:41</div>
        <div className="px-3 pb-2">
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-ink-800/80 px-3 py-2">
            <Search size={13} className="text-white/40" />
            <span className="text-[11px] text-white/40">Nearby photo spots</span>
          </div>
        </div>
        <div className="relative flex-1 overflow-hidden scan-sweep">
          <div className="absolute inset-0 map-grid-fine bg-ink-900" />
          <div className="absolute left-0 top-1/3 h-px w-full bg-white/5" />
          <div className="absolute left-0 top-2/3 h-px w-full bg-white/5" />
          <div className="absolute left-1/3 top-0 h-full w-px bg-white/5" />
          <MapMarker className="left-[30%] top-[25%]" />
          <MapMarker className="left-[60%] top-[45%]" active />
          <MapMarker className="left-[45%] top-[68%]" />
          <MapMarker className="left-[75%] top-[75%]" />

          {/* Mini spot list card */}
          <div className="absolute bottom-3 left-3 right-3 space-y-1.5">
            <SpotListRow name="Harbor Lot" photos="8 photos" dist="1.2 mi" />
            <SpotListRow name="Canyon Overlook" photos="5 photos" dist="2.8 mi" />
          </div>
        </div>
        <div className="flex items-center justify-around border-t border-white/5 bg-ink-900 px-2 py-2.5">
          <TabIcon icon={<MapPin size={16} />} active />
          <TabIcon icon={<Camera size={16} />} />
          <TabIcon icon={<MessageSquare size={16} />} />
        </div>
      </div>
    </PhoneFrame>
  );
}

function SpotListRow({ name, photos, dist }: { name: string; photos: string; dist: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-ink-800/90 px-2.5 py-2 backdrop-blur-sm">
      <div className="flex items-center gap-1.5">
        <MapPin size={10} className="text-accent-400" />
        <span className="text-[11px] font-semibold text-white">{name}</span>
      </div>
      <div className="flex items-center gap-2 text-[10px] text-white/50">
        <span>{photos}</span>
        <span className="text-accent-300">{dist}</span>
      </div>
    </div>
  );
}

/**
 * App preview screen 2: Photo spot location page
 */
export function SpotLocationScreen() {
  return (
    <PhoneFrame>
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between px-5 pt-3 pb-2 text-[10px] font-medium text-white/70">
          <span>9:41</span>
          <span className="h-2 w-2 rounded-full bg-accent-400" />
        </div>
        {/* Hero image */}
        <div className="relative h-44 overflow-hidden">
          <img
            src={IMAGES.spotLocation}
            alt="Photo spot"
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/20 to-transparent" />
          <div className="absolute bottom-2 left-3 right-3">
            <div className="flex items-center gap-1.5">
              <MapPin size={11} className="text-accent-400" />
              <span className="text-sm font-bold text-white">Downtown Garage</span>
              <span className="ml-auto flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-live-dot" />
                <span className="text-[9px] font-semibold text-cyan-400">live</span>
              </span>
            </div>
            <p className="mt-0.5 text-[10px] text-white/60">12 photos this week · 0.4 mi away</p>
          </div>
        </div>
        {/* Post thumbnails */}
        <div className="flex-1 overflow-hidden px-3 pt-3">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-white/40">
            Recent photos
          </p>
          <div className="grid grid-cols-2 gap-2">
            <PostThumb img={IMAGES.community[0].img} label="2h ago" />
            <PostThumb img={IMAGES.community[1].img} label="5h ago" />
            <PostThumb img={IMAGES.community[4].img} label="12h ago" />
            <PostThumb img={IMAGES.community[2].img} label="6h ago" />
          </div>
        </div>
        <div className="flex items-center justify-around border-t border-white/5 bg-ink-900 px-2 py-2.5">
          <TabIcon icon={<MapPin size={16} />} />
          <TabIcon icon={<Camera size={16} />} active />
          <TabIcon icon={<MessageSquare size={16} />} />
        </div>
      </div>
    </PhoneFrame>
  );
}

function PostThumb({ img, label }: { img: string; label: string }) {
  return (
    <div className="relative overflow-hidden rounded-xl">
      <img src={img} alt="Car photo" className="h-20 w-full object-cover" loading="lazy" />
      <span className="absolute bottom-1 left-1 rounded bg-ink-950/70 px-1.5 py-0.5 text-[9px] text-white/80">
        {label}
      </span>
    </div>
  );
}

/**
 * App preview screen 3: Recent photos feed
 */
export function PostsFeedScreen() {
  return (
    <PhoneFrame>
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between px-5 pt-3 pb-2 text-[10px] font-medium text-white/70">
          <span>9:41</span>
          <span className="h-2 w-2 rounded-full bg-accent-400" />
        </div>
        <div className="px-4 pb-2">
          <h3 className="text-base font-bold text-white">Recent Photos</h3>
          <p className="text-[10px] text-white/50">Latest from the community</p>
        </div>
        <div className="flex-1 space-y-2.5 overflow-hidden px-3">
          <FeedCard
            img={IMAGES.community[0].img}
            car="Lamborghini Huracán"
            place="Downtown Garage"
            time="2h ago"
            user="@alex.spots"
          />
          <FeedCard
            img={IMAGES.community[3].img}
            car="BMW M3 E46"
            place="Weekly Meet Spot"
            time="8h ago"
            user="@e46forever"
          />
          <FeedCard
            img={IMAGES.community[5].img}
            car="Mazda RX-7 FD"
            place="Industrial District"
            time="1d ago"
            user="@rotarylife"
          />
        </div>
        <div className="flex items-center justify-around border-t border-white/5 bg-ink-900 px-2 py-2.5">
          <TabIcon icon={<MapPin size={16} />} />
          <TabIcon icon={<Camera size={16} />} />
          <TabIcon icon={<MessageSquare size={16} />} active />
        </div>
      </div>
    </PhoneFrame>
  );
}

function FeedCard({
  img,
  car,
  place,
  time,
  user,
}: {
  img: string;
  car: string;
  place: string;
  time: string;
  user: string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-ink-800/80">
      <div className="relative h-24 overflow-hidden">
        <img src={img} alt={car} className="h-full w-full object-cover" loading="lazy" />
        <span className="absolute right-2 top-2 rounded-full bg-ink-950/70 px-2 py-0.5 text-[9px] font-semibold text-accent-300">
          Spotted
        </span>
      </div>
      <div className="p-2.5">
        <p className="text-[11px] font-bold text-white">{car}</p>
        <div className="mt-0.5 flex items-center justify-between text-[9px] text-white/50">
          <span className="flex items-center gap-1">
            <MapPin size={8} className="text-accent-400" />
            {place}
          </span>
          <span>{time}</span>
        </div>
        <div className="mt-1 flex items-center justify-between">
          <span className="text-[9px] text-white/40">{user}</span>
          <Heart size={11} className="text-white/30" />
        </div>
      </div>
    </div>
  );
}
