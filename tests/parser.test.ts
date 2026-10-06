import { describe, it, expect } from "vitest";
import { cleanMarkdown, parseMarkdown } from "../src/parser";

describe("ChangelogParser - cleanMarkdown", () => {
  it("strips HTML comments <!-- ... -->", () => {
    const md = "# Changelog\n\n<!-- Some internal comment -->\n\n## [1.0.0] - 2026-01-01\n- Added feature";
    const cleaned = cleanMarkdown(md);
    expect(cleaned).not.toContain("<!-- Some internal comment -->");
    expect(cleaned).toContain("# Changelog");
    expect(cleaned).toContain("## [1.0.0]");
  });

  it("strips AI Agent instructions and Mandatory Protocols", () => {
    const md = [
      "# Changelog",
      "",
      "<!--",
      "🤖 AI AGENT INSTRUCTIONS:",
      "Do not modify in place!",
      "-->",
      "",
      "> ### 🤖 Mandatory Protocol for Autonomous Coding Agents (Gemini 3.8 Flash+, Claude, ChatGPT, Kimi, etc.)",
      ">",
      "> **Dual-Track Changelog Format Standard (Enforced from Release 2.41.0 Onwards):**",
      "> 1. Plan Snapshot",
      "> 2. Changelist",
      "",
      "## [2.52.0] - 2026-10-06",
      "### Added",
      "- Bulk upload capability"
    ].join("\n");

    const cleaned = cleanMarkdown(md);
    expect(cleaned).not.toContain("AI AGENT INSTRUCTIONS");
    expect(cleaned).not.toContain("Mandatory Protocol for Autonomous Coding Agents");
    expect(cleaned).not.toContain("Dual-Track Changelog Format Standard");
    expect(cleaned).toContain("# Changelog");
    expect(cleaned).toContain("## [2.52.0]");
    expect(cleaned).toContain("Bulk upload capability");
  });

  it("strips empty [Unreleased] placeholder heading", () => {
    const md = "# Changelog\n\n## [Unreleased]\n\n## [1.0.0] - 2026-01-01\n- Initial release";
    const cleaned = cleanMarkdown(md);
    expect(cleaned).not.toContain("## [Unreleased]");
    expect(cleaned).toContain("## [1.0.0]");
  });

  it("normalizes excessive blank lines", () => {
    const md = "# Changelog\n\n\n\n\n## [1.0.0]\n- Note";
    const cleaned = cleanMarkdown(md);
    expect(cleaned).toBe("# Changelog\n\n## [1.0.0]\n- Note");
  });

  it("applies custom cleaner rules when passed", () => {
    const md = "# Changelog\n\nSecret Internal Note: Confidential\n\n## [1.0.0]";
    const cleaned = cleanMarkdown(md, {
      customCleaners: [{ pattern: /Secret Internal Note: Confidential/g, replacement: "" }],
    });
    expect(cleaned).not.toContain("Secret Internal Note");
  });
});

describe("ChangelogParser - parseMarkdown", () => {
  it("converts cleaned markdown to html via marked", () => {
    const md = "# Changelog\n\n<!-- Secret -->\n\n## [1.0.0] - 2026-01-01\n* Item 1";
    const html = parseMarkdown(md) as string;
    expect(html).toContain("<h1");
    expect(html).toContain("Changelog");
    expect(html).toContain("<h2");
    expect(html).toContain("1.0.0");
    expect(html).toContain("<li>Item 1</li>");
    expect(html).not.toContain("Secret");
  });

  it("supports customParser callback", () => {
    const md = "## [1.0.0]";
    const html = parseMarkdown(md, {
      customParser: (cleaned) => "<custom>" + cleaned + "</custom>",
    });
    expect(html).toBe("<custom>## [1.0.0]</custom>");
  });
});
