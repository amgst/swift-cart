import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ViewType, Product, CartItem, Order, StoreProfile, MerchantStore } from './types';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import Storefront from './components/Storefront';
import AdminPanel from './components/AdminPanel';
import CartDrawer from './components/CartDrawer';
import Checkout from './components/Checkout';
import SuccessView from './components/SuccessView';
import Onboarding from './components/Onboarding';
import PaymentSimulation from './components/PaymentSimulation';
import Marketplace from './components/Marketplace';
import OrderTracking from './components/OrderTracking';
import Login from './components/Login';
import Register from './components/Register';
import UserDashboard from './components/UserDashboard';
// Fix: Added missing ShoppingBag icon import from lucide-react
import { ShoppingBag } from 'lucide-react';
import { storeService, cartService } from './firebase/firestore';
import { onAuthStateChange, getCurrentUser, registerUser, logoutUser } from './firebase/auth';
import { User } from 'firebase/auth';

interface AppProps {
  initialView?: ViewType;
  storeSlug?: string;
  page?: 'home' | 'about' | 'contact';
}

const App: React.FC<AppProps> = ({ initialView, storeSlug, page = 'home' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [view, setView] = useState<ViewType>(initialView || 'landing');
  const [stores, setStores] = useState<MerchantStore[]>([]);
  const [activeStoreId, setActiveStoreId] = useState<string | null>(() => {
    return localStorage.getItem('swiftcart_active_store_id');
  });
  const [cart, setCart] = useState<CartItem[]>([]);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const sessionId = useRef<string>(cartService.generateSessionId());
  const unsubscribeStoresRef = useRef<(() => void) | null>(null);
  const unsubscribeStoreRef = useRef<(() => void) | null>(null);

  // Load cart from Firebase
  const loadCart = useCallback(async (storeId: string) => {
    try {
      const cartItems = await cartService.getCart(storeId, sessionId.current);
      setCart(cartItems);
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  }, []);

  // Initialize Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChange((currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Handle URL-based routing for store slugs
  useEffect(() => {
    if (storeSlug && !authLoading) {
      // Load store by slug
      const loadStoreBySlug = async () => {
        try {
          const store = await storeService.getStoreBySlug(storeSlug);
          if (store) {
            setActiveStoreId(store.profile.id);
            // Determine view based on URL path
            if (location.pathname.includes('/admin')) {
              // Admin route - require authentication and ownership
              // Wait for auth to finish loading before checking
              if (!user) {
                // Not logged in, redirect to login with return URL
                const returnUrl = `/shop/${storeSlug}/admin`;
                navigate(`/login?return=${encodeURIComponent(returnUrl)}`);
                return;
              }
              if (store.profile.userId !== user.uid) {
                // Not the store owner, logout and redirect to login to allow switch account
                console.log('Permission denied: User ID mismatch. Logging out to allow account switch.');
                logoutUser();
                return;
              }
              setView('admin');
            } else {
              setView('store');
            }
          } else {
            // Store not found, redirect to landing
            navigate('/');
          }
        } catch (error) {
          console.error('Error loading store:', error);
          navigate('/');
        }
      };
      loadStoreBySlug();
    }
  }, [storeSlug, navigate, location.pathname, user, authLoading]);

  // Sync view with URL path
  useEffect(() => {
    const path = location.pathname;
    if (!storeSlug) {
      if (path === '/') setView('landing');
      else if (path === '/marketplace') setView('marketplace');
      else if (path === '/tracking') setView('tracking');
      else if (path === '/login') setView('login');
      else if (path === '/register') setView('register');
      else if (path === '/dashboard') setView('dashboard');
      else if (path === '/onboarding') setView('onboarding');
    }
  }, [location.pathname, storeSlug]);

  // Protect dashboard route - redirect to login if not authenticated
  useEffect(() => {
    if (view === 'dashboard' && !authLoading && !user) {
      navigate('/login');
    }
  }, [view, user, authLoading, navigate]);

  // Protect onboarding route - redirect to dashboard if already logged in and has store
  useEffect(() => {
    if (view === 'onboarding' && !authLoading && user) {
      // Check if user already has a store (one store per merchant limit)
      const userStores = stores.filter(s => s.profile.userId === user.uid);
      if (userStores.length > 0) {
        alert('You already have a store. Each merchant can only create one store.');
        navigate('/dashboard');
      }
    }
  }, [view, user, authLoading, navigate, stores]);

  // Initialize Firebase subscriptions
  useEffect(() => {
    // Subscribe to all stores
    const unsubscribe = storeService.subscribeToAllStores((updatedStores) => {
      setStores(updatedStores);
      setIsLoading(false);
    });
    unsubscribeStoresRef.current = unsubscribe;

    // Load initial cart if activeStoreId exists
    if (activeStoreId) {
      loadCart(activeStoreId);
    }

    return () => {
      if (unsubscribe) unsubscribe();
      if (unsubscribeStoreRef.current) unsubscribeStoreRef.current();
    };
  }, [loadCart, activeStoreId]);

  // Save cart to Firebase
  const saveCart = useCallback(async (storeId: string, items: CartItem[]) => {
    try {
      await cartService.saveCart(storeId, sessionId.current, items);
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  }, []);

  // Update activeStoreId in localStorage and load cart
  useEffect(() => {
    if (activeStoreId) {
      localStorage.setItem('swiftcart_active_store_id', activeStoreId);
      loadCart(activeStoreId);
      // Unsubscribe from previous store
      if (unsubscribeStoreRef.current) {
        unsubscribeStoreRef.current();
      }
    } else {
      localStorage.removeItem('swiftcart_active_store_id');
      setCart([]);
    }
  }, [activeStoreId, loadCart]);

  // Save cart to Firebase whenever it changes (if activeStoreId exists)
  useEffect(() => {
    if (activeStoreId && cart.length >= 0) {
      saveCart(activeStoreId, cart);
    }
  }, [cart, activeStoreId, saveCart]);

  const activeStore = stores.find(s => s.profile.id === activeStoreId) || null;

  const createStore = useCallback(async (
    profileData: Partial<StoreProfile> & { email?: string; password?: string; displayName?: string }
  ) => {
    let currentUser = user;

    // If user is not logged in, register them first
    if (!currentUser && profileData.email && profileData.password && profileData.displayName) {
      try {
        currentUser = await registerUser(profileData.email, profileData.password, profileData.displayName);
        // User is now logged in, auth state will update automatically
      } catch (error: any) {
        console.error('Error registering user:', error);
        alert(error.message || 'Failed to create account. Please try again.');
        return;
      }
    }

    // At this point, user should be logged in
    if (!currentUser) {
      alert('Please login to create a store');
      navigate('/login');
      return;
    }

    // Check if user already has a store (one store per merchant limit)
    const userStores = stores.filter(s => s.profile.userId === currentUser.uid);
    if (userStores.length > 0) {
      alert('You already have a store. Each merchant can only create one store.');
      navigate('/dashboard');
      return;
    }

    const storeId = 'shop-' + Math.random().toString(36).substr(2, 5);
    const newStore: MerchantStore = {
      profile: {
        id: storeId,
        name: profileData.name || 'My Local Store',
        tagline: profileData.tagline || 'Quality Products, Quick Delivery',
        brandColor: profileData.brandColor || '#4f46e5',
        subscriptionStatus: 'active',
        planName: 'Local Hero Plan',
        expiryDate: Date.now() + (30 * 24 * 60 * 60 * 1000),
        ownerEmail: currentUser.email || profileData.ownerEmail || profileData.email || '',
        userId: currentUser.uid,
        storeSlug: profileData.storeSlug || storeId,
        phone: profileData.phone
      },
      products: [],
      orders: []
    };
    try {
      await storeService.createStore(newStore);
      setActiveStoreId(newStore.profile.id);
      // Redirect directly to the Merchant Portal (Admin Panel)
      navigate(`/shop/${newStore.profile.storeSlug}/admin`);
    } catch (error) {
      console.error('Error creating store:', error);
      alert('Failed to create store. Please try again.');
    }
  }, [user, navigate, stores]);

  const updateActiveStore = useCallback(async (updater: (store: MerchantStore) => MerchantStore) => {
    if (!activeStoreId) return;

    const currentStore = stores.find(s => s.profile.id === activeStoreId);
    if (!currentStore) return;

    const updatedStore = updater(currentStore);

    try {
      // Check what changed and update accordingly
      const profileChanged = JSON.stringify(updatedStore.profile) !== JSON.stringify(currentStore.profile);
      const productsChanged = JSON.stringify(updatedStore.products) !== JSON.stringify(currentStore.products);
      const ordersChanged = JSON.stringify(updatedStore.orders) !== JSON.stringify(currentStore.orders);

      if (profileChanged && productsChanged && ordersChanged) {
        // Everything changed, use updateStore
        await storeService.updateStore(updatedStore);
      } else {
        // Update individual fields
        if (profileChanged) {
          await storeService.updateStoreProfile(activeStoreId, updatedStore.profile);
        }
        if (productsChanged) {
          await storeService.updateProducts(activeStoreId, updatedStore.products);
        }
        if (ordersChanged) {
          await storeService.updateOrders(activeStoreId, updatedStore.orders);
        }
      }
    } catch (error) {
      console.error('Error updating store:', error);
    }
  }, [activeStoreId, stores]);

  const addToCart = useCallback((product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  }, []);

  const placeOrder = useCallback(async (customerData: Order['customer']) => {
    if (!activeStore || !activeStoreId) return;
    const shipping = 200;
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const newOrder: Order = {
      id: 'SWIFT-' + Math.random().toString(36).substr(2, 5).toUpperCase(),
      items: [...cart],
      customer: customerData,
      total: subtotal + shipping,
      status: 'pending',
      createdAt: Date.now()
    };

    try {
      await storeService.addOrder(activeStoreId, newOrder);
      setLastOrder(newOrder);
      await cartService.clearCart(activeStoreId, sessionId.current);
      setCart([]);
      setView('success');
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    }
  }, [cart, activeStore, activeStoreId]);

  const handleExitStore = async () => {
    if (activeStoreId) {
      await cartService.clearCart(activeStoreId, sessionId.current);
    }
    setActiveStoreId(null);
    setCart([]);
    navigate('/');
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading SwiftCart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar
        profile={activeStore?.profile || null}
        view={view}
        setView={setView}
        cartCount={cart.reduce((a, b) => a + b.quantity, 0)}
        onCartClick={() => setIsCartOpen(true)}
        onExitStore={handleExitStore}
        user={user}
      />

      <main className="flex-grow container mx-auto py-8">
        {view === 'login' && (
          <Login
            onSuccess={() => {
              // Check if there's a return URL in the query params
              const params = new URLSearchParams(location.search);
              const returnUrl = params.get('return');
              if (returnUrl) {
                navigate(returnUrl);
              } else {
                navigate('/dashboard');
              }
            }}
            onCancel={() => navigate('/')}
            onSwitchToRegister={() => navigate('/register')}
          />
        )}

        {view === 'register' && (
          <Register
            onSuccess={() => navigate('/dashboard')}
            onCancel={() => navigate('/')}
            onSwitchToLogin={() => navigate('/login')}
          />
        )}

        {view === 'dashboard' && user && (
          <UserDashboard
            user={user}
            stores={stores}
            onCreateStore={() => navigate('/onboarding')}
            onVisitStore={(id) => {
              const store = stores.find(s => s.profile.id === id);
              if (store) {
                navigate(`/shop/${store.profile.storeSlug}`);
              }
            }}
            onManageStore={(id) => {
              const store = stores.find(s => s.profile.id === id);
              if (store) {
                navigate(`/shop/${store.profile.storeSlug}/admin`);
              }
            }}
            onLogout={() => {
              setUser(null);
              navigate('/');
            }}
          />
        )}

        {view === 'landing' && (
          <LandingPage
            stores={stores}
            onStartOnboarding={() => {
              if (user) {
                // Check if user already has a store
                const userStores = stores.filter(s => s.profile.userId === user.uid);
                if (userStores.length > 0) {
                  alert('You already have a store. Each merchant can only create one store.');
                  navigate('/dashboard');
                } else {
                  navigate('/onboarding');
                }
              } else {
                // New merchant - go directly to onboarding (will register during onboarding)
                navigate('/onboarding');
              }
            }}
            onVisitStore={(id) => {
              const store = stores.find(s => s.profile.id === id);
              if (store) {
                navigate(`/shop/${store.profile.storeSlug}`);
              }
            }}
            onManageStore={(id) => {
              const store = stores.find(s => s.profile.id === id);
              if (store) {
                navigate(`/shop/${store.profile.storeSlug}/admin`);
              }
            }}
          />
        )}

        {view === 'marketplace' && (
          <Marketplace
            stores={stores}
            onVisitStore={(id) => {
              const store = stores.find(s => s.profile.id === id);
              if (store) {
                navigate(`/shop/${store.profile.storeSlug}`);
              }
            }}
          />
        )}

        {view === 'tracking' && (
          <OrderTracking stores={stores} />
        )}

        {view === 'onboarding' && (
          <Onboarding
            onCancel={() => user ? navigate('/dashboard') : navigate('/')}
            onComplete={(data) => {
              // Store temporarily in localStorage for payment step
              localStorage.setItem('pending_onboarding', JSON.stringify(data));
              setView('payment');
            }}
          />
        )}

        {view === 'payment' && (
          <PaymentSimulation
            onSuccess={() => {
              const pending = JSON.parse(localStorage.getItem('pending_onboarding') || '{}');
              createStore(pending);
              localStorage.removeItem('pending_onboarding');
            }}
            onCancel={() => navigate('/onboarding')}
          />
        )}

        {activeStore && (
          <>
            {view === 'store' && (
              <Storefront profile={activeStore.profile} products={activeStore.products} onAddToCart={addToCart} page={page} />
            )}
            {view === 'admin' && user && activeStore.profile.userId === user.uid && (
              <AdminPanel
                profile={activeStore.profile}
                setProfile={(p) => updateActiveStore(s => ({ ...s, profile: p }))}
                products={activeStore.products}
                onAddProduct={(p) => updateActiveStore(s => ({ ...s, products: [p, ...s.products] }))}
                onDeleteProduct={(id) => updateActiveStore(s => ({ ...s, products: s.products.filter(item => item.id !== id) }))}
                orders={activeStore.orders}
                onViewStore={() => activeStore ? navigate(`/shop/${activeStore.profile.storeSlug}`) : navigate('/')}
                onUpdateOrderStatus={(id, status) => {
                  storeService.updateOrderStatus(activeStoreId!, id, status);
                  // Optimistic update
                  updateActiveStore(s => ({
                    ...s,
                    orders: s.orders.map(o => o.id === id ? { ...o, status } : o)
                  }));
                }}
              />
            )}
            {view === 'checkout' && (
              <Checkout
                profile={activeStore.profile}
                cart={cart}
                onPlaceOrder={placeOrder}
                onBack={() => activeStore ? navigate(`/shop/${activeStore.profile.storeSlug}`) : navigate('/')}
              />
            )}
            {view === 'success' && (
              <SuccessView profile={activeStore.profile} order={lastOrder} onContinue={() => navigate(`/shop/${activeStore.profile.storeSlug}`)} />
            )}
          </>
        )}
      </main>

      <CartDrawer
        profile={activeStore?.profile || null}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={(id, delta) => setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item))}
        onRemove={(id) => setCart(prev => prev.filter(item => item.id !== id))}
        onCheckout={() => { setIsCartOpen(false); setView('checkout'); }} // Checkout uses view state for now
      />

      <footer className="bg-white border-t border-gray-200 py-16 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2 space-y-6">
              <div
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => activeStore ? navigate(`/shop/${activeStore.profile.storeSlug}`) : navigate('/')}
              >
                <div className="p-2 bg-indigo-600 rounded-lg text-white">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <span className="text-2xl font-black text-gray-900">
                  {activeStore ? activeStore.profile.name : 'SwiftCart'}
                </span>
              </div>
              <p className="text-gray-500 max-w-sm font-medium">Empowering the next generation of Pakistani merchants with robust Cash on Delivery e-commerce solutions.</p>
            </div>
            <div>
              <h4 className="font-black text-gray-900 mb-6 uppercase text-xs tracking-widest">Platform</h4>
              <ul className="space-y-4 text-sm text-gray-500 font-bold">
                <li onClick={() => setView('marketplace')} className="cursor-pointer hover:text-indigo-600">Marketplace</li>
                <li onClick={() => setView('tracking')} className="cursor-pointer hover:text-indigo-600">Order Tracking</li>
                <li onClick={() => setView(user ? 'dashboard' : 'login')} className="cursor-pointer hover:text-indigo-600">Start Selling</li>
              </ul>
            </div>
            <div>
              <h4 className="font-black text-gray-900 mb-6 uppercase text-xs tracking-widest">Support</h4>
              <ul className="space-y-4 text-sm text-gray-500 font-bold">
                <li className="cursor-pointer hover:text-indigo-600">Merchant Help</li>
                <li className="cursor-pointer hover:text-indigo-600">Seller Policies</li>
                <li className="cursor-pointer hover:text-indigo-600">Developer API</li>
              </ul>
            </div>
          </div>
          <div className="pt-12 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-gray-400 text-sm font-medium">&copy; 2024 SwiftCart SaaS. Built for scale.</p>
            <div className="flex gap-8 text-xs font-black text-gray-400 uppercase tracking-widest">
              <span className="cursor-pointer hover:text-indigo-600">Terms</span>
              <span className="cursor-pointer hover:text-indigo-600">Privacy</span>
              <span className="cursor-pointer hover:text-indigo-600">Refunds</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;