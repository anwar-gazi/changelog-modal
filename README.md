# changelog-modal-element 📜✨

> Universal, framework-agnostic web component and markdown sanitization engine for rendering interactive changelog modals across any web application.

[![npm version](https://img.shields.io/npm/v/changelog-modal-element.svg)](https://www.npmjs.com/package/changelog-modal-element)
[![license](https://img.shields.io/npm/l/changelog-modal-element.svg)](https://github.com/anwar-gazi/changelog-modal/blob/main/LICENSE)
[![bundle size](https://img.shields.io/bundlephobia/minzip/changelog-modal-element)](https://bundlephobia.com/package/changelog-modal-element)

---

## 🌟 Features

- 🚀 **Framework Agnostic**: Native Web Component (`<changelog-modal>`) that works with Vanilla JS, PHP (Laravel Blade, CodeIgniter, WordPress), React, Vue, Angular, Svelte, or static HTML.
- 🛡️ **Intelligent Sanitization**: Automatically strips internal HTML comments (`<!-- ... -->`), AI agent prompt preambles, and `Mandatory Protocol for Autonomous Coding Agents` blocks before rendering.
- 🎭 **Dual Modal Engine**:
  - **Bootstrap Adapter**: Auto-detects Bootstrap (v3, v4, or v5) and renders using native Bootstrap modal markup and JavaScript.
  - **Standalone Engine**: If Bootstrap is not present, falls back to a sleek, accessible, zero-dependency modal with backdrop blur, keyboard navigation (ESC key), and light/dark theme support.
- 📦 **Dual Ingestion Sources**:
  - **Inline Template**: Ingests server-rendered or static markdown from a child `<template>` tag (zero network latency).
  - **Remote URL**: Ingests markdown dynamically via the `src="/CHANGELOG.md"` attribute.
- 🧩 **Customizable Triggers**: Use the built-in styled trigger link or provide any custom button/link using `slot="trigger"`.
- 📦 **Multi-Format Bundles**: Distributed in ESM, CommonJS, TypeScript declarations, and a pre-bundled standalone CDN script.

---

## 📦 Installation

### NPM / Yarn / PNPM

```bash
npm install changelog-modal-element
```

### CDN (Drop-in Single Script Tag)

Add to your HTML `<head>` or before `</body>`:

```html
<!-- Pre-bundled script (includes markdown parser) -->
<script src="https://cdn.jsdelivr.net/npm/changelog-modal-element/dist/changelog-modal.min.js"></script>

<!-- Optional standalone CSS (if not using Bootstrap) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/changelog-modal-element/dist/styles.css">
```

---

## 🚀 Quick Start

### 1. Basic Usage (Inline Template)

```html
<changelog-modal version="2.52.0">
  <template>
    # Changelog

    All notable changes to this project will be documented in this file.

    <!-- 
    🤖 AI AGENT INSTRUCTIONS:
    Internal instructions are automatically stripped!
    -->

    ## [2.52.0] - 2026-10-06
    ### Added
    - Bulk guest list import feature.
    - Automated regression test suite.

    ## [2.51.0] - 2026-09-28
    ### Fixed
    - Resolved Safari mobile viewport layout shifts.
  </template>
</changelog-modal>
```

### 2. Remote Markdown Fetching

```html
<changelog-modal version="2.52.0" src="/CHANGELOG.md"></changelog-modal>
```

### 3. Custom Trigger Element

Provide your own trigger button or navbar item using `slot="trigger"`:

```html
<changelog-modal version="2.52.0">
  <button slot="trigger" class="btn btn-primary">
    <i class="fa fa-history"></i> What&apos;s New?
  </button>
  <template>
    ...
  </template>
</changelog-modal>
```

### 4. PHP / Laravel Blade / CodeIgniter Integration

```html
<changelog-modal version="<?= htmlspecialchars($appVersion); ?>">
  <template>
    <?php
    $changelogFile = APPPATH . '../CHANGELOG.md';
    if (file_exists($changelogFile)) {
        echo htmlspecialchars(file_get_contents($changelogFile));
    }
    ?>
  </template>
</changelog-modal>

<script src="/path/to/changelog-modal.min.js?v=<?= $appVersion ?>"></script>
```

---

## ⚙️ Attributes Reference

| Attribute | Type | Default | Description |
|:---|:---|:---|:---|
| `version` | `string` | `"1.0.0"` | Version label displayed on default trigger link. |
| `src` | `string` | `undefined` | Remote URL to fetch markdown from (e.g. `"/CHANGELOG.md"`). |
| `modal-title` | `string` | `"System Changelog"` | Title displayed in the modal header. |
| `modal-id` | `string` | `"changelogModal"` | Unique DOM ID for the generated modal element. |
| `mode` | `"auto" | "bootstrap" | "standalone"` | `"auto"` | Modal engine to use. `"auto"` uses Bootstrap if detected, else Standalone. |
| `theme` | `"auto" | "light" | "dark"` | `"auto"` | Theme for Standalone modal mode. |

---

## 🛠️ Programmatic JavaScript API

You can also use the sanitizer and parser directly in your own scripts or components without the Web Component:

```typescript
import { cleanMarkdown, parseMarkdown } from "changelog-modal-element";

const rawMarkdown = `
# Changelog
<!-- confidential comment -->
> ### 🤖 Mandatory Protocol for Autonomous Coding Agents...
## [1.0.0] - 2026-10-06
- Added feature
`;

// 1. Sanitize raw markdown
const sanitizedMd = cleanMarkdown(rawMarkdown, {
  stripComments: true,
  stripAgentProtocol: true,
  stripUnreleased: true,
});

// 2. Parse into HTML
const html = parseMarkdown(rawMarkdown);
```

---

## 💻 Development & Testing

```bash
# 1. Install dependencies
npm install

# 2. Run test suite
npm test

# 3. Start local demo server
npm run dev

# 4. Build production bundles
npm run build
```

---

## 📄 License

MIT © [Minhajul Anwar](https://github.com/artauk)
