export interface Database {
    public: {
        Tables: {
            memos: {
                Row: {
                    id: string
                    user_id: string
                    content: string
                    book_id: string
                    chapter_id: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    content: string
                    book_id: string
                    chapter_id?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    content?: string
                    book_id?: string
                    chapter_id?: string | null
                    created_at?: string
                }
            }
        }
    }
} 