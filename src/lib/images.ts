/**
 * Centralized image URLs so automotive photography is easy to swap later.
 * All images are external high-quality automotive photos.
 */
export const IMAGES = {
  // Hero phone mockup preview
  heroCar:
    'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800',

  // App preview screens
  mapDiscovery:
    'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=600',
  spotLocation:
    'https://images.pexels.com/photos/707046/pexels-photo-707046.jpeg?auto=compress&cs=tinysrgb&w=600',
  postsFeed:
    'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=600',

  // Community photo cards
  community: [
    {
      car: 'Lamborghini Huracán',
      location: 'Downtown Garage',
      time: '2h ago',
      user: '@alex.spots',
      img: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=600',
    },
    {
      car: 'Porsche 911 GT3',
      location: 'Harbor Lot',
      time: '5h ago',
      user: '@nightdriver',
      img: 'https://images.pexels.com/photos/707046/pexels-photo-707046.jpeg?auto=compress&cs=tinysrgb&w=600',
    },
    {
      car: 'Nissan GT-R',
      location: 'Canyon Overlook',
      time: '6h ago',
      user: '@canyon.cars',
      img: 'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=600',
    },
    {
      car: 'BMW M3 E46',
      location: 'Weekly Meet Spot',
      time: '8h ago',
      user: '@e46forever',
      img: 'https://images.pexels.com/photos/3786091/pexels-photo-3786091.jpeg?auto=compress&cs=tinysrgb&w=600',
    },
    {
      car: 'Ferrari 488',
      location: 'Coastal Pull-out',
      time: '12h ago',
      user: '@coastal.spotter',
      img: 'https://images.pexels.com/photos/5059962/pexels-photo-5059962.jpeg?auto=compress&cs=tinysrgb&w=600',
    },
    {
      car: 'Mazda RX-7 FD',
      location: 'Industrial District',
      time: '1d ago',
      user: '@rotarylife',
      img: 'https://images.pexels.com/photos/16365582/pexels-photo-16365582.jpeg?auto=compress&cs=tinysrgb&w=600',
    },
  ],
} as const;
