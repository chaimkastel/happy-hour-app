'use client';

import { useState, useEffect, useRef } from 'react';

interface UseScrollDirectionOptions {
  threshold?: number;
  idleDelay?: number;
  enabled?: boolean;
}

export function useScrollDirection({
  threshold = 10,
  idleDelay = 120,
  enabled = true
}: UseScrollDirectionOptions = {}) {
  const [direction, setDirection] = useState<'up' | 'down' | null>(null);
  const [isAtTop, setIsAtTop] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);
  const idleTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled) return;

    let rafId: number;

    const updateScrollDirection = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY.current;

      // Check if at top
      setIsAtTop(currentScrollY <= threshold);

      // Only update direction if scroll amount exceeds threshold
      if (Math.abs(scrollDelta) >= threshold) {
        const newDirection = scrollDelta > 0 ? 'down' : 'up';
        
        if (newDirection !== direction) {
          setDirection(newDirection);
        }
      }

      lastScrollY.current = currentScrollY;
      ticking.current = false;
    };

    const handleScroll = () => {
      if (!ticking.current) {
        rafId = requestAnimationFrame(updateScrollDirection);
        ticking.current = true;
      }

      // Clear idle timer on scroll
      if (idleTimer.current) {
        clearTimeout(idleTimer.current);
      }

      // Set idle timer to clear direction after delay
      idleTimer.current = setTimeout(() => {
        setDirection(null);
      }, idleDelay);
    };

    // Initial check
    setIsAtTop(window.scrollY <= threshold);

    // Add passive scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      if (idleTimer.current) {
        clearTimeout(idleTimer.current);
      }
    };
  }, [threshold, idleDelay, enabled, direction]);

  return {
    direction,
    isAtTop,
    isScrolling: direction !== null
  };
}