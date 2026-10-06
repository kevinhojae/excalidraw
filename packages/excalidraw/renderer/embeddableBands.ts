import { isIframeLikeElement } from "@excalidraw/element";

import type { NonDeletedExcalidrawElement } from "@excalidraw/element/types";

export type EmbeddableBands = {
  /** painted on the static canvas, beneath every embeddable's DOM */
  base: readonly NonDeletedExcalidrawElement[];
  /**
   * elements that follow a DOM-rendered embeddable in scene order, keyed by
   * that embeddable's id. Each band is painted on its own transparent canvas
   * placed right after the embeddable's DOM node.
   */
  overlays: ReadonlyMap<string, readonly NonDeletedExcalidrawElement[]>;
};

/**
 * Embeddables are DOM nodes stacked above the static canvas, so an element
 * that follows an embeddable in scene order must be painted on a separate
 * canvas interleaved with the embeddable DOM. Every element lands in exactly
 * one band.
 *
 * @param visibleElements in scene order
 */
export const splitElementsByEmbeddables = (
  visibleElements: readonly NonDeletedExcalidrawElement[],
  isRenderedAsDOM: (element: NonDeletedExcalidrawElement) => boolean,
): EmbeddableBands => {
  const overlays = new Map<string, NonDeletedExcalidrawElement[]>();
  const base: NonDeletedExcalidrawElement[] = [];
  let band = base;

  for (const element of visibleElements) {
    if (isIframeLikeElement(element)) {
      // the element's own frame & placeholder stay beneath its DOM
      base.push(element);
      if (isRenderedAsDOM(element)) {
        band = [];
        overlays.set(element.id, band);
      }
      continue;
    }
    band.push(element);
  }

  for (const [id, elements] of overlays) {
    if (!elements.length) {
      overlays.delete(id);
    }
  }

  return {
    // keep the identity when nothing was split off, for render memoization
    base: overlays.size ? base : visibleElements,
    overlays,
  };
};
