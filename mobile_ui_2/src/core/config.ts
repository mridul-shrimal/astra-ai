type PublicEnvironment = { apiUrl: string; supabaseUrl: string; supabaseAnonKey: string };
function required(name: string): string { const value = process.env[name]?.trim(); if (!value) throw new Error(`Missing required environment variable: ${name}`); return value; }
function validUrl(name: string, value: string): string { try { new URL(value); return value.replace(/\/$/, ""); } catch { throw new Error(`${name} must be a valid URL.`); } }
export function getPublicEnvironment(): PublicEnvironment { return { apiUrl: validUrl("EXPO_PUBLIC_API_URL", required("EXPO_PUBLIC_API_URL")), supabaseUrl: validUrl("EXPO_PUBLIC_SUPABASE_URL", required("EXPO_PUBLIC_SUPABASE_URL")), supabaseAnonKey: required("EXPO_PUBLIC_SUPABASE_ANON_KEY") }; }
