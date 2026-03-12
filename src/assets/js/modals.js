export function initMobileMenu() {
    const mobileNav = document.querySelector('.mobile-nav');
    const burgerBtn = document.querySelector('.burger-menu');
    let overlay = document.querySelector('.mobile-nav-overlay');

    if (!mobileNav || !burgerBtn) {
        return;
    }

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
        
        if (window.innerWidth > 450) {
            overlay.classList.add('active');
        }

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

    burgerBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (isMenuOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    overlay.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isMenuOpen) {
            closeMenu();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMenuOpen) {
            closeMenu();
        }
    });

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
            
            if (window.innerWidth <= 450) {
                overlay.classList.remove('active');
            } else {
                overlay.classList.add('active');
            }
        }
    });

    return {
        open: openMenu,
        close: closeMenu,
        isOpen: () => isMenuOpen
    };
}

export function initFeedbackModal(menuController) {
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
      
        if (menuController && menuController.isOpen()) {
            menuController.close();
        }

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

    footerButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            openModal();
        });
    });

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

        if (onOpen) onOpen();
    }

    function closeModal() {
        modal.classList.remove('active');
        overlay.classList.remove('active');
        enableBodyScroll();

        isModalOpen = false;

        if (onClose) onClose();
    }

    openButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            openModal();
        });
    });

    const closeBtn = modal.querySelector(closeButtonSelector);
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

export function initModals() {
    initModal({
        modalSelector: '.form-solution',
        openButtonsSelector: '.header__btn, .technology__btn.color-btn, .footer-btn.color-btn, .tasks__btn.color-btn, .cases__btn.color-btn',
        closeButtonSelector: '.modal-form__close'
    });

    const authModal = initModal({
        modalSelector: '.form-authorization',
        openButtonsSelector: '.access-link',
        closeButtonSelector: '.modal-form__close'
    });

    const regModal = initModal({
        modalSelector: '.form-registration',
        openButtonsSelector: '.registration-link',
        closeButtonSelector: '.modal-form__close'
    });

    if (authModal && regModal) {
        const registrationLinks = document.querySelectorAll('.registration-link');
        registrationLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                if (authModal.isOpen()) {
                    authModal.close();
                }

                regModal.open();
            });
        });

        const accessLinks = document.querySelectorAll('.access-link');
        accessLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                if (regModal.isOpen()) {
                    regModal.close();
                }
            });
        });
    }
}