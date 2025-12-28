import React, { useState } from 'react';
import { StoreProfile } from '../types';
import { Store, Mail, Palette, Lock, User, ArrowRight, X } from 'lucide-react';
import { generateSlug, isValidSlug } from '../utils/slug';

interface OnboardingProps {
  onComplete: (data: Partial<StoreProfile> & { email: string; password: string; displayName: string }) => void;
  onCancel: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    brandColor: '#4f46e5',
    storeSlug: ''
  });
  const [error, setError] = useState('');

  const next = () => {
    setError('');

    // Validate step 1
    if (step === 1) {
      if (!formData.name || !formData.tagline || !formData.storeSlug || !isValidSlug(formData.storeSlug)) {
        return;
      }
    }

    // Validate step 2
    if (step === 2) {
      if (!formData.email || !formData.password || !formData.confirmPassword || !formData.displayName) {
        setError('Please fill in all fields');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
    }

    setStep(s => s + 1);
  };

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
          <p className="text-gray-500 font-medium">Step {step} of 3 &bull; Store Setup</p>
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
                onChange={e => {
                  const name = e.target.value;
                  setFormData({
                    ...formData,
                    name,
                    storeSlug: generateSlug(name) || formData.storeSlug
                  });
                }}
                placeholder="e.g. Lahore Street Style"
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-8 py-5 outline-none focus:border-indigo-600 transition-colors text-lg font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Store URL Slug</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">swiftcart.pk/shop/</span>
                <input
                  type="text" required value={formData.storeSlug}
                  onChange={e => setFormData({ ...formData, storeSlug: generateSlug(e.target.value) })}
                  placeholder="my-store"
                  className="w-full pl-40 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-indigo-600 transition-colors text-lg font-bold"
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">Your store will be available at: swiftcart.pk/shop/{formData.storeSlug || 'my-store'}</p>
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Store Slogan</label>
              <input
                type="text" required value={formData.tagline}
                onChange={e => setFormData({ ...formData, tagline: e.target.value })}
                placeholder="e.g. Fast COD across Pakistan"
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-8 py-5 outline-none focus:border-indigo-600 transition-colors font-medium"
              />
            </div>
            <button
              onClick={next}
              disabled={!formData.name || !formData.tagline || !formData.storeSlug || !isValidSlug(formData.storeSlug)}
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
                <User className="w-8 h-8" />
              </div>
              <span className="text-xl font-black uppercase tracking-widest">Create Account</span>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Your Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  required
                  value={formData.displayName}
                  onChange={e => setFormData({ ...formData, displayName: e.target.value })}
                  placeholder="John Doe"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-indigo-600 transition-colors text-lg font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@company.pk"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-indigo-600 transition-colors text-lg font-bold"
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">This will be used for login and billing receipts.</p>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-indigo-600 transition-colors text-lg font-bold"
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">Minimum 6 characters</p>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-indigo-600 transition-colors text-lg font-bold"
                />
              </div>
            </div>

            <button
              onClick={next}
              disabled={!formData.email || !formData.password || !formData.confirmPassword || !formData.displayName}
              className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-lg flex items-center justify-center gap-3 disabled:opacity-30 shadow-xl shadow-indigo-100 active:scale-95 transition-all"
            >
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
                  onChange={e => setFormData({ ...formData, brandColor: e.target.value })}
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
              onClick={() => {
                const { confirmPassword, ...dataToComplete } = formData;
                onComplete({
                  name: dataToComplete.name,
                  tagline: dataToComplete.tagline,
                  storeSlug: dataToComplete.storeSlug,
                  brandColor: dataToComplete.brandColor,
                  ownerEmail: dataToComplete.email,
                  email: dataToComplete.email,
                  password: dataToComplete.password,
                  displayName: dataToComplete.displayName
                });
              }}
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
