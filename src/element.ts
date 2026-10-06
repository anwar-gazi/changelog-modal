import { parseMarkdown } from "./parser";
import { createOrGetModal } from "./modal";

/**
 * Custom Element: <changelog-modal>
 */
export class ChangelogModalElement extends HTMLElement {
  static get observedAttributes(): string[] {
    return ["version", "src", "modal-title", "modal-id", "theme", "mode"];
  }

  private _modalHelper?: ReturnType<typeof createOrGetModal>;
  private _markdown: string = "";
  private _renderedHtml: string = "";

  connectedCallback(): void {
    const version = this.getAttribute("version") || "1.0.0";
    const modalId = this.getAttribute("modal-id") || "changelogModal";
    const title = this.getAttribute("modal-title") || "System Changelog";
    const theme = (this.getAttribute("theme") as "auto" | "light" | "dark") || "auto";
    const mode = (this.getAttribute("mode") as "auto" | "bootstrap" | "standalone") || "auto";

    // 1. Initialize modal helper
    this._modalHelper = createOrGetModal({
      modalId,
      title,
      theme,
      mode,
    });

    // 2. Render trigger element if user has not provided their own trigger markup
    if (!this.querySelector("[slot=trigger]") && !this.querySelector("a, button")) {
      const link = document.createElement("a");
      link.href = "#";
      link.setAttribute("data-toggle", "modal");
      link.setAttribute("data-target", `#${modalId}`);
      link.setAttribute("data-bs-toggle", "modal");
      link.setAttribute("data-bs-target", `#${modalId}`);
      link.style.cssText =
        "display: block; padding: 15px; color: #8a8a8a; font-size: 12px; text-align: center; border-top: 1px solid rgba(255,255,255,0.05); margin-top: 20px; text-decoration: none; transition: color 0.3s; cursor: pointer;";
      link.innerHTML = `Version ${version} <i class="fa fa-info-circle"></i>`;

      link.addEventListener("mouseover", () => {
        link.style.color = "#fff";
      });
      link.addEventListener("mouseout", () => {
        link.style.color = "#8a8a8a";
      });

      link.addEventListener("click", (e) => {
        e.preventDefault();
        this.open();
      });

      this.appendChild(link);
    } else {
      // Custom trigger: attach click handler
      const trigger = this.querySelector("[slot=trigger]") || this.querySelector("a, button");
      if (trigger) {
        trigger.addEventListener("click", (e) => {
          e.preventDefault();
          this.open();
        });
      }
    }

    // 3. Ingest markdown (from child <template> or remote src)
    this.loadChangelog();
  }

  async loadChangelog(): Promise<void> {
    const src = this.getAttribute("src");

    // Case A: Remote URL provided
    if (src) {
      try {
        const res = await fetch(src);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status} ${res.statusText}`);
        }
        const text = await res.text();
        this.setMarkdown(text);
      } catch (err: any) {
        if (this._modalHelper) {
          this._modalHelper.content.innerHTML = `<div style="color: #d9534f; padding: 15px;">Failed to load changelog: ${err.message || err}</div>`;
        }
      }
      return;
    }

    // Case B: Child <template> provided
    const template = this.querySelector("template");
    let rawContent = template ? template.innerHTML : "";

    if (rawContent) {
      // Decode HTML entities (e.g. from server-rendered htmlspecialchars)
      const txt = document.createElement("textarea");
      txt.innerHTML = rawContent;
      rawContent = txt.value;
      this.setMarkdown(rawContent);
    }
  }

  setMarkdown(markdown: string): void {
    this._markdown = markdown;
    const parsed = parseMarkdown(markdown);

    if (typeof parsed === "string") {
      this._renderedHtml = parsed;
      if (this._modalHelper) {
        this._modalHelper.content.innerHTML = parsed;
      }
    } else {
      // Promise-based custom parser
      parsed.then((html) => {
        this._renderedHtml = html;
        if (this._modalHelper) {
          this._modalHelper.content.innerHTML = html;
        }
      });
    }

    this.dispatchEvent(
      new CustomEvent("changelog-loaded", {
        detail: { markdown, html: this._renderedHtml },
        bubbles: true,
      })
    );
  }

  open(): void {
    if (this._modalHelper) {
      this._modalHelper.open();
      this.dispatchEvent(new CustomEvent("changelog-open", { bubbles: true }));
    }
  }

  close(): void {
    if (this._modalHelper) {
      this._modalHelper.close();
      this.dispatchEvent(new CustomEvent("changelog-close", { bubbles: true }));
    }
  }
}

/**
 * Registers the web component with customElements registry.
 */
export function defineChangelogModal(tagName = "changelog-modal"): void {
  if (typeof window !== "undefined" && "customElements" in window) {
    if (!customElements.get(tagName)) {
      customElements.define(tagName, ChangelogModalElement);
    }
  }
}

// Auto-register in browser environment
if (typeof window !== "undefined") {
  defineChangelogModal();
}
