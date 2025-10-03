class QuickFilter {
    constructor(element) {
      this.element = element;
      this.selector = {
        linkClass: '.c-quick-filters__link',
        activeClass: 'm-active'
      };
      this.cache = {};

      this.scrollContainer =
        this.element.querySelector('.c-quick-filters__list') || this.element;
  
      this.init();
      this.ensureInitialActiveVisible();
    }
  
    init() {
      this.cache.links = this.element.querySelectorAll(this.selector.linkClass);
      this.cache.links.forEach(link => {
        link.addEventListener('click', e => {
          e.preventDefault();
          this.setActive(link);
  
          const id = link.dataset.id;
          const event = new CustomEvent('filter:change', {
            detail: { id }
          });
          this.element.dispatchEvent(event);
        });
      });
    }
  
    setActive(activeLink) {
      this.cache.links.forEach(link =>
        link.classList.toggle(this.selector.activeClass, link === activeLink)
      );
      this.scrollActiveIntoView(activeLink);
    }
  
    activateById(id) {
      const match = [...this.cache.links].find(link => link.dataset.id === id);
      if (match) this.setActive(match);
    }
  
    scrollToId(id) {
      const match = [...this.cache.links].find(link => link.dataset.id === id);
      if (match) this.scrollActiveIntoView(match);
    }
  
    ensureInitialActiveVisible() {
      const active = this.element.querySelector(
        `${this.selector.linkClass}.${this.selector.activeClass}`
      );
      if (active) this.scrollActiveIntoView(active);
    }
  
    scrollActiveIntoView(link) {
      if (!this.scrollContainer || !link) return;
  
      const c = this.scrollContainer;
      const cRect = c.getBoundingClientRect();
      const lRect = link.getBoundingClientRect();
      const margin = 12;
  
      if (lRect.left >= cRect.left + margin && lRect.right <= cRect.right - margin) {
        return;
      }
  
      const relLeft = lRect.left - cRect.left + c.scrollLeft;
      const target =
        relLeft - (c.clientWidth - lRect.width) / 2;
  
      const clamped = Math.max(0, Math.min(target, c.scrollWidth - c.clientWidth));
      c.scrollTo({ left: clamped, behavior: 'smooth' });
    }
  }
  
  export default QuickFilter;
  