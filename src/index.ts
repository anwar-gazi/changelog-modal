export { cleanMarkdown, parseMarkdown } from "./parser";
export type { CleanMarkdownOptions, ParseMarkdownOptions } from "./parser";
export { createOrGetModal, openModal, closeModal, hasBootstrap } from "./modal";
export type { ModalOptions } from "./modal";
export { ChangelogModalElement, defineChangelogModal } from "./element";

import { ChangelogModalElement } from "./element";
export default ChangelogModalElement;
