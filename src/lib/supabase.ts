import { createClient } from '@supabase/supabase-js'

const supabaseUrl = window.env?.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = window.env?.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder'
)
