
import Base from './core/Base.js';
import { Event } from './core/Event.js';
import { deepMerge } from './core/utilities/deepMerge.js';

export default class CascadeMenu extends Base {
  constructor(element, options = {}) {
    super(element, deepMerge({
      selectors: {
        nav: '.js-navigation',
        header: '.js-navigation-header',
        panel: '.js-navigation-panel',
        parentLink: '.js-parent-link',
        parentMenu: '.js-parent-menu',
        navigationList: '.js-navigation-list',
        link: '.js-nav-link',
        back: '.js-navigation-panel-back',
        title: '.js-navigation-panel-title',
        closeButton: '[data-component="CloseMenuButton"]',
        footer: '.js-navigation-footer'
      },
      classNames: {
        active: 'm-active',
        hide: 'm-hide'
      },
      a11y: { roleMenu: true },
    }, options));
  }

  init() {

  }

  initCache() {
    this.cache.header = this.element.querySelector(this.options.selectors.header);
    this.cache.parentLinks = this.element.querySelectorAll(this.options.selectors.parentLink);
    this.cache.panel = this.element.querySelector(this.options.selectors.panel);
    if (this.cache.panel) {
      this.cache.back = this.cache.panel.querySelector(this.options.selectors.back);
      this.cache.title = this.cache.panel.querySelector(this.options.selectors.title);
    }

    this.cache.closeButtons = this.element.querySelectorAll(this.options.selectors.closeButton);
    this.cache.navigationList = this.element.querySelector(this.options.selectors.navigationList);
    this.cache.footer = this.element.querySelector(this.options.selectors.footer);
  }

  initStates() {
    this.state.stack = [];
  }

  bindEvents() {
    Event.on('click', this.cache.navigationList, (event) => {
      const link = event.target.closest(this.options.selectors.parentLink);
      if (!link) return;
      const parentMenu = link.nextElementSibling;
      if (parentMenu && parentMenu.classList.contains(this.options.selectors.parentMenu.slice(1))) {
        event.preventDefault();
        this.next(link);
      }
    });

    Event.on('click', this.cache.back, (event) => {
      event.preventDefault();
      this.back();
    });
  }

  afterInit() {
    this.saveNavigationState();
  }

  clone(node){
    return node.cloneNode(true);
  }

  getTitle() {
    return this.cache.title ? this.cache.title.getAttribute('data-title') : '';
  }

  next(link) {
    this.saveNavigationState(link);
    let state = this.state.stack[this.state.stack.length - 1];
    if (state) {
      this.update(state);
      this.cache.header.classList.add(this.options.classNames.hide);
      this.cache.panel.classList.add(this.options.classNames.active);
      this.cache.footer?.classList.add(this.options.classNames.hide);
    }
  }

  back() {
    this.state.stack.pop();
    let state = this.state.stack[this.state.stack.length - 1];
    if (state && this.state.stack.length > 1) {
      this.update(state);
    } else {
      this.update(state);
      this.cache.header.classList.remove(this.options.classNames.hide);
      this.cache.panel.classList.remove(this.options.classNames.active);
      this.cache.footer?.classList.remove(this.options.classNames.hide);
    }
  }

  saveNavigationState(link) {
    if (link) {
      const parentMenu = link.nextElementSibling;
      if (parentMenu && parentMenu.classList.contains(this.options.selectors.parentMenu.slice(1))) {
        this.state.stack.push({
          title: link.textContent.trim(),
          menu: this.clone(parentMenu)
        });
      }
    } else {
      this.state.stack.push({
        title: this.getTitle(),
        menu: this.clone(this.cache.navigationList)
      });
    }
  }

  remove() {
    this.cache.navigationList.innerHTML = '';
  }

  update(state) {
    this.remove();
    this.updatePanelTitle(state.title);

    const frag = document.createDocumentFragment();
    Array.from(state.menu.children).forEach((ch) => {
      frag.appendChild(ch.cloneNode(true));
    });
    this.cache.navigationList.appendChild(frag);
  }

  updatePanelTitle(title) {
    if (this.cache.title) {
      this.cache.title.textContent = title;
    } else {
      console.warn('CascadeMenu: panel title element not found');
    }
  }

  destroy() {
    this.cache.parentLinks.forEach((parentLink) => {
      Event.off('click', parentLink);
    });
  }
}
