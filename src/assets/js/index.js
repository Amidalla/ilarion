import "../styles/reset.scss";
import "../styles/styles.scss";
import "../styles/header.scss";
import "../styles/footer.scss";
import "../styles/home.scss";
import "../styles/modals.scss";
import LazyLoad from "vanilla-lazyload";
import Swiper from 'swiper';
import 'swiper/swiper-bundle.css';
import { Pagination, Navigation, Autoplay, Thumbs, EffectFade } from 'swiper/modules';
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import IMask from 'imask';
import { SlidersInit } from './sliders.js';
import { initFeedbackModal, initMobileMenu } from './modals.js';

// Инициализация модулей Swiper
Swiper.use([Pagination, Navigation, Autoplay, Thumbs, EffectFade]);

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
    // Инициализируем LazyLoad
    const lazyLoadInstance = new LazyLoad();

    // Инициализируем маски для телефонов
    initPhoneMasks();

    // Инициализируем мобильное меню
    initMobileMenu();

    // Инициализируем модальное окно обратной связи
    initFeedbackModal();

    // Инициализируем слайдеры
    SlidersInit();

    // Инициализируем Fancybox для галерей
    Fancybox.bind("[data-fancybox]", {
        Thumbs: false,
        Toolbar: false,
        Images: {
            zoom: true,
        },
    });
});