# Android Resources Configuration

## App Icon Setup

1. Use the generated icon at `public/icon-1024.png` as your base icon
2. Generate all required Android icon sizes using a tool like:
   - https://icon.kitchen/ (recommended)
   - Android Asset Studio
   - Or manually create these sizes

3. Required icon sizes for Android (place in `android/app/src/main/res/`):
   - `mipmap-mdpi/ic_launcher.png` (48x48)
   - `mipmap-hdpi/ic_launcher.png` (72x72)
   - `mipmap-xhdpi/ic_launcher.png` (96x96)
   - `mipmap-xxhdpi/ic_launcher.png` (144x144)
   - `mipmap-xxxhdpi/ic_launcher.png` (192x192)

4. For adaptive icons (Android 8+), also create:
   - `mipmap-mdpi/ic_launcher_foreground.png`
   - `mipmap-mdpi/ic_launcher_background.png`
   - (Same for all other densities)

## AdMob Setup

### 1. Get Your AdMob App ID
1. Go to https://apps.admob.com/
2. Create an account or sign in
3. Create a new app or select existing
4. Get your App ID (format: ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY)

### 2. Update AdMob IDs in Code
Edit `src/services/admob.ts` and replace the test IDs with your real IDs:
```typescript
const ADMOB_CONFIG = {
  android: {
    banner: 'YOUR_BANNER_AD_UNIT_ID',
    interstitial: 'YOUR_INTERSTITIAL_AD_UNIT_ID',
    rewarded: 'YOUR_REWARDED_AD_UNIT_ID',
  }
};
```

### 3. Add AdMob App ID to AndroidManifest.xml
After running `npx cap add android`, edit `android/app/src/main/AndroidManifest.xml`:

```xml
<application>
    <!-- Add this meta-data tag with your AdMob App ID -->
    <meta-data
        android:name="com.google.android.gms.ads.APPLICATION_ID"
        android:value="ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY"/>
    
    <!-- Rest of your application config -->
</application>
```

## Building APK Steps

### Prerequisites
1. Install Android Studio: https://developer.android.com/studio
2. Install Java JDK 11 or higher

### Build Instructions

1. **Export project to Github** (use the button in Lovable)

2. **Clone and setup locally**:
```bash
git clone YOUR_GITHUB_REPO_URL
cd YOUR_PROJECT_NAME
npm install
```

3. **Add Android platform**:
```bash
npx cap add android
```

4. **Update Capacitor**:
```bash
npx cap update android
```

5. **Build the web app**:
```bash
npm run build
```

6. **Sync to Android**:
```bash
npx cap sync android
```

7. **Copy your app icon**:
   - Generate all required icon sizes from `public/icon-1024.png`
   - Place them in the appropriate `android/app/src/main/res/mipmap-*` folders

8. **Update AndroidManifest.xml** with your AdMob App ID (see above)

9. **Open in Android Studio**:
```bash
npx cap open android
```

10. **Generate Signed APK in Android Studio**:
    - Build → Generate Signed Bundle / APK
    - Choose APK
    - Create a new keystore (save it securely!)
    - Fill in your details
    - Choose "release" build variant
    - Click Finish

Your APK will be generated in `android/app/release/app-release.apk`

## Testing on Device

### Quick testing (during development):
```bash
npx cap run android
```

This will:
- Build the app
- Install on connected device/emulator
- Launch the app

### Testing AdMob
- During development, test ads will show (the test IDs in the code)
- Before publishing, replace with your real AdMob IDs
- Test on a real device (not emulator) for best results

## Important Notes

1. **AdMob Test Mode**: The current configuration uses test ad IDs. Replace them with real IDs before publishing to Play Store.

2. **App Permissions**: AdMob requires internet permission, which is already included by default in Android apps.

3. **Google Play Store**: Before publishing:
   - Update `android/app/build.gradle` with proper version codes
   - Create a privacy policy (required for apps with ads)
   - Link your AdMob account to your Play Console account

4. **Hot Reload**: The app is configured to load from the Lovable preview URL for easy testing. Before building production APK, you may want to disable this in `capacitor.config.ts` by removing the `server` section.

## Troubleshooting

- **Build errors**: Make sure Android SDK is properly installed via Android Studio
- **AdMob not showing**: Check device has internet connection and wait a few seconds
- **Icon not showing**: Verify all icon sizes are generated and placed correctly
- **App crashes**: Check Android Studio Logcat for error messages
