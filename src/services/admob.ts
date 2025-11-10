import { AdMob, BannerAdOptions, BannerAdSize, BannerAdPosition, AdOptions } from '@capacitor-community/admob';

// AdMob Configuration
// IMPORTANT: Replace these with your actual AdMob IDs from Google AdMob Console
const ADMOB_CONFIG = {
  // Test IDs for development - Replace with your real IDs in production
  android: {
    banner: 'ca-app-pub-3940256099942544/6300978111', // Test banner ID
    interstitial: 'ca-app-pub-3940256099942544/1033173712', // Test interstitial ID
    rewarded: 'ca-app-pub-3940256099942544/5224354917', // Test rewarded ID
  },
  ios: {
    banner: 'ca-app-pub-3940256099942544/2934735716',
    interstitial: 'ca-app-pub-3940256099942544/4411468910',
    rewarded: 'ca-app-pub-3940256099942544/1712485313',
  }
};

class AdMobService {
  private isInitialized = false;

  async initialize() {
    try {
      await AdMob.initialize({
        testingDevices: ['YOUR_DEVICE_ID_HERE'],
        initializeForTesting: true,
      });
      this.isInitialized = true;
      console.log('AdMob initialized successfully');
    } catch (error) {
      console.error('AdMob initialization failed:', error);
    }
  }

  async showBanner() {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const options: BannerAdOptions = {
        adId: ADMOB_CONFIG.android.banner,
        adSize: BannerAdSize.ADAPTIVE_BANNER,
        position: BannerAdPosition.BOTTOM_CENTER,
        margin: 0,
      };

      await AdMob.showBanner(options);
      console.log('Banner ad shown');
    } catch (error) {
      console.error('Error showing banner ad:', error);
    }
  }

  async hideBanner() {
    try {
      await AdMob.hideBanner();
      console.log('Banner ad hidden');
    } catch (error) {
      console.error('Error hiding banner ad:', error);
    }
  }

  async showInterstitial() {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const options: AdOptions = {
        adId: ADMOB_CONFIG.android.interstitial,
      };

      await AdMob.prepareInterstitial(options);
      await AdMob.showInterstitial();
      console.log('Interstitial ad shown');
    } catch (error) {
      console.error('Error showing interstitial ad:', error);
    }
  }

  async showRewardedAd(): Promise<boolean> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const options: AdOptions = {
        adId: ADMOB_CONFIG.android.rewarded,
      };

      await AdMob.prepareRewardVideoAd(options);
      await AdMob.showRewardVideoAd();
      console.log('Rewarded ad completed');
      return true;
    } catch (error) {
      console.error('Error showing rewarded ad:', error);
      return false;
    }
  }
}

export const admobService = new AdMobService();
