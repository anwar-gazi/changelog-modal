import { defineConfig } from "tsup";

export default defineConfig([
  // 1. Core ESM and CommonJS library
  {
    entry: ["src/index.ts"],
    format: ["esm", "cjs"],
    dts: true,
    sourcemap: true,
    clean: true,
    minify: false,
    external: ["marked"],
    outExtension({ format }) {
      return {
        js: format === "esm" ? ".mjs" : ".cjs",
      };
    },
    onSuccess: "node -e \"const fs=require('fs'); fs.copyFileSync('src/styles.css', 'dist/styles.css'); console.log('Copied styles.css to dist/');\"",
  },
  // 2. Standalone IIFE / UMD browser bundle (bundles marked for single script tag drop-in usage)
  {
    entry: {
      "changelog-modal.min": "src/index.ts",
    },
    format: ["iife"],
    globalName: "ChangelogModalElement",
    dts: false,
    sourcemap: true,
    minify: true,
    noExternal: ["marked"],
    outExtension() {
      return {
        js: ".js",
      };
    },
  },
]);
