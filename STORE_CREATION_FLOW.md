# New Merchant Store Creation Flow

## Overview
When a new merchant wants to create a store, here's exactly what happens:

## Step-by-Step Process

### 1. **Onboarding Form** (`components/Onboarding.tsx`)
User fills out 3 steps:
- **Step 1:** Store Name & Tagline
- **Step 2:** Owner Email
- **Step 3:** Brand Color

### 2. **Data Storage (Temporary)**
After completing onboarding, data is temporarily saved to `localStorage`:
```javascript
localStorage.setItem('pending_onboarding', JSON.stringify(formData))
```

### 3. **Payment Simulation** (`components/PaymentSimulation.tsx`)
User goes through payment flow (simulated EasyPaisa payment for Rs. 500)

### 4. **Store Creation** (`App.tsx` → `createStore()`)
When payment succeeds, `createStore()` function is called:

```javascript
const createStore = async (profileData) => {
  // Generate unique store ID
  const storeId = 'shop-' + Math.random().toString(36).substr(2, 5);
  
  // Create store object
  const newStore = {
    profile: {
      id: storeId,
      name: profileData.name,
      tagline: profileData.tagline,
      brandColor: profileData.brandColor,
      subscriptionStatus: 'active',
      planName: 'Local Hero Plan',
      expiryDate: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 days from now
      ownerEmail: profileData.ownerEmail
    },
    products: [],  // Empty array initially
    orders: []     // Empty array initially
  };
  
  // Save to Firebase Firestore
  await storeService.createStore(newStore);
}
```

### 5. **Firebase Firestore Storage** (`firebase/firestore.ts`)
The store is saved to Firestore:
- **Collection:** `stores`
- **Document ID:** The store's profile ID (e.g., "shop-abc123")
- **Document Data:**
  ```javascript
  {
    profile: {
      id: "shop-abc123",
      name: "Lahore Street Style",
      tagline: "Fast COD across Pakistan",
      brandColor: "#4f46e5",
      subscriptionStatus: "active",
      planName: "Local Hero Plan",
      expiryDate: Timestamp,  // Converted to Firestore Timestamp
      ownerEmail: "merchant@example.com"
    },
    products: [],
    orders: [],
    createdAt: Timestamp  // Auto-added by Firebase
  }
  ```

### 6. **Real-time Sync**
Once saved to Firestore:
- Store immediately appears in all connected clients
- `subscribeToAllStores()` updates the stores list in real-time
- User is redirected to Admin Panel

### 7. **Admin Panel Access**
User can now:
- Add products (stored in `products` array in Firestore)
- View/manage orders (stored in `orders` array in Firestore)
- Update store settings (profile updates saved to Firestore)
- View their storefront

## Key Differences with Firebase

### Before (localStorage):
- Data only stored locally in browser
- Lost if user clears browser data
- Not accessible across devices
- No real-time sync

### Now (Firebase):
- Data stored in cloud (Firestore)
- Persistent across sessions
- Accessible from any device
- Real-time updates across all users
- Appears in marketplace immediately
- Other users can see the store

## Data Structure in Firestore

```
stores/
  └── shop-abc123/
      ├── profile: { ... }
      ├── products: [ Product, Product, ... ]
      ├── orders: [ Order, Order, ... ]
      └── createdAt: Timestamp
```

## What Happens After Creation

1. Store is saved to Firestore ✅
2. Store appears in marketplace immediately ✅
3. Store appears in user's "My Command Center" ✅
4. User can start adding products ✅
5. Store is publicly viewable at storefront ✅
6. Store can receive orders ✅

