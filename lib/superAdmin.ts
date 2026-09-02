// Emails authorized to access the Platform Admin dashboard.
// Configured via VITE_SUPER_ADMIN_EMAILS (comma-separated) in .env.local, falling back to a default.
const envList = (import.meta.env.VITE_SUPER_ADMIN_EMAILS || 'amgst99@gmail.com') as string;

export const SUPER_ADMIN_EMAILS = envList
  .split(',')
  .map(email => email.trim().toLowerCase())
  .filter(Boolean);

export const isSuperAdmin = (email?: string | null): boolean => {
  return !!email && SUPER_ADMIN_EMAILS.includes(email.toLowerCase());
};
