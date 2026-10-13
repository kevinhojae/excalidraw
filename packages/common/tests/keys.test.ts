import { KEYS, getLatinKey, matchKey } from "../src/keys";

describe("key matcher", async () => {
  it("should not match unexpected key", async () => {
    expect(
      matchKey(new KeyboardEvent("keydown", { key: "N" }), KEYS.Y),
    ).toBeFalsy();
    expect(
      matchKey(new KeyboardEvent("keydown", { key: "Unidentified" }), KEYS.Z),
    ).toBeFalsy();

    expect(
      matchKey(new KeyboardEvent("keydown", { key: "z" }), KEYS.Y),
    ).toBeFalsy();
    expect(
      matchKey(new KeyboardEvent("keydown", { key: "y" }), KEYS.Z),
    ).toBeFalsy();

    expect(
      matchKey(new KeyboardEvent("keydown", { key: "Z" }), KEYS.Y),
    ).toBeFalsy();
    expect(
      matchKey(new KeyboardEvent("keydown", { key: "Y" }), KEYS.Z),
    ).toBeFalsy();
  });

  it("should match key (case insensitive) when key is latin", async () => {
    expect(
      matchKey(new KeyboardEvent("keydown", { key: "z" }), KEYS.Z),
    ).toBeTruthy();
    expect(
      matchKey(new KeyboardEvent("keydown", { key: "y" }), KEYS.Y),
    ).toBeTruthy();

    expect(
      matchKey(new KeyboardEvent("keydown", { key: "Z" }), KEYS.Z),
    ).toBeTruthy();
    expect(
      matchKey(new KeyboardEvent("keydown", { key: "Y" }), KEYS.Y),
    ).toBeTruthy();
  });

  it("should match key on QWERTY, QWERTZ, AZERTY", async () => {
    // QWERTY
    expect(
      matchKey(
        new KeyboardEvent("keydown", { key: "z", code: "KeyZ" }),
        KEYS.Z,
      ),
    ).toBeTruthy();
    expect(
      matchKey(
        new KeyboardEvent("keydown", { key: "y", code: "KeyY" }),
        KEYS.Y,
      ),
    ).toBeTruthy();

    // QWERTZ
    expect(
      matchKey(
        new KeyboardEvent("keydown", { key: "z", code: "KeyY" }),
        KEYS.Z,
      ),
    ).toBeTruthy();
    expect(
      matchKey(
        new KeyboardEvent("keydown", { key: "y", code: "KeyZ" }),
        KEYS.Y,
      ),
    ).toBeTruthy();

    // AZERTY
    expect(
      matchKey(
        new KeyboardEvent("keydown", { key: "z", code: "KeyW" }),
        KEYS.Z,
      ),
    ).toBeTruthy();
    expect(
      matchKey(
        new KeyboardEvent("keydown", { key: "y", code: "KeyY" }),
        KEYS.Y,
      ),
    ).toBeTruthy();
  });

  it("should match key on DVORAK, COLEMAK", async () => {
    // DVORAK
    expect(
      matchKey(
        new KeyboardEvent("keydown", { key: "z", code: "KeySemicolon" }),
        KEYS.Z,
      ),
    ).toBeTruthy();
    expect(
      matchKey(
        new KeyboardEvent("keydown", { key: "y", code: "KeyF" }),
        KEYS.Y,
      ),
    ).toBeTruthy();

    // COLEMAK
    expect(
      matchKey(
        new KeyboardEvent("keydown", { key: "z", code: "KeyZ" }),
        KEYS.Z,
      ),
    ).toBeTruthy();
    expect(
      matchKey(
        new KeyboardEvent("keydown", { key: "y", code: "KeyJ" }),
        KEYS.Y,
      ),
    ).toBeTruthy();
  });

  it("should match key on Turkish-Q", async () => {
    // Turkish-Q
    expect(
      matchKey(
        new KeyboardEvent("keydown", { key: "z", code: "KeyN" }),
        KEYS.Z,
      ),
    ).toBeTruthy();
    expect(
      matchKey(
        new KeyboardEvent("keydown", { key: "Y", code: "KeyY" }),
        KEYS.Y,
      ),
    ).toBeTruthy();
  });

  it("should not fallback when code is not defined", async () => {
    expect(
      matchKey(new KeyboardEvent("keydown", { key: "я" }), KEYS.Z),
    ).toBeFalsy();

    expect(
      matchKey(new KeyboardEvent("keydown", { key: "卜" }), KEYS.Y),
    ).toBeFalsy();
  });

  it("should not fallback when code is incorrect", async () => {
    expect(
      matchKey(
        new KeyboardEvent("keydown", { key: "z", code: "KeyY" }),
        KEYS.Y,
      ),
    ).toBeFalsy();
    expect(
      matchKey(
        new KeyboardEvent("keydown", { key: "Y", code: "KeyZ" }),
        KEYS.Z,
      ),
    ).toBeFalsy();
  });

  it("should fallback to code when key is non-latin", async () => {
    // Macedonian
    expect(
      matchKey(
        new KeyboardEvent("keydown", { key: "з", code: "KeyZ" }),
        KEYS.Z,
      ),
    ).toBeTruthy();
    expect(
      matchKey(
        new KeyboardEvent("keydown", { key: "ѕ", code: "KeyY" }),
        KEYS.Y,
      ),
    ).toBeTruthy();

    // Russian
    expect(
      matchKey(
        new KeyboardEvent("keydown", { key: "я", code: "KeyZ" }),
        KEYS.Z,
      ),
    ).toBeTruthy();
    expect(
      matchKey(
        new KeyboardEvent("keydown", { key: "н", code: "KeyY" }),
        KEYS.Y,
      ),
    ).toBeTruthy();

    // Serbian
    expect(
      matchKey(
        new KeyboardEvent("keydown", { key: "ѕ", code: "KeyZ" }),
        KEYS.Z,
      ),
    ).toBeTruthy();
    expect(
      matchKey(
        new KeyboardEvent("keydown", { key: "з", code: "KeyY" }),
        KEYS.Y,
      ),
    ).toBeTruthy();

    // Greek
    expect(
      matchKey(
        new KeyboardEvent("keydown", { key: "ζ", code: "KeyZ" }),
        KEYS.Z,
      ),
    ).toBeTruthy();
    expect(
      matchKey(
        new KeyboardEvent("keydown", { key: "υ", code: "KeyY" }),
        KEYS.Y,
      ),
    ).toBeTruthy();

    // Hebrew
    expect(
      matchKey(
        new KeyboardEvent("keydown", { key: "ז", code: "KeyZ" }),
        KEYS.Z,
      ),
    ).toBeTruthy();
    expect(
      matchKey(
        new KeyboardEvent("keydown", { key: "ט", code: "KeyY" }),
        KEYS.Y,
      ),
    ).toBeTruthy();

    // Cangjie - Traditional
    expect(
      matchKey(
        new KeyboardEvent("keydown", { key: "重", code: "KeyZ" }),
        KEYS.Z,
      ),
    ).toBeTruthy();
    expect(
      matchKey(
        new KeyboardEvent("keydown", { key: "卜", code: "KeyY" }),
        KEYS.Y,
      ),
    ).toBeTruthy();

    // Japanese
    expect(
      matchKey(
        new KeyboardEvent("keydown", { key: "つ", code: "KeyZ" }),
        KEYS.Z,
      ),
    ).toBeTruthy();
    expect(
      matchKey(
        new KeyboardEvent("keydown", { key: "ん", code: "KeyY" }),
        KEYS.Y,
      ),
    ).toBeTruthy();

    // 2-Set Korean
    expect(
      matchKey(
        new KeyboardEvent("keydown", { key: "ㅋ", code: "KeyZ" }),
        KEYS.Z,
      ),
    ).toBeTruthy();
    expect(
      matchKey(
        new KeyboardEvent("keydown", { key: "ㅛ", code: "KeyY" }),
        KEYS.Y,
      ),
    ).toBeTruthy();
  });
});

describe("getLatinKey", () => {
  it("keeps a latin key as typed", () => {
    // Arrange
    const event = new KeyboardEvent("keydown", { key: "R", code: "KeyR" });

    // Act
    const key = getLatinKey(event);

    // Assert
    expect(key).toBe("R");
  });

  it("uses the physical key's letter on a non-latin layout", () => {
    // Arrange
    const event = new KeyboardEvent("keydown", { key: "ㄱ", code: "KeyR" });

    // Act
    const key = getLatinKey(event);

    // Assert
    expect(key).toBe("r");
  });

  it("keeps a non-letter key as typed", () => {
    // Arrange
    const event = new KeyboardEvent("keydown", { key: "1", code: "Digit1" });

    // Act
    const key = getLatinKey(event);

    // Assert
    expect(key).toBe("1");
  });
});
