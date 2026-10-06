import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { ChangelogModalElement, defineChangelogModal } from "../src/element";

describe("<changelog-modal> Web Component", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    defineChangelogModal();
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("renders trigger link with version attribute", () => {
    const el = document.createElement("changelog-modal") as ChangelogModalElement;
    el.setAttribute("version", "2.52.0");
    document.body.appendChild(el);

    const link = el.querySelector("a");
    expect(link).not.toBeNull();
    expect(link?.textContent).toContain("Version 2.52.0");
  });

  it("reads and parses markdown from child <template>", async () => {
    const el = document.createElement("changelog-modal") as ChangelogModalElement;
    el.setAttribute("version", "3.0.0");
    el.innerHTML = `
      <template>
        # Changelog
        <!-- Internal comment -->
        ## [3.0.0] - 2026-10-06
        - Brand new feature
      </template>
    `;
    document.body.appendChild(el);

    const modalContent = document.getElementById("changelog-content");
    expect(modalContent).not.toBeNull();
    expect(modalContent?.innerHTML).toContain("3.0.0");
    expect(modalContent?.innerHTML).toContain("Brand new feature");
    expect(modalContent?.innerHTML).not.toContain("Internal comment");
  });

  it("opens modal when trigger link is clicked", () => {
    const el = document.createElement("changelog-modal") as ChangelogModalElement;
    el.setAttribute("mode", "standalone");
    document.body.appendChild(el);

    const modalEl = document.getElementById("changelogModal");
    expect(modalEl?.classList.contains("cme-open")).toBe(false);

    const link = el.querySelector("a") as HTMLAnchorElement;
    link.click();

    expect(modalEl?.classList.contains("cme-open")).toBe(true);
  });
});
