import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, ArrowRight } from 'lucide-react';
import { loginUser, logoutUser } from '../firebase/auth';
import { isSuperAdmin, SUPER_ADMIN_EMAILS } from '../lib/superAdmin';

const SuperAdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState(SUPER_ADMIN_EMAILS[0] || '');
  const [password, setPassword] = useState((import.meta.env.VITE_SUPER_ADMIN_PASSWORD as string) || '');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const user = await loginUser(email, password);
      if (!isSuperAdmin(user.email)) {
        await logoutUser();
        setError('This account is not authorized for platform admin access.');
        return;
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-10">
          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl mb-6">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Platform Admin</h1>
          <p className="text-gray-500 font-medium mt-2">Restricted access. Authorized personnel only.</p>
        </div>

        <div className="bg-white/[0.03] border border-white/10 p-8 rounded-[2rem]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-2xl text-sm font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-3">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@swiftcart.com"
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border-2 border-white/10 rounded-2xl outline-none focus:border-white/30 transition-colors text-white font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-3">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border-2 border-white/10 rounded-2xl outline-none focus:border-white/30 transition-colors text-white font-bold"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-5 bg-white text-gray-950 rounded-2xl font-black text-lg flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95 transition-all"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
              {!isLoading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminLogin;
