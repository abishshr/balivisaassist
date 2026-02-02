/**
 * Typography utility classes for consistent heading styles
 * Use these throughout the app for consistent visual hierarchy
 */

export const headings = {
  h1: 'text-5xl sm:text-6xl font-black leading-tight',
  h2: 'text-4xl sm:text-5xl font-black leading-tight',
  h3: 'text-2xl sm:text-3xl font-bold leading-snug',
  h4: 'text-xl sm:text-2xl font-bold leading-snug',
  h5: 'text-lg sm:text-xl font-semibold leading-normal',
  h6: 'text-base sm:text-lg font-semibold leading-normal',
} as const;

export const body = {
  large: 'text-lg leading-relaxed',
  base: 'text-base leading-relaxed',
  small: 'text-sm leading-normal',
  xs: 'text-xs leading-normal',
} as const;

// Page hero heading with drop shadow
export const heroHeading = `${headings.h1} text-white drop-shadow-2xl`;

// Section heading with drop shadow
export const sectionHeading = `${headings.h2} text-white drop-shadow-lg`;

// Subsection heading
export const subsectionHeading = `${headings.h3} text-white drop-shadow-md`;
