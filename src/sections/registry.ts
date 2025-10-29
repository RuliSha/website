import { lazy, type LazyExoticComponent } from "react";
import RichTextSection from "./rich-text/RichTextSection";
import PublicationListSection from "./publications/PublicationListSection";

import type { SectionComponentType } from "../lib/types";
import type {
  GenericSectionComponent,
  SectionComponentFor,
  SectionContentByType,
} from "./types";

type SectionLoader<TKey extends keyof SectionContentByType> = () => Promise<{
  default: SectionComponentFor<TKey>;
}>;

const loaders: {
  [K in keyof SectionContentByType]: SectionLoader<K>;
} = {
  "rich-text": () => import("./rich-text/RichTextSection"),
  "publication-list": () => import("./publications/PublicationListSection"),
};

const componentCache = new Map<
  SectionComponentType,
  LazyExoticComponent<GenericSectionComponent>
>();

export function getLazySectionComponent<
  TKey extends keyof SectionContentByType
>(type: TKey): LazyExoticComponent<SectionComponentFor<TKey>> {
  const cached = componentCache.get(type);
  if (cached) {
    return cached as LazyExoticComponent<SectionComponentFor<TKey>>;
  }
  // Prefer static (already-imported) components for performance-critical
  // sections. Wrap them in a resolved promise so callers can treat the
  // result as a LazyExoticComponent and continue to render inside
  // <Suspense> uniformly.
  let component: LazyExoticComponent<GenericSectionComponent> | undefined;

  if (type === "rich-text") {
    component = lazy(() => Promise.resolve({ default: RichTextSection })) as LazyExoticComponent<GenericSectionComponent>;
  } else if (type === "publication-list") {
    component = lazy(() => Promise.resolve({ default: PublicationListSection })) as LazyExoticComponent<GenericSectionComponent>;
  } else {
    const loader = loaders[type];

    if (!loader) {
      throw new Error(`Missing renderer for section type "${type as string}"`);
    }

    component = lazy(loader) as LazyExoticComponent<GenericSectionComponent>;
  }

  componentCache.set(type, component);
  return component as LazyExoticComponent<SectionComponentFor<TKey>>;
}
