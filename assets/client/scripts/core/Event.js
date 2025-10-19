class CustomEventEmitter {
    constructor() {
        this.events = {};
    }

    /**
     * Generate unique event ID
     * @param {number} length Length of the random string to be generated
     * @returns {string} Event ID
     */
    #generateEventID(length = 8) {
        if (typeof length !== 'number' || length <= 0) {
            throw new Error('Length must be a positive integer');
        }

        const charset = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let result = 'event_';
        for (var i = 0; i < length; i += 1) {
            result += charset.charAt(Math.floor(Math.random() * length));
        }

        return result;
    }

    #removeEvent(eventName, target) {
        const { eventId } = target;

        const event = this.events[eventId][eventName];
        if (event && event.target) {
            event.target.removeEventListener(eventName, event.fn, event.options);
        }
    }

    #registerListener(eventName, target, fn, options) {
        // Ensure the target is HTML element
        if (!(target instanceof HTMLElement)) {
            throw new Error(`The event '${eventName}' can not be registered to the element ${target}, it is not DOM node`);
        }

        let eventId = this.#generateEventID();
        // eslint-disable-next-line no-param-reassign
        target.eventId = eventId;

        if (!this.events[eventId]) {
            this.events[eventId] = {};
        }

        this.events[eventId][eventName] = { target, fn, options };

        target.addEventListener(eventName, fn, options);
    }

    #removeListener(eventName, target, fn, options) {
        const { eventId } = target;

        if (!this.events[eventId]) {
            throw new Error(`The event '${eventName}' can not be removed, cause that has not been attached to element: ${target}`);
        }

        this.#removeEvent(eventName, target, fn, options);
    }

    on(eventName, target, fn, options = {}) {
        if (!eventName) {
            throw new Error('The event name is required.');
        }

        if (!target) {
            return;
        }

        if (typeof fn !== 'function') {
            throw new Error(`Handler function is required for ${eventName}.`);
        }

        this.#registerListener(eventName, target, fn, options);
    }

    off(eventName, target, fn, options) {
        this.#removeListener(eventName, target, fn, options);
    }

    emit(eventName, element, options = {}) {
        let eventOptions = {
            bubbles: options.bubbles || false,
            cancelable: options.cancelable || false,
            composed: options.composed || false,
            detail: options
        };

        const event = new CustomEvent(eventName, eventOptions);
        element.dispatchEvent(event);
    }
}

export const Event = new CustomEventEmitter();

