/**
 * Design Tokens - Centralized styling system for BaliVisaAssist
 * Use these tokens throughout the app for consistent theming
 */

export const COLORS = {
  // Primary brand colors - Amber (Bali temple inspired)
  primary: {
    base: 'amber-500',
    dark: 'amber-600',
    light: 'amber-400',
    gradient: 'from-amber-500 to-orange-500',
  },
  // Secondary brand colors - Orange
  secondary: {
    base: 'orange-600',
    dark: 'orange-700',
    light: 'orange-500',
  },
  // Background colors (dark theme)
  background: {
    base: 'gray-900',
    card: 'white/15',
    cardHover: 'white/20',
    overlay: 'white/10',
    glass: 'white/15', // For glass morphism effects
  },
  // Text colors
  text: {
    primary: 'white',
    secondary: 'gray-200',
    muted: 'gray-400',
    onPrimary: 'white', // Text on primary color backgrounds
  },
  // Border colors
  border: {
    base: 'white/30',
    light: 'white/20',
    focus: 'amber-500',
  },
  // State colors
  state: {
    error: 'red-500',
    errorDark: 'red-600',
    success: 'green-500',
    successDark: 'green-600',
    info: 'blue-500',
    warning: 'yellow-500',
  },
  // Special colors
  whatsapp: '#25D366',
} as const;

export const TYPOGRAPHY = {
  // Headings - consistent hierarchy
  h1: 'text-5xl sm:text-6xl font-black leading-tight',
  h2: 'text-4xl sm:text-5xl font-black leading-tight',
  h3: 'text-2xl sm:text-3xl font-bold leading-snug',
  h4: 'text-xl sm:text-2xl font-bold leading-snug',
  h5: 'text-lg sm:text-xl font-semibold leading-normal',
  h6: 'text-base sm:text-lg font-semibold leading-normal',
  // Body text
  body: {
    large: 'text-lg leading-relaxed',
    base: 'text-base leading-relaxed',
    small: 'text-sm leading-normal',
    xs: 'text-xs leading-normal',
  },
  // Labels and metadata
  label: 'text-sm font-semibold',
  caption: 'text-xs text-gray-400',
} as const;

export const SPACING = {
  // Section spacing
  section: 'py-20 sm:py-28',
  sectionCompact: 'py-16 sm:py-20',
  // Container padding
  container: 'px-4 sm:px-6 lg:px-8',
  // Card padding
  card: 'p-6 sm:p-8',
  cardCompact: 'p-4 sm:p-6',
  // Grid gaps
  gap: {
    small: 'gap-4',
    base: 'gap-6',
    large: 'gap-8',
    responsive: 'gap-6 sm:gap-8',
  },
} as const;

export const BORDERS = {
  // Border radius
  radius: {
    small: 'rounded-lg',
    base: 'rounded-xl',
    large: 'rounded-2xl',
    xlarge: 'rounded-3xl',
    full: 'rounded-full',
  },
  // Border styles
  style: {
    base: 'border border-white/30',
    light: 'border border-white/20',
    focus: 'border-2 border-amber-500',
  },
} as const;

export const EFFECTS = {
  // Glass morphism
  glass: 'bg-white/15 backdrop-blur-xl border border-white/30',
  glassHover: 'bg-white/20 backdrop-blur-xl border border-white/30',
  // Shadows
  shadow: {
    small: 'shadow-lg',
    base: 'shadow-xl',
    large: 'shadow-2xl',
    hover: 'hover:shadow-2xl',
  },
  // Text shadows for readability
  textShadow: {
    base: 'drop-shadow-lg',
    strong: 'drop-shadow-xl',
  },
  // Transitions
  transition: {
    base: 'transition-all duration-300',
    fast: 'transition-all duration-200',
    slow: 'transition-all duration-500',
  },
} as const;

export const MOTION = {
  // Animation durations
  duration: {
    fast: 0.2,
    base: 0.3,
    slow: 0.5,
  },
  // Standard easing
  easing: 'ease-in-out',
  // Hover effects
  hover: {
    lift: { y: -12, scale: 1.02 },
    scale: { scale: 1.05 },
    scaleSmall: { scale: 1.02 },
  },
  // Fade in animations
  fadeIn: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  },
  fadeInUp: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
  },
} as const;

// Helper function to build class names with tokens
export function buildClasses(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

// Utility type for theme color access
export type ThemeColor = keyof typeof COLORS;
export type TypographyScale = keyof typeof TYPOGRAPHY;
export type SpacingScale = keyof typeof SPACING;
