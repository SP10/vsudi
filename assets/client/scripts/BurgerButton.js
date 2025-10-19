import Base from './core/Base.js';
import { Event } from './core/Event.js';
import { deepMerge } from './core/utilities/deepMerge.js';

class BurgerButton extends Base {
    constructor(element, options = {}) {
        super(element, deepMerge({}, options));

        this.isOpen = false;
    }

    initCache() {
        this.cache.target = document.querySelector(this.element.getAttribute('data-target'));
    }

    bindEvents() {
        Event.on('click', this.element, (e) => this.toggleMenu(e));
    }

    toggleMenu(e) {
        e.preventDefault();
        if (this.cache.target) {
            this.isOpen = !this.isOpen;
            this.cache.target.classList.add('m-active');
            document.documentElement.classList.add('is-lock');
        }
    }
}

export default BurgerButton;
