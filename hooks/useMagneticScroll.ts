import { useEffect, useRef } from 'react';

export const useMagneticScroll = (sections: string[]) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const lastScrollTime = useRef(Date.now());
  const currentSectionRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const getClosestSection = (scrollY: number, windowHeight: number) => {
      let closestSection = 0;
      let minDistance = Infinity;

      sections.forEach((_, index) => {
        const sectionElement = container.children[index] as HTMLElement;
        if (!sectionElement) return;

        const sectionTop = sectionElement.offsetTop;
        const distance = Math.abs(scrollY - sectionTop);

        if (distance < minDistance) {
          minDistance = distance;
          closestSection = index;
        }
      });

      return closestSection;
    };

    const scrollToSection = (index: number) => {
      const sectionElement = container.children[index] as HTMLElement;
      if (!sectionElement) return;

      isScrollingRef.current = true;
      lastScrollTime.current = Date.now();
      currentSectionRef.current = index;

      window.scrollTo({
        top: sectionElement.offsetTop,
        behavior: 'smooth'
      });

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false;
      }, 1000);
    };

    const handleScroll = () => {
      if (isScrollingRef.current) return;

      const now = Date.now();
      if (now - lastScrollTime.current < 100) return;

      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const closestSection = getClosestSection(scrollY, windowHeight);

      if (closestSection !== currentSectionRef.current) {
        scrollToSection(closestSection);
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (isScrollingRef.current) {
        e.preventDefault();
        return;
      }

      const direction = e.deltaY > 0 ? 1 : -1;
      const nextSection = Math.max(0, Math.min(sections.length - 1, currentSectionRef.current + direction));

      if (nextSection !== currentSectionRef.current) {
        e.preventDefault();
        scrollToSection(nextSection);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isScrollingRef.current) return;

      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const direction = e.key === 'ArrowDown' ? 1 : -1;
        const nextSection = Math.max(0, Math.min(sections.length - 1, currentSectionRef.current + direction));

        if (nextSection !== currentSectionRef.current) {
          scrollToSection(nextSection);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [sections]);

  return containerRef;
}; 