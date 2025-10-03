class Modal {
    /**
     * @param {HTMLElement} el - контейнер .modal з data-component="Modal"
     * @param {Object} opts
     * @param {string} [opts.activeClass='is-open']
     * @param {boolean} [opts.closeOnEsc=true]
     * @param {boolean} [opts.closeOnOverlay=true]
     * @param {boolean} [opts.lockScroll=true]
     * @param {boolean} [opts.trapFocus=true]
     * @param {boolean} [opts.returnFocus=true]
     * @param {string}  [opts.autofocus='[data-autofocus], [autofocus]']
     */
    constructor(el, opts = {}) {
      if (!el) throw new Error('Modal: element is required');
  
      this.el = el;
      this.wrapper = el.querySelector('.modal-wrapper') || el.firstElementChild || el;
      this.opts = Object.assign({
        activeClass: 'm-open',
        closeOnEsc: true,
        closeOnOverlay: true,
        lockScroll: true,
        trapFocus: true,
        returnFocus: true,
        autofocus: '[data-autofocus], [autofocus]'
      }, opts);
  
      this.isOpen = false;
      this._trigger = null;
  
      // A11y атрибути
      this.el.setAttribute('role', 'dialog');
      this.el.setAttribute('aria-modal', 'true');
      this.el.setAttribute('aria-hidden', 'true');
  
      const title = this.el.querySelector('.modal-header__title');
      if (title) {
        if (!title.id) title.id = `modal-title-${Math.random().toString(36).slice(2, 8)}`;
        this.el.setAttribute('aria-labelledby', title.id);
      }
  
      // бинди
      this._onKeydown = this._onKeydown.bind(this);
      this._onFocusIn = this._onFocusIn.bind(this);
      this._onOverlayClick = this._onOverlayClick.bind(this);
      this._onClick = this._onClick.bind(this);
  
      // Делегований клік для кнопок закриття всередині модалки
      this.el.addEventListener('click', this._onClick);
    }
  
    open(triggerEl = document.activeElement) {
      if (this.isOpen) return;
  
      const before = new CustomEvent('modal:beforeOpen', { cancelable: true });
      if (!this.el.dispatchEvent(before)) return;
  
      this.isOpen = true;
      this._trigger = triggerEl && triggerEl instanceof HTMLElement ? triggerEl : null;
  
      this.el.classList.add(this.opts.activeClass);
      this.el.setAttribute('aria-hidden', 'false');
  
      if (this.opts.lockScroll) document.documentElement.classList.add('is-locked');
  
      document.addEventListener('keydown', this._onKeydown);
      document.addEventListener('focusin', this._onFocusIn);
      this.el.addEventListener('mousedown', this._onOverlayClick);
  
      this._focusFirst();
  
      this.el.dispatchEvent(new CustomEvent('modal:open'));
    }
  
    close(reason = 'api') {
      if (!this.isOpen) return;
  
      const before = new CustomEvent('modal:beforeClose', { cancelable: true, detail: { reason } });
      if (!this.el.dispatchEvent(before)) return;
  
      this.isOpen = false;
  
      this.el.classList.remove(this.opts.activeClass);
      this.el.setAttribute('aria-hidden', 'true');
  
      if (this.opts.lockScroll) document.documentElement.classList.remove('is-locked');
  
      document.removeEventListener('keydown', this._onKeydown);
      document.removeEventListener('focusin', this._onFocusIn);
      this.el.removeEventListener('mousedown', this._onOverlayClick);
  
      // Відновити фокус на тригері
      if (this.opts.returnFocus && this._trigger && document.contains(this._trigger)) {
        this._trigger.focus();
      }
  
      this.el.dispatchEvent(new CustomEvent('modal:close', { detail: { reason } }));
    }
  
    toggle(triggerEl) {
      this.isOpen ? this.close('toggle') : this.open(triggerEl);
    }
  
    destroy() {
      this.close('destroy');
      this.el.removeEventListener('click', this._onClick);
    }
  
    // ===== приватні =====
    _onKeydown(e) {
      if (e.key === 'Escape' && this.opts.closeOnEsc) {
        e.stopPropagation();
        this.close('esc');
        return;
      }
      if (this.opts.trapFocus && e.key === 'Tab') {
        this._handleTabTrap(e);
      }
    }
  
    _onFocusIn(e) {
      if (!this.opts.trapFocus || !this.isOpen) return;
      if (!this.el.contains(e.target)) {
        // якщо фокус вискочив за межі модалки — повертаємо
        this._focusFirst();
      }
    }
  
    _onOverlayClick(e) {
      if (!this.opts.closeOnOverlay || !this.isOpen) return;
      // клік поза .modal-wrapper
      if (!this.wrapper.contains(e.target)) this.close('overlay');
    }
  
    _onClick(e) {
      const closeBtn = e.target.closest('[data-component="CloseButton"], [data-modal-close]');
      if (closeBtn) {
        e.preventDefault();
        this.close('button');
      }
    }
  
    _focusables() {
      const sel = [
        'a[href]',
        'button:not([disabled])',
        'input:not([disabled]):not([type="hidden"])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
        'audio[controls]',
        'video[controls]'
      ].join(',');
      return Array.from(this.el.querySelectorAll(sel)).filter(el => el.offsetParent !== null || el === document.activeElement);
    }
  
    _focusFirst() {
      // 1) автофокус; 2) перший фокусабельний; 3) wrapper з tabindex
      const auto = this.el.querySelector(this.opts.autofocus);
      if (auto) { auto.focus(); return; }
  
      const list = this._focusables();
      if (list.length) { list[0].focus(); return; }
  
      if (!this.wrapper.hasAttribute('tabindex')) this.wrapper.setAttribute('tabindex', '-1');
      this.wrapper.focus();
    }
  
    _handleTabTrap(e) {
      const nodes = this._focusables();
      if (!nodes.length) return;
  
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement;
  
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    }
  
    // ===== статичні хелпери =====
    static initAll(selector = '[data-component="Modal"]', opts) {
      const instances = new Map();
      document.querySelectorAll(selector).forEach(el => {
        instances.set(el, new Modal(el, opts));
      });
      return instances;
    }
  }
  
  export default Modal;