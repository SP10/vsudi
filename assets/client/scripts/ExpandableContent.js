import pxToRem from './utils/pxToRem.js'

const rootSelector = '[data-js-expandable-content]'

class ExpandableContent {
  selectors = {
    root: rootSelector,
    body: '[data-js-expandable-content-body]',
    button: '[data-js-expandable-content-button]'
  }

  stateClasses = {
    isExpanded: 'is-expanded',
  }

  animationParams = {
    duration: 500,
    easing: 'ease',
    fill: 'forwards'
  }

  constructor(rootElement) {
    this.rootElement = rootElement
    this.buttonElement = this.rootElement.querySelector(this.selectors.button)
    this.bodyElement = this.rootElement.querySelector(this.selectors.body)

    this.bindEvents()
  }

  expand() {
    const { offsetHeight, scrollHeight } = this.bodyElement

    this.rootElement.classList.add(this.stateClasses.isExpanded)
    this.bodyElement.animate([
      {
        maxHeight: `${pxToRem(offsetHeight)}rem`,
      },
      {
        maxHeight: `${pxToRem(scrollHeight)}rem`,
      },
    ], this.animationParams)

    this.buttonElement.animate([
      {
        opacity: 1,
      },
      {
        opacity: 0,
      },
    ], this.animationParams)
    this.buttonElement.style.pointerEvents = 'none';
  }

  onButtonClick = () => {
    this.expand()
  }

  bindEvents() {
    this.buttonElement.addEventListener('click', this.onButtonClick)
  }
}

class ExpandableContentCollection {
  constructor() {
    this.init()
  }

  init() {
    document.querySelectorAll(rootSelector).forEach((element) => {
      new ExpandableContent(element)
    })
  }
}

export default ExpandableContentCollection
