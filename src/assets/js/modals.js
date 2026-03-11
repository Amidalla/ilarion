// Инициализация мобильного меню с блокировкой скролла и оверлеем
export function initMobileMenu() {
    const mobileNav = document.querySelector('.mobile-nav');
    const burgerBtn = document.querySelector('.burger-menu');
    let overlay = document.querySelector('.mobile-nav-overlay');

    if (!mobileNav || !burgerBtn) {
        return;
    }

    // Создаем оверлей, если его нет
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'mobile-nav-overlay';
        document.body.appendChild(overlay);
    }

    let isMenuOpen = false;
    let scrollbarWidth = 0;

    function calculateScrollbarWidth() {
        return window.innerWidth - document.documentElement.clientWidth;
    }

    function disableBodyScroll() {
        scrollbarWidth = calculateScrollbarWidth();
        const scrollY = window.scrollY;

        document.documentElement.classList.add('modal-open');

        if (scrollbarWidth > 0) {
            document.documentElement.style.paddingRight = `${scrollbarWidth}px`;
        }

        document.documentElement.dataset.scrollY = scrollY;
    }

    function enableBodyScroll() {
        const scrollY = document.documentElement.dataset.scrollY;

        document.documentElement.classList.remove('modal-open');
        document.documentElement.style.paddingRight = '';

        if (scrollY) {
            window.scrollTo(0, parseInt(scrollY));
            delete document.documentElement.dataset.scrollY;
        }
    }

    function openMenu() {
        disableBodyScroll();

        mobileNav.classList.add('active');
        overlay.classList.add('active');
        burgerBtn.classList.add('is-open');
        isMenuOpen = true;
    }

    function closeMenu() {
        enableBodyScroll();

        mobileNav.classList.remove('active');
        overlay.classList.remove('active');
        burgerBtn.classList.remove('is-open');
        isMenuOpen = false;
    }

    // Обработчик для бургер-кнопки
    burgerBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (isMenuOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Закрытие по клику на оверлей
    overlay.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isMenuOpen) {
            closeMenu();
        }
    });

    // Закрытие по Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMenuOpen) {
            closeMenu();
        }
    });

    // Обновление отступа при изменении размера окна
    window.addEventListener('resize', () => {
        if (isMenuOpen) {
            const newScrollbarWidth = calculateScrollbarWidth();
            if (newScrollbarWidth !== scrollbarWidth) {
                scrollbarWidth = newScrollbarWidth;
                if (scrollbarWidth > 0) {
                    document.documentElement.style.paddingRight = `${scrollbarWidth}px`;
                } else {
                    document.documentElement.style.paddingRight = '';
                }
            }
        }
    });

    return {
        open: openMenu,
        close: closeMenu,
        isOpen: () => isMenuOpen
    };
}

// Инициализация модального окна обратной связи
export function initFeedbackModal() {
    const modal = document.querySelector('.feedback-modal');
    const footerButtons = document.querySelectorAll('.footer__btn .border-btn');
    const mobileMenuButton = document.querySelector('.mobile-nav .plain-btn');
    const overlay = document.querySelector('.overlay');

    if (!modal || !overlay) {
        return;
    }

    let isModalOpen = false;
    let scrollbarWidth = 0;

    function calculateScrollbarWidth() {
        return window.innerWidth - document.documentElement.clientWidth;
    }

    function disableBodyScroll() {
        scrollbarWidth = calculateScrollbarWidth();
        const scrollY = window.scrollY;

        document.documentElement.classList.add('modal-open');

        if (scrollbarWidth > 0) {
            document.documentElement.style.paddingRight = `${scrollbarWidth}px`;
        }

        document.documentElement.dataset.scrollY = scrollY;
    }

    function enableBodyScroll() {
        const scrollY = document.documentElement.dataset.scrollY;

        document.documentElement.classList.remove('modal-open');
        document.documentElement.style.paddingRight = '';

        if (scrollY) {
            window.scrollTo(0, parseInt(scrollY));
            delete document.documentElement.dataset.scrollY;
        }
    }

    function openModal() {
        disableBodyScroll();

        modal.classList.add('active');
        overlay.classList.add('active');
        isModalOpen = true;
    }

    function closeModal() {
        modal.classList.remove('active');
        overlay.classList.remove('active');
        enableBodyScroll();

        isModalOpen = false;
    }

    // Обработчики для кнопок в футере
    footerButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            openModal();
        });
    });

    // Обработчик для кнопки в мобильном меню
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            openModal();
        });
    }

    const closeBtn = modal.querySelector('.feedback-modal__close');
    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeModal();
        });
    }

    overlay.addEventListener('click', (e) => {
        if (isModalOpen) {
            e.preventDefault();
            e.stopPropagation();
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isModalOpen) {
            closeModal();
        }
    });

    modal.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    window.addEventListener('resize', () => {
        if (isModalOpen) {
            const newScrollbarWidth = calculateScrollbarWidth();
            if (newScrollbarWidth !== scrollbarWidth) {
                scrollbarWidth = newScrollbarWidth;
                if (scrollbarWidth > 0) {
                    document.documentElement.style.paddingRight = `${scrollbarWidth}px`;
                } else {
                    document.documentElement.style.paddingRight = '';
                }
            }
        }
    });

    return {
        open: openModal,
        close: closeModal,
        isOpen: () => isModalOpen
    };
}

// Универсальная функция для инициализации модалок
function initModal(config) {
    const {
        modalSelector,
        openButtonsSelector,
        closeButtonSelector = '.modal-form__close',
        onOpen = null,
        onClose = null
    } = config;

    const modal = document.querySelector(modalSelector);
    const overlay = document.querySelector('.overlay');
    const openButtons = document.querySelectorAll(openButtonsSelector);

    if (!modal || !overlay || openButtons.length === 0) {
        return null;
    }

    let isModalOpen = false;
    let scrollbarWidth = 0;

    function calculateScrollbarWidth() {
        return window.innerWidth - document.documentElement.clientWidth;
    }

    function disableBodyScroll() {
        scrollbarWidth = calculateScrollbarWidth();

        // Сохраняем текущую позицию скролла
        const scrollY = window.scrollY;

        // Добавляем класс к html
        document.documentElement.classList.add('modal-open');

        // Компенсируем исчезновение скроллбара
        if (scrollbarWidth > 0) {
            document.documentElement.style.paddingRight = `${scrollbarWidth}px`;
        }

        // Сохраняем позицию скролла в data-атрибуте
        document.documentElement.dataset.scrollY = scrollY;
    }

    function enableBodyScroll() {
        // Восстанавливаем позицию скролла
        const scrollY = document.documentElement.dataset.scrollY;

        // Убираем класс и стили
        document.documentElement.classList.remove('modal-open');
        document.documentElement.style.paddingRight = '';

        // Возвращаем скролл
        if (scrollY) {
            window.scrollTo(0, parseInt(scrollY));
            delete document.documentElement.dataset.scrollY;
        }
    }

    function openModal() {
        disableBodyScroll();

        modal.classList.add('active');
        overlay.classList.add('active');
        isModalOpen = true;

        if (onOpen) onOpen();
    }

    function closeModal() {
        modal.classList.remove('active');
        overlay.classList.remove('active');
        enableBodyScroll();

        isModalOpen = false;

        if (onClose) onClose();
    }

    // Обработчики для кнопок открытия
    openButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            openModal();
        });
    });

    // Обработчик для кнопки закрытия
    const closeBtn = modal.querySelector(closeButtonSelector);
    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeModal();
        });
    }

    // Закрытие по клику на overlay
    overlay.addEventListener('click', (e) => {
        if (isModalOpen) {
            e.preventDefault();
            e.stopPropagation();
            closeModal();
        }
    });

    // Закрытие по Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isModalOpen) {
            closeModal();
        }
    });

    // Предотвращение закрытия при клике внутри модалки
    modal.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Обновление отступа при изменении размера окна
    window.addEventListener('resize', () => {
        if (isModalOpen) {
            const newScrollbarWidth = calculateScrollbarWidth();
            if (newScrollbarWidth !== scrollbarWidth) {
                scrollbarWidth = newScrollbarWidth;
                if (scrollbarWidth > 0) {
                    document.documentElement.style.paddingRight = `${scrollbarWidth}px`;
                } else {
                    document.documentElement.style.paddingRight = '';
                }
            }
        }
    });

    return {
        open: openModal,
        close: closeModal,
        isOpen: () => isModalOpen
    };
}

// Инициализация всех модалок
export function initModals() {
    // Модалка form-solution
    initModal({
        modalSelector: '.form-solution',
        openButtonsSelector: '.header__btn, .technology__btn.color-btn, .footer-btn.color-btn, .tasks__btn.color-btn, .cases__btn.color-btn',
        closeButtonSelector: '.modal-form__close'
    });

    // Модалка form-authorization
    const authModal = initModal({
        modalSelector: '.form-authorization',
        openButtonsSelector: '.access-link',
        closeButtonSelector: '.modal-form__close'
    });

    // Модалка form-registration
    const regModal = initModal({
        modalSelector: '.form-registration',
        openButtonsSelector: '.registration-link',
        closeButtonSelector: '.modal-form__close'
    });

    // Логика переключения между модалками
    if (authModal && regModal) {
        // При клике на registration-link в модалке авторизации
        const registrationLinks = document.querySelectorAll('.registration-link');
        registrationLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                // Закрываем модалку авторизации
                if (authModal.isOpen()) {
                    authModal.close();
                }

                // Открываем модалку регистрации
                regModal.open();
            });
        });

        // При клике на access-link (если нужно переключаться обратно)
        const accessLinks = document.querySelectorAll('.access-link');
        accessLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                // Если открыта модалка регистрации, закрываем её
                if (regModal.isOpen()) {
                    regModal.close();
                }

                // authModal откроется автоматически через openButtonsSelector
            });
        });
    }
}