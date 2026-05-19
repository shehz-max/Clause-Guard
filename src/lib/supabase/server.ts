import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

// For server components and API routes (with cookie auth)
export async function createServerSupabaseClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Handle cookie errors in middleware
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // Handle cookie errors in middleware
          }
        },
      },
    }
  )
}

// Alias for compatibility
export { createServerSupabaseClient as createClient }

// Admin client for server-side operations (bypasses RLS)
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}

// Health check function
export async function checkDatabaseHealth() {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase.from('documents').select('id').limit(1)
    
    if (error) {
      return { healthy: false, error: error.message }
    }
    
    return { healthy: true, error: null }
  } catch (error: any) {
    return { healthy: false, error: error.message }
  }
}

// Sync function for knowledge base (for API routes)
export async function syncKnowledgeBase() {
  const supabase = createAdminClient()
  // Add sync logic here if needed
  return { success: true }
}