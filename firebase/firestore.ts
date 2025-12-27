import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query,
  onSnapshot,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from './config';
import { MerchantStore, StoreProfile, Product, Order } from '../types';

// Collections
const STORES_COLLECTION = 'stores';
const CARTS_COLLECTION = 'carts';

// Helper to convert Firestore timestamps to numbers
const convertTimestamp = (data: any): any => {
  if (data && typeof data === 'object') {
    if (data instanceof Timestamp) {
      return data.toMillis();
    }
    if (Array.isArray(data)) {
      return data.map(convertTimestamp);
    }
    const converted: any = {};
    for (const key in data) {
      converted[key] = convertTimestamp(data[key]);
    }
    return converted;
  }
  return data;
};

// Stores operations
export const storeService = {
  // Get all stores
  getAllStores: async (): Promise<MerchantStore[]> => {
    const storesRef = collection(db, STORES_COLLECTION);
    const snapshot = await getDocs(storesRef);
    return snapshot.docs.map(doc => {
      const data = convertTimestamp(doc.data());
      return { ...data, profile: { ...data.profile } } as MerchantStore;
    });
  },

  // Get store by ID
  getStore: async (storeId: string): Promise<MerchantStore | null> => {
    const storeRef = doc(db, STORES_COLLECTION, storeId);
    const storeSnap = await getDoc(storeRef);
    if (storeSnap.exists()) {
      const data = convertTimestamp(storeSnap.data());
      return { ...data, profile: { ...data.profile } } as MerchantStore;
    }
    return null;
  },

  // Create a new store
  createStore: async (store: MerchantStore): Promise<void> => {
    const storeRef = doc(db, STORES_COLLECTION, store.profile.id);
    await setDoc(storeRef, {
      ...store,
      profile: {
        ...store.profile,
        expiryDate: Timestamp.fromMillis(store.profile.expiryDate),
      },
      createdAt: Timestamp.now(),
    });
  },

  // Update store profile
  updateStoreProfile: async (storeId: string, profile: StoreProfile): Promise<void> => {
    const storeRef = doc(db, STORES_COLLECTION, storeId);
    await updateDoc(storeRef, {
      'profile': {
        ...profile,
        expiryDate: Timestamp.fromMillis(profile.expiryDate),
      },
    });
  },

  // Add product to store
  addProduct: async (storeId: string, product: Product): Promise<void> => {
    const storeRef = doc(db, STORES_COLLECTION, storeId);
    const storeSnap = await getDoc(storeRef);
    if (storeSnap.exists()) {
      const storeData = convertTimestamp(storeSnap.data());
      const store = storeData as MerchantStore;
      const updatedProducts = [product, ...(store.products || [])];
      await updateDoc(storeRef, { products: updatedProducts });
    }
  },

  // Delete product from store
  deleteProduct: async (storeId: string, productId: string): Promise<void> => {
    const storeRef = doc(db, STORES_COLLECTION, storeId);
    const storeSnap = await getDoc(storeRef);
    if (storeSnap.exists()) {
      const storeData = convertTimestamp(storeSnap.data());
      const store = storeData as MerchantStore;
      const updatedProducts = (store.products || []).filter(p => p.id !== productId);
      await updateDoc(storeRef, { products: updatedProducts });
    }
  },

  // Add order to store
  addOrder: async (storeId: string, order: Order): Promise<void> => {
    const storeRef = doc(db, STORES_COLLECTION, storeId);
    const storeSnap = await getDoc(storeRef);
    if (storeSnap.exists()) {
      const storeData = convertTimestamp(storeSnap.data());
      const store = storeData as MerchantStore;
      const updatedOrders = [order, ...(store.orders || [])];
      await updateDoc(storeRef, { 
        orders: updatedOrders,
      });
    }
  },

  // Update order status
  updateOrderStatus: async (storeId: string, orderId: string, status: Order['status']): Promise<void> => {
    const storeRef = doc(db, STORES_COLLECTION, storeId);
    const storeSnap = await getDoc(storeRef);
    if (storeSnap.exists()) {
      const storeData = convertTimestamp(storeSnap.data());
      const store = storeData as MerchantStore;
      const updatedOrders = (store.orders || []).map(order => 
        order.id === orderId ? { ...order, status } : order
      );
      await updateDoc(storeRef, { orders: updatedOrders });
    }
  },

  // Update products array
  updateProducts: async (storeId: string, products: Product[]): Promise<void> => {
    const storeRef = doc(db, STORES_COLLECTION, storeId);
    await updateDoc(storeRef, { products });
  },

  // Update orders array
  updateOrders: async (storeId: string, orders: Order[]): Promise<void> => {
    const storeRef = doc(db, STORES_COLLECTION, storeId);
    await updateDoc(storeRef, { orders });
  },

  // Update entire store (for complex updates)
  updateStore: async (store: MerchantStore): Promise<void> => {
    const storeRef = doc(db, STORES_COLLECTION, store.profile.id);
    await updateDoc(storeRef, {
      profile: {
        ...store.profile,
        expiryDate: Timestamp.fromMillis(store.profile.expiryDate),
      },
      products: store.products,
      orders: store.orders,
    });
  },

  // Subscribe to store changes
  subscribeToStore: (storeId: string, callback: (store: MerchantStore | null) => void): (() => void) => {
    const storeRef = doc(db, STORES_COLLECTION, storeId);
    return onSnapshot(storeRef, (doc) => {
      if (doc.exists()) {
        const data = convertTimestamp(doc.data());
        callback({ ...data, profile: { ...data.profile } } as MerchantStore);
      } else {
        callback(null);
      }
    });
  },

  // Subscribe to all stores changes
  subscribeToAllStores: (callback: (stores: MerchantStore[]) => void): (() => void) => {
    const storesRef = collection(db, STORES_COLLECTION);
    return onSnapshot(storesRef, (snapshot) => {
      const stores = snapshot.docs.map(doc => {
        const data = convertTimestamp(doc.data());
        return { ...data, profile: { ...data.profile } } as MerchantStore;
      });
      callback(stores);
    });
  },
};

// Cart operations (stored per user session/store combination)
export const cartService = {
  // Get cart for a store
  getCart: async (storeId: string, sessionId: string): Promise<any[]> => {
    const cartRef = doc(db, CARTS_COLLECTION, `${storeId}_${sessionId}`);
    const cartSnap = await getDoc(cartRef);
    if (cartSnap.exists()) {
      return cartSnap.data().items || [];
    }
    return [];
  },

  // Save cart
  saveCart: async (storeId: string, sessionId: string, items: any[]): Promise<void> => {
    const cartRef = doc(db, CARTS_COLLECTION, `${storeId}_${sessionId}`);
    await setDoc(cartRef, { 
      items,
      storeId,
      sessionId,
      updatedAt: Timestamp.now(),
    }, { merge: true });
  },

  // Clear cart
  clearCart: async (storeId: string, sessionId: string): Promise<void> => {
    const cartRef = doc(db, CARTS_COLLECTION, `${storeId}_${sessionId}`);
    await deleteDoc(cartRef);
  },

  // Generate session ID (simple implementation)
  generateSessionId: (): string => {
    let sessionId = localStorage.getItem('swiftcart_session_id');
    if (!sessionId) {
      sessionId = 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
      localStorage.setItem('swiftcart_session_id', sessionId);
    }
    return sessionId;
  },
};
