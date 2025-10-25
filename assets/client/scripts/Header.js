import Base from "./core/Base.js";
import BurgerButton from "./BurgerButton.js";
import CloseMenuButton from "./CloseMenuButton.js";
import CascadeMenu from "./CascadeMenu.js";

class Header extends Base {
  constructor(element, options = {}) {
    super(element, options);

    this.burgerButton = null;
    this.classNames = {
      show: "m-show",
    };
  }

  initCache() {
    this.cache.overlay = this.element.querySelector(".js-header-overlay");
    this.cache.burgerButton = this.element.querySelector("[data-component='BurgerButton']");
    this.cache.closeMenuButton = this.element.querySelectorAll("[data-component='CloseMenuButton']");
    this.cache.menu = this.element.querySelector("#menu");
  }

  initStates() {
    this.burgerButton = new BurgerButton(this.cache.burgerButton);
    if (this.cache.closeMenuButton && this.cache.closeMenuButton.length) {
      this.cache.closeMenuButton.forEach((btn) =>
        new CloseMenuButton(btn)
      );
    }
    this.menu = new CascadeMenu(this.cache.menu);
  }

  bindEvents() { }

}

export default Header;
