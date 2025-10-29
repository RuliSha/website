import { createContext } from "react";

import type {
  ColorSchemeSetting,
  ResolvedColorScheme,
  ThemeDefinition,
} from "../lib/types";

export interface ThemeContextValue {
  definition: ThemeDefinition;
  scheme: ColorSchemeSetting;
  resolvedScheme: ResolvedColorScheme;
  setScheme: (scheme: ColorSchemeSetting) => void;
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(
  undefined
);
