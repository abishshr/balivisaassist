import { join } from 'path'

export const FONT_FAMILY = 'PlusJakartaSans'

const FONT_DIR = join(process.cwd(), 'fonts')

/**
 * Register custom fonts with fontconfig so Sharp/libvips/Pango can use them.
 * Sets FONTCONFIG_FILE to a custom config that includes our fonts directory.
 * Safe to call multiple times — only runs once.
 */
let registered = false

export function registerFonts(): void {
  if (registered) return

  // Create a fontconfig XML that adds our fonts directory
  const fontsConf = join(FONT_DIR, 'fonts.conf')
  process.env.FONTCONFIG_FILE = fontsConf

  registered = true
}
