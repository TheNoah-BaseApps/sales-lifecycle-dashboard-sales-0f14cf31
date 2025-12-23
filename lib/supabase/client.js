// This file is for compatibility but not used since we're using PostgreSQL directly
// Keeping it for potential future migration or reference

export function createClient() {
  console.warn('Supabase client not configured - using direct PostgreSQL connection');
  return null;
}