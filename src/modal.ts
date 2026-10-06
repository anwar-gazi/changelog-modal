export interface ModalOptions {
  modalId?: string;
  title?: string;
  mode?: "auto" | "bootstrap" | "standalone";
  theme?: "auto" | "light" | "dark";
}

/**
 * Checks whether Bootstrap or jQuery modal plugin is active on the host page.
 */
export function hasBootstrap(): boolean {
  if (typeof window === "undefined") return false;
  const w = window as any;
  if (typeof w.bootstrap !== "undefined" && typeof w.bootstrap.Modal === "function") {
    return true;
  }
  if (typeof w.$ !== "undefined" && typeof w.$.fn !== "undefined" && typeof w.$.fn.modal === "function") {
    return true;
  }
  if (typeof w.jQuery !== "undefined" && typeof w.jQuery.fn !== "undefined" && typeof w.jQuery.fn.modal === "function") {
    return true;
  }
  return false;
}

/**
 * Creates or retrieves the modal container element.
 */
export function createOrGetModal(options: ModalOptions = {}): {
  container: HTMLElement;
  content: HTMLElement;
  isBootstrap: boolean;
  open: () => void;
  close: () => void;
} {
  const modalId = options.modalId || "changelogModal";
  const title = options.title || "System Changelog";
  const mode = options.mode || "auto";
  const isBootstrap = mode === "bootstrap" ? true : mode === "standalone" ? false : hasBootstrap();

  let existing = document.getElementById(modalId);
  if (existing) {
    const content = existing.querySelector("#changelog-content") as HTMLElement || existing;
    return {
      container: existing,
      content,
      isBootstrap,
      open: () => openModal(existing!, isBootstrap),
      close: () => closeModal(existing!, isBootstrap),
    };
  }

  if (isBootstrap) {
    // Bootstrap Modal (3, 4, 5 compatible)
    const container = document.createElement("div");
    container.className = "modal fade";
    container.id = modalId;
    container.tabIndex = -1;
    container.setAttribute("role", "dialog");
    container.setAttribute("aria-labelledby", modalId + "Label");
    container.innerHTML = `
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content" style="text-align: left;">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" data-bs-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
            <h4 class="modal-title" id="${modalId}Label">
              <i class="fa fa-history"></i> ${title}
            </h4>
          </div>
          <div class="modal-body" id="changelog-content" style="max-height: 65vh; overflow-y: auto; color: #333;">
            Loading changelog...
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(container);
    const content = container.querySelector("#changelog-content") as HTMLElement;
    return {
      container,
      content,
      isBootstrap: true,
      open: () => openModal(container, true),
      close: () => closeModal(container, true),
    };
  } else {
    // Standalone Accessible Modal
    const container = document.createElement("div");
    container.className = "cme-modal-overlay";
    container.id = modalId;
    container.setAttribute("role", "dialog");
    container.setAttribute("aria-modal", "true");
    container.setAttribute("aria-labelledby", modalId + "Label");

    if (options.theme === "dark") {
      container.classList.add("cme-dark");
    }

    container.innerHTML = `
      <div class="cme-modal-dialog">
        <div class="cme-modal-header">
          <h3 class="cme-modal-title" id="${modalId}Label">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            ${title}
          </h3>
          <button type="button" class="cme-close-button" aria-label="Close dialog">&times;</button>
        </div>
        <div class="cme-modal-body" id="changelog-content">
          Loading changelog...
        </div>
        <div class="cme-modal-footer">
          <button type="button" class="cme-btn cme-close-btn">Close</button>
        </div>
      </div>
    `;

    // Event listeners for close
    const handleClose = () => closeModal(container, false);
    container.querySelectorAll(".cme-close-button, .cme-close-btn").forEach((btn) => {
      btn.addEventListener("click", handleClose);
    });

    container.addEventListener("click", (e) => {
      if (e.target === container) {
        handleClose();
      }
    });

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && container.classList.contains("cme-open")) {
        handleClose();
      }
    };
    document.addEventListener("keydown", handleKeydown);

    document.body.appendChild(container);
    const content = container.querySelector("#changelog-content") as HTMLElement;

    return {
      container,
      content,
      isBootstrap: false,
      open: () => openModal(container, false),
      close: () => closeModal(container, false),
    };
  }
}

/**
 * Opens the specified modal element according to its engine type.
 */
export function openModal(modalEl: HTMLElement, isBootstrap: boolean): void {
  if (isBootstrap) {
    const w = window as any;
    if (typeof w.bootstrap !== "undefined" && typeof w.bootstrap.Modal === "function") {
      const bsModal = w.bootstrap.Modal.getOrCreateInstance(modalEl);
      bsModal.show();
      return;
    }
    const $ = w.$ || w.jQuery;
    if (typeof $ !== "undefined" && typeof $.fn.modal === "function") {
      $(modalEl).modal("show");
      return;
    }
  }

  // Fallback / Standalone mode
  modalEl.classList.add("cme-open");
  document.body.style.overflow = "hidden";
}

/**
 * Closes the specified modal element according to its engine type.
 */
export function closeModal(modalEl: HTMLElement, isBootstrap: boolean): void {
  if (isBootstrap) {
    const w = window as any;
    if (typeof w.bootstrap !== "undefined" && typeof w.bootstrap.Modal === "function") {
      const bsModal = w.bootstrap.Modal.getInstance(modalEl);
      if (bsModal) bsModal.hide();
      return;
    }
    const $ = w.$ || w.jQuery;
    if (typeof $ !== "undefined" && typeof $.fn.modal === "function") {
      $(modalEl).modal("hide");
      return;
    }
  }

  // Fallback / Standalone mode
  modalEl.classList.remove("cme-open");
  document.body.style.overflow = "";
}
