import { createClient } from '@supabase/supabase-js'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

export const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Add this function to test your connection
export async function testSupabaseConnection() {
    try {
        const { data, error } = await supabase.from('memos').select('count').limit(1)
        if (error) throw error
        console.log('Supabase connection successful')
        return true
    } catch (error) {
        console.error('Supabase connection test failed:', error)
        return false
    }
} 