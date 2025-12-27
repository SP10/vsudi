import Base from "./core/Base.js";

class ScrollTop extends Base {
  init() {
    this.activeClass = "is-visible";
    this.showAfter = this.options.showAfter || 400;
    this.handleScroll = this.handleScroll.bind(this);
  }

  bindEvents() {
    window.addEventListener("scroll", this.handleScroll, { passive: true });

    this.element.addEventListener("click", (event) => {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    this.handleScroll();
  }

  destroy() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll() {
    if (window.pageYOffset > this.showAfter) {
      this.element.classList.add(this.activeClass);
    } else {
      this.element.classList.remove(this.activeClass);
    }
  }
}

export default ScrollTop;
