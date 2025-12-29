
import React, { useState, useMemo } from 'react';
import { Product, StoreProfile } from '../types';
import {
  Plus, Tag, Search, SlidersHorizontal, X, AlertCircle,
  Calendar, ShoppingBag, ChevronRight, ArrowUpRight,
  Filter, Grid3X3, List as ListIcon, Truck
} from 'lucide-react';

interface StorefrontProps {
  profile: StoreProfile;
  products: Product[];
  onAddToCart: (product: Product) => void;
  page?: 'home' | 'about' | 'contact';
}

const Storefront: React.FC<StorefrontProps> = ({ profile, products, onAddToCart, page = 'home' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState<number>(100000);
  const [showFilters, setShowFilters] = useState(false);

  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category));
    return ['All', ...Array.from(cats)];
  }, [products]);

  const maxPrice = useMemo(() => {
    if (products.length === 0) return 100000;
    return Math.max(...products.map(p => p.price));
  }, [products]);

  const filteredProducts = useMemo(() => {
    const keywords = searchQuery.toLowerCase().trim().split(/\s+/).filter(k => k.length > 0);
    return products.filter(p => {
      const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesPrice = p.price <= priceRange;
      if (!matchesCat || !matchesPrice) return false;
      if (keywords.length === 0) return true;
      const searchStr = `${p.name} ${p.category} ${p.description}`.toLowerCase();
      return keywords.every(kw => searchStr.includes(kw));
    });
  }, [products, searchQuery, selectedCategory, priceRange]);

  if (profile.subscriptionStatus === 'expired') {
    return (
      <div className="max-w-2xl mx-auto py-24 text-center px-4">
        <div className="inline-block p-4 bg-red-100 rounded-full mb-6">
          <AlertCircle className="w-16 h-16 text-red-600" />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{profile.name} is Temporarily Unavailable</h1>
        <p className="text-gray-600 text-lg mb-8 leading-relaxed">
          The merchant's store subscription has expired. If you are the owner, please visit your dashboard to renew your plan for Rs. 500/month.
        </p>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-center gap-4 text-gray-500 text-sm font-medium italic">
          <Calendar className="w-5 h-5" />
          Offline since {new Date(profile.expiryDate).toLocaleDateString()}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      {/* About Page */}
      {page === 'about' && (
        <div className="max-w-4xl mx-auto py-12 px-4">
          <h1 className="text-5xl font-black text-gray-900 mb-8 text-center">About {profile.name}</h1>
          <div className="bg-white rounded-2xl md:rounded-[3rem] p-8 md:p-12 border border-gray-100 shadow-sm space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Our Story</h2>
              <p className="text-xl text-gray-500 font-medium leading-relaxed mb-6">
                {profile.aboutContent || `Welcome to ${profile.name}. We are dedicated to providing the best quality products to our customers. Our journey began with a simple passion for excellence and a commitment to customer satisfaction.`}
              </p>
            </div>
            <div className="h-px bg-gray-100" />
            <div>
              <h2 className="text-2xl font-bold mb-4">Our Values</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 text-lg">
                <li>Customer Satisfaction First</li>
                <li>Premium Quality Assurance</li>
                <li>Fast & Reliable Delivery</li>
                <li>Sustainable Practices</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Contact Page */}
      {page === 'contact' && (
        <div className="max-w-4xl mx-auto py-12 px-4">
          <h1 className="text-5xl font-black text-gray-900 mb-8 text-center">Contact Us</h1>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl md:rounded-[3rem] p-8 md:p-12 border border-gray-100 shadow-sm h-full">
              <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center shrink-0">
                    <ShoppingBag className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Store Address</h3>
                    <p className="text-gray-500">123 Commerce Road, Phase 6 DHA, Lahore, Pakistan</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center shrink-0">
                    <Tag className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Email Us</h3>
                    <p className="text-gray-500">{profile.ownerEmail}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center shrink-0">
                    <Calendar className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Working Hours</h3>
                    <p className="text-gray-500">Mon - Sat: 9:00 AM - 9:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl md:rounded-[3rem] p-8 md:p-12 border border-gray-100 shadow-sm">
              <h2 className="text-2xl font-bold mb-6">Send a Message</h2>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <input type="text" placeholder="Your Name" className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-indigo-500" />
                <input type="email" placeholder="Your Email" className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-indigo-500" />
                <textarea rows={4} placeholder="How can we help?" className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
                <button style={{ backgroundColor: profile.brandColor }} className="w-full py-4 rounded-2xl text-white font-bold text-lg shadow-lg hover:brightness-110 transition-all">Send Message</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Home Page Content */}
      {page === 'home' && (
        <>
          {/* Store Hero / Banner */}
          <section className="relative h-[400px] md:h-[500px] rounded-2xl md:rounded-[3rem] overflow-hidden group">
            <img
              src={profile.heroImage || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop"}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              alt="Store Banner"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent flex items-center px-8 md:px-20">
              <div className="max-w-xl text-white">
                <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-widest mb-4">
                  Premium Collection 2024
                </span>
                <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tighter">
                  {profile.name}
                </h1>
                <p className="text-xl text-gray-200 mb-10 font-medium">
                  {profile.tagline}
                </p>
                <button
                  style={{ backgroundColor: profile.brandColor }}
                  className="px-10 py-5 rounded-2xl font-bold text-lg flex items-center gap-3 shadow-2xl hover:brightness-110 transition-all"
                >
                  Shop Collection <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </section>

          {/* Filter & Search Bar */}
          <section className="sticky top-[4.5rem] z-30 py-4 bg-gray-50/95 backdrop-blur-md border-b border-gray-200">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-4 w-full md:w-auto">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-2xl font-bold text-sm hover:border-indigo-600 transition-colors shadow-sm"
                >
                  <Filter className="w-4 h-4" />
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </button>
                <div className="h-10 w-px bg-gray-200" />
                <div className="flex-1 md:w-80 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm font-medium"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="font-bold text-gray-900">{filteredProducts.length}</span> Products found
              </div>
            </div>

            {/* Expandable Filter Panel */}
            {showFilters && (
              <div className="mt-6 p-6 md:p-8 bg-white border border-gray-200 rounded-2xl md:rounded-[2.5rem] shadow-xl animate-in slide-in-from-top-4 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Categories</h4>
                    <div className="flex flex-wrap gap-2">
                      {categories.map(c => (
                        <button
                          key={c}
                          onClick={() => setSelectedCategory(c)}
                          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${selectedCategory === c ? 'text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                          style={{ backgroundColor: selectedCategory === c ? profile.brandColor : undefined }}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Price Range</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between font-bold text-sm">
                        <span>Rs. 0</span>
                        <span style={{ color: profile.brandColor }}>Rs. {priceRange.toLocaleString()}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max={maxPrice}
                        value={priceRange}
                        onChange={(e) => setPriceRange(parseInt(e.target.value))}
                        className="w-full accent-indigo-600"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col justify-center items-center text-center p-6 border-2 border-dashed border-gray-100 rounded-2xl md:rounded-[2rem]">
                    <Tag className="w-8 h-8 text-gray-300 mb-2" />
                    <p className="text-xs text-gray-400 font-medium italic">Apply filters to refine your search</p>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
            {filteredProducts.length > 0 ? (
              filteredProducts.map(p => (
                <div key={p.id} className="group flex flex-col">
                  <div className="relative aspect-[4/5] bg-gray-100 rounded-2xl md:rounded-[2.5rem] overflow-hidden mb-6 shadow-sm group-hover:shadow-2xl transition-all duration-500">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Overlay UI */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                      <button
                        onClick={() => onAddToCart(p)}
                        style={{ backgroundColor: profile.brandColor }}
                        className="w-full py-4 rounded-2xl text-white font-bold flex items-center justify-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-xl"
                      >
                        <Plus className="w-5 h-5" /> Quick Add
                      </button>
                    </div>

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                        {p.category}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-white p-2 rounded-full shadow-lg">
                        <ArrowUpRight className="w-4 h-4 text-gray-900" />
                      </div>
                    </div>
                  </div>

                  <div className="px-2">

                    <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
                      {p.name}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-1 mb-3">
                      {p.description}
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-black text-gray-900">Rs. {p.price.toLocaleString()}</span>
                      <span className="text-xs text-gray-400 line-through">Rs. {(p.price * 1.2).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 md:py-32 flex flex-col items-center justify-center bg-white rounded-2xl md:rounded-[3rem] border border-gray-100">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <Search className="w-10 h-10 text-gray-200" />
                </div>
                <h3 className="text-2xl font-bold text-gray-400">No products match your criteria</h3>
                <button
                  onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setPriceRange(maxPrice); }}
                  className="mt-6 text-indigo-600 font-bold hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>

          {/* Why Choose Us / Trust Section */}
          <section className="pt-24 grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-gray-200">
            {[
              {
                title: "Free Shipping",
                desc: "On all orders above Rs. 10,000 across Pakistan.",
                // Added Truck icon from lucide-react
                icon: <Truck className="w-8 h-8" />
              },
              {
                title: "COD Specialists",
                desc: "Pay securely at your doorstep. No hidden card fees.",
                icon: <Calendar className="w-8 h-8" />
              },
              {
                title: "24/7 Support",
                desc: "Contact our WhatsApp support for quick assistance.",
                icon: <ShoppingBag className="w-8 h-8" />
              }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center px-6">
                <div style={{ color: profile.brandColor, backgroundColor: profile.brandColor + '10' }} className="w-16 h-16 rounded-3xl flex items-center justify-center mb-6">
                  {item.icon}
                </div>
                <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </section>
        </>
      )}

      {/* Newsletter / Signup */}
      <section className="bg-gray-900 rounded-2xl md:rounded-[3rem] p-12 md:p-24 text-center text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-600/20 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
        <div className="relative z-10">
          <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">Join the {profile.name} Inner Circle</h2>
          <p className="text-gray-400 max-w-xl mx-auto mb-12 text-lg">
            Be the first to hear about new arrivals, sales, and exclusive drops in the local market.
          </p>
          <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="you@example.com"
              className="flex-1 bg-white/10 border border-white/20 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
            <button
              style={{ backgroundColor: profile.brandColor }}
              className="px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl"
            >
              Join Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Storefront;
