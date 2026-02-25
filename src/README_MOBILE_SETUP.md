# Mobile setup (React Native CLI)

This repo ships `mobile_src/` (MVC app code). To generate a full RN CLI project with Android Studio files:

```bash
cd scripts
bash bootstrap_mobile.sh
```

Then:
- Open Android Studio -> `mobile/android`
- Run Metro: `cd mobile && npx react-native start`
- Run app: `cd mobile && npx react-native run-android`

## Required deps (will be installed by npm i)
- react-native-paper
- react-navigation
- @react-native-quick-crypto (AES-256-GCM)
- react-native-keychain (biometric gate)
