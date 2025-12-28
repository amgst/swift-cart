import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ViewType, StoreProfile } from '../types';
import { ShoppingBag, Settings, Store, ShoppingCart, LayoutGrid, LogOut, Globe, Search, Menu, X } from 'lucide-react';

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm transition-all">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => {
            if (profile) {
              window.location.href = `/shop/${profile.storeSlug}`;
            } else {
              setView('landing');
            }
          }}
        >
          <div style={{ backgroundColor: profile?.brandColor || '#4f46e5' }} className="p-2 rounded-lg transition-colors shadow-md group-hover:scale-105 transition-transform">
            <ShoppingBag className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900 truncate max-w-[150px] sm:max-w-xs block">
            {profile ? profile.name : 'SwiftCart'}
          </span>
        </div>

        <div className="flex items-center gap-2 md:gap-6">
          {!profile && (
            <div className="hidden md:flex items-center gap-4">
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
            </div>
          )}

          {/* Desktop Links */}
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
            <div className="hidden md:flex items-center gap-6">
              <Link
                to={`/shop/${profile!.storeSlug}`}
                className={`font-bold text-sm transition-colors ${location.pathname === `/shop/${profile!.storeSlug}` ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'}`}
              >
                Home
              </Link>
              <Link
                to={`/shop/${profile!.storeSlug}/about`}
                className={`font-bold text-sm transition-colors ${location.pathname === `/shop/${profile!.storeSlug}/about` ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'}`}
              >
                About
              </Link>
              <Link
                to={`/shop/${profile!.storeSlug}/contact`}
                className={`font-bold text-sm transition-colors ${location.pathname === `/shop/${profile!.storeSlug}/contact` ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'}`}
              >
                Contact
              </Link>
            </div>
          )}

          <div className="hidden md:block h-6 w-px bg-gray-200 mx-1" />

          {/* Cart Icon - Always Visible */}
          <div className="flex items-center gap-4">
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

            {/* Hamburger Toggle */}
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-gray-600 hover:text-indigo-600">
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-4 shadow-xl animate-in slide-in-from-top-4 duration-200">
          {!profile ? (
            <div className="flex flex-col gap-4">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="font-bold text-gray-600 py-2">Home</Link>
              <Link to="/marketplace" onClick={() => setIsMenuOpen(false)} className="font-bold text-gray-600 py-2 flex items-center gap-2"><Globe className="w-4 h-4" /> Explore Stores</Link>
              <Link to="/tracking" onClick={() => setIsMenuOpen(false)} className="font-bold text-gray-600 py-2 flex items-center gap-2"><Search className="w-4 h-4" /> Track Order</Link>
              <hr className="border-gray-100" />
              {!user ? (
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 bg-indigo-600 text-white rounded-xl font-bold text-center">Login</Link>
              ) : (
                <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 bg-gray-100 text-gray-900 rounded-xl font-bold text-center">Dashboard</Link>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <Link to={`/shop/${profile.storeSlug}`} onClick={() => setIsMenuOpen(false)} className="font-bold text-gray-600 py-2">Home</Link>
              <Link to={`/shop/${profile.storeSlug}/about`} onClick={() => setIsMenuOpen(false)} className="font-bold text-gray-600 py-2">About</Link>
              <Link to={`/shop/${profile.storeSlug}/contact`} onClick={() => setIsMenuOpen(false)} className="font-bold text-gray-600 py-2">Contact</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
