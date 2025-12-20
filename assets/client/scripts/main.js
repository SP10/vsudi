import Header from "./Header.js";
import Carousel from "./Сarousel.js";
import TelInput from "./TelInput.js";
import defineScrollBarWidthCSSVar from "./utils/defineScrollBarWidthCSSVar.js";
import Modal from "./Modal.js";
import ObserverCollection from "./Observer.js";
import ExpandableContent from "./ExpandableContent.js";
import LanguageSwitcher from "./LanguageSwitcher.js";
import { LoadMoreButton, LoadMoreIndicator } from "./LoadMore.js";

document.addEventListener("DOMContentLoaded", async () => {
  setTimeout(() => {
    const header = document.querySelector('[data-component="Header"]');
    if (header) {
      new Header(header);
    }

    const languageSwitcher = document.querySelector('[data-component="LanguageSwitcher"]');
    if (languageSwitcher){
      new LanguageSwitcher(languageSwitcher);
    }

    const loadMoreButton = document.querySelector('[data-component="LoadMoreButton"]');
    const loadMoreIndicator = document.querySelector('[data-component="LoadMoreIndicator"]');
    if (loadMoreButton && loadMoreIndicator) {
      new LoadMoreButton(loadMoreButton, new LoadMoreIndicator(loadMoreIndicator));
    }

    Modal.initAll();

    new ObserverCollection;
    new ExpandableContent;

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

    const initTiltedCards = () => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const hasFinePointer = window.matchMedia("(pointer: fine)").matches;

      if (prefersReducedMotion || !hasFinePointer) return;

      const cards = document.querySelectorAll("[data-tilt-card]");
      if (!cards.length) return;

      cards.forEach((card) => {
        const maxTilt = 10;

        const handlePointerMove = (event) => {
          const rect = card.getBoundingClientRect();
          const x = event.clientX - rect.left;
          const y = event.clientY - rect.top;
          const rotateX = ((y - rect.height / 2) / rect.height) * -maxTilt;
          const rotateY = ((x - rect.width / 2) / rect.width) * maxTilt;

          card.style.setProperty("--tilt-x", `${(x / rect.width) * 100}%`);
          card.style.setProperty("--tilt-y", `${(y / rect.height) * 100}%`);
          card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;
        };

        const resetTilt = () => {
          card.style.transform = "";
          card.style.removeProperty("--tilt-x");
          card.style.removeProperty("--tilt-y");
          card.classList.remove("is-tilting");
        };

        card.addEventListener("pointerenter", () => card.classList.add("is-tilting"));
        card.addEventListener("pointermove", handlePointerMove);
        card.addEventListener("pointerleave", resetTilt);
      });
    };

    initTiltedCards();


    (function () {
      const map = document.querySelector('.js-map');
      if (!map) return;
  
      const iframe = map.querySelector('iframe');
      const guard  = map.querySelector('.map__guard');
  
      const disable = () => {
        iframe.style.pointerEvents = 'none';
        map.classList.remove('is-active');
      };
  
      const enable = () => {
        iframe.style.pointerEvents = 'auto';
        map.classList.add('is-active');
      };
  
      // Активувати по кліку на оверлей
      guard.addEventListener('click', enable);
  
      // Деактивувати, коли курсор пішов з області карти
      map.addEventListener('mouseleave', disable);
  
      // Деактивувати по Esc
      map.addEventListener('keydown', (e) => { if (e.key === 'Escape') disable(); });
  
      // На мобільних: деактивувати після втрати фокусу/тачу
      map.addEventListener('focusout', disable);
      map.addEventListener('touchend', () => setTimeout(disable, 300));
    })();

    document.addEventListener('fetchit:success', (e) => {
      const { response, form } = e.detail;

      if (response && response.success) {
        form.classList.add('d-none');
        let formName = form.getAttribute('name');
        let successMessage = document.querySelector(`[data-form="${formName}"]`);
        successMessage.classList.remove('d-none');

        let closeButton = document.querySelector('[data-component="CloseButton"]');
        closeButton.addEventListener('click', () => {
          form.classList.remove('d-none');
          successMessage.classList.add('d-none');
        });

        console.log('SUCCESS JSON:', response);
      }
    }, { once: false });

    defineScrollBarWidthCSSVar();
  }, 1000); // Delay to ensure all elements are loaded
});
