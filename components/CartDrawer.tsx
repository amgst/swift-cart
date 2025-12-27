
import React from 'react';
import { CartItem, StoreProfile } from '../types';
import { X, Minus, Plus, ShoppingCart, ArrowRight } from 'lucide-react';

interface CartDrawerProps {
  profile: StoreProfile | null;
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ profile, isOpen, onClose, items, onUpdateQuantity, onRemove, onCheckout }) => {
  const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-md transition-opacity" 
        onClick={onClose}
      />
      
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          <div className="p-8 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div style={{ backgroundColor: profile?.brandColor || '#4f46e5' }} className="p-2 rounded-xl shadow-lg">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Cart</h2>
            </div>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900 transition-colors bg-gray-50 rounded-xl">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="bg-gray-50 p-10 rounded-full mb-6">
                  <ShoppingCart className="w-16 h-16 text-gray-200" />
                </div>
                <h3 className="text-2xl font-black text-gray-900">Your bag is empty</h3>
                <p className="text-gray-500 max-w-xs mt-2 font-medium">Add some items from {profile?.name || 'the shop'} to get started.</p>
                <button 
                  onClick={onClose}
                  style={{ color: profile?.brandColor || '#4f46e5' }}
                  className="mt-8 font-black text-sm uppercase tracking-widest hover:underline"
                >
                  Return to Store
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                {items.map(item => (
                  <div key={item.id} className="flex gap-6 group">
                    <div className="w-24 h-24 rounded-[1.5rem] overflow-hidden bg-gray-100 flex-shrink-0 shadow-sm border border-gray-50">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-black text-gray-900 leading-tight pr-2">{item.name}</h4>
                        <button 
                          onClick={() => onRemove(item.id)}
                          className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      <p style={{ color: profile?.brandColor || '#4f46e5' }} className="text-sm font-black mt-1">Rs. {item.price.toLocaleString()}</p>
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100">
                          <button 
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="p-1.5 hover:bg-white rounded-lg text-gray-500 transition-colors shadow-sm"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-10 text-center text-sm font-black text-gray-900">{item.quantity}</span>
                          <button 
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="p-1.5 hover:bg-white rounded-lg text-gray-500 transition-colors shadow-sm"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <span className="text-xs font-bold text-gray-400">
                          Subtotal: Rs. {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="p-8 border-t border-gray-100 bg-gray-50/50 backdrop-blur-xl">
              <div className="flex justify-between items-center mb-8">
                <span className="text-gray-400 font-black text-xs uppercase tracking-widest">Grand Total</span>
                <span className="text-3xl font-black text-gray-900">Rs. {total.toLocaleString()}</span>
              </div>
              <button 
                onClick={onCheckout}
                style={{ backgroundColor: profile?.brandColor || '#4f46e5' }}
                className="w-full text-white py-6 rounded-[2rem] font-black text-lg flex items-center justify-center gap-3 shadow-2xl active:scale-95 transition-all"
              >
                Go to Checkout
                <ArrowRight className="w-6 h-6" />
              </button>
              <div className="flex items-center justify-center gap-2 mt-6 text-[10px] font-black text-green-600 uppercase tracking-widest">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                No extra taxes applied
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
