import React from 'react';
import { MerchantStore } from '../types';
import { Store, Plus, ExternalLink, Settings, LogOut } from 'lucide-react';
import { logoutUser } from '../firebase/auth';
import { User } from 'firebase/auth';

interface UserDashboardProps {
  user: User;
  stores: MerchantStore[];
  onCreateStore: () => void;
  onVisitStore: (id: string) => void;
  onManageStore: (id: string) => void;
  onLogout: () => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ 
  user, 
  stores, 
  onCreateStore, 
  onVisitStore, 
  onManageStore,
  onLogout 
}) => {
  const handleLogout = async () => {
    await logoutUser();
    onLogout();
  };

  const userStores = stores.filter(store => store.profile?.userId === user.uid);

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
            Welcome, {user.displayName || user.email}
          </h1>
          <p className="text-gray-500 font-medium">Manage your stores and grow your business</p>
        </div>
        <button
          onClick={handleLogout}
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 transition-colors flex items-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>

      <div className="bg-white rounded-[3rem] border border-gray-100 shadow-xl p-12 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl font-black text-gray-900 mb-2">My Stores</h2>
            <p className="text-gray-500">Create and manage your online stores</p>
          </div>
          <button
            onClick={onCreateStore}
            className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:bg-indigo-700 transition-colors shadow-xl shadow-indigo-100 flex items-center justify-center gap-3"
          >
            <Plus className="w-6 h-6" />
            Create New Store
          </button>
        </div>

        {userStores.length === 0 ? (
          <div className="text-center py-20 border-4 border-dashed border-gray-200 rounded-[2rem]">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
              <Store className="w-12 h-12" />
            </div>
            <h3 className="text-2xl font-black text-gray-400 mb-4">No stores yet</h3>
            <p className="text-gray-400 mb-8">Create your first store to start selling</p>
            <button
              onClick={onCreateStore}
              className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:bg-indigo-700 transition-colors shadow-xl shadow-indigo-100"
            >
              Create Your First Store
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {userStores.map(store => (
              <div key={store.profile.id} className="bg-gray-50 rounded-[2rem] p-8 border border-gray-100 hover:shadow-xl transition-all group">
                <div className="flex items-start justify-between mb-6">
                  <div
                    style={{ backgroundColor: store.profile.brandColor }}
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-xl"
                  >
                    <Store className="w-8 h-8" />
                  </div>
                  <span className="text-xs font-bold text-gray-400">{store.profile.id}</span>
                </div>

                <h3 className="text-2xl font-black text-gray-900 mb-2">{store.profile.name}</h3>
                <p className="text-sm text-gray-500 mb-6 line-clamp-2">{store.profile.tagline}</p>

                <div className="mb-6 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400 font-bold">Store URL</span>
                    <span className="text-indigo-600 font-black">
                      swiftcart.pk/s/{store.profile.storeSlug}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400 font-bold">Products</span>
                    <span className="text-gray-900 font-black">{store.products.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400 font-bold">Orders</span>
                    <span className="text-gray-900 font-black">{store.orders.length}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => onManageStore(store.profile.id)}
                    className="flex-1 py-3 bg-white border border-gray-200 rounded-xl text-sm font-black text-gray-700 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all flex items-center justify-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    Manage
                  </button>
                  <button
                    onClick={() => onVisitStore(store.profile.id)}
                    className="p-3 bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-indigo-600 transition-all"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
