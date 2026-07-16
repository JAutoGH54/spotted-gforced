import { useState, type ReactNode } from 'react';
import { MapPin, Camera, MessageSquare, Navigation2, Heart, Search, ChevronLeft, Award } from 'lucide-react';
import { IMAGES } from '../lib/images';

// Base Phone Frame
export function PhoneFrame({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      {/* Outer frame */}
      <div className="relative aspect-[9/19] w-full overflow-hidden rounded-[2.5rem] border border-white/10 bg-ink-900 p-2 shadow-phone">
        {/* Notch */}
        <div className="absolute left-1/2 top-2 z-20 h-6 w-28 -translate-x-1/2 rounded-b-2xl bg-ink-950" />
        {/* Screen */}
        <div className="relative h-full w-full overflow-hidden rounded-[2rem] bg-ink-950 select-none">
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

interface Spot {
  id: string;
  name: string;
  location: string;
  photosCount: number;
  distance: string;
  img: string;
  coords: { x: number; y: number };
  recentPhotos: string[];
}

const SPOTS_DATA: Spot[] = [
  {
    id: 'downtown-garage',
    name: 'Downtown Garage',
    location: 'Downtown Garage, Level 4',
    photosCount: 12,
    distance: '0.4 mi away',
    img: IMAGES.heroCar,
    coords: { x: 68, y: 40 },
    recentPhotos: [
      IMAGES.community[0].img,
      IMAGES.community[1].img,
      IMAGES.community[4].img,
      IMAGES.community[2].img
    ]
  },
  {
    id: 'harbor-lot',
    name: 'Harbor Lot',
    location: 'Harbor Lot, East Pier',
    photosCount: 8,
    distance: '1.2 mi away',
    img: IMAGES.community[1].img,
    coords: { x: 22, y: 28 },
    recentPhotos: [
      IMAGES.community[1].img,
      IMAGES.community[3].img,
      IMAGES.community[0].img,
      IMAGES.community[4].img
    ]
  },
  {
    id: 'canyon-overlook',
    name: 'Canyon Overlook',
    location: 'Canyon Road, Vista Pt',
    photosCount: 5,
    distance: '2.8 mi away',
    img: IMAGES.community[2].img,
    coords: { x: 40, y: 62 },
    recentPhotos: [
      IMAGES.community[2].img,
      IMAGES.community[5].img,
      IMAGES.community[1].img,
      IMAGES.community[3].img
    ]
  },
  {
    id: 'industrial-district',
    name: 'Industrial District',
    location: 'Warehouse Row',
    photosCount: 14,
    distance: '3.5 mi away',
    img: IMAGES.community[5].img,
    coords: { x: 78, y: 70 },
    recentPhotos: [
      IMAGES.community[5].img,
      IMAGES.community[4].img,
      IMAGES.community[2].img,
      IMAGES.community[0].img
    ]
  }
];

interface Post {
  id: string;
  car: string;
  location: string;
  time: string;
  user: string;
  img: string;
  likes: number;
  liked: boolean;
}

const INITIAL_POSTS: Post[] = [
  {
    id: 'post-1',
    car: 'Lamborghini Huracán',
    location: 'Downtown Garage',
    time: '2h ago',
    user: '@alex.spots',
    img: IMAGES.community[0].img,
    likes: 42,
    liked: false
  },
  {
    id: 'post-2',
    car: 'Porsche 911 GT3',
    location: 'Harbor Lot',
    time: '5h ago',
    user: '@nightdriver',
    img: IMAGES.community[1].img,
    likes: 28,
    liked: false
  },
  {
    id: 'post-3',
    car: 'Nissan GT-R',
    location: 'Canyon Overlook',
    time: '6h ago',
    user: '@canyon.cars',
    img: IMAGES.community[2].img,
    likes: 19,
    liked: false
  },
  {
    id: 'post-4',
    car: 'BMW M3 E46',
    location: 'Weekly Meet Spot',
    time: '8h ago',
    user: '@e46forever',
    img: IMAGES.community[3].img,
    likes: 37,
    liked: false
  }
];

const CAR_OPTIONS = [
  { name: 'Ferrari SF90 Stradale', img: IMAGES.community[4].img },
  { name: 'McLaren 720S Spider', img: IMAGES.community[0].img },
  { name: 'Porsche 911 GT3 RS', img: IMAGES.community[1].img },
  { name: 'Aston Martin Valour', img: IMAGES.community[3].img },
  { name: 'Mazda RX-7 Spirit R', img: IMAGES.community[5].img }
];

export function PhoneApp({
  initialTab = 'map',
  initialSelectedSpotId = 'downtown-garage'
}: {
  initialTab?: 'map' | 'spot-details' | 'feed' | 'camera';
  initialSelectedSpotId?: string;
}) {
  const [activeTab, setActiveTab] = useState<'map' | 'spot-details' | 'feed' | 'camera'>(initialTab);
  const [selectedSpotId, setSelectedSpotId] = useState<string>(initialSelectedSpotId);
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [flash, setFlash] = useState(false);
  const [justSpottedCar, setJustSpottedCar] = useState<string | null>(null);

  // Active Spot Reference
  const activeSpot = SPOTS_DATA.find((s) => s.id === selectedSpotId) || SPOTS_DATA[0];

  // Like Toggle Handler
  const toggleLike = (postId: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            liked: !post.liked,
            likes: post.liked ? post.likes - 1 : post.likes + 1
          };
        }
        return post;
      })
    );
  };

  // Simulated Spot Camera Action
  const triggerCameraSpot = () => {
    setFlash(true);
    // Select random car & spot
    const randomCar = CAR_OPTIONS[Math.floor(Math.random() * CAR_OPTIONS.length)];
    const randomSpot = SPOTS_DATA[Math.floor(Math.random() * SPOTS_DATA.length)];
    
    setTimeout(() => {
      setFlash(false);
      setJustSpottedCar(randomCar.name);

      // Create new post
      const newPost: Post = {
        id: `spotted-${Date.now()}`,
        car: randomCar.name,
        location: randomSpot.name,
        time: 'Just now',
        user: '@you.spotted',
        img: randomCar.img,
        likes: 1,
        liked: true
      };

      // Prepend to posts list
      setPosts((prev) => [newPost, ...prev]);

      // Transition to Feed tab after a short delay so the user can see their post
      setTimeout(() => {
        setJustSpottedCar(null);
        setActiveTab('feed');
      }, 1500);
    }, 250);
  };

  return (
    <PhoneFrame className="w-full">
      <div className="flex h-full flex-col bg-ink-950 text-white font-sans overflow-hidden select-none">
        
        {/* Status bar */}
        <div className="flex items-center justify-between px-5 pt-3 pb-1 text-[10px] font-semibold text-white/80 z-20 bg-ink-950/80 backdrop-blur-sm">
          <span>9:41</span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-400" />
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
          </span>
        </div>

        {/* Dynamic Header */}
        {activeTab !== 'camera' && activeTab !== 'spot-details' && (
          <div className="px-3.5 pb-2.5 pt-1.5 border-b border-white/5 bg-ink-950/80 backdrop-blur-sm z-20">
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-ink-900/60 px-3 py-2">
              <Search size={12} className="text-white/40" />
              <span className="text-[10px] text-white/40 leading-none">Search photo spots...</span>
            </div>
          </div>
        )}

        {/* Screens Area */}
        <div className="relative flex-1 overflow-hidden">
          
          {/* CAMERA FLASH OVERLAY */}
          {flash && (
            <div className="absolute inset-0 bg-white z-[99] animate-fade-in" style={{ animationDuration: '100ms' }} />
          )}

          {/* SPOTTED NOTIFICATION DIALOG */}
          {justSpottedCar && (
            <div className="absolute inset-x-3 top-4 z-[90] flex items-center gap-2.5 rounded-2xl border border-cyan-400/30 bg-ink-900/95 p-3.5 shadow-glow-sm backdrop-blur-md animate-fade-up">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-400/25 text-cyan-400 border border-cyan-400/20">
                <Award size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-bold text-cyan-400 uppercase tracking-wide leading-none">Spotted!</p>
                <p className="text-xs font-extrabold text-white truncate mt-1">{justSpottedCar}</p>
              </div>
            </div>
          )}

          {/* MAP SCREEN */}
          {activeTab === 'map' && (
            <div className="relative h-full w-full overflow-hidden bg-[#070b13]">
              {/* Map grid background */}
              <div className="absolute inset-0 map-grid-fine opacity-20" />
              
              {/* Stylized River (Vector path) */}
              <svg className="absolute inset-0 h-full w-full opacity-[0.15]" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M -40,320 C 60,300 100,240 160,140 C 220,40 280,-10 320,-30 L 320,-10 C 280,10 220,60 160,160 C 100,260 60,320 -40,340 Z"
                  fill="#5ab2ff"
                />
              </svg>

              {/* Stylized Parks */}
              <div className="absolute left-[8%] top-[38%] h-14 w-20 rounded-xl bg-emerald-500/10 border border-emerald-500/20 rotate-[12deg] pointer-events-none" />
              <div className="absolute right-[6%] bottom-[22%] h-16 w-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 pointer-events-none" />
              <div className="absolute left-[45%] top-[12%] h-10 w-14 rounded-lg bg-emerald-500/5 border border-emerald-500/10 -rotate-[15deg] pointer-events-none" />

              {/* Stylized Roads / Highways */}
              <svg className="absolute inset-0 h-full w-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                {/* Curved Main Highway */}
                <path
                  d="M -10,210 Q 120,180 290,250"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.12)"
                  strokeWidth="6"
                />
                <path
                  d="M -10,210 Q 120,180 290,250"
                  fill="none"
                  stroke="rgba(90, 178, 255, 0.25)"
                  strokeWidth="1.5"
                  strokeDasharray="4,4"
                />
                
                {/* Secondary roads */}
                <path d="M 75,0 L 75,500" fill="none" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="3" />
                <path d="M 215,0 L 215,500" fill="none" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="3" />
                <path d="M 0,95 L 280,95" fill="none" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="3" />
                <path d="M 0,390 L 280,390" fill="none" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="3" />
              </svg>

              {/* Radar scanner sweep effect */}
              <div className="absolute inset-0 scan-sweep pointer-events-none" />

              {/* Markers */}
              {SPOTS_DATA.map((spot) => {
                const isActive = spot.id === selectedSpotId;
                return (
                  <button
                    key={spot.id}
                    onClick={() => setSelectedSpotId(spot.id)}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer focus:outline-none"
                    style={{ left: `${spot.coords.x}%`, top: `${spot.coords.y}%` }}
                    aria-label={`Select ${spot.name}`}
                  >
                    {/* Ripple glow for active marker */}
                    {isActive && (
                      <span className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-400/35 animate-pulse-marker" />
                    )}
                    
                    {/* Marker pin */}
                    <div
                      className={`relative flex h-7 w-7 items-center justify-center rounded-full border-2 border-ink-950 shadow-glow-sm transition-all duration-300 ${
                        isActive ? 'bg-accent-400 scale-110' : 'bg-accent-500/70 hover:bg-accent-500 hover:scale-105'
                      }`}
                    >
                      <MapPin size={11} className={isActive ? 'text-ink-950' : 'text-white'} />
                    </div>
                  </button>
                );
              })}

              {/* Selected spot details card */}
              <div className="absolute bottom-3.5 left-3.5 right-3.5 overflow-hidden rounded-2xl border border-white/10 bg-ink-900/90 p-3 shadow-glow-sm backdrop-blur-md transition-all duration-300">
                <div className="flex gap-3">
                  <img
                    src={activeSpot.img}
                    alt={activeSpot.name}
                    className="h-16 w-16 flex-shrink-0 rounded-xl object-cover border border-white/5"
                  />
                  <div className="flex flex-col justify-center min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={11} className="text-accent-400" />
                      <span className="truncate text-xs font-bold text-white">
                        {activeSpot.name}
                      </span>
                      <span className="ml-auto flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-live-dot" />
                        <span className="text-[9px] font-semibold text-cyan-400">live</span>
                      </span>
                    </div>
                    <p className="mt-0.5 text-[9px] text-white/50 truncate">
                      {activeSpot.photosCount} photos this week · {activeSpot.distance}
                    </p>
                    <button
                      onClick={() => setActiveTab('spot-details')}
                      className="mt-2 inline-flex self-start items-center justify-center gap-1 rounded-lg bg-accent-400/15 hover:bg-accent-400/25 px-2.5 py-1 text-[10px] font-bold text-accent-400 transition-colors cursor-pointer"
                    >
                      <Navigation2 size={8} className="rotate-45" />
                      Explore Spot
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SPOT DETAILS SCREEN */}
          {activeTab === 'spot-details' && (
            <div className="h-full w-full bg-ink-950 flex flex-col overflow-y-auto no-scrollbar animate-fade-in">
              {/* Cover view */}
              <div className="relative h-40 shrink-0">
                <img
                  src={activeSpot.img}
                  alt={activeSpot.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/20 to-transparent" />
                <button
                  onClick={() => setActiveTab('map')}
                  className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-ink-950/70 border border-white/10 text-white/80 hover:bg-ink-950 hover:text-white cursor-pointer"
                  aria-label="Back to Map"
                >
                  <ChevronLeft size={16} />
                </button>
              </div>

              {/* Title Content */}
              <div className="px-4 pt-2.5 pb-4">
                <div className="flex items-center gap-1.5">
                  <MapPin size={12} className="text-accent-400" />
                  <h3 className="text-sm font-extrabold text-white">{activeSpot.name}</h3>
                  <span className="ml-auto flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-live-dot" />
                    <span className="text-[9px] font-semibold text-cyan-400">live</span>
                  </span>
                </div>
                <p className="mt-1 text-[10px] text-white/50">{activeSpot.location}</p>
                <div className="mt-2.5 flex items-center gap-4 border-t border-white/5 pt-2.5 text-[10px] text-white/60">
                  <span>{activeSpot.photosCount} photos shared</span>
                  <span className="text-accent-300">{activeSpot.distance}</span>
                </div>

                {/* Photo Grid */}
                <div className="mt-4">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-white/40 mb-2">
                    Recent Photos taken here
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {activeSpot.recentPhotos.map((imgUrl, i) => (
                      <div key={i} className="relative overflow-hidden rounded-xl aspect-[4/3] border border-white/5">
                        <img
                          src={imgUrl}
                          alt={`${activeSpot.name} spot detail ${i}`}
                          className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FEED SCREEN */}
          {activeTab === 'feed' && (
            <div className="h-full w-full bg-ink-950 overflow-y-auto no-scrollbar px-3 pt-3 pb-5 flex flex-col gap-3 animate-fade-in">
              <div className="px-1.5 pb-1">
                <h3 className="text-sm font-extrabold text-white">Recent Spots</h3>
                <p className="text-[9px] text-white/50 mt-0.5">Latest community submissions</p>
              </div>

              {posts.map((post) => (
                <div key={post.id} className="overflow-hidden rounded-2xl border border-white/10 bg-ink-900/60 transition-colors">
                  <div className="relative h-28 overflow-hidden">
                    <img src={post.img} alt={post.car} className="h-full w-full object-cover" />
                    <span className="absolute right-2 top-2 rounded-full bg-ink-950/70 px-2 py-0.5 text-[8px] font-bold text-accent-300 backdrop-blur-md">
                      Spotted
                    </span>
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-bold text-white leading-none">{post.car}</p>
                    <div className="mt-1 flex items-center justify-between text-[9px] text-white/50">
                      <span className="flex items-center gap-1">
                        <MapPin size={8} className="text-accent-400" />
                        {post.location}
                      </span>
                      <span>{post.time}</span>
                    </div>
                    <div className="mt-2.5 flex items-center justify-between border-t border-white/5 pt-2.5">
                      <span className="text-[9px] text-white/40">{post.user}</span>
                      <button
                        onClick={() => toggleLike(post.id)}
                        className={`flex items-center gap-1 text-[9px] transition-colors cursor-pointer ${
                          post.liked ? 'text-accent-400 font-bold' : 'text-white/40 hover:text-white'
                        }`}
                        aria-label={post.liked ? 'Unlike' : 'Like'}
                      >
                        <Heart size={10} className={post.liked ? 'fill-accent-400 text-accent-400' : ''} />
                        <span>{post.likes}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CAMERA SIMULATION SCREEN */}
          {activeTab === 'camera' && (
            <div className="relative h-full w-full bg-ink-950 flex flex-col justify-between overflow-hidden animate-fade-in">
              {/* Live camera preview simulator background */}
              <div className="absolute inset-0">
                <img
                  src={IMAGES.heroCar}
                  alt="Camera viewport simulator"
                  className="h-full w-full object-cover filter brightness-[0.7] contrast-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
              </div>

              {/* Top controls HUD */}
              <div className="relative z-10 p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-1 bg-ink-950/70 border border-white/10 px-2.5 py-1 rounded-full text-[9px] text-white/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-live-dot" />
                  <span>SIM VIEW</span>
                </div>
                <div className="text-[10px] text-white/60 font-mono tracking-widest bg-ink-950/70 px-2 py-0.5 rounded-full">
                  1080p · 60FPS
                </div>
              </div>

              {/* Center viewfinder reticle */}
              <div className="relative z-10 flex-1 flex items-center justify-center p-8">
                <div className="relative h-44 w-full max-w-[190px] border border-dashed border-white/20 rounded-2xl flex items-center justify-center flex-col">
                  {/* Corners brackets */}
                  <div className="absolute -left-1 -top-1 h-3 w-3 border-l-2 border-t-2 border-white/60 rounded-tl-md" />
                  <div className="absolute -right-1 -top-1 h-3 w-3 border-r-2 border-t-2 border-white/60 rounded-tr-md" />
                  <div className="absolute -left-1 -bottom-1 h-3 w-3 border-l-2 border-b-2 border-white/60 rounded-bl-md" />
                  <div className="absolute -right-1 -bottom-1 h-3 w-3 border-r-2 border-b-2 border-white/60 rounded-br-md" />

                  <Camera size={26} className="text-white/20 animate-pulse" />
                  <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest mt-2">Align car in center</p>
                </div>
              </div>

              {/* Bottom controls & shutter */}
              <div className="relative z-10 p-4 bg-gradient-to-t from-black/90 to-transparent flex flex-col items-center">
                <p className="text-[9px] text-white/50 mb-3 text-center">
                  Tap shutter to simulate spotting a supercar
                </p>
                <button
                  onClick={triggerCameraSpot}
                  className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-white/30 bg-white hover:bg-white/95 scale-100 hover:scale-105 active:scale-95 transition-all shadow-glow cursor-pointer"
                  aria-label="Trigger Shutter"
                >
                  <span className="h-10 w-10 rounded-full border border-ink-950 bg-transparent" />
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Tab Navigation bar */}
        <div className="flex items-center justify-around border-t border-white/5 bg-ink-900/90 py-2 z-20">
          <button
            onClick={() => setActiveTab('map')}
            className={`flex h-11 w-11 flex-col items-center justify-center rounded-xl transition-all cursor-pointer ${
              activeTab === 'map' || activeTab === 'spot-details' ? 'bg-accent-400/15 text-accent-400' : 'text-white/40 hover:text-white/60'
            }`}
            aria-label="Map discovery"
          >
            <MapPin size={17} />
            <span className="text-[7.5px] font-bold mt-1 tracking-wide">Map</span>
          </button>
          
          <button
            onClick={() => setActiveTab('camera')}
            className={`flex h-11 w-11 flex-col items-center justify-center rounded-xl transition-all cursor-pointer ${
              activeTab === 'camera' ? 'bg-accent-400/15 text-accent-400' : 'text-white/40 hover:text-white/60'
            }`}
            aria-label="Spot camera"
          >
            <Camera size={17} />
            <span className="text-[7.5px] font-bold mt-1 tracking-wide">Spot</span>
          </button>

          <button
            onClick={() => setActiveTab('feed')}
            className={`flex h-11 w-11 flex-col items-center justify-center rounded-xl transition-all cursor-pointer ${
              activeTab === 'feed' ? 'bg-accent-400/15 text-accent-400' : 'text-white/40 hover:text-white/60'
            }`}
            aria-label="Community feed"
          >
            <MessageSquare size={17} />
            <span className="text-[7.5px] font-bold mt-1 tracking-wide">Feed</span>
          </button>
        </div>

      </div>
    </PhoneFrame>
  );
}

// Wrappers mapping legacy mockups to our unified stateful app simulator
export function HeroPhone() {
  return <PhoneApp initialTab="map" />;
}

export function MapDiscoveryScreen() {
  return <PhoneApp initialTab="map" />;
}

export function SpotLocationScreen() {
  return <PhoneApp initialTab="spot-details" initialSelectedSpotId="downtown-garage" />;
}

export function PostsFeedScreen() {
  return <PhoneApp initialTab="feed" />;
}
