import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { createOrGetModal, openModal, closeModal } from "../src/modal";

describe("Modal Engine", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("creates a standalone modal when mode=standalone", () => {
    const modal = createOrGetModal({
      modalId: "testModal",
      title: "Release Notes",
      mode: "standalone",
    });

    expect(modal.isBootstrap).toBe(false);
    expect(document.getElementById("testModal")).not.toBeNull();
    expect(modal.container.className).toContain("cme-modal-overlay");
    expect(modal.container.innerHTML).toContain("Release Notes");
  });

  it("creates a Bootstrap modal when mode=bootstrap", () => {
    const modal = createOrGetModal({
      modalId: "bsModal",
      title: "Bootstrap Changelog",
      mode: "bootstrap",
    });

    expect(modal.isBootstrap).toBe(true);
    expect(modal.container.className).toContain("modal fade");
    expect(modal.container.innerHTML).toContain("modal-dialog modal-lg");
    expect(modal.container.innerHTML).toContain("Bootstrap Changelog");
  });

  it("opens and closes standalone modal toggling cme-open class", () => {
    const modal = createOrGetModal({
      modalId: "standaloneModal",
      mode: "standalone",
    });

    modal.open();
    expect(modal.container.classList.contains("cme-open")).toBe(true);
    expect(document.body.style.overflow).toBe("hidden");

    modal.close();
    expect(modal.container.classList.contains("cme-open")).toBe(false);
    expect(document.body.style.overflow).toBe("");
  });

  it("closes standalone modal when close button is clicked", () => {
    const modal = createOrGetModal({
      modalId: "autoCloseModal",
      mode: "standalone",
    });

    modal.open();
    expect(modal.container.classList.contains("cme-open")).toBe(true);

    const closeBtn = modal.container.querySelector(".cme-close-button") as HTMLButtonElement;
    closeBtn.click();
    expect(modal.container.classList.contains("cme-open")).toBe(false);
  });
});
