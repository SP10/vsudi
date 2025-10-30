import Base from "./core/Base.js";
import BurgerButton from "./BurgerButton.js";
import CloseMenuButton from "./CloseMenuButton.js";
import CascadeMenu from "./CascadeMenu.js";
import { Event } from "./core/Event.js";

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
    this.cache.searchModal = this.element.querySelector("[data-component='Modal'][name='SearchForm']");
    this.cache.cascadMenu = this.element.querySelectorAll("[data-cascad-menu]");
  }

  initStates() {
    this.burgerButton = new BurgerButton(this.cache.burgerButton);
    if (this.cache.closeMenuButton && this.cache.closeMenuButton.length) {
      this.cache.closeMenuButton.forEach((btn) =>
        new CloseMenuButton(btn)
      );
    }

    this.cache.cascadMenu.forEach((menu => {
      new CascadeMenu(menu);
    }));
  }

  bindEvents() {
    Event.on('modal:beforeClose', this.cache.searchModal, (e) => {
      console.log('closed search modal', e);
    });
  }

}

export default Header;
