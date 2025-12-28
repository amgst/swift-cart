
import React, { useEffect, useState } from 'react';
import { Order, StoreProfile } from '../types';
import { CheckCircle, Truck, Calendar, ShoppingBag, MessageCircle, ExternalLink } from 'lucide-react';

interface SuccessViewProps {
  profile: StoreProfile;
  order: Order | null;
  onContinue: () => void;
}

const SuccessView: React.FC<SuccessViewProps> = ({ profile, order, onContinue }) => {
  const [countdown, setCountdown] = useState(5);

  if (!order) return null;

  // Construct WhatsApp Message
  const waNumber = profile.phone?.replace(/\+/g, '').replace(/\s/g, ''); // Clean number
  const message = encodeURIComponent(
    `*New Order via SwiftCart* 🛒\n\n` +
    `*Customer:* ${order.customer.name}\n` +
    `*Address:* ${order.customer.address}\n\n` +
    `*Items:*\n` +
    order.items.map(i => `- ${i.name} (x${i.quantity})`).join('\n') +
    `\n\n*Total Due:* Rs. ${order.total.toLocaleString()}\n` +
    `*Order ID:* #${order.id.substr(-4)}`
  );

  const waLink = waNumber ? `https://wa.me/${waNumber}?text=${message}` : null;

  useEffect(() => {
    if (!waLink) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = waLink;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [waLink]);

  return (
    <div className="max-w-2xl mx-auto py-12 text-center px-4">
      <div className="inline-block p-6 bg-green-100 rounded-full mb-8">
        <CheckCircle className="w-16 h-16 text-green-600" />
      </div>

      <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Shukriya! Order Placed.</h1>

      {waLink && (
        <div className="mb-10 bg-green-50 p-6 rounded-[2rem] border border-green-100 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <p className="text-green-800 font-bold mb-4">Redirecting to WhatsApp for confirmation in {countdown}s...</p>
          <a
            href={waLink}
            className="w-full bg-[#25D366] text-white py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-lg hover:brightness-105 transition-all"
          >
            <MessageCircle className="w-6 h-6" />
            Send Order on WhatsApp Now
            <ExternalLink className="w-4 h-4 opacity-70" />
          </a>
          <p className="text-[10px] text-green-600 mt-2 font-medium">Click above if not redirected automatically</p>
        </div>
      )}

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
