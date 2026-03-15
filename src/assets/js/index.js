import "../styles/reset.scss";
import "../styles/styles.scss";
import "../styles/header.scss";
import "../styles/footer.scss";
import "../styles/home.scss";
import "../styles/modals.scss";
import "../styles/section.scss";
import "../styles/contacts.scss";
import "../styles/photo-album.scss";
import "../styles/history.scss";
import LazyLoad from "vanilla-lazyload";
import Swiper from 'swiper';
import 'swiper/swiper-bundle.css';
import { Pagination, Navigation, Autoplay, Thumbs, EffectFade } from 'swiper/modules';
import IMask from 'imask';
import { SlidersInit } from './sliders.js';
import { initFeedbackModal, initMobileMenu } from './modals.js';
import { initPhotoTabs } from './tabs.js';
import { initLightbox } from './lightbox.js';
import { initHistoryTimeline } from './history-timeline.js';

import homeBg from '../images/home-bg.png';
import homeBgLaptop from '../images/home-bg-laptop.png';
import homeBgTablet from '../images/home-bg-tablet.png';
import homeBgMobile from '../images/home-bg-mobile.png';

Swiper.use([Pagination, Navigation, Autoplay, Thumbs, EffectFade]);

function initFixedBackground() {
    const homePage = document.querySelector('.home-page');
    if (!homePage) return;

    const oldBgElement = document.querySelector('.fixed-bg-element');
    if (oldBgElement) {
        oldBgElement.remove();
    }

    const bgElement = document.createElement('div');
    bgElement.className = 'fixed-bg-element';
    homePage.parentNode.insertBefore(bgElement, homePage);

    function updateBackground() {
        const width = window.innerWidth;

        bgElement.style.position = 'fixed';
        bgElement.style.top = '0';
        bgElement.style.left = '0';
        bgElement.style.right = '0';
        bgElement.style.bottom = '0';
        bgElement.style.backgroundRepeat = 'no-repeat';
        bgElement.style.backgroundPosition = 'top center';
        bgElement.style.backgroundColor = '#FFF';
        bgElement.style.zIndex = '0';
        bgElement.style.pointerEvents = 'none';
        bgElement.style.transform = 'none';


        if (width <= 730) {
            bgElement.style.backgroundImage = `url(${homeBgMobile})`;
            bgElement.style.backgroundSize = '100% auto';
        } else if (width <= 1250) {
            bgElement.style.backgroundImage = `url(${homeBgTablet})`;
            bgElement.style.backgroundSize = '100% auto';
        } else if (width <= 1550) {
            bgElement.style.backgroundImage = `url(${homeBgLaptop})`;
            bgElement.style.backgroundSize = '100% auto';
        } else {
            bgElement.style.backgroundImage = `url(${homeBg})`;
            bgElement.style.backgroundSize = '100% auto';
        }
    }

    updateBackground();
    window.addEventListener('resize', updateBackground);
}

function initPhoneMasks() {
    const phoneInputs = document.querySelectorAll(`
        input[type="tel"][name="tel"],
        input[type="tel"][data-phone-input]
    `);

    phoneInputs.forEach(input => {
        let mask = null;

        const initMask = () => {
            if (!mask) {
                input.classList.add('phone-mask-active');
                mask = IMask(input, {
                    mask: '+{7} (000) 000-00-00',
                    lazy: false
                });

                if (!input.value) {
                    input.value = '+7 (';
                }
            }
        };

        const destroyMask = () => {
            if (mask) {
                const phoneNumber = input.value.replace(/\D/g, '');
                if (phoneNumber.length < 11 || phoneNumber === '7') {
                    input.value = '';
                }
                input.classList.remove('phone-mask-active');
                mask.destroy();
                mask = null;
            }
        };

        input.addEventListener('focus', initMask);
        input.addEventListener('blur', destroyMask);

        input.addEventListener('input', (e) => {
            if (mask && input.value === '+7 (' && e.inputType === 'deleteContentBackward') {
                destroyMask();
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const lazyLoadInstance = new LazyLoad();
    initPhoneMasks();

    const menuController = initMobileMenu();
    initFeedbackModal(menuController);

    SlidersInit();
    initPhotoTabs();
    initLightbox();
    initFixedBackground();
    initHistoryTimeline();

    initStickyScroll();
});

function initStickyScroll() {
    const stickyBlock = document.querySelector('.content__item:first-child');
    if (!stickyBlock) return;

    let timeoutId = null;

    function checkSticky() {
        const rect = stickyBlock.getBoundingClientRect();

        if (rect.top <= 0) {

            stickyBlock.classList.add('is-sticky');
            stickyBlock.style.paddingTop = '20px';


            if (timeoutId) {
                clearTimeout(timeoutId);
                timeoutId = null;
            }
        } else {

            if (!timeoutId) {
                timeoutId = setTimeout(() => {
                    stickyBlock.classList.remove('is-sticky');
                    stickyBlock.style.paddingTop = '';
                    timeoutId = null;
                }, 50);
            }
        }
    }

    window.addEventListener('scroll', checkSticky, { passive: true });
    checkSticky();
    window.addEventListener('resize', checkSticky);
}