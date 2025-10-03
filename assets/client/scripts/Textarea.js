class TextArea {
  constructor(element) {
    this.element = element;
    this.selector = {};
    this.state = {
      maxLength: 100,
    };
    this.cache = {};
    this.initCache();
    this.bindEvents();
  }

  initCache() {
    this.selector.counter = this.element.querySelector('.c-textarea__counter');
    this.selector.textarea = this.element.querySelector('textarea');
  }

  initState() {
    this.state.maxLength = this.selector.textarea.getAttribute('maxlength') || 1000;
  }

  bindEvents() {
    this.element.addEventListener('input', () => this.updateCounter());
    this.updateCounter();
  }

  updateCounter() {
    const currentLength = this.selector.textarea.value.length;
    this.selector.counter.textContent = `${currentLength}/${this.state.maxLength}`;
  }
}

export default TextArea;