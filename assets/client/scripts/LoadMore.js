import Base from "./core/Base.js";

export class LoadMoreButton {
    constructor(element, indicator) {
        this.element = element;
        this.indicator = indicator;
        this.className = {
            hiddenClass: 'd-none'
        }

        this.state = {
            currentPage: 0
        }

        this.init();
        this.bindEvents();
    }

    #nextPage() {
        this.state.currentPage++;
        this.element.setAttribute('data-page', this.state.currentPage);
        this.indicator.setPage(this.state.currentPage);
    }

    init() {
        this.state.url = this.element.getAttribute('data-url');
        this.state.currentPage = this.element.getAttribute('data-page', 0);
        this.state.pageCount = this.element.getAttribute('data-page-count', 0);
    }

    bindEvents() {
        this.element.addEventListener('click', (e) => {
            e.preventDefault();

            this.#nextPage();
            if (this.state.currentPage >= this.state.pageCount) {
                this.element.classList.add(this.className.hiddenClass);
            }

            fetch(`${this.state.url}?page=${this.state.currentPage}`)
                .then(res => res.text())
                .then(html => {
                    const parser = new DOMParser();
                    const contentHtml = parser.parseFromString(html, 'text/html');
                    const content = contentHtml.querySelector('.js-content');
                    if (content) {
                        let contentContainer = document.querySelector('.js-content');
                        contentContainer.insertAdjacentHTML('beforeend', content.innerHTML);
                    }
                })
                .catch(err => {
                    console.error('Помилка при завантаженні сторінки:', err);
                });
        });
    }
}

export class LoadMoreIndicator {
    constructor(element) {
        this.element = element;
        this.cache = {};

        this.initCache();
    }

    initCache() {
        this.cache.page = this.element.querySelector('.js-page');
    }

    setPage(page) {
        this.cache.page.innerHTML = page;
    }
}