
import React, { useState } from 'react';
import { MerchantStore } from '../types';
import { Search, Store, ArrowRight, Star, MapPin, Globe } from 'lucide-react';

interface MarketplaceProps {
  stores: MerchantStore[];
  onVisitStore: (id: string) => void;
}

const Marketplace: React.FC<MarketplaceProps> = ({ stores, onVisitStore }) => {
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'products' | 'stores'>('products');

  // Flatten products from all stores
  const allProducts = stores.flatMap(store =>
    store.products.map(product => ({
      ...product,
      storeId: store.profile.id,
      storeName: store.profile.name,
      storeSlug: store.profile.storeSlug,
      brandColor: store.profile.brandColor
    }))
  );

  const filteredProducts = allProducts.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.storeName.toLowerCase().includes(search.toLowerCase())
  );

  const filteredStores = stores.filter(s =>
    s.profile.name.toLowerCase().includes(search.toLowerCase()) ||
    s.profile.tagline.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 space-y-12">
      <div className="text-center space-y-6">
        <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight">
          Explore the <span className="text-indigo-600">Marketplace</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
          Discover unique products from top local brands.
        </p>

        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setViewMode('products')}
            className={`px-6 py-2 rounded-full font-bold transition-all ${viewMode === 'products' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
          >
            Products
          </button>
          <button
            onClick={() => setViewMode('stores')}
            className={`px-6 py-2 rounded-full font-bold transition-all ${viewMode === 'stores' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
          >
            Stores
          </button>
        </div>

        <div className="max-w-xl mx-auto relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-300 group-focus-within:text-indigo-600 transition-colors" />
          <input
            type="text"
            placeholder={viewMode === 'products' ? "Search for products..." : "Search for stores..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-16 pr-8 py-6 bg-white border-2 border-gray-100 rounded-[2.5rem] outline-none focus:border-indigo-600 shadow-xl transition-all font-medium text-lg"
          />
        </div>
      </div>

      {viewMode === 'products' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map(p => (
            <div
              key={`${p.storeId}-${p.id}`}
              onClick={() => onVisitStore(p.storeId)}
              className="group bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300"
            >
              <div className="aspect-square relative overflow-hidden bg-gray-100">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute bottom-4 left-4 right-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <div style={{ backgroundColor: p.brandColor }} className="text-white text-xs font-bold py-2 px-4 rounded-xl text-center shadow-lg">
                    Visit {p.storeName}
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-gray-900 line-clamp-1">{p.name}</h3>
                    <p className="text-xs text-gray-500 font-medium">{p.storeName}</p>
                  </div>
                  <span className="font-black text-indigo-600">Rs. {p.price}</span>
                </div>
              </div>
            </div>
          ))}
          {filteredProducts.length === 0 && (
            <div className="col-span-full py-20 text-center text-gray-400">
              No products found.
            </div>
          )}
        </div>
      ) : (
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
              <h3 className="text-2xl font-black text-gray-400">No stores found matching your search.</h3>
              <button onClick={() => setSearch('')} className="mt-4 text-indigo-600 font-bold hover:underline">Clear Search</button>
            </div>
          )}
        </div>
      )}

      <div className="bg-indigo-600 rounded-[4rem] p-12 md:p-20 text-white flex flex-col md:flex-row items-center gap-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="flex-1 space-y-6 relative z-10">
          <h2 className="text-4xl md:text-6xl font-black leading-tight">Want your brand <br /> featured here?</h2>
          <p className="text-indigo-100 text-lg opacity-80 max-w-md">
            Join thousands of successful Pakistani entrepreneurs. Start selling today with zero transaction fees.
          </p>
        </div>
        <button className="px-12 py-6 bg-white text-indigo-600 rounded-3xl font-black text-xl shadow-2xl hover:bg-indigo-50 transition-all active:scale-95 shrink-0">
          Create My Store
        </button>
      </div>
    </div>
  );
};

export default Marketplace;
