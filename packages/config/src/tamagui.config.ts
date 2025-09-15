import { defaultConfig } from '@tamagui/config/v4'
import { createMedia, createTamagui, createTokens, setupDev } from 'tamagui'
import { bodyFont, headingFont } from './fonts'
import { animations } from './animations'
import { color } from './themes/token-colors'
import { radius } from './themes/token-radius'
import { size } from './themes/token-size'
import { space } from './themes/token-space'
import { zIndex } from './themes/token-z-index'
import { media, mediaQueryDefaultActive } from './config/media'
import { themes as themesIn } from './themes/theme-generated'
import { shorthands } from '@tamagui/shorthands'

// Hold down Option for a second to see some helpful visuals
setupDev({
  visualizer: true,
})

// export const media = createMedia({
//   xxs: { maxWidth: 390 },
//   xs: { maxWidth: 660 },
//   sm: { maxWidth: 800 },
//   md: { maxWidth: 1020 },
//   lg: { maxWidth: 1280 },
//   xl: { maxWidth: 1650 },

//   gtXs: { minWidth: 660 + 1 },
//   gtSm: { minWidth: 800 + 1 },
//   gtMd: { minWidth: 1020 + 1 },
//   gtLg: { minWidth: 1280 + 1 },
//   gtXl: { minWidth: 1650 + 1 },
//   maxMd: { maxWidth: 1020 },
// })

// export const mediaQueryDefaultActive = {
//   xxs: false,
//   xs: true,
//   sm: true,
//   md: true,
//   lg: true,
//   xl: true,

//   gtXs: true,
//   gtSm: true,
//   gtMd: true,
//   gtLg: true,
//   gtXl: true,
//   maxMd: true,
// }

const themes =
  process.env.TAMAGUI_TARGET !== 'web' || process.env.TAMAGUI_IS_SERVER || process.env.STORYBOOK
    ? themesIn
    : ({} as typeof themesIn)

export const config = createTamagui({
  ...defaultConfig,
  themes,
  defaultFont: 'body',
  animations,
  shouldAddPrefersColorThemes: true,
  themeClassNameOnRoot: true,
  mediaQueryDefaultActive,
  selectionStyles: (theme) => ({
    backgroundColor: theme.color5,
    color: theme.color11,
  }),
  onlyAllowShorthands: false,
  shorthands,
  fonts: {
    heading: headingFont,
    body: bodyFont,
  },
  tokens: createTokens({
    color,
    radius,
    zIndex,
    space,
    size,
  }),
  media,
  settings: {
    allowedStyleValues: 'somewhat-strict',
    autocompleteSpecificTokens: 'except-special',
    fastSchemeChange: true,
  },
})
