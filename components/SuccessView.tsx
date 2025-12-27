
import React from 'react';
import { Order, StoreProfile } from '../types';
import { CheckCircle, Truck, Calendar, ShoppingBag } from 'lucide-react';

interface SuccessViewProps {
  profile: StoreProfile;
  order: Order | null;
  onContinue: () => void;
}

const SuccessView: React.FC<SuccessViewProps> = ({ profile, order, onContinue }) => {
  if (!order) return null;

  return (
    <div className="max-w-2xl mx-auto py-12 text-center px-4">
      <div className="inline-block p-6 bg-green-100 rounded-full mb-8">
        <CheckCircle className="w-16 h-16 text-green-600" />
      </div>
      
      <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Shukriya! Order Placed.</h1>
      <p className="text-gray-600 text-lg mb-12">
        We've received your order at <span className="font-bold text-gray-900">{profile.name}</span>. 
        Keep your phone nearby for a confirmation call!
      </p>

      <div className="bg-white p-8 sm:p-12 rounded-[3rem] border border-gray-100 shadow-xl text-left space-y-8 mb-12">
        <div className="flex items-start gap-5">
          <div style={{ backgroundColor: profile.brandColor }} className="p-3 rounded-2xl text-white shadow-lg">
             <Truck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-black text-lg text-gray-900">Delivery Information</h4>
            <p className="text-gray-500 font-medium mt-1 leading-relaxed">{order.customer.address}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-5">
           <div style={{ backgroundColor: profile.brandColor }} className="p-3 rounded-2xl text-white shadow-lg">
              <Calendar className="w-6 h-6" />
           </div>
          <div>
            <h4 className="font-black text-lg text-gray-900">Estimated Arrival</h4>
            <p className="text-gray-500 font-medium mt-1">3 - 5 business days</p>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100">
          <div className="flex items-center justify-between mb-6">
             <h4 className="font-black text-xl text-gray-900">Order Summary</h4>
             <span className="text-xs font-bold text-gray-400">ID: #{order.id.substr(-6)}</span>
          </div>
          <div className="space-y-4">
            {order.items.map(item => (
              <div key={item.id} className="flex justify-between items-center text-sm">
                <span className="text-gray-600 font-medium">{item.name} <span className="text-gray-400 px-2 font-bold">×{item.quantity}</span></span>
                <span className="font-black text-gray-900">Rs. {(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
            <div className="flex justify-between pt-6 border-t border-gray-100">
               <div>
                  <span className="block text-xl font-black text-gray-900">Pay at Doorstep</span>
                  <span className="text-xs text-green-600 font-bold uppercase tracking-widest">Cash on Delivery</span>
               </div>
              <span style={{ color: profile.brandColor }} className="text-3xl font-black">Rs. {order.total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <button 
        onClick={onContinue}
        style={{ backgroundColor: profile.brandColor }}
        className="text-white px-12 py-5 rounded-[2rem] font-black text-lg flex items-center justify-center gap-3 hover:opacity-90 transition-all mx-auto shadow-2xl active:scale-95"
      >
        <ShoppingBag className="w-6 h-6" />
        Continue Shopping
      </button>
    </div>
  );
};

export default SuccessView;
