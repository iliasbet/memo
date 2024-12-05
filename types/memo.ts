export interface MemoInput {
    userId: string;
    content: string;
    bookId: string;
    chapterId?: string;
}

export interface Memo {
    id: string;
    user_id: string;
    content: string;
    book_id: string;
    chapter_id?: string | null;
    created_at: string;
}

export interface DatabaseMemo {
    id: string;
    user_id: string;
    content: string;
    book_id: string;
    chapter_id?: string | null;
    created_at: string;
}

export type MemoResponse = {
    id: string;
    userId: string;
    content: string;
    bookId: string;
    chapterId?: string;
    createdAt: string;
} 