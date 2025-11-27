import Base from "./core/Base.js";

export default class LanguageSwitcher extends Base {
    constructor(element, options = {}) {
        super(element, options);
    }

    bindEvents() {
        this.element.addEventListener('change', (event) => {
            const selectedOption = event.target.selectedOptions[0];
            const url = selectedOption.getAttribute('data-url');
            if (url) {
                window.location.href = url;
            }
        });
    }
}