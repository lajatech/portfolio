import artboardUnit from "./postcss-artboard-unit.mjs";

const config = {
  // array form, because the artboard-unit plugin has to run after Tailwind so
  // that authored `206.6µ` values survive into the emitted CSS
  plugins: ["@tailwindcss/postcss", artboardUnit()],
};

export default config;
