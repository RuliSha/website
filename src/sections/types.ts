import type { ReactNode } from "react";

import type {
  PublicationListSectionContent,
  RichTextSectionContent,
  SectionContent,
} from "../lib/types";

export interface SectionComponentProps<TContent extends SectionContent> {
  data: TContent;
  isActive: boolean;
}

export type SectionComponent<TContent extends SectionContent> = (
  props: SectionComponentProps<TContent>
) => ReactNode;

export type SectionContentByType = {
  "rich-text": RichTextSectionContent;
  "publication-list": PublicationListSectionContent;
};

export type SectionComponentFor<TKey extends keyof SectionContentByType> =
  SectionComponent<SectionContentByType[TKey]>;

export type GenericSectionComponent = SectionComponent<SectionContent>;
