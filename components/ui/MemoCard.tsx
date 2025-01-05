import React from 'react';
import { MemoSectionProps } from '@/types/index';
import { formatMemoContent } from '@/lib/utils';
import { cn } from '@/lib/utils';

const cardBaseStyles = "w-full h-[400px] relative rounded-2xl overflow-hidden";
const cardContentStyles = "relative h-full flex flex-col p-8";
const cardBgStyles = "absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800";
const titleStyles = "text-3xl font-medium mb-4 text-white relative z-10";
const contentStyles = "flex-1 overflow-y-auto prose prose-invert max-w-none relative z-10";
const topicStyles = "mt-4 text-sm text-white/60 relative z-10";

export const MemoCard: React.FC<MemoSectionProps> = ({
    title,
    content,
    isLoading = false,
    topic,
    idMemo
}) => {
    if (isLoading) {
        return <div className={cn(cardBaseStyles, "animate-pulse bg-gray-800")} />;
    }

    return (
        <div className={cardBaseStyles}>
            <div className={cardBgStyles} />
            <div className="absolute inset-0 opacity-[0.15] noise-bg" />
            
            <div className={cardContentStyles}>
                <h2 className={titleStyles}>{title}</h2>

                <div className={contentStyles}>
                    <div dangerouslySetInnerHTML={{
                        __html: formatMemoContent(content)
                    }} />
                </div>

                {topic && <div className={topicStyles}>{topic}</div>}
            </div>
        </div>
    );
};
