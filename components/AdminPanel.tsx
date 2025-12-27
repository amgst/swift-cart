
import React, { useState } from 'react';
import { Product, Order, StoreProfile } from '../types';
import { generateDescription } from '../services/gemini';
import { 
  Plus, Trash2, Package, Sparkles, Loader2, List, 
  Settings as SettingsIcon, Layout, CreditCard, 
  ShieldCheck, RefreshCw, AlertTriangle, ExternalLink, Copy,
  Globe, CheckCircle2, Info, ChevronRight, Server
} from 'lucide-react';

interface AdminPanelProps {
  profile: StoreProfile;
  setProfile: (p: StoreProfile) => void;
  products: Product[];
  onAddProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  orders: Order[];
  onViewStore: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ profile, setProfile, products, onAddProduct, onDeleteProduct, orders, onViewStore }) => {
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'settings' | 'billing' | 'domain'>('products');
  const [isAdding, setIsAdding] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [domainInput, setDomainInput] = useState(profile.customDomain || '');
  
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop'
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;
    onAddProduct({
      id: Math.random().toString(36).substr(2, 9),
      name: newProduct.name,
      description: newProduct.description,
      price: parseFloat(newProduct.price),
      category: newProduct.category,
      image: newProduct.image
    });
    setNewProduct({
      name: '', description: '', price: '', category: 'Electronics',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop'
    });
    setIsAdding(false);
  };

  const handleMagicDescription = async () => {
    if (!newProduct.name) return;
    setIsGenerating(true);
    const desc = await generateDescription(newProduct.name);
    setNewProduct(prev => ({ ...prev, description: desc }));
    setIsGenerating(false);
  };

  const handleCopyLink = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerifyDomain = () => {
    if (!domainInput) return;
    setIsVerifying(true);
    // Simulate propagation check
    setTimeout(() => {
      setProfile({
        ...profile,
        customDomain: domainInput,
        domainStatus: 'active'
      });
      setIsVerifying(false);
    }, 2000);
  };

  const displayUrl = profile.domainStatus === 'active' && profile.customDomain 
    ? profile.customDomain 
    : `swiftcart.pk/stores/${profile.id}`;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Merchant Portal</h1>
          <div className="flex items-center gap-3 mt-2">
             <div style={{ backgroundColor: profile.brandColor }} className="w-3 h-3 rounded-full shadow-sm" />
             <span className="text-gray-500 font-medium">Currently managing <strong className="text-gray-900">{profile.name}</strong></span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
           <div className="bg-gray-100 p-1 rounded-2xl flex border border-gray-200 shadow-sm overflow-x-auto no-scrollbar">
            {[
              { id: 'products', label: 'Items', icon: <Package className="w-4 h-4" /> },
              { id: 'orders', label: 'Orders', icon: <List className="w-4 h-4" /> },
              { id: 'domain', label: 'Domain', icon: <Globe className="w-4 h-4" /> },
              { id: 'settings', label: 'Brand', icon: <SettingsIcon className="w-4 h-4" /> },
              { id: 'billing', label: 'Billing', icon: <CreditCard className="w-4 h-4" /> }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === tab.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
           </div>
           <button 
             onClick={onViewStore}
             className="bg-gray-900 text-white px-6 py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-black transition-colors"
           >
             <ExternalLink className="w-4 h-4" /> View Storefront
           </button>
        </div>
      </div>

      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
             <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900">Your Store Link</h3>
                <p className="text-sm text-gray-400 mt-1 italic">Share this URL with your customers to start getting orders.</p>
                <div className="mt-4 flex items-center gap-2 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                   <code className="flex-1 text-sm font-bold text-indigo-600 truncate">{displayUrl}</code>
                   <button onClick={handleCopyLink} className="p-2 text-gray-400 hover:text-indigo-600 transition-colors">
                      {copied ? <ShieldCheck className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                   </button>
                </div>
             </div>
             <button 
                onClick={() => setIsAdding(!isAdding)}
                style={{ backgroundColor: profile.brandColor }}
                className="w-full md:w-auto px-8 py-4 text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-all"
              >
                <Plus className="w-5 h-5" /> Add New Item
              </button>
          </div>

          {isAdding && (
            <div className="bg-white p-8 rounded-[2.5rem] border border-indigo-100 shadow-2xl mb-8 animate-in zoom-in duration-300">
              <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Product Name</label>
                    <input 
                      type="text" required value={newProduct.name}
                      onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                      placeholder="e.g. Premium Leather Wallet"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 flex justify-between">
                      AI Description
                      <button type="button" onClick={handleMagicDescription} disabled={!newProduct.name || isGenerating} className="text-[10px] text-indigo-600 font-black flex items-center gap-1 hover:underline">
                        {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                        MAGIC WRITE
                      </button>
                    </label>
                    <textarea 
                      rows={4} value={newProduct.description}
                      onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500 text-sm leading-relaxed"
                      placeholder="Enter details or use Magic Write..."
                    />
                  </div>
                </div>
                <div className="space-y-6 flex flex-col justify-between">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Price (PKR)</label>
                       <input type="number" required value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-bold" />
                    </div>
                    <div>
                       <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Category</label>
                       <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-bold">
                          <option>Electronics</option><option>Furniture</option><option>Lifestyle</option><option>Apparel</option>
                       </select>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-[2rem] border border-dashed border-gray-200 text-center">
                     <p className="text-xs font-bold text-gray-400">Preview Image URL (Preset for Demo)</p>
                     <p className="text-[10px] text-gray-300 truncate mt-1">{newProduct.image}</p>
                  </div>
                  <div className="flex gap-4">
                    <button type="submit" style={{ backgroundColor: profile.brandColor }} className="flex-1 text-white py-5 rounded-2xl font-black shadow-lg">SAVE PRODUCT</button>
                    <button type="button" onClick={() => setIsAdding(false)} className="px-8 py-5 text-gray-400 font-bold hover:text-gray-900 transition-colors">CANCEL</button>
                  </div>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm">
            {products.length === 0 ? (
               <div className="py-24 text-center">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Package className="w-8 h-8 text-gray-200" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-300">No Products Found</h4>
                  <p className="text-gray-400 text-sm mt-2">Add your first item to start selling.</p>
               </div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Product</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Category</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Price</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-8 py-6 flex items-center gap-4">
                        <img src={p.image} className="w-12 h-12 rounded-xl object-cover shadow-sm" />
                        <span className="font-bold text-gray-900">{p.name}</span>
                      </td>
                      <td className="px-8 py-6">
                         <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase">{p.category}</span>
                      </td>
                      <td className="px-8 py-6 font-black">Rs. {p.price.toLocaleString()}</td>
                      <td className="px-8 py-6 text-right">
                        <button onClick={() => onDeleteProduct(p.id)} className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 className="w-5 h-5" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {activeTab === 'domain' && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="bg-white p-12 rounded-[3rem] border border-gray-100 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8">
               <Globe className="w-32 h-32 text-gray-50/50 -mr-16 -mt-16" />
             </div>
             
             <div className="relative z-10 max-w-2xl">
                <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Connect Your Brand</h2>
                <p className="text-gray-500 mb-10 leading-relaxed font-medium">
                  Take your business to the next level by connecting a custom domain. Your customers will trust a professional URL like <span className="text-indigo-600 font-bold">www.mystore.com</span>.
                </p>

                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Your Custom Domain</label>
                    <div className="flex flex-col sm:flex-row gap-4">
                       <div className="relative flex-1">
                          <Globe className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                          <input 
                            type="text" 
                            value={domainInput}
                            onChange={(e) => setDomainInput(e.target.value)}
                            placeholder="www.yourname.com"
                            className="w-full pl-14 pr-6 py-5 bg-gray-50 border-2 border-gray-100 rounded-[2rem] outline-none focus:border-indigo-600 font-bold transition-all"
                          />
                       </div>
                       <button 
                         onClick={handleVerifyDomain}
                         disabled={isVerifying || !domainInput}
                         style={{ backgroundColor: profile.brandColor }}
                         className="px-10 py-5 rounded-[2rem] text-white font-black text-sm shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                       >
                         {isVerifying ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                         VERIFY DOMAIN
                       </button>
                    </div>
                  </div>

                  {profile.domainStatus === 'active' && (
                    <div className="bg-green-50 border border-green-100 p-6 rounded-[2rem] flex items-center gap-4 animate-in zoom-in">
                       <div className="bg-green-100 p-3 rounded-full">
                          <CheckCircle2 className="w-6 h-6 text-green-600" />
                       </div>
                       <div>
                          <h4 className="font-black text-green-900">Domain Connected</h4>
                          <p className="text-sm text-green-700 font-medium">Your store is now live at <span className="underline">{profile.customDomain}</span></p>
                       </div>
                    </div>
                  )}
                </div>
             </div>
          </div>

          <div className="bg-white p-12 rounded-[3rem] border border-gray-100 shadow-sm">
             <div className="flex items-center gap-3 mb-8">
               <Server className="w-6 h-6 text-indigo-600" />
               <h3 className="text-xl font-bold text-gray-900">DNS Configuration Instructions</h3>
             </div>
             
             <p className="text-gray-500 mb-8 text-sm font-medium leading-relaxed">
               To connect your domain, log in to your domain provider (GoDaddy, Namecheap, etc.) and update your DNS settings to the following values:
             </p>

             <div className="space-y-4">
                <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-gray-50">
                  <table className="w-full text-left text-sm">
                    <thead>
                       <tr className="border-b border-gray-200">
                         <th className="px-6 py-4 font-black uppercase text-[10px] text-gray-400">Type</th>
                         <th className="px-6 py-4 font-black uppercase text-[10px] text-gray-400">Host / Name</th>
                         <th className="px-6 py-4 font-black uppercase text-[10px] text-gray-400">Value / Points To</th>
                         <th className="px-6 py-4 font-black uppercase text-[10px] text-gray-400">TTL</th>
                       </tr>
                    </thead>
                    <tbody>
                       <tr className="border-b border-gray-100">
                         <td className="px-6 py-4 font-bold text-indigo-600">A</td>
                         <td className="px-6 py-4 font-medium text-gray-600">@</td>
                         <td className="px-6 py-4 font-mono font-bold text-gray-900">76.76.21.21</td>
                         <td className="px-6 py-4 text-gray-400 text-xs">Automatic</td>
                       </tr>
                       <tr>
                         <td className="px-6 py-4 font-bold text-indigo-600">CNAME</td>
                         <td className="px-6 py-4 font-medium text-gray-600">www</td>
                         <td className="px-6 py-4 font-mono font-bold text-gray-900">swiftcart.pk</td>
                         <td className="px-6 py-4 text-gray-400 text-xs">Automatic</td>
                       </tr>
                    </tbody>
                  </table>
                </div>

                <div className="flex items-start gap-3 p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
                   <Info className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                   <p className="text-xs text-indigo-700 leading-relaxed">
                     <strong>Pro Tip:</strong> DNS changes can take up to 48 hours to propagate globally, but usually happen within minutes. Our system will automatically provision a free SSL certificate once connected.
                   </p>
                </div>
             </div>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
             <h2 className="text-2xl font-bold text-gray-900">Order Management</h2>
             <div className="bg-green-50 text-green-700 px-4 py-2 rounded-xl text-xs font-black uppercase">COD Only Enabled</div>
          </div>
          <div className="grid gap-6">
            {orders.length === 0 ? (
              <div className="bg-white py-32 rounded-[3rem] border border-gray-100 text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-200">
                   <List className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-gray-300">Awaiting your first sale...</h3>
              </div>
            ) : (
              orders.map(o => (
                <div key={o.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 flex flex-col md:flex-row justify-between hover:shadow-lg transition-shadow">
                  <div className="flex gap-6 items-start">
                    <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 font-black">
                      #{o.id.substr(-4)}
                    </div>
                    <div>
                      <h4 className="font-black text-xl text-gray-900">{o.customer.name}</h4>
                      <p className="text-sm text-gray-500 font-medium">{o.customer.phone} &bull; {o.customer.address}</p>
                      <div className="mt-4 flex gap-2">
                         {o.items.map(i => <span key={i.id} className="text-[10px] font-bold bg-gray-100 px-2 py-1 rounded">{i.name} (x{i.quantity})</span>)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right mt-6 md:mt-0 flex flex-col justify-between">
                    <div>
                       <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Due</p>
                       <p className="text-2xl font-black text-gray-900">Rs. {o.total.toLocaleString()}</p>
                    </div>
                    <div className="mt-4 md:mt-0">
                       <span className="text-[10px] font-black bg-green-100 text-green-700 px-3 py-1.5 rounded-full uppercase tracking-widest">PENDING COD</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="max-w-3xl bg-white p-12 rounded-[3rem] border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4 mb-10">
             <div style={{ backgroundColor: profile.brandColor }} className="w-12 h-12 rounded-2xl flex items-center justify-center text-white">
                <Layout className="w-6 h-6" />
             </div>
             <div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Store Branding</h2>
                <p className="text-gray-500">Configure your storefront's visual identity.</p>
             </div>
          </div>
          
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div>
                 <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Store Name</label>
                 <input 
                   type="text" value={profile.name}
                   onChange={e => setProfile({...profile, name: e.target.value})}
                   className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                 />
               </div>
               <div>
                 <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Primary Brand Color</label>
                 <div className="flex items-center gap-4 bg-gray-50 border border-gray-100 p-3 rounded-2xl">
                    <input 
                      type="color" value={profile.brandColor}
                      onChange={e => setProfile({...profile, brandColor: e.target.value})}
                      className="h-10 w-16 p-1 rounded-xl cursor-pointer bg-white border border-gray-200"
                    />
                    <code className="text-sm font-bold text-gray-500 uppercase">{profile.brandColor}</code>
                 </div>
               </div>
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Store Tagline / Slogan</label>
              <input 
                type="text" value={profile.tagline}
                onChange={e => setProfile({...profile, tagline: e.target.value})}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              />
            </div>
            <div className="pt-6">
               <div className="bg-indigo-50 p-6 rounded-[2rem] border border-indigo-100 flex items-start gap-4">
                  <Sparkles className="w-5 h-5 text-indigo-600 mt-1" />
                  <div>
                     <h4 className="font-bold text-indigo-900">SaaS Branding Active</h4>
                     <p className="text-sm text-indigo-700 mt-1 leading-relaxed">
                        These settings are applied instantly to your public store. Customers will see your chosen colors and name across all pages.
                     </p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'billing' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="md:col-span-2 space-y-8">
            <div className="bg-white p-12 rounded-[3rem] border border-gray-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8">
                 <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${profile.subscriptionStatus === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                   {profile.subscriptionStatus === 'active' ? <ShieldCheck className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                   Subscription {profile.subscriptionStatus}
                 </div>
              </div>

              <div className="mb-10">
                <h3 className="text-3xl font-black text-gray-900 tracking-tight">{profile.planName}</h3>
                <p className="text-gray-500 font-medium mt-1">Automatic monthly billing enabled.</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
                <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100">
                  <p className="text-[10px] text-gray-400 font-black mb-2 uppercase tracking-widest">Next Payment Date</p>
                  <p className="text-2xl font-black text-gray-900">
                    {new Date(profile.expiryDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100">
                  <p className="text-[10px] text-gray-400 font-black mb-2 uppercase tracking-widest">Monthly Platform Fee</p>
                  <p className="text-2xl font-black text-gray-900">Rs. 500</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => setProfile({...profile, subscriptionStatus: profile.subscriptionStatus === 'active' ? 'expired' : 'active'})}
                  className="flex-1 bg-gray-900 text-white py-5 rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:bg-black transition-colors shadow-xl"
                >
                  <RefreshCw className="w-4 h-4" />
                  {profile.subscriptionStatus === 'active' ? 'SIMULATE EXPIRE' : 'RENEW (RS. 500)'}
                </button>
                <button className="flex-1 border border-gray-200 py-5 rounded-2xl font-black text-sm text-gray-500 hover:bg-gray-50 transition-colors">
                  DOWNLOAD INVOICES
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-10 rounded-[3rem] text-white flex flex-col md:flex-row items-center gap-8">
              <div className="w-20 h-20 bg-white/20 rounded-[2rem] flex items-center justify-center backdrop-blur-md flex-shrink-0">
                <Sparkles className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-2xl font-black mb-2 leading-tight">SaaS Savings Calculator</h4>
                <p className="text-indigo-100 text-sm leading-relaxed">
                  By using our flat-fee model, you've saved <strong>Rs. {Math.round(orders.reduce((acc, o) => acc + o.total, 0) * 0.03).toLocaleString()}</strong> in commission fees this month compared to Shopify or Daraz.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6">Payment Source</h4>
              <div className="flex items-center gap-4 p-5 border-2 border-indigo-50 rounded-2xl bg-indigo-50/20">
                <div className="bg-indigo-600 text-white px-3 py-1 rounded font-black text-[10px]">VISA</div>
                <div className="flex-1">
                  <p className="text-sm font-black text-gray-900">•••• 9901</p>
                  <p className="text-[10px] text-gray-400 font-bold">Expires 08/2027</p>
                </div>
              </div>
              <button className="w-full mt-6 py-3 text-xs font-black text-indigo-600 border border-indigo-100 rounded-xl hover:bg-indigo-50 transition-all">
                CHANGE CARD
              </button>
            </div>
            
            <div className="bg-gray-900 p-8 rounded-[2.5rem] text-white">
              <div className="flex items-center gap-3 mb-4">
                 <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                    <Layout className="w-4 h-4" />
                 </div>
                 <h4 className="font-bold">SaaS Support</h4>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed mb-6">Need technical help with your store settings or billing? Our engineers are online.</p>
              <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-black transition-colors uppercase tracking-widest">
                Chat With Us
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
