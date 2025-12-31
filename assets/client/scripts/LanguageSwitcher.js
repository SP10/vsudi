import Base from "./core/Base.js";

export default class LanguageSwitcher extends Base {
    constructor(element, options = {}) {
        super(element, options);
    }

    initCache() {
        this.cache.activeLink = this.element.querySelector('.m-active');
        this.cache.toggle = this.element.querySelector('.js-language-toggle');
        this.cache.toggleText = this.element.querySelector('.header__language-toggle-text');
        this.cache.menu = this.element.querySelector('.js-language-menu');
        this.cache.links = this.element.querySelectorAll('.js-language-link');
    }

    initStates() {
        if (this.cache.activeLink && this.cache.toggleText) {
            this.cache.toggleText.textContent = this.cache.activeLink.textContent.trim();
        }

        if (this.cache.toggle) {
            this.cache.toggle.setAttribute('aria-expanded', 'false');
        }

        if (this.cache.activeLink) {
            this.cache.activeLink.classList.add('m-hidden');
        }
    }

    bindEvents() {
        if (this.cache.toggle && this.cache.menu) {
            this.cache.toggle.addEventListener('click', () => {
                const isOpen = this.cache.menu.classList.toggle('m-shown');
                this.cache.toggle.setAttribute('aria-expanded', String(isOpen));
                this.cache.toggle.classList.toggle('m-open', isOpen);
            });
        }

        if (this.cache.links && this.cache.menu && this.cache.toggle) {
            this.cache.links.forEach((element) => {
                element.addEventListener('click', () => {
                    this.cache.menu.classList.remove('m-shown');
                    this.cache.toggle.setAttribute('aria-expanded', 'false');
                    this.cache.toggle.classList.remove('m-open');
                });
            });
        }

        document.addEventListener('click', (event) => {
            if (!this.element.contains(event.target) && this.cache.menu && this.cache.toggle) {
                this.cache.menu.classList.remove('m-shown');
                this.cache.toggle.setAttribute('aria-expanded', 'false');
                this.cache.toggle.classList.remove('m-open');
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key !== 'Escape' || !this.cache.menu || !this.cache.toggle) {
                return;
            }

            if (this.cache.menu.classList.contains('m-shown')) {
                this.cache.menu.classList.remove('m-shown');
                this.cache.toggle.setAttribute('aria-expanded', 'false');
                this.cache.toggle.classList.remove('m-open');
                this.cache.toggle.focus();
            }
        });
    }
}
