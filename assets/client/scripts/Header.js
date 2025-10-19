import BurgerButton from "./BurgerButton.js";
import CloseMenuButton from "./CloseMenuButton.js";
import Base from "./core/Base.js";

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
    this.cache.closeMenuButton = this.element.querySelector("[data-component='CloseMenuButton']");
  }

  initStates() {
    this.burgerButton = new BurgerButton(this.cache.burgerButton);
    this.closeMenuButton = new CloseMenuButton(this.cache.closeMenuButton);
  }

  bindEvents() {}
   
}

export default Header;
