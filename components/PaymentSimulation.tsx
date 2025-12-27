
import React, { useState } from 'react';
import { Smartphone, ShieldCheck, Loader2, CheckCircle2 } from 'lucide-react';

interface PaymentSimulationProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const PaymentSimulation: React.FC<PaymentSimulationProps> = ({ onSuccess, onCancel }) => {
  const [phone, setPhone] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handlePay = () => {
    if (phone.length < 10) return;
    setIsProcessing(true);
    // Simulate API delay
    setTimeout(() => {
      setIsProcessing(false);
      setIsDone(true);
      setTimeout(() => onSuccess(), 1500);
    }, 2500);
  };

  return (
    <div className="max-w-md mx-auto py-12 text-center">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-teal-50">
        <div className="flex justify-center mb-6">
          <div className="bg-teal-500 text-white px-4 py-2 rounded-xl font-black text-xl italic">
            easyPaisa
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Subscription Payment</h2>
        <p className="text-gray-500 mb-8">Amount to pay: <span className="text-gray-900 font-bold">Rs. 500</span></p>

        {!isDone ? (
          <div className="space-y-6">
            <div className="text-left">
              <label className="block text-sm font-bold text-gray-700 mb-1.5">EasyPaisa Mobile Number</label>
              <div className="relative">
                <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="tel" required value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="03XX XXXXXXX"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-teal-500 transition-colors"
                />
              </div>
            </div>

            <button 
              onClick={handlePay}
              disabled={isProcessing || phone.length < 10}
              className="w-full py-5 bg-teal-500 text-white rounded-2xl font-bold text-lg hover:bg-teal-600 transition-colors flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Pay Rs. 500
                </>
              )}
            </button>
            
            <button onClick={onCancel} className="text-sm text-gray-400 font-medium hover:text-gray-600">
              Cancel and go back
            </button>
          </div>
        ) : (
          <div className="py-8 animate-in zoom-in duration-300">
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Payment Successful!</h3>
            <p className="text-gray-500 mt-2">Activating your store now...</p>
          </div>
        )}

        <div className="mt-8 pt-8 border-t border-gray-100 flex items-center justify-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
          <ShieldCheck className="w-4 h-4" />
          Secure Local Payment Gateway
        </div>
      </div>
    </div>
  );
};

export default PaymentSimulation;
