class Overlay {
    /**
     * @param {HTMLElement} el Overlay element
     * @param {Object} opts
     * @param {string} [opts.activeClass='m-show']
     * @param {boolean} [opts.closeOnEsc=true]
     * @param {boolean} [opts.closeOnOverlay=true]
     * @param {boolean} [opts.lockScroll=true]
     */
    constructor(el, opts = {}) {
      if (!el) throw new Error('Overlay: element is required');
      this.el = el;
      this.opts = Object.assign({ activeClass: 'm-show', closeOnEsc: true, closeOnOverlay: true, lockScroll: true },
        opts
      );
      this.isOpen = false;
  
      this._onKeydown = this._onKeydown.bind(this);
      this._onClick = this._onClick.bind(this);
  
      this.el.setAttribute('aria-hidden', 'true');
    }
  
    open() {
      if (this.isOpen) return;
  
      const before = new CustomEvent('overlay:beforeShow', { cancelable: true });
      if (!this.el.dispatchEvent(before)) return;
  
      this.el.classList.add(this.opts.activeClass);
      this.el.setAttribute('aria-hidden', 'false');
      if (this.opts.lockScroll) document.documentElement.classList.add('is-locked');
  
      document.addEventListener('keydown', this._onKeydown);
      this.el.addEventListener('click', this._onClick);
  
      this.isOpen = true;
      this.el.dispatchEvent(new CustomEvent('overlay:show'));
    }
  
    close(reason = 'api') {
      if (!this.isOpen) return;
  
      const before = new CustomEvent('overlay:beforeHide', {
        cancelable: true,
        detail: { reason }
      });
      if (!this.el.dispatchEvent(before)) return;
  
      this.el.classList.remove(this.opts.activeClass);
      this.el.setAttribute('aria-hidden', 'true');
      if (this.opts.lockScroll) document.documentElement.classList.remove('is-locked');
  
      document.removeEventListener('keydown', this._onKeydown);
      this.el.removeEventListener('click', this._onClick);
  
      this.isOpen = false;
      this.el.dispatchEvent(new CustomEvent('overlay:hide', { detail: { reason } }));
    }
  
    toggle() {
      this.isOpen ? this.close('toggle') : this.open();
    }
  
    _onKeydown(e) {
      if (e.key === 'Escape' && this.opts.closeOnEsc) this.close('esc');
    }
  
    _onClick(e) {
      if (this.opts.closeOnOverlay && e.target === this.el) {
        this.close('overlay');
        return;
      }

      const closer = e.target.closest('[data-overlay-close]');
      if (closer) this.close('button');
    }
  }

  export default Overlay;
  
  
  