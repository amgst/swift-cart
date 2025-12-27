# Firebase Integration Guide

This document describes the Firebase integration for SwiftCart.

## Overview

SwiftCart has been migrated from localStorage to Firebase Firestore for data persistence. This provides:
- Real-time data synchronization
- Cloud-based data storage
- Better scalability
- Multi-device support

## Architecture

### Collections

1. **stores** - Contains all merchant store data
   - Document ID: Store profile ID (e.g., "shop-abc123")
   - Fields:
     - `profile`: StoreProfile object
     - `products`: Array of Product objects
     - `orders`: Array of Order objects
     - `createdAt`: Timestamp

2. **carts** - Contains shopping cart data per session
   - Document ID: `{storeId}_{sessionId}`
   - Fields:
     - `items`: Array of CartItem objects
     - `storeId`: String
     - `sessionId`: String
     - `updatedAt`: Timestamp

## Security Rules

The Firestore security rules (`firestore.rules`) implement:

1. **Public Read Access**: All stores are publicly readable for marketplace and storefront viewing
2. **Store Creation**: Anyone can create a new store (for onboarding)
3. **Store Updates**: Public updates allowed (restricted in production with authentication)
4. **Cart Management**: Session-based cart read/write access
5. **Data Validation**: Ensures data structure integrity

### Production Considerations

For production, consider:
- Implementing Firebase Authentication
- Restricting store updates to authenticated owners
- Adding rate limiting
- Implementing proper access control based on `ownerEmail`

## Environment Variables

Required environment variables (in `.env.local`):

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## File Structure

```
firebase/
  ├── config.ts          # Firebase initialization
  └── firestore.ts       # Firestore service functions

firestore.rules          # Firestore security rules
firebase.json            # Firebase project configuration
.firebaserc              # Firebase project reference
```

## Key Functions

### Store Service (`storeService`)

- `getAllStores()`: Get all stores
- `getStore(storeId)`: Get a single store
- `createStore(store)`: Create a new store
- `updateStoreProfile(storeId, profile)`: Update store profile
- `addProduct(storeId, product)`: Add a product
- `deleteProduct(storeId, productId)`: Delete a product
- `addOrder(storeId, order)`: Add an order
- `updateOrderStatus(storeId, orderId, status)`: Update order status
- `updateProducts(storeId, products)`: Update products array
- `updateOrders(storeId, orders)`: Update orders array
- `updateStore(store)`: Update entire store
- `subscribeToStore(storeId, callback)`: Real-time store subscription
- `subscribeToAllStores(callback)`: Real-time all stores subscription

### Cart Service (`cartService`)

- `getCart(storeId, sessionId)`: Get cart for a session
- `saveCart(storeId, sessionId, items)`: Save cart
- `clearCart(storeId, sessionId)`: Clear cart
- `generateSessionId()`: Generate/retrieve session ID

## Deployment

1. **Deploy Security Rules:**
   ```bash
   firebase deploy --only firestore:rules
   ```

2. **Initialize Firestore:**
   - Create Firestore database in Firebase Console
   - Start in test mode or deploy rules first

3. **Verify Rules:**
   - Use Firebase Console > Firestore > Rules tab
   - Test rules with the rules playground

## Migration Notes

- Cart data is stored per session in Firestore
- Session ID is generated once per user and stored in localStorage
- Stores are synced in real-time across all clients
- Timestamps are automatically converted between Firestore Timestamp and JavaScript number formats

## Troubleshooting

1. **Firebase not initialized:**
   - Check environment variables are set correctly
   - Verify Firebase config values match your project

2. **Permission denied errors:**
   - Ensure Firestore rules are deployed
   - Check rules allow the operation you're trying to perform

3. **Data not syncing:**
   - Check browser console for errors
   - Verify Firestore database is created and rules are deployed
   - Ensure network connection is active
