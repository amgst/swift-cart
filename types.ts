
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface StoreProfile {
  id: string;
  name: string;
  tagline: string;
  brandColor: string;
  subscriptionStatus: 'active' | 'expired';
  planName: string;
  expiryDate: number;
  ownerEmail: string;
  userId: string; // Firebase Auth user ID
  storeSlug: string; // Custom URL slug (e.g., "my-store" -> swiftcart.pk/s/my-store)
  customDomain?: string;
  domainStatus?: 'pending' | 'active' | 'error';
}

export interface MerchantStore {
  profile: StoreProfile;
  products: Product[];
  orders: Order[];
}

export interface Order {
  id: string;
  items: CartItem[];
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  total: number;
  status: 'pending' | 'shipped' | 'delivered';
  createdAt: number;
}

export type ViewType = 'landing' | 'onboarding' | 'payment' | 'store' | 'admin' | 'checkout' | 'success' | 'marketplace' | 'tracking' | 'login' | 'register' | 'dashboard';
