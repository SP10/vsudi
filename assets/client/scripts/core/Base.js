import { deepMerge } from './utilities/deepMerge.js';

export default class Base {
    constructor(element, options = {}) {
        this.element = element;
        this.options = deepMerge({}, options);
        this.state = {};
        this.cache = {};

        this.#init();
        this.initCache();
        this.initStates();
        this.bindEvents();
        this.afterInit();
        this.setupDestroy();
    }

    /**
     * Init component options
     */
    #init() {
        this.#loadComponentOptions();
        this.init();
    }

    /**
     * Init
     */
    init() {
        // Method can be overloaded
    }

    /**
     * After init
     * Run any script after the component is fully initialized
     */
    afterInit() {
        // Method can be overloaded
    }

    /**
     * Init component caches
     */
    initCache() {
        // Method can be overloaded
    }

    /**
     * Init component states
     */
    initStates() {
        // Method can be overloaded
    }

    /**
     * Bind the events
     */
    bindEvents() {
        // Method can be overloaded
    }

    /**
     * Destroy method, called when a component is removed from DOM
     */
    destroy() {
        // Method can be overloaded
    }

    /**
     * Destroy method (private)
     */
    #destroy() {
        this.destroy();
    }

    /**
    * Return the component name
    * @returns {string} component name
    */
    getComponentName() {
        return this.constructor.name || this.constructor.toString().split('(')[0].replace(/function\s*/, '');
    }

    /**
    * Return the component ID
    * @returns {string} component id
    */
    getComponentID() {
        return this.element.getAttribute('data-component-id');
    }

    /**
    * Returns component options data, depending on the target element
    *
    * @param {HTMLElement} target HTML element to use as a source of component options data
    * @return {Object|null} options data
    */
    #getComponentOptionsAttributeData(target) {
        const options = target && target.getAttribute('data-component-options');
        let data;

        if (options) {
            try {
                data = JSON.parse(options);
            } catch (e) {
                console.error(`Please check that the data-component-options you have passed for "${target}" respect JSON format`);
            }
        }

        return data || null;
    }

    /**
     * Load the options of the component
     */
    #loadComponentOptions() {
        const options = this.#getComponentOptionsAttributeData(this.element);
        if (options) {
            this.options = deepMerge(this.options, options);
        }
    }

    /**
    * Setup destroy observer
    */
    setupDestroy() {
        const observer = new MutationObserver((mutationsList, observer) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    for(const removedNode of mutation.removedNodes) {
                        if (removedNode === this.element) {
                            this.#destroy();
                            observer.disconnect(); // Disconnect observer after the element is removed
                            break;
                        }
                    }
                }
            }
        });

        // Observe changes in the parent of the component element
        observer.observe(this.element.parentNode, {
            childList: true, // Watch for added or removed child nodes
            subtree: false, // Only check direct children, not the whole tree
        });
    }
}
