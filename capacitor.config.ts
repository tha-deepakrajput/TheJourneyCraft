import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.journeycraft.app',
  appName: 'JourneyCraft',
  webDir: 'public',
  server: {
    url: 'http://localhost:3000', // Update this to your deployed URL for production
    cleartext: true
  }
};

export default config;
