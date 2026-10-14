import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  CHAPTERS,
  CHAPTER_THEME,
  activeChapters,
  approach,
  clamp,
  easeOutBack,
  easeOutBounce,
  easeOutCubic,
  easeOutExpo,
  easeOutQuart,
  easeInOutCubic,
  entry,
  hash,
  lerp,
  navForeground,
  range,
  thru,
  win,
  type SectionMap,
} from "./motion.ts";

/** A section pinned at 1000, 3000 tall, in a 1000px viewport. */
const sections: SectionMap = {
  hero: { top: 0, height: 1000, viewport: 1000 },
  manifesto: { top: 1000, height: 3000, viewport: 1000 },
  work: { top: 4000, height: 2000, viewport: 1000 },
};

describe("primitives", () => {
  it("clamps", () => {
    assert.equal(clamp(-1), 0);
    assert.equal(clamp(2), 1);
    assert.equal(clamp(0.5), 0.5);
    assert.equal(clamp(5, 1, 3), 3);
  });

  it("lerps", () => {
    assert.equal(lerp(0, 10, 0.5), 5);
    assert.equal(lerp(10, 20, 0), 10);
    assert.equal(lerp(10, 20, 1), 20);
  });

  it("ranges and clamps outside the window", () => {
    assert.equal(range(0, 10, 5), 0.5);
    assert.equal(range(0, 10, -5), 0);
    assert.equal(range(0, 10, 50), 1);
  });

  it("range survives a zero-width window", () => {
    assert.ok(Number.isFinite(range(5, 5, 5)));
  });
});

describe("approach", () => {
  it("moves toward the target", () => {
    const next = approach(0, 100, 10, 1 / 60);
    assert.ok(next > 0 && next < 100);
  });

  it("is frame-rate independent", () => {
    // one 1/30s step should land close to two 1/60s steps
    const big = approach(0, 100, 10, 1 / 30);
    let small = approach(0, 100, 10, 1 / 60);
    small = approach(small, 100, 10, 1 / 60);
    assert.ok(Math.abs(big - small) < 0.001, `${big} vs ${small}`);
  });

  it("converges", () => {
    let v = 0;
    for (let i = 0; i < 600; i++) v = approach(v, 100, 10, 1 / 60);
    assert.ok(Math.abs(v - 100) < 0.01);
  });
});

describe("easings", () => {
  const eases = {
    easeInOutCubic,
    easeOutCubic,
    easeOutQuart,
    easeOutExpo,
    easeOutBounce,
  };

  it("all pin 0 to 0 and 1 to 1", () => {
    for (const [name, fn] of Object.entries(eases)) {
      assert.ok(Math.abs(fn(0)) < 1e-9, `${name}(0)`);
      assert.ok(Math.abs(fn(1) - 1) < 1e-9, `${name}(1)`);
    }
  });

  it("all stay within 0..1 across the domain", () => {
    for (const [name, fn] of Object.entries(eases)) {
      for (let t = 0; t <= 1.0001; t += 0.05) {
        const v = fn(t);
        assert.ok(v >= -1e-9 && v <= 1 + 1e-9, `${name}(${t}) = ${v}`);
      }
    }
  });

  it("easeOutBack overshoots, which is the point", () => {
    let peak = 0;
    for (let t = 0; t <= 1; t += 0.01) peak = Math.max(peak, easeOutBack(t));
    assert.ok(peak > 1, `expected overshoot, peak was ${peak}`);
    assert.ok(Math.abs(easeOutBack(1) - 1) < 1e-9);
  });

  it("are monotonic where they should be", () => {
    for (const fn of [easeOutCubic, easeOutQuart, easeInOutCubic]) {
      let prev = -1;
      for (let t = 0; t <= 1; t += 0.02) {
        const v = fn(t);
        assert.ok(v >= prev - 1e-9);
        prev = v;
      }
    }
  });
});

describe("hash", () => {
  it("is deterministic, which keeps the choreography stable across loads", () => {
    assert.equal(hash(7), hash(7));
    assert.notEqual(hash(7), hash(8));
  });

  it("stays in 0..1", () => {
    for (let i = 0; i < 500; i++) {
      const v = hash(i);
      assert.ok(v >= 0 && v < 1, `hash(${i}) = ${v}`);
    }
  });

  it("spreads across the range", () => {
    const buckets = new Array(10).fill(0);
    for (let i = 0; i < 1000; i++) buckets[Math.floor(hash(i) * 10)]++;
    // no bucket should be empty with 1000 samples over 10 buckets
    assert.ok(buckets.every((b) => b > 0), buckets.join(","));
  });
});

describe("thru", () => {
  it("is 0 at the pin point", () => {
    assert.equal(thru(sections, "manifesto", 1000), 0);
  });

  it("is 1 when the section releases", () => {
    // height 3000, viewport 1000, so travel is 2000 from top 1000
    assert.equal(thru(sections, "manifesto", 3000), 1);
  });

  it("is 0.5 halfway", () => {
    assert.equal(thru(sections, "manifesto", 2000), 0.5);
  });

  it("clamps outside the section", () => {
    assert.equal(thru(sections, "manifesto", 0), 0);
    assert.equal(thru(sections, "manifesto", 99999), 1);
  });

  it("returns 0 for an unmeasured section rather than NaN", () => {
    assert.equal(thru(sections, "nope", 500), 0);
  });
});

describe("entry", () => {
  it("is 0 a full viewport before the section arrives", () => {
    assert.equal(entry(sections, "work", 3000), 0);
  });

  it("is 1 when the section top reaches the viewport top", () => {
    assert.equal(entry(sections, "work", 4000), 1);
  });

  it("is 0.5 halfway in", () => {
    assert.equal(entry(sections, "work", 3500), 0.5);
  });

  it("returns 0 for an unknown section", () => {
    assert.equal(entry(sections, "nope", 500), 0);
  });
});

describe("win", () => {
  it("opens before the section arrives when `from` is negative", () => {
    // work.top = 4000, viewport 1000: window runs 3000 -> 4000
    assert.equal(win(sections, "work", -1, 0, 3000), 0);
    assert.equal(win(sections, "work", -1, 0, 3500), 0.5);
    assert.equal(win(sections, "work", -1, 0, 4000), 1);
  });

  it("clamps at both ends", () => {
    assert.equal(win(sections, "work", -1, 0, 0), 0);
    assert.equal(win(sections, "work", -1, 0, 9999), 1);
  });

  it("handles a window entirely after the section top", () => {
    assert.equal(win(sections, "work", 0.5, 1.5, 4500), 0);
    assert.equal(win(sections, "work", 0.5, 1.5, 5000), 0.5);
  });

  it("does not divide by zero on a degenerate window", () => {
    assert.ok(Number.isFinite(win(sections, "work", 0.5, 0.5, 4500)));
  });

  it("returns 0 for an unknown section", () => {
    assert.equal(win(sections, "nope", -1, 0, 500), 0);
  });
});

describe("chapters", () => {
  it("has a theme for every chapter", () => {
    for (const id of CHAPTERS) {
      assert.ok(CHAPTER_THEME[id], `missing theme for ${id}`);
    }
  });

  it("has seven chapters, matching the HUD counter", () => {
    assert.equal(CHAPTERS.length, 7);
  });

  it("darkens the nav on light themes only", () => {
    assert.equal(navForeground("cream"), "#101A5C");
    assert.equal(navForeground("yellow"), "#101A5C");
    assert.equal(navForeground("blue"), "#fff");
    assert.equal(navForeground("navy"), "#fff");
    assert.equal(navForeground("coral"), "#fff");
  });

  it("every theme maps to a defined foreground", () => {
    for (const id of CHAPTERS) {
      assert.ok(navForeground(CHAPTER_THEME[id]).startsWith("#"));
    }
  });
});

describe("activeChapters", () => {
  it("starts on the hero", () => {
    const { current, dominant } = activeChapters(sections, 0, 1000);
    assert.equal(current, "hero");
    assert.equal(dominant, "hero");
  });

  it("flips `current` as soon as a section passes the nav", () => {
    // manifesto top is 1000, so y + 40 >= 1000 at y = 960
    assert.equal(activeChapters(sections, 960, 1000).current, "manifesto");
  });

  it("holds both on hero while the next section is still below the fold", () => {
    // midpoint is 900, short of manifesto's top at 1000
    const at400 = activeChapters(sections, 400, 1000);
    assert.equal(at400.current, "hero");
    assert.equal(at400.dominant, "hero");
  });

  it("`dominant` leads `current`, which is why they are separate", () => {
    // midpoint 1100 is past manifesto's top, but y+40 = 640 is not
    const at600 = activeChapters(sections, 600, 1000);
    assert.equal(at600.current, "hero", "theme should not have flipped yet");
    assert.equal(at600.dominant, "manifesto", "counter should have advanced");
  });

  it("dominant can lead current, which is why they are separate", () => {
    const { current, dominant } = activeChapters(sections, 3600, 1000);
    assert.equal(current, "manifesto");
    assert.equal(dominant, "work");
  });
});
