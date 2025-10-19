// Usage:
// import { CascadeMenu } from './CascadeMenu';
// const menu = new CascadeMenu(document.querySelector('#menu'));
// Event.on('drilldown:change', menu.element, (e) => { /* analytics */ });

import { Base } from './core/Base';
import { Event } from './core/Event';
import { deepMerge } from './core/utilities/deepMerge';

export class CascadeMenu extends Base {
  constructor(element, options = {}) {
    super(element, deepMerge({
      selectors: {
        nav: '.c-drilldown',
        panel: '.c-drilldown__panel',
        item: '.c-drilldown__item',
        backWrap: '.c-drilldown__back-wrap'
      },
      labels: { back: 'Назад' },
      a11y: { roleMenu: true },
      hooks: {
        backMarkup: ({ label }) => `<button type="button" class="c-drilldown__back" aria-label="${label}">← ${label}</button>`,
        onHeightChange: null // (panelEl, height) => {}
      }
    }, options));
  }

  init() {
    this.cache.handlers = {};
    this.cache.bound = [];

    this.cache.nav = this.element.matches(this.options.selectors.nav)
      ? this.element
      : this.element.querySelector(this.options.selectors.nav) || this.element;

    this.cache.panels = Array.from(this.cache.nav.querySelectorAll(this.options.selectors.panel));
    this.state.stack = [];
    this.state.active = null;
  }

  bindEvents() {
    this.cache.panels.forEach((panel) => {
      if (this.options.a11y.roleMenu) panel.setAttribute('role', 'menu');
      panel.setAttribute('aria-hidden', panel.hidden ? 'true' : 'false');

      if (!panel.classList.contains('is-root')) {
        const backWrap = panel.querySelector(this.options.selectors.backWrap);
        const backEl = this.#toElement(this.options.hooks.backMarkup({ label: this.options.labels.back }));
        this.#listen('click', backEl, () => this.back());
        if (backWrap) backWrap.appendChild(backEl); else panel.insertAdjacentElement('afterbegin', this.#wrapInLi(backEl));
      }

      this.#listen('click', panel, (e) => this.#onClick(e));
      this.#listen('keydown', panel, (e) => this.#onKeydown(e));
    });
  }

  afterInit() {
    const root = this.cache.panels.find((p) => p.classList.contains('is-root')) || this.cache.panels[0];
    this.#activate(root, { push: false });
  }

  destroy() {
    this.cache.bound.forEach(({ name, target, fn, options }) => { try { Event.off(name, target, fn, options); } catch(_){} });
    this.cache.bound = [];
  }

  // Public API --------------------------------------
  open(target) {
    let panel = null;
    if (typeof target === 'string') panel = this.cache.nav.querySelector(target);
    else if (target instanceof HTMLElement && target.matches(this.options.selectors.panel)) panel = target;
    else if (target instanceof HTMLElement) {
      const ref = target.getAttribute('data-submenu');
      if (ref) panel = this.cache.nav.querySelector(ref);
    }
    if (!panel) return;
    this.#activate(panel, { push: true });
    Event.emit('drilldown:open', this.element, { panel });
  }

  back() {
    if (!this.state.stack.length) return;
    const prev = this.state.stack.pop();
    this.#activate(prev, { push: false });
    Event.emit('drilldown:back', this.element, { panel: prev });
  }

  getActivePanel() { return this.state.active; }

  // Private -----------------------------------------
  #onClick(e) {
    const item = e.target.closest(this.options.selectors.item);
    if (!item || !this.element.contains(item)) return;
    const ref = item.getAttribute('data-submenu');
    if (ref) { e.preventDefault(); const sub = this.cache.nav.querySelector(ref); if (sub) this.open(sub); }
  }

  #onKeydown(e) {
    const panel = e.currentTarget;
    const items = this.#focusables(panel);
    const idx = items.indexOf(document.activeElement);
    switch (e.key) {
      case 'ArrowDown': e.preventDefault(); this.#focusNext(items, idx); break;
      case 'ArrowUp':   e.preventDefault(); this.#focusPrev(items, idx); break;
      case 'Home':      e.preventDefault(); items[0]?.focus(); break;
      case 'End':       e.preventDefault(); items[items.length - 1]?.focus(); break;
      case 'ArrowRight':
      case 'Enter':
      case ' ': if (document.activeElement?.hasAttribute('data-submenu')) { e.preventDefault(); this.open(document.activeElement); } break;
      case 'ArrowLeft':
      case 'Escape': e.preventDefault(); this.back(); break;
    }
  }

  #focusables(panel) {
    const sel = `${this.options.selectors.item}, .c-drilldown__back`;
    return Array.from(panel.querySelectorAll(sel)).filter((el) => !el.closest('[hidden]'));
  }
  #focusNext(items, i) { (items[(i + 1 + items.length) % items.length] || items[0])?.focus(); }
  #focusPrev(items, i) { (items[(i - 1 + items.length) % items.length] || items[items.length - 1])?.focus(); }

  #activate(panel, { push }) {
    if (this.state.active === panel) return;

    if (push && this.state.active) this.state.stack.push(this.state.active);
    if (!push) this.state.stack = this.state.stack.filter((p) => p !== panel);

    if (this.state.active) {
      const prev = this.state.active;
      prev.hidden = true; prev.setAttribute('aria-hidden','true'); prev.classList.remove('is-active');
      this.cache.panels.forEach((p) => { if (p !== panel && p !== prev && !p.classList.contains('is-root')) { p.hidden = true; p.setAttribute('aria-hidden','true'); p.classList.remove('is-active'); } });
    }

    panel.hidden = false; panel.setAttribute('aria-hidden','false'); panel.classList.add('is-active');

    this.#updateTriggers(panel);

    const cb = this.options.hooks.onHeightChange; if (typeof cb === 'function') cb(panel, panel.scrollHeight);

    this.#focusables(panel)[0]?.focus();

    const previous = this.state.active; this.state.active = panel;
    Event.emit('drilldown:change', this.element, { panel, previous });
  }

  #updateTriggers(activePanel) {
    const triggers = this.cache.nav.querySelectorAll(`${this.options.selectors.item}[data-submenu]`);
    triggers.forEach((btn) => {
      const ref = btn.getAttribute('data-submenu');
      const sub = ref ? this.cache.nav.querySelector(ref) : null;
      const expanded = sub === activePanel || (sub && !sub.hidden);
      btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      if (!btn.hasAttribute('aria-haspopup')) btn.setAttribute('aria-haspopup', 'menu');
      btn.setAttribute('role', 'menuitem');
    });
  }

  // utils -------------------------------------------
  #wrapInLi(node) { const li = document.createElement('li'); li.setAttribute('role','none'); li.appendChild(node); return li; }
  #toElement(html) { const tpl = document.createElement('template'); tpl.innerHTML = html.trim(); return tpl.content.firstElementChild; }
  #listen(name, target, fn, options) { Event.on(name, target, fn, options); this.cache.bound.push({ name, target, fn, options }); }
}

