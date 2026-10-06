import type { NonDeletedExcalidrawElement } from "@excalidraw/element/types";

import { splitElementsByEmbeddables } from "./embeddableBands";

// the fork's test hook (window.h) is unavailable, so build bare elements
const element = (type: string, id: string) =>
  ({ type, id } as NonDeletedExcalidrawElement);

const ids = (elements: readonly { id: string }[]) =>
  elements.map((el) => el.id);

describe("splitElementsByEmbeddables", () => {
  it("keeps the elements untouched when no embeddable is rendered as DOM", () => {
    // Arrange
    const elements = [
      element("rectangle", "rect"),
      element("embeddable", "placeholder"),
      element("line", "line"),
    ];

    // Act
    const bands = splitElementsByEmbeddables(elements, () => false);

    // Assert
    expect(bands.base).toBe(elements);
    expect(bands.overlays.size).toBe(0);
  });

  it("paints an element above exactly the embeddables that precede it in scene order", () => {
    // Arrange
    const elements = [
      element("rectangle", "below"),
      element("embeddable", "A"),
      element("line", "X"),
      element("embeddable", "B"),
      element("arrow", "Y"),
      element("freedraw", "Z"),
    ];

    // Act
    const bands = splitElementsByEmbeddables(elements, () => true);

    // Assert
    expect(ids(bands.base)).toEqual(["below", "A", "B"]);
    expect([...bands.overlays.keys()]).toEqual(["A", "B"]);
    expect(ids(bands.overlays.get("A")!)).toEqual(["X"]);
    expect(ids(bands.overlays.get("B")!)).toEqual(["Y", "Z"]);
  });

  it("creates no overlay for an embeddable with nothing above it", () => {
    // Arrange
    const elements = [
      element("embeddable", "A"),
      element("embeddable", "B"),
      element("line", "X"),
    ];

    // Act
    const bands = splitElementsByEmbeddables(elements, () => true);

    // Assert
    expect([...bands.overlays.keys()]).toEqual(["B"]);
  });

  it("does not split at an embeddable that is only a canvas placeholder", () => {
    // Arrange
    const elements = [
      element("embeddable", "placeholder"),
      element("line", "X"),
      element("embeddable", "A"),
      element("line", "Y"),
    ];

    // Act
    const bands = splitElementsByEmbeddables(elements, (el) => el.id === "A");

    // Assert
    expect(ids(bands.base)).toEqual(["placeholder", "X", "A"]);
    expect(ids(bands.overlays.get("A")!)).toEqual(["Y"]);
  });
});
