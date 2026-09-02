
import React, { useState } from 'react';
import { Store, ArrowRight, Star, MapPin, Globe, Search } from 'lucide-react';
import { MerchantStore } from '../types';

interface LandingPageProps {
  stores: MerchantStore[];
  onVisitStore: (id: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ stores, onVisitStore }) => {
  const [search, setSearch] = useState('');

  const filteredStores = stores.filter(s =>
    s.profile.name.toLowerCase().includes(search.toLowerCase()) ||
    s.profile.tagline.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 space-y-12">
      <div className="text-center space-y-6">
        <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight">
          All <span className="text-indigo-600">Stores</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
          Browse every store on SwiftCart.
        </p>

        <div className="max-w-xl mx-auto relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-300 group-focus-within:text-indigo-600 transition-colors" />
          <input
            type="text"
            placeholder="Search for stores..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-16 pr-8 py-6 bg-white border-2 border-gray-100 rounded-[2.5rem] outline-none focus:border-indigo-600 shadow-xl transition-all font-medium text-lg"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredStores.length > 0 ? (
          filteredStores.map(store => (
            <div key={store.profile.id} className="group bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col">
              <div className="flex items-start justify-between mb-10">
                <div
                  style={{ backgroundColor: store.profile.brandColor }}
                  className="w-20 h-20 rounded-[1.75rem] flex items-center justify-center text-white shadow-2xl group-hover:-rotate-6 transition-transform"
                >
                  <Store className="w-10 h-10" />
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 justify-end mb-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-black text-gray-900">4.9</span>
                  </div>
                  <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Active Store</span>
                </div>
              </div>

              <h3 className="text-3xl font-black text-gray-900 mb-4">{store.profile.name}</h3>
              <p className="text-gray-500 font-medium mb-12 line-clamp-2 leading-relaxed">
                {store.profile.tagline}
              </p>

              <div className="mt-auto flex items-center justify-between pt-8 border-t border-gray-50">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>Pakistan Delivery</span>
                </div>
                <button
                  onClick={() => onVisitStore(store.profile.id)}
                  className="flex items-center gap-2 px-6 py-3 bg-indigo-50 text-indigo-600 rounded-2xl font-black text-xs hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                >
                  VISIT SHOP <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-32 text-center bg-gray-50 rounded-[4rem] border-4 border-dashed border-gray-200">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Globe className="w-8 h-8 text-gray-200" />
            </div>
            <h3 className="text-2xl font-black text-gray-400">
              {stores.length === 0 ? 'No stores yet.' : 'No stores found matching your search.'}
            </h3>
            {search && (
              <button onClick={() => setSearch('')} className="mt-4 text-indigo-600 font-bold hover:underline">Clear Search</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LandingPage;
