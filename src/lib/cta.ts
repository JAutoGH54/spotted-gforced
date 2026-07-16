/**
 * CTA configuration. Flip `LAUNCHED` to true when the app is live
 * and add store URLs — every CTA across the site updates automatically.
 */
export const CTA_CONFIG = {
  LAUNCHED: false,
  PRE_LAUNCH_LABEL: 'Join the Waitlist',
  LAUNCH_LABEL: 'Get the App',
  APP_STORE_URL: '#',
  GOOGLE_PLAY_URL: '#',
} as const;
