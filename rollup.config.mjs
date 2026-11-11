import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

export default {
  input: "src/water-tank-card.ts",
  output: {
    file: "dist/water-tank-card.js",
    format: "es",
    sourcemap: false,
  },
  plugins: [resolve(), typescript({ tsconfig: "./tsconfig.json" })],
};
