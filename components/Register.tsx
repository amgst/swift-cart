import React, { useState } from 'react';
import { registerUser } from '../firebase/auth';
import { Mail, Lock, User, ArrowRight, X } from 'lucide-react';

interface RegisterProps {
  onSuccess: () => void;
  onCancel: () => void;
  onSwitchToLogin: () => void;
}

const Register: React.FC<RegisterProps> = ({ onSuccess, onCancel, onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      await registerUser(email, password, name);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Create Account</h1>
        <button onClick={onCancel} className="p-3 hover:bg-gray-100 rounded-2xl transition-colors">
          <X className="w-6 h-6 text-gray-400" />
        </button>
      </div>

      <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-indigo-600 transition-colors text-lg font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-indigo-600 transition-colors text-lg font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-indigo-600 transition-colors text-lg font-bold"
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">Minimum 6 characters</p>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-indigo-600 transition-colors text-lg font-bold"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-6 bg-indigo-600 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl shadow-indigo-100 active:scale-95 transition-all"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
            {!isLoading && <ArrowRight className="w-6 h-6" />}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-gray-100 text-center">
          <p className="text-gray-500 font-medium mb-4">
            Already have an account?
          </p>
          <button
            onClick={onSwitchToLogin}
            className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
