<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1YzZy_S_l8jNGEoX6hwpWCJ6_Gs_NhDry

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   ```env
   # Gemini AI API Key
   GEMINI_API_KEY=your_gemini_api_key_here

   # Firebase Configuration
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

3. Set up Firebase:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Firestore Database
   - Copy your Firebase config values to `.env.local`
   - Deploy Firestore security rules:
     ```bash
     firebase deploy --only firestore:rules
     ```

4. Run the app:
   ```bash
   npm run dev
   ```

## Firebase Setup

The application uses Firebase Firestore for data persistence. To set up Firebase:

1. **Create a Firebase Project:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Firestore Database in test mode initially

2. **Get Firebase Configuration:**
   - Go to Project Settings > General
   - Scroll down to "Your apps"
   - Click on the web icon (</>)
   - Copy the config values to your `.env.local` file

3. **Deploy Security Rules:**
   - Install Firebase CLI: `npm install -g firebase-tools`
   - Login: `firebase login`
   - Initialize: `firebase init firestore`
   - Deploy rules: `firebase deploy --only firestore:rules`

The security rules are located in `firestore.rules` and allow:
- Public read access to stores (for marketplace and storefront)
- Public write access for store creation and updates
- Session-based cart management
