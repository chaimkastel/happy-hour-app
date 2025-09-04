'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseMicroInteractionsOptions {
  enableHaptic?: boolean;
  enableSound?: boolean;
  enableAnimations?: boolean;
}

export function useMicroInteractions(options: UseMicroInteractionsOptions = {}) {
  const {
    enableHaptic = true,
    enableSound = false,
    enableAnimations = true
  } = options;

  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [ripplePosition, setRipplePosition] = useState<{ x: number; y: number } | null>(null);
  const [bounceScale, setBounceScale] = useState(1);
  const [glowIntensity, setGlowIntensity] = useState(0);
  const [shakeIntensity, setShakeIntensity] = useState(0);

  const animationRef = useRef<number | null>(null);
  const rippleTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Haptic feedback
  const triggerHaptic = useCallback((type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (!enableHaptic || typeof navigator === 'undefined' || !navigator.vibrate) return;

    const patterns = {
      light: [10],
      medium: [20],
      heavy: [30, 10, 30]
    };

    navigator.vibrate(patterns[type]);
  }, [enableHaptic]);

  // Sound feedback
  const triggerSound = useCallback((type: 'tap' | 'success' | 'error' | 'swipe') => {
    if (!enableSound || typeof window === 'undefined') return;

    // Create audio context for sound effects
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    const frequencies = {
      tap: 800,
      success: 1000,
      error: 400,
      swipe: 600
    };

    oscillator.frequency.setValueAtTime(frequencies[type], audioContext.currentTime);
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  }, [enableSound]);

  // Ripple effect
  const createRipple = useCallback((event: React.MouseEvent<HTMLElement>) => {
    if (!enableAnimations) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    setRipplePosition({ x, y });

    if (rippleTimeoutRef.current) {
      clearTimeout(rippleTimeoutRef.current);
    }

    rippleTimeoutRef.current = setTimeout(() => {
      setRipplePosition(null);
    }, 600);
  }, [enableAnimations]);

  // Bounce animation
  const triggerBounce = useCallback(() => {
    if (!enableAnimations) return;

    setBounceScale(1.1);
    setTimeout(() => setBounceScale(1), 200);
  }, [enableAnimations]);

  // Glow effect
  const triggerGlow = useCallback((intensity: number = 1) => {
    if (!enableAnimations) return;

    setGlowIntensity(intensity);
    setTimeout(() => setGlowIntensity(0), 1000);
  }, [enableAnimations]);

  // Shake animation
  const triggerShake = useCallback(() => {
    if (!enableAnimations) return;

    setShakeIntensity(10);
    setTimeout(() => setShakeIntensity(0), 500);
  }, [enableAnimations]);

  // Counter animation
  const animateCounter = useCallback((from: number, to: number, duration: number = 1000) => {
    return new Promise<number>((resolve) => {
      const startTime = performance.now();
      const difference = to - from;

      const updateCounter = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.round(from + (difference * easeOut));

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(updateCounter);
        } else {
          resolve(to);
        }
      };

      animationRef.current = requestAnimationFrame(updateCounter);
    });
  }, []);

  // Typewriter effect
  const typewriter = useCallback(async (text: string, speed: number = 50) => {
    return new Promise<string>((resolve) => {
      let currentText = '';
      let index = 0;

      const typeInterval = setInterval(() => {
        if (index < text.length) {
          currentText += text[index];
          index++;
        } else {
          clearInterval(typeInterval);
          resolve(currentText);
        }
      }, speed);
    });
  }, []);

  // Pulse animation
  const triggerPulse = useCallback(() => {
    if (!enableAnimations) return;

    setGlowIntensity(0.5);
    setTimeout(() => setGlowIntensity(1), 100);
    setTimeout(() => setGlowIntensity(0.5), 200);
    setTimeout(() => setGlowIntensity(0), 300);
  }, [enableAnimations]);

  // Wave animation
  const triggerWave = useCallback(() => {
    if (!enableAnimations) return;

    setBounceScale(1.05);
    setTimeout(() => setBounceScale(0.95), 100);
    setTimeout(() => setBounceScale(1.02), 200);
    setTimeout(() => setBounceScale(1), 300);
  }, [enableAnimations]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (rippleTimeoutRef.current) {
        clearTimeout(rippleTimeoutRef.current);
      }
    };
  }, []);

  // Event handlers
  const handlePress = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setIsPressed(true);
    createRipple(event);
    triggerHaptic('light');
    triggerSound('tap');
  }, [createRipple, triggerHaptic, triggerSound]);

  const handleRelease = useCallback(() => {
    setIsPressed(false);
  }, []);

  const handleHover = useCallback(() => {
    setIsHovered(true);
    triggerGlow(0.3);
  }, [triggerGlow]);

  const handleLeave = useCallback(() => {
    setIsHovered(false);
    setGlowIntensity(0);
  }, []);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    triggerGlow(0.2);
  }, [triggerGlow]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    setGlowIntensity(0);
  }, []);

  const handleSuccess = useCallback(() => {
    triggerBounce();
    triggerHaptic('medium');
    triggerSound('success');
    triggerGlow(1);
  }, [triggerBounce, triggerHaptic, triggerSound, triggerGlow]);

  const handleError = useCallback(() => {
    triggerShake();
    triggerHaptic('heavy');
    triggerSound('error');
  }, [triggerShake, triggerHaptic, triggerSound]);

  const handleSwipe = useCallback(() => {
    triggerWave();
    triggerHaptic('light');
    triggerSound('swipe');
  }, [triggerWave, triggerHaptic, triggerSound]);

  return {
    // State
    isPressed,
    isHovered,
    isFocused,
    ripplePosition,
    bounceScale,
    glowIntensity,
    shakeIntensity,

    // Actions
    triggerHaptic,
    triggerSound,
    createRipple,
    triggerBounce,
    triggerGlow,
    triggerShake,
    triggerPulse,
    triggerWave,
    animateCounter,
    typewriter,

    // Event handlers
    handlePress,
    handleRelease,
    handleHover,
    handleLeave,
    handleFocus,
    handleBlur,
    handleSuccess,
    handleError,
    handleSwipe
  };
}

// Custom hook for scroll-based animations
export function useScrollAnimation(threshold: number = 0.1) {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        setScrollProgress(entry.intersectionRatio);
      },
      { threshold }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold]);

  return { isVisible, scrollProgress, elementRef };
}

// Custom hook for gesture detection
export function useGestureDetection() {
  const [gesture, setGesture] = useState<'none' | 'swipe-left' | 'swipe-right' | 'swipe-up' | 'swipe-down' | 'pinch' | 'long-press'>('none');
  const [gestureData, setGestureData] = useState<{
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    duration: number;
    distance: number;
  } | null>(null);

  const startPos = useRef<{ x: number; y: number; time: number } | null>(null);
  const longPressTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleTouchStart = useCallback((event: React.TouchEvent) => {
    const touch = event.touches[0];
    startPos.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };

    // Long press detection
    longPressTimeout.current = setTimeout(() => {
      setGesture('long-press');
    }, 500);
  }, []);

  const handleTouchMove = useCallback((event: React.TouchEvent) => {
    if (!startPos.current) return;

    const touch = event.touches[0];
    const deltaX = touch.clientX - startPos.current.x;
    const deltaY = touch.clientY - startPos.current.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Clear long press if moving
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current);
    }

    // Detect swipe direction
    if (distance > 50) {
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      if (absX > absY) {
        setGesture(deltaX > 0 ? 'swipe-right' : 'swipe-left');
      } else {
        setGesture(deltaY > 0 ? 'swipe-down' : 'swipe-up');
      }
    }
  }, []);

  const handleTouchEnd = useCallback((event: React.TouchEvent) => {
    if (!startPos.current) return;

    const touch = event.changedTouches[0];
    const endTime = Date.now();
    const duration = endTime - startPos.current.time;

    setGestureData({
      startX: startPos.current.x,
      startY: startPos.current.y,
      endX: touch.clientX,
      endY: touch.clientY,
      duration,
      distance: Math.sqrt(
        Math.pow(touch.clientX - startPos.current.x, 2) +
        Math.pow(touch.clientY - startPos.current.y, 2)
      )
    });

    startPos.current = null;

    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current);
    }
  }, []);

  const resetGesture = useCallback(() => {
    setGesture('none');
    setGestureData(null);
  }, []);

  return {
    gesture,
    gestureData,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    resetGesture
  };
}

// Custom hook for dynamic theming
export function useDynamicTheme() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('auto');
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'night'>('morning');

  useEffect(() => {
    // Detect system theme preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (theme === 'auto') {
        setCurrentTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    if (theme === 'auto') {
      setCurrentTheme(mediaQuery.matches ? 'dark' : 'light');
    }

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  useEffect(() => {
    // Update time of day
    const updateTimeOfDay = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) setTimeOfDay('morning');
      else if (hour >= 12 && hour < 17) setTimeOfDay('afternoon');
      else if (hour >= 17 && hour < 21) setTimeOfDay('evening');
      else setTimeOfDay('night');
    };

    updateTimeOfDay();
    const interval = setInterval(updateTimeOfDay, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const setThemeMode = useCallback((newTheme: 'light' | 'dark' | 'auto') => {
    setTheme(newTheme);
    if (newTheme !== 'auto') {
      setCurrentTheme(newTheme);
    }
  }, []);

  return {
    theme,
    currentTheme,
    timeOfDay,
    setThemeMode
  };
}

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseMicroInteractionsOptions {
  enableHaptic?: boolean;
  enableSound?: boolean;
  enableAnimations?: boolean;
}

export function useMicroInteractions(options: UseMicroInteractionsOptions = {}) {
  const {
    enableHaptic = true,
    enableSound = false,
    enableAnimations = true
  } = options;

  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [ripplePosition, setRipplePosition] = useState<{ x: number; y: number } | null>(null);
  const [bounceScale, setBounceScale] = useState(1);
  const [glowIntensity, setGlowIntensity] = useState(0);
  const [shakeIntensity, setShakeIntensity] = useState(0);

  const animationRef = useRef<number | null>(null);
  const rippleTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Haptic feedback
  const triggerHaptic = useCallback((type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (!enableHaptic || typeof navigator === 'undefined' || !navigator.vibrate) return;

    const patterns = {
      light: [10],
      medium: [20],
      heavy: [30, 10, 30]
    };

    navigator.vibrate(patterns[type]);
  }, [enableHaptic]);

  // Sound feedback
  const triggerSound = useCallback((type: 'tap' | 'success' | 'error' | 'swipe') => {
    if (!enableSound || typeof window === 'undefined') return;

    // Create audio context for sound effects
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    const frequencies = {
      tap: 800,
      success: 1000,
      error: 400,
      swipe: 600
    };

    oscillator.frequency.setValueAtTime(frequencies[type], audioContext.currentTime);
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  }, [enableSound]);

  // Ripple effect
  const createRipple = useCallback((event: React.MouseEvent<HTMLElement>) => {
    if (!enableAnimations) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    setRipplePosition({ x, y });

    if (rippleTimeoutRef.current) {
      clearTimeout(rippleTimeoutRef.current);
    }

    rippleTimeoutRef.current = setTimeout(() => {
      setRipplePosition(null);
    }, 600);
  }, [enableAnimations]);

  // Bounce animation
  const triggerBounce = useCallback(() => {
    if (!enableAnimations) return;

    setBounceScale(1.1);
    setTimeout(() => setBounceScale(1), 200);
  }, [enableAnimations]);

  // Glow effect
  const triggerGlow = useCallback((intensity: number = 1) => {
    if (!enableAnimations) return;

    setGlowIntensity(intensity);
    setTimeout(() => setGlowIntensity(0), 1000);
  }, [enableAnimations]);

  // Shake animation
  const triggerShake = useCallback(() => {
    if (!enableAnimations) return;

    setShakeIntensity(10);
    setTimeout(() => setShakeIntensity(0), 500);
  }, [enableAnimations]);

  // Counter animation
  const animateCounter = useCallback((from: number, to: number, duration: number = 1000) => {
    return new Promise<number>((resolve) => {
      const startTime = performance.now();
      const difference = to - from;

      const updateCounter = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.round(from + (difference * easeOut));

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(updateCounter);
        } else {
          resolve(to);
        }
      };

      animationRef.current = requestAnimationFrame(updateCounter);
    });
  }, []);

  // Typewriter effect
  const typewriter = useCallback(async (text: string, speed: number = 50) => {
    return new Promise<string>((resolve) => {
      let currentText = '';
      let index = 0;

      const typeInterval = setInterval(() => {
        if (index < text.length) {
          currentText += text[index];
          index++;
        } else {
          clearInterval(typeInterval);
          resolve(currentText);
        }
      }, speed);
    });
  }, []);

  // Pulse animation
  const triggerPulse = useCallback(() => {
    if (!enableAnimations) return;

    setGlowIntensity(0.5);
    setTimeout(() => setGlowIntensity(1), 100);
    setTimeout(() => setGlowIntensity(0.5), 200);
    setTimeout(() => setGlowIntensity(0), 300);
  }, [enableAnimations]);

  // Wave animation
  const triggerWave = useCallback(() => {
    if (!enableAnimations) return;

    setBounceScale(1.05);
    setTimeout(() => setBounceScale(0.95), 100);
    setTimeout(() => setBounceScale(1.02), 200);
    setTimeout(() => setBounceScale(1), 300);
  }, [enableAnimations]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (rippleTimeoutRef.current) {
        clearTimeout(rippleTimeoutRef.current);
      }
    };
  }, []);

  // Event handlers
  const handlePress = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setIsPressed(true);
    createRipple(event);
    triggerHaptic('light');
    triggerSound('tap');
  }, [createRipple, triggerHaptic, triggerSound]);

  const handleRelease = useCallback(() => {
    setIsPressed(false);
  }, []);

  const handleHover = useCallback(() => {
    setIsHovered(true);
    triggerGlow(0.3);
  }, [triggerGlow]);

  const handleLeave = useCallback(() => {
    setIsHovered(false);
    setGlowIntensity(0);
  }, []);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    triggerGlow(0.2);
  }, [triggerGlow]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    setGlowIntensity(0);
  }, []);

  const handleSuccess = useCallback(() => {
    triggerBounce();
    triggerHaptic('medium');
    triggerSound('success');
    triggerGlow(1);
  }, [triggerBounce, triggerHaptic, triggerSound, triggerGlow]);

  const handleError = useCallback(() => {
    triggerShake();
    triggerHaptic('heavy');
    triggerSound('error');
  }, [triggerShake, triggerHaptic, triggerSound]);

  const handleSwipe = useCallback(() => {
    triggerWave();
    triggerHaptic('light');
    triggerSound('swipe');
  }, [triggerWave, triggerHaptic, triggerSound]);

  return {
    // State
    isPressed,
    isHovered,
    isFocused,
    ripplePosition,
    bounceScale,
    glowIntensity,
    shakeIntensity,

    // Actions
    triggerHaptic,
    triggerSound,
    createRipple,
    triggerBounce,
    triggerGlow,
    triggerShake,
    triggerPulse,
    triggerWave,
    animateCounter,
    typewriter,

    // Event handlers
    handlePress,
    handleRelease,
    handleHover,
    handleLeave,
    handleFocus,
    handleBlur,
    handleSuccess,
    handleError,
    handleSwipe
  };
}

// Custom hook for scroll-based animations
export function useScrollAnimation(threshold: number = 0.1) {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        setScrollProgress(entry.intersectionRatio);
      },
      { threshold }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold]);

  return { isVisible, scrollProgress, elementRef };
}

// Custom hook for gesture detection
export function useGestureDetection() {
  const [gesture, setGesture] = useState<'none' | 'swipe-left' | 'swipe-right' | 'swipe-up' | 'swipe-down' | 'pinch' | 'long-press'>('none');
  const [gestureData, setGestureData] = useState<{
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    duration: number;
    distance: number;
  } | null>(null);

  const startPos = useRef<{ x: number; y: number; time: number } | null>(null);
  const longPressTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleTouchStart = useCallback((event: React.TouchEvent) => {
    const touch = event.touches[0];
    startPos.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };

    // Long press detection
    longPressTimeout.current = setTimeout(() => {
      setGesture('long-press');
    }, 500);
  }, []);

  const handleTouchMove = useCallback((event: React.TouchEvent) => {
    if (!startPos.current) return;

    const touch = event.touches[0];
    const deltaX = touch.clientX - startPos.current.x;
    const deltaY = touch.clientY - startPos.current.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Clear long press if moving
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current);
    }

    // Detect swipe direction
    if (distance > 50) {
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      if (absX > absY) {
        setGesture(deltaX > 0 ? 'swipe-right' : 'swipe-left');
      } else {
        setGesture(deltaY > 0 ? 'swipe-down' : 'swipe-up');
      }
    }
  }, []);

  const handleTouchEnd = useCallback((event: React.TouchEvent) => {
    if (!startPos.current) return;

    const touch = event.changedTouches[0];
    const endTime = Date.now();
    const duration = endTime - startPos.current.time;

    setGestureData({
      startX: startPos.current.x,
      startY: startPos.current.y,
      endX: touch.clientX,
      endY: touch.clientY,
      duration,
      distance: Math.sqrt(
        Math.pow(touch.clientX - startPos.current.x, 2) +
        Math.pow(touch.clientY - startPos.current.y, 2)
      )
    });

    startPos.current = null;

    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current);
    }
  }, []);

  const resetGesture = useCallback(() => {
    setGesture('none');
    setGestureData(null);
  }, []);

  return {
    gesture,
    gestureData,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    resetGesture
  };
}

// Custom hook for dynamic theming
export function useDynamicTheme() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('auto');
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'night'>('morning');

  useEffect(() => {
    // Detect system theme preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (theme === 'auto') {
        setCurrentTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    if (theme === 'auto') {
      setCurrentTheme(mediaQuery.matches ? 'dark' : 'light');
    }

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  useEffect(() => {
    // Update time of day
    const updateTimeOfDay = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) setTimeOfDay('morning');
      else if (hour >= 12 && hour < 17) setTimeOfDay('afternoon');
      else if (hour >= 17 && hour < 21) setTimeOfDay('evening');
      else setTimeOfDay('night');
    };

    updateTimeOfDay();
    const interval = setInterval(updateTimeOfDay, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const setThemeMode = useCallback((newTheme: 'light' | 'dark' | 'auto') => {
    setTheme(newTheme);
    if (newTheme !== 'auto') {
      setCurrentTheme(newTheme);
    }
  }, []);

  return {
    theme,
    currentTheme,
    timeOfDay,
    setThemeMode
  };
}
