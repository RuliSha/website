import { parse } from "yaml";

import type { ColorSchemeSetting, ThemeDefinition } from "../types";
import themeRaw from "@content/theme.yaml?raw";

export class ThemeRepository {
  private readonly themeDefinition: ThemeDefinition;

  constructor() {
    const parsed = parse(themeRaw) as ThemeDefinition;
    this.themeDefinition = {
      ...parsed,
      defaultScheme: (parsed.defaultScheme ?? "system") as ColorSchemeSetting,
    };
  }

  getDefinition(): ThemeDefinition {
    return this.themeDefinition;
  }
}

export const themeRepository = new ThemeRepository();
