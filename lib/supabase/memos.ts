import { supabase } from './client'
import { Database } from '@/types/database'

type Memo = Database['public']['Tables']['memos']['Row']
type NewMemo = Database['public']['Tables']['memos']['Insert']
type UpdateMemo = Database['public']['Tables']['memos']['Update']

// Create a new memo
export async function createMemo(memo: NewMemo) {
    const { data, error } = await supabase
        .from('memos')
        .insert(memo)
        .select()
        .single()

    if (error) throw error
    return data
}

// Get a single memo by ID
export async function getMemoById(id: string) {
    const { data, error } = await supabase
        .from('memos')
        .select()
        .eq('id', id)
        .single()

    if (error) throw error
    return data
}

// Get all memos for a user
export async function getUserMemos(userId: string) {
    const { data, error } = await supabase
        .from('memos')
        .select()
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

    if (error) throw error
    return data
}

// Update a memo
export async function updateMemo(id: string, updates: UpdateMemo) {
    const { data, error } = await supabase
        .from('memos')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

    if (error) throw error
    return data
}

// Delete a memo
export async function deleteMemo(id: string) {
    const { error } = await supabase
        .from('memos')
        .delete()
        .eq('id', id)

    if (error) throw error
    return true
}

// Get memos by book ID
export async function getMemosByBook(bookId: string, userId: string) {
    const { data, error } = await supabase
        .from('memos')
        .select()
        .eq('book_id', bookId)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

    if (error) throw error
    return data
}

// Get memos by chapter ID
export async function getMemosByChapter(chapterId: string, userId: string) {
    const { data, error } = await supabase
        .from('memos')
        .select()
        .eq('chapter_id', chapterId)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

    if (error) throw error
    return data
} 