import { parse } from "yaml";

import type {
  SectionComponentType,
  SectionContent,
  SectionRecord,
} from "../types";

const sectionModules = import.meta.glob("@content/sections/**/section.yaml", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

export class SectionRepository {
  private readonly sections: SectionRecord[];

  constructor() {
    this.sections = Object.entries(sectionModules)
      .map(([filePath, rawContent]) => this.parseModule(filePath, rawContent))
      .sort((a, b) => a.data.order - b.data.order);
  }

  getAll(): SectionRecord[] {
    return this.sections;
  }

  getBySlug(slug: string): SectionRecord | undefined {
    return this.sections.find((section) => section.data.slug === slug);
  }

  getAvailableComponentTypes(): SectionComponentType[] {
    return Array.from(
      new Set(this.sections.map((section) => section.data.component))
    ) as SectionComponentType[];
  }

  private parseModule(filePath: string, rawContent: string): SectionRecord {
    const data = parse(rawContent) as SectionContent;

    if (!data.slug) {
      throw new Error(`Section slug missing in ${filePath}`);
    }

    if (typeof data.order !== "number") {
      throw new Error(`Section order missing in ${filePath}`);
    }

    if (!data.component) {
      throw new Error(`Section component missing in ${filePath}`);
    }

    return {
      id: data.slug,
      data,
    };
  }
}

export const sectionRepository = new SectionRepository();
