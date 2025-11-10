import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.add7fa5647464c669e696fca050648af',
  appName: 'تفسير الأحلام AI',
  webDir: 'dist',
  server: {
    url: 'https://add7fa56-4746-4c66-9e69-6fca050648af.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#1a1a3e",
      showSpinner: false
    }
  }
};

export default config;
