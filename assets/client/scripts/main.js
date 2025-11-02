import Header from "./Header.js";
import Carousel from "./Сarousel.js";
import TelInput from "./TelInput.js";
import TextArea from "./TextArea.js";
import defineScrollBarWidthCSSVar from "./utils/defineScrollBarWidthCSSVar.js";
import Overlay from "./Overlay.js";
import Modal from "./Modal.js";
import ObserverCollection from "./Observer.js";

document.addEventListener("DOMContentLoaded", async () => {
  setTimeout(() => {
    const header = document.querySelector('[data-component="Header"]');
    if (header) {
      new Header(header);
    }

    Modal.initAll();

    new ObserverCollection;

    let phone = document.querySelectorAll(".js-phone");
    phone.forEach((element) => {
      new TelInput(element);
    });

    new Carousel('[data-carousel="hero"]', {
      slidesPerView: 1,
      effect: 'fade',
      fadeEffect: {
        crossFade: true
      },
      autoplay: {
        delay: 10000,
        disableOnInteraction: true,
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
    });

    new Carousel('[data-carousel="cases"]', {
      slidesPerView: 1,
      spaceBetween: 24,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      breakpoints: {
        768: {
          slidesPerView: 2,
          pagination: false
        },
        1025: {
          pagination: false,
          slidesPerView: 3,
        },
      },
    });

    new Carousel('[data-carousel="сlients"]', {
      slidesPerView: 1,
      spaceBetween: 24,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      breakpoints: {
        768: {
          slidesPerView: 3,
        },
        1025: {
          slidesPerView: 4,
        },
      },
    });

    new Carousel('[data-carousel="reviews"]', {
      slidesPerView: 1,
      spaceBetween: 24,
      autoHeight: true,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      breakpoints: {
        768: {
          slidesPerView: 2,
          pagination: false
        },
        1025: {
          pagination: false,
          slidesPerView: 3,
        },
      },
    });

    defineScrollBarWidthCSSVar();
  }, 1000); // Delay to ensure all elements are loaded
});
