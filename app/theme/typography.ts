// TODO: write documentation about fonts and typography along with guides on how to add custom fonts in own
// markdown file and add links from here

import { Platform } from "react-native"
import {
  Comfortaa_300Light as comfortaaLight,
  Comfortaa_400Regular as comfortaaRegular,
  Comfortaa_500Medium as comfortaaMedium,
  Comfortaa_600SemiBold as comfortaaSemiBold,
  Comfortaa_700Bold as comfortaaBold,
} from "@expo-google-fonts/comfortaa"

export const customFontsToLoad = {
  comfortaaLight,
  comfortaaRegular,
  comfortaaMedium,
  comfortaaSemiBold,
  comfortaaBold,
}

const fonts = {
  comfortaa: {
    // Cross-platform Google font.
    light: "comfortaaLight",
    normal: "comfortaaRegular",
    medium: "comfortaaMedium",
    semiBold: "comfortaaSemiBold",
    bold: "comfortaaBold",
  },
  helveticaNeue: {
    // iOS only font.
    thin: "HelveticaNeue-Thin",
    light: "HelveticaNeue-Light",
    normal: "Helvetica Neue",
    medium: "HelveticaNeue-Medium",
  },
  courier: {
    // iOS only font.
    normal: "Courier",
  },
  sansSerif: {
    // Android only font.
    thin: "sans-serif-thin",
    light: "sans-serif-light",
    normal: "sans-serif",
    medium: "sans-serif-medium",
  },
  monospace: {
    // Android only font.
    normal: "monospace",
  },
}

export const typography = {
  /**
   * The fonts are available to use, but prefer using the semantic name.
   */
  fonts,
  /**
   * The primary font. Used in most places.
   */
  primary: fonts.comfortaa,
  /**
   * An alternate font used for perhaps titles and stuff.
   */
  secondary: Platform.select({ ios: fonts.helveticaNeue, android: fonts.sansSerif }),
  /**
   * Lets get fancy with a monospace font!
   */
  code: Platform.select({ ios: fonts.courier, android: fonts.monospace }),
}
