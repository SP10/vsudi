import Header from "./Header.js";
import Carousel from "./Сarousel.js";
import TelInput from "./TelInput.js";
import defineScrollBarWidthCSSVar from "./utils/defineScrollBarWidthCSSVar.js";
import Modal from "./Modal.js";
import ObserverCollection from "./Observer.js";
import ExpandableContent from "./ExpandableContent.js";
import LanguageSwitcher from "./LanguageSwitcher.js";

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
