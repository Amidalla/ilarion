export class Lightbox {
    constructor() {
        this.currentIndex = 0;
        this.imageItems = []; // только изображения из активного таба
        this.videoItems = []; // только видео из блока под табами
        this.currentType = null; // 'image' или 'video'
        this.isLoading = false;
        this.init();
    }

    init() {
        this.collectItems();
        this.createLightboxDOM();
        this.bindTriggers();
        this.initTabsObserver();
    }

    collectItems() {
        const activePane = document.querySelector('.photo-tabs__pane.active');

        // Собираем только изображения из активного таба
        const imageTriggers = activePane ? activePane.querySelectorAll('.lightbox-trigger') : [];
        this.imageItems = Array.from(imageTriggers).map(trigger => ({
            type: 'image',
            src: trigger.getAttribute('href'),
            caption: trigger.dataset.caption || '',
            element: trigger
        }));

        // Собираем видео из блока под табами
        const videoTriggers = document.querySelectorAll('.content-video [data-video]');
        this.videoItems = Array.from(videoTriggers).map(trigger => ({
            type: 'video',
            src: trigger.getAttribute('href'),
            caption: trigger.dataset.caption || 'Видео',
            element: trigger
        }));
    }

    createLightboxDOM() {
        this.lightbox = document.createElement('div');
        this.lightbox.className = 'custom-lightbox';
        this.lightbox.innerHTML = `
            <div class="lightbox__overlay"></div>
            <div class="lightbox__content">
                <button class="lightbox__close">
                    <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                        <path d="M22.5 7.5L7.5 22.5M7.5 7.5L22.5 22.5" stroke="#977939" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </button>
                <div class="lightbox__media-container">
                    <div class="lightbox__media-wrapper">
                        <img src="" alt="" class="lightbox__image">
                        <div class="lightbox__video-wrapper" style="display: none;"></div>
                        <button class="lightbox__nav lightbox__nav--prev">
                            <svg width="60" height="60" viewBox="0 0 100 100" fill="none">
                                <path d="M27 96L73 50L27 4" stroke="#977939" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                        </button>
                        <button class="lightbox__nav lightbox__nav--next">
                            <svg width="60" height="60" viewBox="0 0 100 100" fill="none">
                                <path d="M27 96L73 50L27 4" stroke="#977939" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                        </button>
                    </div>
                    <div class="lightbox__caption"></div>
                </div>
            </div>
        `;

        document.body.appendChild(this.lightbox);

        this.overlay = this.lightbox.querySelector('.lightbox__overlay');
        this.content = this.lightbox.querySelector('.lightbox__content');
        this.mediaWrapper = this.lightbox.querySelector('.lightbox__media-wrapper');
        this.image = this.lightbox.querySelector('.lightbox__image');
        this.videoWrapper = this.lightbox.querySelector('.lightbox__video-wrapper');
        this.captionEl = this.lightbox.querySelector('.lightbox__caption');
        this.closeBtn = this.lightbox.querySelector('.lightbox__close');
        this.prevBtn = this.lightbox.querySelector('.lightbox__nav--prev');
        this.nextBtn = this.lightbox.querySelector('.lightbox__nav--next');

        this.bindLightboxEvents();
    }

    bindTriggers() {
        document.addEventListener('click', (e) => {
            const imageTrigger = e.target.closest('.lightbox-trigger');
            if (imageTrigger) {
                e.preventDefault();
                e.stopPropagation();
                this.collectItems();

                const imageIndex = this.imageItems.findIndex(item =>
                    item.element === imageTrigger
                );

                if (imageIndex !== -1) {
                    this.currentType = 'image';
                    this.currentIndex = imageIndex;
                    this.open();
                }
                return;
            }

            const videoTrigger = e.target.closest('[data-video]');
            if (videoTrigger) {
                e.preventDefault();
                e.stopPropagation();
                this.collectItems();

                const videoIndex = this.videoItems.findIndex(item =>
                    item.element === videoTrigger
                );

                if (videoIndex !== -1) {
                    this.currentType = 'video';
                    this.currentIndex = videoIndex;
                    this.open();
                }
            }
        });
    }

    bindLightboxEvents() {
        this.overlay.addEventListener('click', () => this.close());

        this.content.addEventListener('click', (e) => {
            if (!e.target.closest('.lightbox__media-wrapper')) {
                this.close();
            }
        });

        this.closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.close();
        });

        this.prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (this.currentType === 'image') {
                this.navigateImage('prev');
            }
        });

        this.nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (this.currentType === 'image') {
                this.navigateImage('next');
            }
        });

        document.addEventListener('keydown', (e) => {
            if (!this.lightbox.classList.contains('active')) return;

            if (this.currentType !== 'image') return;

            if (e.key === 'Escape') {
                e.preventDefault();
                this.close();
            }
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.navigateImage('prev');
            }
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                this.navigateImage('next');
            }
        });
    }

    open() {
        this.updateMedia();
        this.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.lightbox.classList.remove('active');
        document.body.style.overflow = '';
        this.cleanupMedia();
    }

    cleanupMedia() {
        this.image.src = '';
        this.image.style.display = 'none';
        this.videoWrapper.innerHTML = '';
        this.videoWrapper.style.display = 'none';
    }

    navigateImage(direction) {
        if (this.isLoading || this.imageItems.length === 0) return;

        this.isLoading = true;

        if (direction === 'prev') {
            this.currentIndex--;
            if (this.currentIndex < 0) {
                this.currentIndex = this.imageItems.length - 1;
            }
        } else {
            this.currentIndex++;
            if (this.currentIndex >= this.imageItems.length) {
                this.currentIndex = 0;
            }
        }

        this.updateMedia();

        setTimeout(() => {
            this.isLoading = false;
        }, 300);
    }

    updateMedia() {
        if (this.currentType === 'image' && this.imageItems.length === 0) return;
        if (this.currentType === 'video' && this.videoItems.length === 0) return;

        const item = this.currentType === 'image'
            ? this.imageItems[this.currentIndex]
            : this.videoItems[this.currentIndex];

        this.captionEl.textContent = item.caption;

        if (this.currentType === 'image') {
            this.prevBtn.style.display = 'flex';
            this.nextBtn.style.display = 'flex';
        } else {
            this.prevBtn.style.display = 'none';
            this.nextBtn.style.display = 'none';
        }

        this.cleanupMedia();

        if (this.currentType === 'image') {
            this.image.style.display = 'block';
            this.image.src = item.src;

            this.image.onerror = () => {
                this.captionEl.textContent = item.caption + ' (ошибка загрузки)';
            };

            this.image.onload = () => {

                this.isLoading = false;
            };
        } else {
            this.videoWrapper.style.display = 'block';

            if (item.src.endsWith('.mp4') || item.src.includes('/video/')) {
                const video = document.createElement('video');
                video.className = 'lightbox__video';
                video.controls = true;
                video.autoplay = false;
                video.preload = 'metadata';


                video.onloadeddata = () => {
                    this.isLoading = false;

                    if (this.captionEl.textContent.includes('ошибка')) {
                        this.captionEl.textContent = item.caption;
                    }
                };

                video.onerror = (e) => {
                    // Проверяем, действительно ли это ошибка
                    if (video.networkState === video.NETWORK_NO_SOURCE ||
                        video.error) {
                        this.captionEl.textContent = item.caption + ' (ошибка загрузки)';
                        this.isLoading = false;
                    }
                };

                const source = document.createElement('source');
                source.src = item.src;
                source.type = 'video/mp4';

                video.appendChild(source);
                video.appendChild(document.createTextNode('Ваш браузер не поддерживает видео.'));

                this.videoWrapper.appendChild(video);
            } else {
                let videoUrl = item.src;

                videoUrl = videoUrl.replace(/[?&]autoplay=1/g, '');
                videoUrl = videoUrl.replace(/[?&]autoplay=0/g, '');

                if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
                    if (videoUrl.includes('?')) {
                        videoUrl += '&autoplay=0';
                    } else {
                        videoUrl += '?autoplay=0';
                    }
                } else if (videoUrl.includes('vimeo.com')) {
                    if (videoUrl.includes('?')) {
                        videoUrl += '&autoplay=0';
                    } else {
                        videoUrl += '?autoplay=0';
                    }
                } else if (videoUrl.includes('rutube.ru')) {
                    videoUrl = videoUrl.replace(/[?&]autoplay=1/g, '');
                }

                const iframe = document.createElement('iframe');
                iframe.className = 'lightbox__video';
                iframe.src = videoUrl;
                iframe.frameBorder = '0';
                iframe.allow = 'fullscreen; picture-in-picture';
                iframe.allowFullscreen = true;

                iframe.onload = () => {
                    this.isLoading = false;
                };

                iframe.onerror = () => {
                    this.captionEl.textContent = item.caption + ' (ошибка загрузки)';
                    this.isLoading = false;
                };

                this.videoWrapper.appendChild(iframe);
            }
        }
    }

    initTabsObserver() {
        const observer = new MutationObserver(() => {
            this.collectItems();
        });

        const tabsContent = document.querySelector('.photo-tabs__content');
        if (tabsContent) {
            observer.observe(tabsContent, {
                childList: true,
                subtree: true
            });
        }
    }
}

export function initLightbox() {
    return new Lightbox();
}