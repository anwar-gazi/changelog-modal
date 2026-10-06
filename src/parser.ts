import { marked } from "marked";

export interface CleanMarkdownOptions {
  /**
   * Whether to strip HTML comments <!-- ... -->
   * @default true
   */
  stripComments?: boolean;

  /**
   * Whether to strip AI agent instructions, protocols, and prompt preambles
   * @default true
   */
  stripAgentProtocol?: boolean;

  /**
   * Whether to strip empty unreleased section headers e.g. ## [Unreleased]
   * @default true
   */
  stripUnreleased?: boolean;

  /**
   * Normalize 3+ blank newlines to double newlines
   * @default true
   */
  normalizeNewlines?: boolean;

  /**
   * Custom cleaner functions or regex replacements
   */
  customCleaners?: Array<{ pattern: RegExp; replacement: string }>;
}

export interface ParseMarkdownOptions extends CleanMarkdownOptions {
  /**
   * Marked options override
   */
  markedOptions?: Parameters<typeof marked.parse>[1];

  /**
   * Custom parser function to override marked
   */
  customParser?: (markdown: string) => string | Promise<string>;
}

/**
 * Sanitizes raw changelog markdown by stripping out internal comments,
 * AI coding agent directives, unreleased placeholders, and excess spacing.
 */
export function cleanMarkdown(
  markdown: string,
  options: CleanMarkdownOptions = {}
): string {
  if (!markdown || typeof markdown !== "string") {
    return "";
  }

  const {
    stripComments = true,
    stripAgentProtocol = true,
    stripUnreleased = true,
    normalizeNewlines = true,
    customCleaners = [],
  } = options;

  let cleaned = markdown;

  // 1. Strip HTML comments <!-- ... -->
  if (stripComments) {
    cleaned = cleaned.replace(/<!--[\s\S]*?-->/g, "");
  }

  // 2. Strip Autonomous Coding Agent instructions and mandatory protocols
  if (stripAgentProtocol) {
    cleaned = cleaned.replace(
      /(?:>|\s)*(?:###?\s*)?🤖?\s*(?:AI AGENT INSTRUCTIONS|Mandatory Protocol for Autonomous Coding Agents)[\s\S]*?(?=\n##\s*\[|$)/gi,
      ""
    );
  }

  // 3. Strip empty [Unreleased] placeholder heading before first released tag
  if (stripUnreleased) {
    cleaned = cleaned.replace(/## \[Unreleased\]\s+(?=## \[)/, "");
  }

  // 4. Run any caller-supplied custom cleaners
  for (const cleaner of customCleaners) {
    cleaned = cleaned.replace(cleaner.pattern, cleaner.replacement);
  }

  // 5. Normalize whitespace / blank lines
  if (normalizeNewlines) {
    cleaned = cleaned.replace(/\n{3,}/g, "\n\n");
  }

  return cleaned.trim();
}

/**
 * Sanitizes and renders changelog markdown into clean HTML.
 */
export function parseMarkdown(
  markdown: string,
  options: ParseMarkdownOptions = {}
): string | Promise<string> {
  const cleaned = cleanMarkdown(markdown, options);

  if (options.customParser) {
    return options.customParser(cleaned);
  }

  return marked.parse(cleaned, {
    gfm: true,
    breaks: false,
    ...options.markedOptions,
  });
}
