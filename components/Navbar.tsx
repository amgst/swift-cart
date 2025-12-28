
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ViewType, StoreProfile } from '../types';
import { ShoppingBag, Settings, Store, ShoppingCart, LayoutGrid, LogOut, Globe, Search } from 'lucide-react';

interface NavbarProps {
  profile: StoreProfile | null;
  view: ViewType;
  setView: (view: ViewType) => void;
  cartCount: number;
  onCartClick: () => void;
  onExitStore: () => void;
  user?: any;
}

const Navbar: React.FC<NavbarProps> = ({ profile, view, setView, cartCount, onCartClick, onExitStore, user }) => {
  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => profile ? setView('store') : setView('landing')}
        >
          <div style={{ backgroundColor: profile?.brandColor || '#4f46e5' }} className="p-2 rounded-lg transition-colors shadow-md group-hover:scale-105 transition-transform">
            <ShoppingBag className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900">
            {profile ? profile.name : 'SwiftCart'}
          </span>
        </div>

        <div className="flex items-center gap-2 md:gap-6">
          {!profile && (
            <>
              {user && (
                <Link
                  to="/dashboard"
                  className="px-4 py-2 text-sm font-bold text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  Dashboard
                </Link>
              )}
              {!user && (
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  Login
                </Link>
              )}
            </>
          )}
          {!profile ? (
            <div className="hidden md:flex items-center gap-6">
              <Link
                to="/"
                className={`font-bold text-sm transition-colors ${location.pathname === '/' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'}`}
              >
                Home
              </Link>
              <Link
                to="/marketplace"
                className={`flex items-center gap-2 font-bold text-sm transition-colors ${location.pathname === '/marketplace' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'}`}
              >
                <Globe className="w-4 h-4" />
                Explore Stores
              </Link>
              <Link
                to="/tracking"
                className={`flex items-center gap-2 font-bold text-sm transition-colors ${location.pathname === '/tracking' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'}`}
              >
                <Search className="w-4 h-4" />
                Track Order
              </Link>
            </div>
          ) : (
            <>
              {profile && (
                <>
                  <Link
                    to={`/shop/${profile.storeSlug}`}
                    className={`flex items-center gap-2 font-medium transition-colors ${location.pathname === `/shop/${profile.storeSlug}` ? 'text-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    <Store className="w-4 h-4" />
                    <span className="hidden lg:inline text-sm">Shop View</span>
                  </Link>

                  <Link
                    to={`/shop/${profile.storeSlug}/admin`}
                    className={`flex items-center gap-2 font-medium transition-colors ${location.pathname === `/shop/${profile.storeSlug}/admin` ? 'text-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    <Settings className="w-4 h-4" />
                    <span className="hidden lg:inline text-sm">Manage</span>
                  </Link>
                </>
              )}

              <div className="h-6 w-px bg-gray-200 mx-1 hidden sm:block" />

              <button
                onClick={onExitStore}
                className="hidden sm:flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors"
                title="Exit to Platform"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden lg:inline text-xs font-bold uppercase">Exit Store</span>
              </button>
            </>
          )}

          <div className="h-6 w-px bg-gray-200 mx-1" />

          <button
            onClick={onCartClick}
            disabled={!profile || view === 'admin'}
            className={`relative p-2 transition-colors ${profile && view !== 'admin' ? 'text-gray-600 hover:text-indigo-600' : 'text-gray-300 pointer-events-none'}`}
          >
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span style={{ backgroundColor: profile?.brandColor || '#4f46e5' }} className="absolute top-0 right-0 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
