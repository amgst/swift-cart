import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'firebase/auth';
import { MerchantStore } from '../types';
import { onAuthStateChange, logoutUser } from '../firebase/auth';
import { storeService } from '../firebase/firestore';
import { isSuperAdmin } from '../lib/superAdmin';
import SuperAdminDashboard from './SuperAdminDashboard';

const SuperAdminPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [stores, setStores] = useState<MerchantStore[]>([]);
  const [storesLoading, setStoresLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!authLoading && !isSuperAdmin(user?.email)) {
      navigate('/superadmin');
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    const unsubscribe = storeService.subscribeToAllStores((updatedStores) => {
      setStores(updatedStores);
      setStoresLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (authLoading || storesLoading || !isSuperAdmin(user?.email)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <SuperAdminDashboard
      user={user as User}
      stores={stores}
      onVisitStore={(id) => {
        const store = stores.find(s => s.profile.id === id);
        if (store) navigate(`/shop/${store.profile.storeSlug}`);
      }}
      onLogout={() => navigate('/superadmin')}
    />
  );
};

export default SuperAdminPage;
