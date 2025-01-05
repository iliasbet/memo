import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { formatMemoContent } from '@/lib/utils';
import { motion } from 'framer-motion';

export interface MemoSection {
  type: string;
  title?: string;
  content: string;
  color?: string;
}

export interface CardProps {
  topic: string;
  sections: MemoSection[];
  isLoading?: boolean;
}

const Card: React.FC<CardProps> = ({
  topic,
  sections = [],
  isLoading = false,
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate the angle based on distance from card center
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      
      // Normalize the rotation (max 40 degrees)
      const maxRotation = 40;
      const maxDistance = window.innerWidth / 2;
      
      const rotateY = (deltaX / maxDistance) * maxRotation;
      const rotateX = -(deltaY / maxDistance) * maxRotation;
      
      setMousePosition({
        x: rotateY,
        y: rotateX,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (isLoading) {
    return (
      <motion.div 
        className="w-full max-w-[400px] aspect-[3/4] mx-auto bg-gray-800 rounded-xl p-6 animate-pulse"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
        }}
      >
        <div className="h-8 bg-gray-700 rounded w-2/3 mb-8" />
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-3">
              <div className="h-4 bg-gray-700 rounded w-1/4" />
              <div className="h-24 bg-gray-700 rounded w-full" />
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  const validSections = sections.filter(section => 
    section && typeof section === 'object' && 'type' in section && 'content' in section
  );

  return (
    <motion.div 
      ref={cardRef}
      className="w-full max-w-[400px] aspect-[3/4] mx-auto"
      style={{
        perspective: "1500px",
        transformStyle: "preserve-3d"
      }}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <motion.div
        className="relative w-full h-full"
        style={{
          transformStyle: "preserve-3d",
          transformOrigin: "center center",
          transform: `perspective(1500px) rotateY(${mousePosition.x}deg) rotateX(${mousePosition.y}deg)`,
          transition: "transform 0.05s linear"
        }}
      >
        {/* Card body */}
        <div className="absolute inset-0 bg-white dark:bg-gray-800 rounded-xl shadow-2xl"
          style={{
            transformStyle: "preserve-3d",
            transform: "translateZ(0px)",
            backgroundImage: "radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)"
          }}
        >
          {/* Card shine effect */}
          <div 
            className="absolute inset-0 rounded-xl opacity-20"
            style={{
              background: `linear-gradient(
                ${105 + mousePosition.x}deg,
                transparent 20%,
                rgba(255, 255, 255, 0.3) 25%,
                transparent 30%
              )`
            }}
          />

          {/* Card inner border */}
          <div className="absolute inset-[2px] rounded-xl border border-gray-200 dark:border-gray-700" 
            style={{ transform: "translateZ(1px)" }}
          />
          
          {/* Card content */}
          <div className="relative h-full flex flex-col p-6" style={{ transform: "translateZ(2px)" }}>
            {/* Header */}
            <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
              <h1 className="text-2xl font-lexend font-medium text-gray-900 dark:text-white text-center">
                {topic}
              </h1>
            </div>

            {/* Sections */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
              {validSections.map((section, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
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
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Card shadow */}
        <div 
          className="absolute -bottom-10 left-0 right-0 h-[400px] rounded-[50%]"
          style={{
            transform: "rotateX(90deg) translateZ(-200px) scale(0.5)",
            background: "radial-gradient(circle at center, rgba(0,0,0,0.4) 0%, transparent 70%)",
            filter: "blur(8px)",
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default Card; 