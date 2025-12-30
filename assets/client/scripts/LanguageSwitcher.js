import Base from "./core/Base.js";

export default class LanguageSwitcher extends Base {
    constructor(element, options = {}) {
        super(element, options);
    }

    initCache() {
        this.cache.activeLink = this.element.querySelector('.js-active');
        this.cache.linkPopup = this.element.querySelector('.js-language-link-popup');
        this.cache.links = this.element.querySelectorAll('.js-language-link');
    }

    bindEvents() {
        if (this.cache.links) {
            this.cache.links.forEach((element) => {
                element.addEventListener('click', (event) => {
                    if (event.target.classList.contains('m-active')) {
                        event.preventDefault();
                        this.cache.linkPopup.classList.toggle('m-shown');
                    }
                });
            })
        }
    }
}
