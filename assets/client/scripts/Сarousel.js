class Carousel {
    constructor(selector = '[data-carousel]', config = {}) {
        this.selector = selector;
        this.config = config;
        this.swiper = null;
        this.element = document.querySelector(this.selector);

        this.init();
        this.bindEvents();
    }

    init() {
        this.swiper = new Swiper(this.selector, this.config);
    }

    bindEvents() {
        this.swiper.on('slideChange', () => {
            const activeSlide = this.swiper.slides[this.swiper.activeIndex];
            const id = activeSlide?.dataset?.id;

            const event = new CustomEvent('slide:change', {
                detail: { id }
            });
            this.element.dispatchEvent(event);
        });
    }

    slideToById(id) {
        const index = [...this.swiper.slides].findIndex(slide => slide.dataset.id === id);
        if (index !== -1) {
            this.swiper.slideTo(index);
        }
    }
}

export default Carousel;
