import React from 'react';
import { MemoSectionProps } from '@/types/index';
import { formatMemoContent } from '@/lib/utils';

export const MemoCard: React.FC<MemoSectionProps> = ({
    title,
    content,
    isLoading = false,
    topic,
    idMemo
}) => {
    if (isLoading) {
        return <div className="w-full h-[400px] animate-pulse bg-gray-800 rounded-2xl" />;
    }

    return (
        <article className="w-full h-[400px] rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 p-8 relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.15] noise-bg" />
            
            <div className="relative z-10 flex flex-col h-full">
                <h2 className="text-3xl font-medium mb-4 text-white">{title}</h2>

                <div className="flex-1 overflow-y-auto prose prose-invert max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: formatMemoContent(content) }} />
                </div>

                {topic && <p className="mt-4 text-sm text-white/60">{topic}</p>}
            </div>
        </article>
    );
};
