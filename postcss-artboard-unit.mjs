/**
 * Artboard-unit PostCSS plugin.
 *
 * This design is authored against a fixed 2048x1152 artboard. Every dimension
 * is written as a number of artboard units followed by the micro sign, for
 * example `206.6µ`, and resolves to:
 *
 *     calc(206.6 * var(--u))
 *
 * where `--u` is `min(100vw / 2048, 100svh / 1152)`. The effect is that the
 * whole layout scales as a single object with the viewport, which is what keeps
 * the type, the gutters and the 3D scene in register at any size.
 *
 * The original export did this with a runtime regex over a stylesheet injected
 * into the document head. Doing it at build time instead means no flash of
 * unstyled layout, no runtime cost, and real values in devtools.
 *
 * Only declaration values and at-rule params are rewritten. A bare number
 * followed by the micro sign is not valid CSS, so there is nothing legitimate
 * to collide with.
 */

const UNIT = /(-?\d*\.?\d+)µ/g;

const toCalc = (_match, n) => `calc(${n} * var(--u))`;

/** @type {import('postcss').PluginCreator} */
const plugin = () => ({
  postcssPlugin: "postcss-artboard-unit",
  Declaration(decl) {
    if (decl.value.includes("µ")) decl.value = decl.value.replace(UNIT, toCalc);
  },
  AtRule(atRule) {
    if (atRule.params && atRule.params.includes("µ")) {
      atRule.params = atRule.params.replace(UNIT, toCalc);
    }
  },
});

plugin.postcss = true;

export default plugin;
