import Base from './core/Base.js';
import { Event } from './core/Event.js';
import { deepMerge } from './core/utilities/deepMerge.js';

class CloseMenuButton extends Base {
    constructor(element, options = {}) {
        super(element, deepMerge({}, options));

        this.isClose = false;
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
            this.isClose = !this.isClose;
            this.cache.target.classList.remove('m-active');
            document.documentElement.classList.remove('is-lock');
        }
    }
}

export default CloseMenuButton;
