class Modal {
  constructor(modal, important = false) {
    this.close = (event) => {
      if (event) {
        event.preventDefault();
      }
      this.modal.classList.add("modal-hiding");
      const modal = this.modal;
      const listenerFunc = function() {
        modal.classList.remove("modal-shown");
        modal.classList.remove("modal-hiding");
        modal.removeEventListener(window.animationEvent, listenerFunc);
      };
      this.modal.addEventListener(window.animationEvent, listenerFunc, false);
    };
    this.show = () => {
      this.modal.classList.add("modal-shown");
    };
    this.toggle = () => {
      if (this.modal.classList.contains("modal-shown")) {
        this.close();
      } else {
        this.show();
      }
    };
    this.modal = modal;
    const closeButton = this.modal.querySelector("span.modal-close");
    if (closeButton !== null) {
      this.closeButton = closeButton;
      this.closeButton.onclick = this.close;
    }
    if (!important) {
      window.addEventListener("click", (event) => {
        if (event.target == this.modal) {
          this.close();
        }
      });
    }
  }
}
//# sourceMappingURL=modal.js.map
