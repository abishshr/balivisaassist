'use client';

import { useEffect, useState } from 'react';

/**
 * Hook to detect if user prefers reduced motion
 * Respects the prefers-reduced-motion media query
 *
 * @returns boolean - true if user prefers reduced motion
 *
 * @example
 * const prefersReducedMotion = useReducedMotion();
 * const animationDuration = prefersReducedMotion ? 0 : 0.5;
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  return prefersReducedMotion;
}

/**
 * Get animation duration based on user preference
 * Returns 0.01 if reduced motion is preferred, otherwise returns the specified duration
 *
 * @param duration - The desired animation duration in seconds
 * @returns number - Animation duration respecting user preferences
 *
 * @example
 * const duration = useAnimationDuration(0.5); // Returns 0.01 if reduced motion, 0.5 otherwise
 */
export function useAnimationDuration(duration: number): number {
  const prefersReducedMotion = useReducedMotion();
  return prefersReducedMotion ? 0.01 : duration;
}

/**
 * Get motion configuration object for Framer Motion
 * Automatically adjusts animation properties based on user preference
 *
 * @example
 * const motion = useMotionConfig();
 * <motion.div animate={motion.fadeIn} />
 */
export function useMotionConfig() {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return {
      initial: {},
      animate: {},
      transition: { duration: 0.01 },
      disabled: true,
    };
  }

  return {
    fadeIn: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
    },
    fadeInUp: {
      initial: { opacity: 0, y: 30 },
      animate: { opacity: 1, y: 0 },
    },
    scaleIn: {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
    },
    disabled: false,
  };
}
