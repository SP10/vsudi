const rootSelector = "[data-js-observer]";

class Observer {
  constructor(rootElement, opts = {}) {
    this.rootElement = rootElement;
    this.opts = Object.assign(
      {
        root: null, // Defaults to the viewport
        rootMargin: "0px",
        threshold: 0.5, // Trigger when 50% of the element is visible
      },
      opts
    );
    this.init();
  }

  init() {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target); // Stop observing once animated
        }
      });
    }, this.opts);

    observer.observe(this.rootElement);
  }
}

class ObserverCollection {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll(rootSelector).forEach((element) => {
      new Observer(element);
    });
  }
}

export default ObserverCollection;
