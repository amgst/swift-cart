
import React, { useState } from 'react';
import { CartItem, Order, StoreProfile } from '../types';
import { ArrowLeft, Truck, ShieldCheck, CreditCard, ChevronRight } from 'lucide-react';

interface CheckoutProps {
  profile: StoreProfile;
  cart: CartItem[];
  onPlaceOrder: (customer: Order['customer']) => void;
  onBack: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ profile, cart, onPlaceOrder, onBack }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = 200; 
  const total = subtotal + shipping;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPlaceOrder(formData);
  };

  return (
    <div className="max-w-6xl mx-auto py-8">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-gray-400 hover:text-gray-900 font-bold mb-10 group transition-colors"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        RETURN TO {profile.name.toUpperCase()}
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-7">
          <div className="flex items-center justify-between mb-8">
             <h2 className="text-4xl font-black text-gray-900 tracking-tight">Checkout</h2>
             <div className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest">
                Order Secure
             </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl space-y-8">
              <h3 className="text-xl font-bold text-gray-900 border-b border-gray-50 pb-4">Shipping Information</h3>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Recipient Full Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-6 py-4 focus:border-indigo-500 outline-none transition-all font-bold"
                  placeholder="Ali Ahmed"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Contact Email</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-6 py-4 focus:border-indigo-500 outline-none transition-all font-bold"
                    placeholder="ali@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Phone Number</label>
                  <input 
                    type="tel" 
                    required
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-6 py-4 focus:border-indigo-500 outline-none transition-all font-bold"
                    placeholder="03XX XXXXXXX"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Home / Office Address</label>
                <textarea 
                  required
                  rows={4}
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-6 py-4 focus:border-indigo-500 outline-none transition-all font-medium leading-relaxed"
                  placeholder="Street No, House No, Area, City"
                />
              </div>
            </div>

            <div className="bg-gray-900 p-8 rounded-[3rem] border border-gray-800 shadow-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-white/10 p-4 rounded-2xl text-white">
                    <Truck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xl">Cash on Delivery</h4>
                    <p className="text-gray-400 text-sm mt-1">Pay when the courier arrives at your door.</p>
                  </div>
                </div>
                <div className="hidden sm:block">
                   <div className="bg-white/10 px-4 py-2 rounded-xl text-white text-[10px] font-black uppercase tracking-widest">Default</div>
                </div>
              </div>
            </div>

            <button 
              type="submit"
              style={{ backgroundColor: profile.brandColor }}
              className="w-full text-white py-6 rounded-[2.5rem] font-black text-xl shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-4 group"
            >
              PLACE ORDER &bull; PKR {total.toLocaleString()}
              <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>

        <div className="lg:col-span-5">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Review Order</h2>
          <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl sticky top-24">
            <div className="space-y-6 mb-8 max-h-80 overflow-y-auto pr-4 no-scrollbar">
              {cart.map(item => (
                <div key={item.id} className="flex gap-4">
                   <img src={item.image} className="w-16 h-16 rounded-xl object-cover" />
                   <div className="flex-1">
                      <h5 className="font-black text-gray-900 text-sm leading-tight line-clamp-2">{item.name}</h5>
                      <div className="flex justify-between mt-2">
                         <span className="text-xs font-bold text-gray-400">Qty: {item.quantity}</span>
                         <span className="text-sm font-black text-gray-900">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                   </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-8 border-t border-gray-100">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-gray-400">Order Subtotal</span>
                <span className="text-gray-900">Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span className="text-gray-400">Flat Shipping</span>
                <span className="text-gray-900">Rs. {shipping.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-end pt-8 border-t border-gray-100">
                <div>
                   <span className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Total to Pay</span>
                   <span style={{ color: profile.brandColor }} className="text-4xl font-black">Rs. {total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-[10px] font-black text-gray-400 bg-gray-50 p-4 rounded-2xl uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4 text-green-500" /> Secure SSL
              </div>
              <div className="flex items-center gap-3 text-[10px] font-black text-gray-400 bg-gray-50 p-4 rounded-2xl uppercase tracking-widest">
                <CreditCard className="w-4 h-4 text-indigo-500" /> COD Ready
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
