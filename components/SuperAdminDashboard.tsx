import React from 'react';
import { MerchantStore } from '../types';
import {
    LayoutDashboard,
    Store,
    Users,
    TrendingUp,
    DollarSign,
    ShieldCheck,
    ExternalLink,
    Trash2,
    Lock,
    Search,
    MoreVertical
} from 'lucide-react';
import { User } from 'firebase/auth';
import { logoutUser } from '../firebase/auth';

interface SuperAdminDashboardProps {
    user: User;
    stores: MerchantStore[];
    onVisitStore: (id: string) => void;
    onLogout: () => void;
}

const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({
    user,
    stores,
    onVisitStore,
    onLogout
}) => {
    // Calculate platform stats
    const totalStores = stores.length;
    const activeStores = stores.filter(s => s.profile.subscriptionStatus === 'active').length;
    const totalProducts = stores.reduce((acc, store) => acc + (store.products?.length || 0), 0);
    const totalOrders = stores.reduce((acc, store) => acc + (store.orders?.length || 0), 0);

    // Simulated revenue (Rs. 500 per active store)
    const monthlyRevenue = activeStores * 500;

    return (
        <div className="max-w-7xl mx-auto py-12 px-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-gray-900 text-white p-2 rounded-lg">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                            Platform Admin
                        </h1>
                    </div>
                    <p className="text-gray-500 font-medium">Overview of the entire SwiftCart ecosystem</p>
                </div>
                <button
                    onClick={async () => {
                        await logoutUser();
                        onLogout();
                    }}
                    className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm"
                >
                    <Lock className="w-5 h-5" />
                    Logout Admin
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-600">
                            <Store className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest text-gray-400">Total Stores</span>
                    </div>
                    <h3 className="text-3xl font-black text-gray-900">{totalStores}</h3>
                    <p className="text-sm text-gray-500 mt-1 font-medium">{activeStores} Active Subscriptions</p>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-green-50 p-3 rounded-2xl text-green-600">
                            <DollarSign className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest text-gray-400">Est. MRR</span>
                    </div>
                    <h3 className="text-3xl font-black text-gray-900">Rs. {monthlyRevenue.toLocaleString()}</h3>
                    <p className="text-sm text-gray-500 mt-1 font-medium">+12% from last month</p>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-blue-50 p-3 rounded-2xl text-blue-600">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest text-gray-400">Platform GMV</span>
                    </div>
                    <h3 className="text-3xl font-black text-gray-900">{totalOrders} Orders</h3>
                    <p className="text-sm text-gray-500 mt-1 font-medium">Across all merchants</p>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-orange-50 p-3 rounded-2xl text-orange-600">
                            <Users className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest text-gray-400">Total Products</span>
                    </div>
                    <h3 className="text-3xl font-black text-gray-900">{totalProducts}</h3>
                    <p className="text-sm text-gray-500 mt-1 font-medium">Live items listed</p>
                </div>
            </div>

            {/* Stores Table */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900">All Stores Directory</h2>
                        <p className="text-gray-500 mt-1 font-medium">Manage all merchant accounts from one place</p>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search stores..."
                            className="pl-12 pr-6 py-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-gray-900 w-full md:w-64"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Store Name</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Owner</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Metrics</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {stores.map(store => (
                                <tr key={store.profile.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div
                                                style={{ backgroundColor: store.profile.brandColor }}
                                                className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm"
                                            >
                                                <Store className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">{store.profile.name}</p>
                                                <p className="text-xs text-gray-500 font-medium">/{store.profile.storeSlug}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="font-bold text-gray-900 text-sm">{store.profile.ownerEmail}</p>
                                        <p className="text-xs text-gray-400 font-medium">ID: {store.profile.userId ? store.profile.userId.substr(0, 8) : 'Unknown'}...</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex gap-3">
                                            <span className="text-xs font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">
                                                {store.products?.length || 0} Prods
                                            </span>
                                            <span className="text-xs font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">
                                                {store.orders?.length || 0} Orders
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${store.profile.subscriptionStatus === 'active'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-red-100 text-red-700'
                                            }`}>
                                            {store.profile.subscriptionStatus}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => onVisitStore(store.profile.id)}
                                                className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                title="View Store"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </button>
                                            <button
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete Store"
                                                onClick={() => {
                                                    if (confirm('Are you sure you want to delete this store? This action cannot be undone.')) {
                                                        // Handler would go here
                                                        alert('Delete functionality restricted in demo mode');
                                                    }
                                                }}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {stores.length === 0 && (
                    <div className="p-12 text-center text-gray-400 font-medium">
                        No stores found in the system.
                    </div>
                )}
            </div>
        </div>
    );
};

export default SuperAdminDashboard;
