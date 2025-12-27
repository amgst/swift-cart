import React, { useState, useEffect, useCallback } from 'react';
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
// Fix: Added missing ShoppingBag icon import from lucide-react
import { ShoppingBag } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewType>('landing');
  
  const [stores, setStores] = useState<MerchantStore[]>(() => {
    const saved = localStorage.getItem('swiftcart_all_stores');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [activeStoreId, setActiveStoreId] = useState<string | null>(() => {
    return localStorage.getItem('swiftcart_active_store_id');
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('swiftcart_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('swiftcart_all_stores', JSON.stringify(stores));
  }, [stores]);

  useEffect(() => {
    if (activeStoreId) {
      localStorage.setItem('swiftcart_active_store_id', activeStoreId);
    } else {
      localStorage.removeItem('swiftcart_active_store_id');
    }
  }, [activeStoreId]);

  useEffect(() => {
    localStorage.setItem('swiftcart_cart', JSON.stringify(cart));
  }, [cart]);

  const activeStore = stores.find(s => s.profile.id === activeStoreId) || null;

  const createStore = useCallback((profileData: Partial<StoreProfile>) => {
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
        ownerEmail: profileData.ownerEmail || ''
      },
      products: [],
      orders: []
    };
    setStores(prev => [...prev, newStore]);
    setActiveStoreId(newStore.profile.id);
    setView('admin');
  }, []);

  const updateActiveStore = useCallback((updater: (store: MerchantStore) => MerchantStore) => {
    setStores(prev => prev.map(s => s.profile.id === activeStoreId ? updater(s) : s));
  }, [activeStoreId]);

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

  const placeOrder = useCallback((customerData: Order['customer']) => {
    if (!activeStore) return;
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
    
    updateActiveStore(s => ({ ...s, orders: [newOrder, ...s.orders] }));
    setLastOrder(newOrder);
    setCart([]);
    setView('success');
  }, [cart, activeStore, updateActiveStore]);

  const handleExitStore = () => {
    setActiveStoreId(null);
    setCart([]);
    setView('landing');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar 
        profile={activeStore?.profile || null}
        view={view} 
        setView={setView} 
        cartCount={cart.reduce((a, b) => a + b.quantity, 0)}
        onCartClick={() => setIsCartOpen(true)}
        onExitStore={handleExitStore}
      />

      <main className="flex-grow container mx-auto py-8">
        {view === 'landing' && (
          <LandingPage 
            stores={stores}
            onStartOnboarding={() => setView('onboarding')} 
            onVisitStore={(id) => { setActiveStoreId(id); setView('store'); }}
            onManageStore={(id) => { setActiveStoreId(id); setView('admin'); }}
          />
        )}

        {view === 'marketplace' && (
          <Marketplace 
            stores={stores} 
            onVisitStore={(id) => { setActiveStoreId(id); setView('store'); }} 
          />
        )}

        {view === 'tracking' && (
          <OrderTracking stores={stores} />
        )}
        
        {view === 'onboarding' && (
          <Onboarding 
            onCancel={() => setView('landing')}
            onComplete={(data) => {
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
            onCancel={() => setView('onboarding')}
          />
        )}

        {activeStore && (
          <>
            {view === 'store' && (
              <Storefront profile={activeStore.profile} products={activeStore.products} onAddToCart={addToCart} />
            )}
            {view === 'admin' && (
              <AdminPanel 
                profile={activeStore.profile}
                setProfile={(p) => updateActiveStore(s => ({ ...s, profile: p }))}
                products={activeStore.products} 
                onAddProduct={(p) => updateActiveStore(s => ({ ...s, products: [p, ...s.products] }))} 
                onDeleteProduct={(id) => updateActiveStore(s => ({ ...s, products: s.products.filter(item => item.id !== id) }))} 
                orders={activeStore.orders}
                onViewStore={() => setView('store')}
              />
            )}
            {view === 'checkout' && (
              <Checkout 
                profile={activeStore.profile}
                cart={cart} 
                onPlaceOrder={placeOrder} 
                onBack={() => setView('store')} 
              />
            )}
            {view === 'success' && (
              <SuccessView profile={activeStore.profile} order={lastOrder} onContinue={() => setView('store')} />
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
        onCheckout={() => { setIsCartOpen(false); setView('checkout'); }}
      />

      <footer className="bg-white border-t border-gray-200 py-16 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2 space-y-6">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-600 rounded-lg text-white">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <span className="text-2xl font-black text-gray-900">SwiftCart</span>
               </div>
               <p className="text-gray-500 max-w-sm font-medium">Empowering the next generation of Pakistani merchants with robust Cash on Delivery e-commerce solutions.</p>
            </div>
            <div>
               <h4 className="font-black text-gray-900 mb-6 uppercase text-xs tracking-widest">Platform</h4>
               <ul className="space-y-4 text-sm text-gray-500 font-bold">
                 <li onClick={() => setView('marketplace')} className="cursor-pointer hover:text-indigo-600">Marketplace</li>
                 <li onClick={() => setView('tracking')} className="cursor-pointer hover:text-indigo-600">Order Tracking</li>
                 <li onClick={() => setView('onboarding')} className="cursor-pointer hover:text-indigo-600">Start Selling</li>
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