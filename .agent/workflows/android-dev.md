---
description: How to run the Sudoku game as an Android application using Android Studio
---

# Android Development Workflow (Bare React Native)

This project has been migrated from Expo to a **Bare React Native** architecture. You now have full control over the `android/` directory and can use **Android Studio** for development.

## Prerequisites
- **Android Studio**: Installed and configured.
- **Java Development Kit (JDK)**: Version 17 or higher (recommended for React Native 0.73+).
- **Android SDK**: Installed via Android Studio SDK Manager.
- **Environment Variables**: Ensure `ANDROID_HOME` is set and `platform-tools` is in your `PATH`.

## Connecting with Android Studio

1. **Open Android Studio**.
2. Select **"Open an existing project"**.
3. Navigate to your project folder and select the **`android/`** directory (not the root project folder).
4. Wait for **Gradle Sync** to finish. This may take a few minutes as it downloads dependencies.

## Running the App

### 1. Start the Metro Bundler
In your terminal (VS Code or CMD), run:
```bash
npm start
```

### 2. Launch on Android
You can launch the app in two ways:

#### Option A: From Terminal (Recommended)
With an emulator running or device connected:
```bash
npm run android
```

#### Option B: From Android Studio
1. Click the **"Run"** button (green play icon) in the top toolbar.
2. Select your target device/emulator.

## Troubleshooting: Gradle Errors

If you see Gradle errors in Android Studio:
1. Go to **File -> Sync Project with Gradle Files**.
2. If errors persist, try cleaning the build:
   ```bash
   cd android
   ./gradlew clean
   cd ..
   ```

## Building a Production APK

1. In Android Studio, go to **Build -> Generate Signed Bundle / APK...**.
2. Follow the wizard to create a Keystore or use an existing one.
3. Select **APK** and choose the **`release`** build variant.
4. The generated APK will be in `android/app/release/`.

---

### Environment Setup Reminder
If `adb` is not recognized, ensure your SDK path is correct:
- **Variable name**: `ANDROID_HOME`
- **Variable value**: `C:\Users\Prakash\AppData\Local\Android\Sdk`
- **Path**: Add `%ANDROID_HOME%\platform-tools`
