import React from 'react';
import { cn } from '@/lib/utils';
import { formatMemoContent } from '@/lib/utils';

export interface MemoSection {
  type: string;
  title?: string;
  content: string;
  color?: string;
}

export interface VerticalMemoCardProps {
  topic: string;
  sections: MemoSection[];
  isLoading?: boolean;
}

const VerticalMemoCard: React.FC<VerticalMemoCardProps> = ({
  topic,
  sections = [],
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="w-full max-w-[400px] aspect-[3/4] mx-auto bg-gray-800 rounded-xl p-6 animate-pulse shadow-2xl">
        <div className="h-8 bg-gray-700 rounded w-2/3 mb-8" />
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-3">
              <div className="h-4 bg-gray-700 rounded w-1/4" />
              <div className="h-24 bg-gray-700 rounded w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const validSections = sections.filter(section => 
    section && typeof section === 'object' && 'type' in section && 'content' in section
  );

  return (
    <div className="w-full max-w-[400px] aspect-[3/4] mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl transform transition-all duration-300 hover:scale-[1.02] hover:shadow-3xl">
      {/* Card inner border */}
      <div className="absolute inset-[2px] rounded-xl border border-gray-200 dark:border-gray-700" />
      
      {/* Card content */}
      <div className="relative h-full flex flex-col p-6">
        {/* Header */}
        <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-lexend font-medium text-gray-900 dark:text-white text-center">
            {topic}
          </h1>
        </div>

        {/* Sections */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
          {validSections.map((section, index) => (
            <div
              key={index}
              className="mb-6 last:mb-0"
            >
              <div className="flex items-center gap-2 mb-2">
                <div 
                  className="w-2 h-2 rounded-full flex-shrink-0" 
                  style={{ backgroundColor: section.color || '#3B82F6' }} 
                />
                <div className="flex items-center gap-2 flex-wrap">
                  {section.title && (
                    <h2 className="text-lg font-lexend font-medium text-gray-800 dark:text-gray-200">
                      {section.title}
                    </h2>
                  )}
                  <span 
                    className="text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: `${section.color}15`,
                      color: section.color || '#3B82F6'
                    }}
                  >
                    {section.type}
                  </span>
                </div>
              </div>
              <div 
                className={cn(
                  "prose dark:prose-invert max-w-none text-sm",
                  "text-gray-600 dark:text-gray-300 pl-4"
                )}
                dangerouslySetInnerHTML={{
                  __html: formatMemoContent(section.content)
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VerticalMemoCard; 