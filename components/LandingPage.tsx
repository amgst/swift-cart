
import React from 'react';
import { 
  ArrowRight, Zap, ShieldCheck, Smartphone, Sparkles, 
  Truck, Store, ExternalLink, Settings, Plus, 
  Globe, MousePointer2, BarChart3, MessageSquare, 
  Layers, Rocket
} from 'lucide-react';
import { MerchantStore } from '../types';

interface LandingPageProps {
  stores: MerchantStore[];
  onStartOnboarding: () => void;
  onVisitStore: (id: string) => void;
  onManageStore: (id: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ stores, onStartOnboarding, onVisitStore, onManageStore }) => {
  return (
    <div className="space-y-32 pb-32 overflow-hidden">
      {/* --- HERO SECTION --- */}
      <section className="relative pt-20 lg:pt-32">
        {/* Animated Background Blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] -z-10 opacity-30 blur-[120px] pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500 rounded-full animate-pulse" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-500 rounded-full animate-bounce duration-[10s]" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-fuchsia-400 rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-indigo-100 text-indigo-700 text-sm font-bold mb-10 shadow-sm animate-in fade-in slide-in-from-bottom-4">
            <Sparkles className="w-4 h-4" />
            <span>Trusted by 1,200+ local sellers in Pakistan</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black text-gray-900 tracking-tight mb-8 leading-[0.9] animate-in fade-in slide-in-from-bottom-6 duration-700">
            Build your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">dream store</span> <br />
            in 5 minutes.
          </h1>
          
          <p className="max-w-3xl mx-auto text-xl text-gray-500 mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000">
            The all-in-one SaaS commerce platform designed specifically for the Pakistani market. 
            Automated COD, AI-powered descriptions, and zero transaction fees.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button 
              onClick={onStartOnboarding}
              className="w-full sm:w-auto px-12 py-6 bg-indigo-600 text-white rounded-2xl font-black text-xl shadow-[0_20px_50px_rgba(79,70,229,0.3)] hover:bg-indigo-700 transition-all hover:-translate-y-1 flex items-center justify-center gap-3 group"
            >
              Start Your Free Trial
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
            <a href="#marketplace" className="w-full sm:w-auto px-12 py-6 bg-white text-gray-700 border border-gray-200 rounded-2xl font-bold text-xl hover:bg-gray-50 transition-all shadow-sm">
              Explore Marketplace
            </a>
          </div>

          {/* Floating Product Previews */}
          <div className="mt-24 relative max-w-5xl mx-auto">
            <div className="bg-white rounded-[3rem] shadow-2xl border border-gray-100 p-4 relative overflow-hidden group">
               <img 
                 src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop" 
                 alt="Dashboard Preview" 
                 className="w-full rounded-[2rem] shadow-lg grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
               />
               {/* Floating Elements */}
               <div className="absolute top-1/4 -left-12 bg-white p-6 rounded-3xl shadow-2xl border border-gray-100 hidden lg:block animate-bounce duration-[6s]">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600">
                      <BarChart3 className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Daily Sales</p>
                      <p className="text-xl font-black text-gray-900">Rs. 45,200</p>
                    </div>
                  </div>
               </div>
               <div className="absolute bottom-1/4 -right-12 bg-gray-900 p-6 rounded-3xl shadow-2xl hidden lg:block animate-bounce duration-[8s] delay-1000">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white">
                      <Truck className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">New Order</p>
                      <p className="text-xl font-black text-white">COD Confirmed</p>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- LOGO WALL --- */}
      <section className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-12">Empowering Local Brands Across Pakistan</p>
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-40 grayscale transition-all hover:grayscale-0 hover:opacity-100">
           <div className="text-2xl font-black text-gray-800 tracking-tighter italic">GulAhmed</div>
           <div className="text-2xl font-black text-gray-800 tracking-tighter italic">Khaadi</div>
           <div className="text-2xl font-black text-gray-800 tracking-tighter italic">SanaSafinaz</div>
           <div className="text-2xl font-black text-gray-800 tracking-tighter italic">J.</div>
           <div className="text-2xl font-black text-gray-800 tracking-tighter italic">Outfitter</div>
        </div>
      </section>

      {/* --- MERCHANT COMMAND CENTER --- */}
      {stores.length > 0 && (
        <section className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-[4rem] border border-gray-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] p-12 relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16 relative z-10">
              <div>
                <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-2">My Command Center</h2>
                <p className="text-gray-500 font-medium">Select a business to manage or visit.</p>
              </div>
              <button 
                onClick={onStartOnboarding}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-xl"
              >
                <Plus className="w-5 h-5" /> Launch New Venture
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
              {stores.map(store => (
                <div key={store.profile.id} className="group bg-gray-50 rounded-[3rem] p-10 border border-transparent hover:border-indigo-200 hover:bg-white transition-all hover:shadow-2xl flex flex-col h-full">
                  <div className="flex items-start justify-between mb-8">
                    <div 
                      style={{ backgroundColor: store.profile.brandColor }} 
                      className="w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl rotate-3 group-hover:rotate-0 transition-transform duration-500"
                    >
                      <Store className="w-8 h-8" />
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Store ID</span>
                      <span className="text-xs font-bold text-gray-400">{store.profile.id}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-black text-gray-900 mb-2">{store.profile.name}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-8 flex-grow leading-relaxed font-medium">
                    {store.profile.tagline}
                  </p>

                  <div className="flex gap-3">
                    <button 
                      onClick={() => onManageStore(store.profile.id)}
                      className="flex-1 py-4 bg-white border border-gray-200 rounded-2xl text-xs font-black flex items-center justify-center gap-2 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all shadow-sm"
                    >
                      <Settings className="w-4 h-4" /> Manage
                    </button>
                    <button 
                      onClick={() => onVisitStore(store.profile.id)}
                      className="p-4 bg-white border border-gray-200 rounded-2xl text-gray-400 hover:text-indigo-600 transition-all shadow-sm"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* --- BENTO FEATURE SECTION --- */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-black text-gray-900 tracking-tight mb-4">One Platform, Infinite Possibilities.</h2>
          <p className="text-xl text-gray-500">Everything you need to scale from first sale to full enterprise.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 md:grid-rows-2 gap-6 h-auto md:h-[800px]">
          {/* Big Bento Item 1: AI */}
          <div className="md:col-span-4 bg-indigo-600 rounded-[3rem] p-12 text-white flex flex-col justify-end relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-20 group-hover:opacity-40 transition-opacity">
              <Sparkles className="w-48 h-48 rotate-12" />
            </div>
            <div className="relative z-10">
              <div className="bg-white/10 w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-8 backdrop-blur-md">
                <Layers className="w-8 h-8" />
              </div>
              <h3 className="text-4xl font-black mb-4">Gemini AI Integration</h3>
              <p className="text-indigo-100 text-lg max-w-xl">
                Automatically generate high-converting product descriptions optimized for the local market. Just type the product name, we do the rest.
              </p>
            </div>
          </div>

          {/* Bento Item 2: Custom Domains */}
          <div className="md:col-span-2 bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm flex flex-col group">
            <div className="bg-indigo-50 w-14 h-14 rounded-2xl flex items-center justify-center text-indigo-600 mb-8 group-hover:scale-110 transition-transform">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-4">Custom Domains</h3>
            <p className="text-gray-500 font-medium leading-relaxed">
              Connect your professional domain (e.g., .com, .pk) instantly. No technical degree required.
            </p>
            <div className="mt-auto pt-6">
              <div className="bg-gray-50 rounded-xl p-3 text-xs font-mono text-gray-400">DNS Verified ✓</div>
            </div>
          </div>

          {/* Bento Item 3: Mobile Commerce */}
          <div className="md:col-span-2 bg-gray-900 rounded-[3rem] p-10 text-white flex flex-col group">
            <div className="bg-white/10 w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-8 group-hover:rotate-12 transition-transform">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black mb-4">Mobile First</h3>
            <p className="text-gray-400 font-medium leading-relaxed">
              90% of Pakistani users shop on mobile. Our checkout is optimized for slow networks and tiny screens.
            </p>
          </div>

          {/* Bento Item 4: Instant COD */}
          <div className="md:col-span-4 bg-gray-50 rounded-[3rem] p-12 border border-gray-200 flex flex-col md:flex-row items-center gap-12 group">
            <div className="flex-1">
              <div className="bg-indigo-600 w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-white mb-8">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-4xl font-black text-gray-900 mb-4">Local Logistics Ready</h3>
              <p className="text-gray-500 text-lg leading-relaxed">
                Plug and play with local couriers. Automated Cash on Delivery (COD) tracking and confirmation calls dashboard included.
              </p>
            </div>
            <div className="w-full md:w-64 bg-white p-6 rounded-3xl shadow-xl border border-gray-100 rotate-2 group-hover:rotate-0 transition-transform duration-500">
               <div className="space-y-4">
                  <div className="h-4 bg-gray-100 rounded-full w-3/4" />
                  <div className="h-4 bg-gray-50 rounded-full w-1/2" />
                  <div className="h-10 bg-green-500 rounded-xl w-full" />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- MARKETPLACE FEED --- */}
      <section id="marketplace" className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <h2 className="text-5xl font-black text-gray-900 tracking-tight mb-4">Live Showcase</h2>
            <p className="text-xl text-gray-500">Discover thriving brands built on our infrastructure.</p>
          </div>
          <div className="bg-indigo-50 border border-indigo-100 px-6 py-3 rounded-2xl text-indigo-600 font-black flex items-center gap-2">
            <Rocket className="w-5 h-5" />
            {stores.length} Ventures Active
          </div>
        </div>

        {stores.length === 0 ? (
          <div className="bg-white border-4 border-dashed border-gray-200 rounded-[4rem] py-40 text-center group">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 text-gray-300 group-hover:scale-110 transition-transform">
              <MousePointer2 className="w-10 h-10" />
            </div>
            <h3 className="text-3xl font-black text-gray-400 mb-4">Your store could be here.</h3>
            <p className="text-gray-400 max-w-sm mx-auto mb-10 text-lg">Be the pioneer in your niche. Start selling today.</p>
            <button onClick={onStartOnboarding} className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-100">Claim Shop #001</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {stores.map(store => (
              <div key={store.profile.id} className="bg-white border border-gray-100 rounded-[3rem] p-10 shadow-sm hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] transition-all duration-500 group flex flex-col">
                <div style={{ backgroundColor: store.profile.brandColor }} className="w-20 h-20 rounded-[1.75rem] flex items-center justify-center mb-10 text-white shadow-2xl group-hover:-translate-y-2 transition-transform duration-500">
                  <Store className="w-10 h-10" />
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-4">{store.profile.name}</h3>
                <p className="text-gray-500 leading-relaxed font-medium mb-12 line-clamp-2">
                  {store.profile.tagline}
                </p>
                
                <div className="mt-auto pt-8 border-t border-gray-50 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Status</span>
                    <span className="inline-flex items-center gap-2 text-xs font-bold text-green-600">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      Accepting Orders
                    </span>
                  </div>
                  <button 
                    onClick={() => onVisitStore(store.profile.id)}
                    className="p-5 rounded-2xl bg-gray-50 text-gray-900 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                  >
                    <ArrowRight className="w-6 h-6" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* --- PRICING CTA --- */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-indigo-600 rounded-[4rem] p-12 md:p-24 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 max-w-4xl mx-auto">
             <h2 className="text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tight">Serious about growing? <br /> So are we.</h2>
             <p className="text-xl text-indigo-100 mb-12 leading-relaxed opacity-90">
               Get every single feature—AI, Domains, Analytics, and Logistics—for one simple, transparent price. No hidden fees. No commissions.
             </p>
             <div className="inline-flex flex-col items-center bg-white p-12 rounded-[3rem] shadow-2xl text-gray-900 mb-12 w-full max-w-md">
                <span className="text-xs font-black text-indigo-600 uppercase tracking-[0.2em] mb-4">Unlimited Growth Plan</span>
                <div className="flex items-baseline gap-2 mb-2">
                   <span className="text-6xl font-black tracking-tighter">Rs. 500</span>
                   <span className="text-gray-400 font-bold">/mo</span>
                </div>
                <p className="text-sm text-gray-500 font-medium mb-10">Includes all future updates & unlimited sales.</p>
                <button 
                  onClick={onStartOnboarding}
                  className="w-full py-6 bg-indigo-600 text-white rounded-2xl font-black text-xl hover:bg-indigo-700 transition-all shadow-xl flex items-center justify-center gap-3"
                >
                  Start Selling Now
                  <Rocket className="w-6 h-6" />
                </button>
             </div>
             <p className="text-indigo-200 text-sm font-medium">Cancel anytime. 7-day money back guarantee.</p>
          </div>
        </div>
      </section>

      {/* --- FINAL CONTACT / FOOTER MINI --- */}
      <section className="max-w-7xl mx-auto px-4 text-center">
         <div className="flex flex-col items-center">
            <div className="flex gap-4 mb-8">
               <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-gray-400" />
               </div>
               <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-gray-400" />
               </div>
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-2">Have questions? We're here.</h4>
            <p className="text-gray-500 font-medium mb-8">Join our community of entrepreneurs on WhatsApp or Email.</p>
            <div className="flex gap-8">
               <span className="text-sm font-bold text-indigo-600 hover:underline cursor-pointer">Support Center</span>
               <span className="text-sm font-bold text-indigo-600 hover:underline cursor-pointer">API Docs</span>
               <span className="text-sm font-bold text-indigo-600 hover:underline cursor-pointer">Partner Program</span>
            </div>
         </div>
      </section>
    </div>
  );
};

export default LandingPage;
