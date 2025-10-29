import { useEffect, useState } from "react";

export function useSectionsObserver(sectionIds: string[]) {
  const [activeId, setActiveId] = useState<string | null>(
    sectionIds[0] ?? null
  );

  useEffect(() => {
    if (sectionIds.length === 0) {
      setActiveId(null);
      return;
    }

    setActiveId((previous) => {
      if (previous && sectionIds.includes(previous)) {
        return previous;
      }

      return sectionIds[0] ?? null;
    });
  }, [sectionIds]);

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return;
    }

    if (!sectionIds.length) {
      return;
    }

    let frameId: number | null = null;

    const updateActiveSection = () => {
      frameId = null;
      const viewportMarker = window.scrollY + window.innerHeight * 0.35;
      let nextActive: string | null = sectionIds[0] ?? null;

      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (!element) {
          continue;
        }

        const elementTop = element.getBoundingClientRect().top + window.scrollY;
        if (elementTop <= viewportMarker) {
          nextActive = id;
        } else {
          break;
        }
      }

      if (!nextActive) {
        return;
      }

      setActiveId((current) => (current === nextActive ? current : nextActive));
    };

    const requestUpdate = () => {
      if (frameId !== null) {
        return;
      }

      frameId = window.requestAnimationFrame(updateActiveSection);
    };

    requestUpdate();

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }

      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, [sectionIds]);

  return {
    activeId,
    setActiveId,
  };
}
