// Admin configuration
// The admin email is set via environment variable NEXT_PUBLIC_ADMIN_EMAIL
// This file is kept for future admin configuration needs

export const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

// Helper function to check if an email is admin
export const isAdminEmail = (email: string | undefined): boolean => {
  return email === ADMIN_EMAIL;
};
