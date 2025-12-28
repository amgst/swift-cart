import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import { useParams } from 'react-router-dom';

// Wrapper component to handle store slug routing
const StoreRoute: React.FC<{ page?: 'home' | 'about' | 'contact' }> = ({ page = 'home' }) => {
  const { slug } = useParams<{ slug: string }>();
  return <App storeSlug={slug} page={page} />;
};

// Wrapper component to handle admin route
const AdminRoute: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  return <App storeSlug={slug} initialView="admin" />;
};

// Wrapper component to handle view-based routes
const AppWithView: React.FC<{ view: string }> = ({ view }) => {
  return <App initialView={view as any} />;
};

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<AppWithView view="landing" />} />
        <Route path="/marketplace" element={<AppWithView view="marketplace" />} />
        <Route path="/tracking" element={<AppWithView view="tracking" />} />

        {/* Store Routes - SEO Friendly URLs */}
        <Route path="/shop/:slug" element={<StoreRoute />} />
        <Route path="/shop/:slug/about" element={<StoreRoute page="about" />} />
        <Route path="/shop/:slug/contact" element={<StoreRoute page="contact" />} />
        <Route path="/shop/:slug/admin" element={<AdminRoute />} />

        {/* Auth Routes */}
        <Route path="/login" element={<AppWithView view="login" />} />
        <Route path="/register" element={<AppWithView view="register" />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<AppWithView view="dashboard" />} />
        <Route path="/onboarding" element={<AppWithView view="onboarding" />} />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
