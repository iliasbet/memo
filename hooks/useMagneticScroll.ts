import { useEffect, useRef } from 'react';

export const useMagneticScroll = (sections: string[]) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const lastScrollTime = useRef(Date.now());

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const now = Date.now();
      if (isScrollingRef.current || now - lastScrollTime.current < 100) return;

      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      
      sections.forEach((_, index) => {
        const sectionElement = container.children[index] as HTMLElement;
        if (!sectionElement) return;
        
        const sectionTop = sectionElement.offsetTop;
        const sectionHeight = sectionElement.offsetHeight;
        const sectionMiddle = sectionTop + sectionHeight / 2;
        const scrollMiddle = scrollPosition + windowHeight / 2;
        const distance = Math.abs(scrollMiddle - sectionMiddle);
        
        if (distance < windowHeight * 0.25) {
          isScrollingRef.current = true;
          lastScrollTime.current = now;
          
          const duration = Math.min(1200, Math.max(800, distance * 2));
          
          window.scrollTo({
            top: sectionTop,
            behavior: 'smooth'
          });

          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          
          timeoutRef.current = setTimeout(() => {
            isScrollingRef.current = false;
          }, duration);
        }
      });
    };

    const debouncedScroll = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(handleScroll, 16); // ~60fps
    };

    window.addEventListener('scroll', debouncedScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', debouncedScroll);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [sections]);

  return containerRef;
}; 