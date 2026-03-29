---
description: How to run the Sudoku game as an Android application
---

# Android Development Workflow

This project is built with **Expo**, which allows it to run natively on Android. Follow these steps to develop and test on Android.

## Prerequisites
- **Android Studio**: Installed and configured with an Android Emulator OR
- **Physical Device**: Android phone with "Developer Options" and "USB Debugging" enabled.
- **Expo Go**: Download the "Expo Go" app from the Google Play Store on your device.

## Running on Android

### 1. Start the Development Server
Run the following command in your terminal:
```bash
npx expo start
```

### 2. Launch on Android
Once the server is running and you see the QR code:
- **Emulator**: Press `a` in the terminal to automatically open the app in your running Android Emulator.
- **Physical Device**: 
  - Open the **Expo Go** app on your phone.
  - Scan the QR code displayed in your terminal.
  - The app will load onto your phone over your local network.

## Building an APK (Production)
To create a standalone Android application file (.apk), you can use EAS Build:

1. **Install EAS CLI**:
   ```bash
   npm install -g eas-cli
   ```
2. **Login to Expo**:
   ```bash
   eas login
   ```
3. **Configure Build**:
   ```bash
   eas build:configure
   ```
4. **Build APK**:
   ```bash
   eas build -p android --profile preview
   ```
   *(This will provide a download link for your APK once completed.)*

## Troubleshooting: SDK Not Found

If you see errors about "Android SDK path" or "'adb' is not recognized", follow these steps:

### 1. Locate your Android SDK
By default, it is installed at:
`C:\Users\Prakash\AppData\Local\Android\Sdk`
Ensure this folder exists. If you installed it elsewhere, note that path.

### 2. Set ANDROID_HOME Environment Variable
1.  Search for **"Edit the system environment variables"** in your Start menu.
2.  Click **Environment Variables**.
3.  Under **User variables**, click **New**.
4.  **Variable name**: `ANDROID_HOME`
5.  **Variable value**: `C:\Users\Prakash\AppData\Local\Android\Sdk` (or your custom path).
6.  Click **OK**.

### 3. Add Platform-Tools to PATH
1.  In the same **Environment Variables** window, find the **Path** variable under **User variables**.
2.  Select it and click **Edit**.
3.  Click **New** and add: `%ANDROID_HOME%\platform-tools`
4.  Click **OK** on all windows.

### 4. Restart your Terminal
Close and reopen your terminal/VS Code for the changes to take effect. Run `adb --version` to verify.
