# Changelog

All notable changes to the `changelog-modal-element` package will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-10-06

### Added
- **Universal Web Component (`<changelog-modal>`)**: Standard Custom Element working across Vanilla HTML, PHP/Blade/Twig, React, Vue, Angular, Svelte, and static sites.
- **Dual Modal Engine**:
  - Auto-integrates with Bootstrap (v3, v4, v5) when present on the host page.
  - Zero-dependency standalone accessible modal fallback with dark/light themes when Bootstrap is absent.
- **Dual Content Ingestion**:
  - Server-rendered or inline `<template>` ingestion with HTML entity decoding.
  - Remote URL ingestion via `src="/CHANGELOG.md"` attribute with error states.
- **Resilient Sanitization Engine**:
  - Automatically strips HTML comments (`<!-- ... -->`).
  - Automatically strips AI agent instructions and mandatory protocol blocks (`🤖 AI AGENT INSTRUCTIONS`, `Mandatory Protocol for Autonomous Coding Agents`, etc.).
  - Strips empty `## [Unreleased]` placeholder blocks.
  - Normalizes excessive blank lines.
- **Multi-Format Distribution**:
  - ESM (`dist/index.mjs`) for modern bundlers.
  - CommonJS (`dist/index.cjs`) for Node.js / SSR.
  - TypeScript types (`dist/index.d.ts`).
  - Standalone bundled script (`dist/changelog-modal.min.js`) for single-tag CDN usage.
- **Automated Test Suite**: Vitest unit test coverage for parser sanitization, modal DOM lifecycle, and custom element reactive contracts.
