class Header {
  selectors = {
    root: '[data-js-header]',
    overlay: '[data-js-header-overlay]',
    burgerButton: '[data-js-header-burger-button]',
    closeButton: '[data-js-header-close-button]',
    link: '.header__menu-link'
  };

  stateClasses = {
    isActive: 'active',
    isLock: 'is-lock',
  };

  constructor() {
    this.rootElement = document.querySelector(this.selectors.root);
    if (!this.rootElement) return;

    this.overlayElement = this.rootElement.querySelector(this.selectors.overlay);
    this.burgerButtonElement = this.rootElement.querySelector(this.selectors.burgerButton);
    this.closeButtonElement = this.rootElement.querySelector(this.selectors.closeButton);
    this.linkElement = this.rootElement.querySelectorAll(this.selectors.link);

    if (!this.overlayElement || !this.burgerButtonElement) return;

    this.bindEvents();
  }

  openMenu = () => {
    this.overlayElement.classList.add(this.stateClasses.isActive);
    document.documentElement.classList.add(this.stateClasses.isLock);
    // A11y
    this.burgerButtonElement.setAttribute('aria-expanded', 'true');
    this.burgerButtonElement.setAttribute('aria-label', 'Close menu');
    // Фокус на кнопку закриття
    if (this.closeButtonElement) this.closeButtonElement.focus();
  };

  closeMenu = () => {
    this.overlayElement.classList.remove(this.stateClasses.isActive);
    document.documentElement.classList.remove(this.stateClasses.isLock);
    // A11y
    this.burgerButtonElement.setAttribute('aria-expanded', 'false');
    this.burgerButtonElement.setAttribute('aria-label', 'Open menu');
    // Повертаємо фокус на бургер
    this.burgerButtonElement.focus();
  };

  toggleMenu = () => {
    const isOpen = this.overlayElement.classList.toggle(this.stateClasses.isActive);
    document.documentElement.classList.toggle(this.stateClasses.isLock, isOpen);
    this.burgerButtonElement.setAttribute('aria-expanded', String(isOpen));
    this.burgerButtonElement.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    if (isOpen) {
      if (this.closeButtonElement) this.closeButtonElement.focus();
    } else {
      this.burgerButtonElement.focus();
    }
  };

  onKeyDown = (e) => {
    if (e.key === 'Escape' && this.overlayElement.classList.contains(this.stateClasses.isActive)) {
      this.closeMenu();
    }
  };

  onOverlayClick = (e) => {
    // Закриваємо тільки якщо клікнули по «фоновій» області overlay (а не по навігації)
    if (e.target === this.overlayElement) {
      this.closeMenu();
    }
  };

  #resetLinkActiveState = () => {
    this.linkElement.forEach((link) => {
      link.classList.remove('active');
    });
  };

  bindEvents() {
    this.burgerButtonElement.addEventListener('click', this.toggleMenu);
    if (this.closeButtonElement) {
      this.closeButtonElement.addEventListener('click', this.closeMenu);
    }
    this.overlayElement.addEventListener('click', this.onOverlayClick);
    document.addEventListener('keydown', this.onKeyDown, { passive: true });
    this.linkElement.forEach((link) => {
      link.addEventListener('click', () => {
        if (link.classList.contains('active')) {
          link.classList.remove('active');

          if (link.classList.contains('dropdown__toggle')) {
            let dropdown = link.nextElementSibling;
            dropdown.classList.add('m-hide');

            let arrow = link.querySelector('.dropdown__arrow');
            arrow.classList.add('m-hide');
            arrow.classList.remove('m-active');
          } else {
            let dropdown = link.nextElementSibling;
            dropdown.classList.remove('m-hide');
          }
        } else {
          this.#resetLinkActiveState();
          link.classList.add('active');

          if (link.classList.contains('dropdown__toggle')) {
            let dropdown = link.nextElementSibling;
            dropdown.classList.remove('m-hide');

            let arrow = link.querySelector('.dropdown__arrow');
            arrow.classList.remove('m-hide');
            arrow.classList.add('m-active');
          } else {
            this.closeMenu();
          }
        }
      });
    });
  }
}

export default Header;
