
import React, { useState } from 'react';
import { StoreProfile } from '../types';
import { Store, Mail, Palette, Type, ArrowRight, X } from 'lucide-react';

interface OnboardingProps {
  onComplete: (data: Partial<StoreProfile>) => void;
  onCancel: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    ownerEmail: '',
    brandColor: '#4f46e5'
  });

  const next = () => setStep(s => s + 1);

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="mb-12 flex items-center justify-between">
        <div className="flex-1">
          <div className="flex gap-2 mb-4">
            {[1, 2, 3].map(i => (
              <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i <= step ? 'bg-indigo-600' : 'bg-gray-200'}`} />
            ))}
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Setup Your Empire</h1>
          <p className="text-gray-500 font-medium">Step {step} of 3 &bull; Business Registration</p>
        </div>
        <button onClick={onCancel} className="p-3 hover:bg-gray-100 rounded-2xl transition-colors">
          <X className="w-6 h-6 text-gray-400" />
        </button>
      </div>

      <div className="bg-white p-10 sm:p-14 rounded-[3rem] shadow-2xl border border-gray-100 animate-in fade-in slide-in-from-bottom-8 duration-500">
        {step === 1 && (
          <div className="space-y-8">
            <div className="flex items-center gap-4 text-indigo-600 mb-8">
              <div className="bg-indigo-50 p-3 rounded-2xl">
                 <Store className="w-8 h-8" />
              </div>
              <span className="text-xl font-black uppercase tracking-widest">The Identity</span>
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Public Store Name</label>
              <input 
                type="text" required value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="e.g. Lahore Street Style"
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-8 py-5 outline-none focus:border-indigo-600 transition-colors text-lg font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Store Slogan</label>
              <input 
                type="text" required value={formData.tagline}
                onChange={e => setFormData({...formData, tagline: e.target.value})}
                placeholder="e.g. Fast COD across Pakistan"
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-8 py-5 outline-none focus:border-indigo-600 transition-colors font-medium"
              />
            </div>
            <button 
              onClick={next} 
              disabled={!formData.name || !formData.tagline} 
              className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-lg flex items-center justify-center gap-3 disabled:opacity-30 shadow-xl shadow-indigo-100 active:scale-95 transition-all"
            >
              CONTINUE <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8">
            <div className="flex items-center gap-4 text-indigo-600 mb-8">
              <div className="bg-indigo-50 p-3 rounded-2xl">
                 <Mail className="w-8 h-8" />
              </div>
              <span className="text-xl font-black uppercase tracking-widest">Admin Contact</span>
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Owner Business Email</label>
              <input 
                type="email" required value={formData.ownerEmail}
                onChange={e => setFormData({...formData, ownerEmail: e.target.value})}
                placeholder="you@company.pk"
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-8 py-5 outline-none focus:border-indigo-600 transition-colors text-lg font-bold"
              />
              <p className="text-xs text-gray-400 mt-4 leading-relaxed">This email will be used for your private dashboard login and billing receipts.</p>
            </div>
            <button onClick={next} disabled={!formData.ownerEmail} className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-lg flex items-center justify-center gap-3 active:scale-95 transition-all">
              NEXT STEP <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8">
            <div className="flex items-center gap-4 text-indigo-600 mb-8">
              <div className="bg-indigo-50 p-3 rounded-2xl">
                 <Palette className="w-8 h-8" />
              </div>
              <span className="text-xl font-black uppercase tracking-widest">Brand Style</span>
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-6">Choose your Primary Brand Color</label>
              <div className="flex flex-col sm:flex-row items-center gap-10 bg-gray-50 p-8 rounded-[2rem] border-2 border-gray-100">
                <input 
                  type="color" value={formData.brandColor}
                  onChange={e => setFormData({...formData, brandColor: e.target.value})}
                  className="w-32 h-32 rounded-[2rem] cursor-pointer p-1 bg-white shadow-xl ring-4 ring-white"
                />
                <div className="flex-1 text-center sm:text-left">
                   <h5 className="text-2xl font-black text-gray-900 uppercase tracking-tighter mb-2">{formData.brandColor}</h5>
                   <p className="text-sm text-gray-400 leading-relaxed">This color will be used for your cart icons, purchase buttons, and checkout highlights.</p>
                </div>
              </div>
            </div>
            <div className="bg-indigo-50 p-6 rounded-2xl text-xs font-bold text-indigo-700 leading-relaxed">
               Note: You can change all these settings later from your Merchant Dashboard.
            </div>
            <button 
              onClick={() => onComplete(formData)}
              className="w-full py-6 bg-gray-900 text-white rounded-[2rem] font-black text-lg flex items-center justify-center gap-3 active:scale-95 transition-all shadow-2xl"
            >
              GO TO PAYMENT <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>
      
      <p className="text-center mt-12 text-gray-400 text-xs font-bold uppercase tracking-widest">
        Protected by SwiftCart SaaS Cloud
      </p>
    </div>
  );
};

export default Onboarding;
