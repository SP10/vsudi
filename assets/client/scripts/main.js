import Header from "./Header.js";
import TextAnimation from "./TextAnimation.js";
import QuickFilter from "./QuickFilter.js";
import Carousel from "./Сarousel.js";
import TelInput from "./TelInput.js";
import TextArea from "./TextArea.js";
import defineScrollBarWidthCSSVar from "./utils/defineScrollBarWidthCSSVar.js";
import Overlay from "./Overlay.js";
import Modal from "./Modal.js";

document.addEventListener("DOMContentLoaded", async () => {
  setTimeout(() => {
    // const overlayElement = document.querySelector('[data-component="Overlay"]');
    // const overlay = new Overlay(overlayElement, {
    //   activeClass: 'm-show',
    //   closeOnEsc: true,
    //   closeOnOverlay: false,
    //   lockScroll: true
    // });

    // const modalElement = document.querySelector('[data-component="Modal"]');
    // const modal = new Modal(modalElement);
    // modalElement.addEventListener('modal:beforeClose', (e) => {
    //   overlay.close();
    // });

    // let quickFilterElement = document.querySelector('[data-component="QuickFilter"]');
    // let quickFilter = new QuickFilter(quickFilterElement);
    // let carousel = new Carousel('[data-carousel="CountryCarousel"]', {
    //   slidesPerView: 1,
    //   spaceBetween: 10,
    //   navigation: {
    //     nextEl: ".swiper-button-next",
    //     prevEl: ".swiper-button-prev",
    //   },
    //   pagination: {
    //     el: ".swiper-pagination",
    //     clickable: true,
    //   },
    //   breakpoints: {
    //     1025: {
    //       pagination: false,
    //     },
    //   },
    // });

    // // 🔁 Slide → Filter
    // carousel.element.addEventListener("slide:change", (e) => {
    //   quickFilter.activateById(e.detail.id);
    // });

    // // 🔁 Filter → Slide
    // quickFilter.element.addEventListener("filter:change", (e) => {
    //   carousel.slideToById(e.detail.id);
    // });

    // new Carousel('[data-carousel="OfficeCarousel"]', {
    //   slidesPerView: 1,
    //   spaceBetween: 24,
    //   navigation: {
    //     nextEl: ".swiper-button-next",
    //     prevEl: ".swiper-button-prev",
    //   },
    //   pagination: {
    //     el: ".swiper-pagination",
    //     clickable: true,
    //   },
    //   breakpoints: {
    //     0: {
    //       slidesPerView: 1,
    //     },
    //     768: {
    //       slidesPerView: 2.2,
    //     },
    //     1025: {
    //       pagination: false,
    //       navigation: false,
    //       slidesPerView: 3,
    //     },
    //   },
    // });

    // new Header();
    // new TextAnimation("[data-animation-text]");

    // let coverImage = document.querySelectorAll(".cover-image");
    // let paperImage = document.querySelectorAll(".paper-image");
    // let contactUsButton = document.querySelectorAll(".js-contact-us-btn");
    // if (contactUsButton && contactUsButton.length) {
    //   contactUsButton.forEach((button) => {
    //     button.addEventListener("mouseenter", (e) => {
    //       coverImage.forEach((el) => {
    //         el.classList.add("m-animation");
    //       });
    //       paperImage.forEach((el) => {
    //         el.classList.add("m-animation");
    //       });
    //     });

    //     button.addEventListener("mouseleave", (e) => {
    //       coverImage.forEach((el) => {
    //         el.classList.remove("m-animation");
    //       });
    //       paperImage.forEach((el) => {
    //         el.classList.remove("m-animation");
    //       });
    //     });

    //     button.addEventListener("click", (e) => {
    //       e.preventDefault();
    //       overlay.open();
    //       modal.open(button);
    //     });
    //   });
    // }

    // const serviceCard = document.querySelectorAll(".js-service-card");
    // serviceCard.forEach((el) => {
    //   el.addEventListener("mouseenter", (e) => {
    //     let body = e.currentTarget.querySelector(".service-card__body");
    //     body.classList.add("m-animation");
    //   });

    //   el.addEventListener("mouseleave", (e) => {
    //     let body = e.currentTarget.querySelector(".service-card__body");
    //     body.classList.remove("m-animation");
    //   });
    // });

    // let phone = document.querySelectorAll(".js-phone");
    // phone.forEach((element) => {
    //   new TelInput(element);
    // });

    // let textAreas = document.querySelectorAll(".c-textarea");
    // textAreas.forEach((element) => {
    //   new TextArea(element);
    // });

    // const NAV_SIZE = 48;   // діаметр
    // const NAV_GAP  = 16;   // відступ від краю
    // const NAV_SPACE = NAV_SIZE + NAV_GAP;

    // new Carousel('[data-carousel="TeamCarousel"]', {
    //   slidesPerView: 1,
    //   spaceBetween: 10,
    //   navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
    //   pagination: { el: ".swiper-pagination", clickable: true },
    //   breakpoints: {
    //     0:    { slidesPerView: 1, spaceBetween: 10 },
    //     375:  { slidesPerView: 1.4, spaceBetween: 24 },
    //     767:  { slidesPerView: 2.8, spaceBetween: 10,             slidesOffsetBefore: NAV_SPACE, slidesOffsetAfter: NAV_SPACE },
    //     1025: { slidesPerView: 3.6,                               slidesOffsetBefore: NAV_SPACE, slidesOffsetAfter: NAV_SPACE },
    //     1400: { slidesPerView: 4,   spaceBetween: 5,              slidesOffsetBefore: NAV_SPACE, slidesOffsetAfter: NAV_SPACE },
    //   },
    // });

    // new Carousel('[data-carousel="ReviewCarousel"]', {
    //   slidesPerView: 1,
    //   spaceBetween: 23,
    //   centerInsufficientSlides: true,
    //   centeredSlidesBounds: true,
    //   autoplay: {
    //     delay: 1000,
    //     disableOnInteraction: true,
    //   },
    //   loop: true,
    //   navigation: {
    //     nextEl: ".swiper-button-next",
    //     prevEl: ".swiper-button-prev",
    //   },
    //   pagination: {
    //     el: ".swiper-pagination",
    //     clickable: true,
    //   },
    //   breakpoints: {
    //     0: {
    //       slidesPerView: 1.4,
    //     },
    //     400: {
    //       slidesPerView: 2.2
    //     },
    //     768: {
    //       slidesPerView: 2.8,
    //     },
    //     899: {
    //       slidesPerView: 3,
    //     },
    //     1025: {
    //       slidesPerView: 4,
    //     },
    //     1400: {
    //       slidesPerView: 5,        },
    //   },
    // });

    new Carousel('[data-carousel="hero"]', {
      slidesPerView: 1,
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
