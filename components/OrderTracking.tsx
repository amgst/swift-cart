
import React, { useState } from 'react';
import { MerchantStore } from '../types';
import { Search, Package, MapPin, Clock, Truck, ShieldCheck, AlertCircle } from 'lucide-react';

interface OrderTrackingProps {
  stores: MerchantStore[];
}

const OrderTracking: React.FC<OrderTrackingProps> = ({ stores }) => {
  const [orderId, setOrderId] = useState('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState(false);

  const handleTrack = () => {
    setError(false);
    let foundOrder = null;
    let foundStore = null;

    for (const store of stores) {
      const order = store.orders.find(o => o.id.toLowerCase() === orderId.toLowerCase());
      if (order) {
        foundOrder = order;
        foundStore = store;
        break;
      }
    }

    if (foundOrder) {
      setResult({ order: foundOrder, store: foundStore });
    } else {
      setResult(null);
      setError(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-20 px-4">
      <div className="text-center space-y-6 mb-16">
        <div className="inline-flex p-4 bg-indigo-50 rounded-3xl mb-4">
          <Package className="w-12 h-12 text-indigo-600" />
        </div>
        <h1 className="text-5xl font-black text-gray-900 tracking-tight">Track Your Order</h1>
        <p className="text-xl text-gray-500 max-w-xl mx-auto font-medium">
          Enter your unique Order ID received via SMS or Email to check the status of your Cash on Delivery parcel.
        </p>
      </div>

      <div className="bg-white p-10 md:p-14 rounded-[4rem] shadow-2xl border border-gray-100 mb-12">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-300" />
            <input 
              type="text" 
              placeholder="e.g. SWIFT-88219"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="w-full pl-16 pr-6 py-6 bg-gray-50 border-2 border-gray-100 rounded-[2rem] outline-none focus:border-indigo-600 font-black text-xl transition-all"
            />
          </div>
          <button 
            onClick={handleTrack}
            className="px-10 py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-lg hover:bg-indigo-700 transition-all shadow-xl active:scale-95"
          >
            TRACK NOW
          </button>
        </div>

        {error && (
          <div className="mt-8 p-6 bg-red-50 rounded-[2rem] border border-red-100 flex items-center gap-4 animate-in zoom-in duration-300">
             <AlertCircle className="w-8 h-8 text-red-500" />
             <div>
                <h4 className="font-black text-red-900">Order Not Found</h4>
                <p className="text-sm text-red-700 font-medium">We couldn't find an order with that ID. Please check your spelling and try again.</p>
             </div>
          </div>
        )}

        {result && (
          <div className="mt-16 space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-gray-100 pb-10">
              <div>
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Store</p>
                 <h3 className="text-2xl font-black text-gray-900">{result.store.profile.name}</h3>
              </div>
              <div>
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</p>
                 <span className="px-6 py-2 bg-green-100 text-green-700 rounded-full font-black text-xs uppercase tracking-widest">
                   {result.order.status}
                 </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { label: 'Confirmed', desc: 'Order is valid', icon: <ShieldCheck className="w-6 h-6" />, active: true },
                { label: 'Processing', desc: 'Packing in progress', icon: <Clock className="w-6 h-6" />, active: true },
                { label: 'Shipped', desc: 'On its way', icon: <Truck className="w-6 h-6" />, active: result.order.status !== 'pending' }
              ].map((step, i) => (
                <div key={i} className={`p-8 rounded-[2.5rem] border ${step.active ? 'bg-indigo-50 border-indigo-100' : 'bg-gray-50 border-gray-100 opacity-50'}`}>
                  <div className={`${step.active ? 'text-indigo-600' : 'text-gray-300'} mb-4`}>
                    {step.icon}
                  </div>
                  <h4 className={`font-black ${step.active ? 'text-gray-900' : 'text-gray-300'}`}>{step.label}</h4>
                  <p className="text-xs font-medium text-gray-400 mt-1">{step.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 p-8 rounded-[3rem] border border-gray-100 flex flex-col md:flex-row gap-8 items-center">
               <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
                  <MapPin className="w-8 h-8" />
               </div>
               <div>
                  <h4 className="font-black text-gray-900">Shipping Address</h4>
                  <p className="text-gray-500 font-medium text-sm leading-relaxed mt-1">{result.order.customer.address}</p>
               </div>
            </div>
          </div>
        )}
      </div>

      <div className="text-center">
         <p className="text-gray-400 text-sm font-medium">Need help with your order? <span className="text-indigo-600 font-bold cursor-pointer hover:underline">Contact Store Support</span></p>
      </div>
    </div>
  );
};

export default OrderTracking;
