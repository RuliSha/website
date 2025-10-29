export type ResolvedColorScheme = "light" | "dark";
export type ColorSchemeSetting = ResolvedColorScheme | "system";

export interface ThemeColorPalette {
  background: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  textMuted: string;
  primary: string;
  primaryContrast: string;
  accent: string;
  border: string;
}

export interface ThemeShadowTokens {
  medium: string;
  [token: string]: string;
}

export interface ThemeLayoutTokens {
  contentWidth: number;
  sectionGap: number;
  navHeight: number;
  maxWidthNarrow: number;
}

export interface ThemeDefinition {
  defaultScheme: ColorSchemeSetting;
  schemes: Record<
    ResolvedColorScheme,
    { colors: ThemeColorPalette; shadows: ThemeShadowTokens }
  >;
  typography: {
    fontFamily: string;
    headingFamily: string;
    baseSize: number;
    lineHeights: Record<string, number>;
  };
  spacing: Record<string, number>;
  radii: Record<string, number>;
  layout: ThemeLayoutTokens;
  shadows: Record<string, string>;
}

export interface BaseSectionContent {
  slug: string;
  title: string;
  order: number;
  component: string;
  description?: string;
}

export interface RichTextBlockHeading {
  type: "heading";
  level: 1 | 2 | 3 | 4;
  text: string;
}

export interface RichTextBlockParagraph {
  type: "paragraph";
  text: string;
}

export interface RichTextBlockList {
  type: "list";
  style: "ordered" | "unordered";
  title?: string;
  items: string[];
}

export type RichTextBlock =
  | RichTextBlockHeading
  | RichTextBlockParagraph
  | RichTextBlockList;

export interface RichTextSectionContent extends BaseSectionContent {
  component: "rich-text";
  hero?: {
    eyebrow?: string;
    headline?: string;
    subtitle?: string;
    image?: {
      src: string;
      alt?: string;
    };
  };
  content: {
    lead?: string;
    blocks: RichTextBlock[];
  };
  spotlight?: {
    items: Array<{ label: string; value: string }>;
  };
}

export interface PublicationLink {
  label: string;
  url: string;
}

export interface PublicationItem {
  title: string;
  authors: string;
  venue: string;
  year: number;
  summary?: string;
  tags?: string[];
  primaryUrl?: string;
  links?: PublicationLink[];
}

export interface PublicationListSectionContent extends BaseSectionContent {
  component: "publication-list";
  content: {
    items: PublicationItem[];
  };
}

export type SectionContent =
  | RichTextSectionContent
  | PublicationListSectionContent;

export type SectionComponentType = SectionContent["component"];

export interface SectionRecord<
  TContent extends SectionContent = SectionContent
> {
  id: string;
  data: TContent;
}
