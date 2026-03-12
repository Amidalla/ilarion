export function initPhotoTabs() {
    class PhotoTabs {
        constructor(container) {
            this.container = container;
            this.buttons = container.querySelectorAll('.photo-tabs__btn');
            this.panes = container.querySelectorAll('.photo-tabs__pane');
            this.init();
        }

        init() {
            if (this.buttons.length > 0 && this.panes.length > 0) {
                this.buttons[0].classList.add('active');
                this.panes[0].classList.add('active');
                this.animateContentItems(this.panes[0]);
            }

            this.container.addEventListener('click', (e) => {
                const button = e.target.closest('.photo-tabs__btn');
                if (button && this.container.contains(button)) {
                    e.preventDefault();
                    this.switchTab(button);
                }
            });
        }

        switchTab(button) {
            if (button.classList.contains('active')) return;

            const targetTabId = button.dataset.tab;

            this.buttons.forEach(btn => btn.classList.remove('active'));
            this.panes.forEach(pane => pane.classList.remove('active'));

            button.classList.add('active');

            const targetPane = this.container.querySelector(`#${targetTabId}`);
            if (targetPane) {
                targetPane.classList.add('active');
                this.animateContentItems(targetPane);
            }
        }

        animateContentItems(pane) {
            const items = pane.querySelectorAll('.photo-album__item');

            items.forEach(item => {
                item.style.animation = 'none';
                item.offsetHeight;
            });

            items.forEach((item, index) => {
                item.style.animation = `photo-tabs-fadeInUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.08}s forwards`;
            });
        }
    }

    const containers = document.querySelectorAll('.photo-album');
    const instances = [];

    containers.forEach(container => {
        instances.push(new PhotoTabs(container));
    });

    return instances;
}

if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initPhotoTabs();
        });
    } else {
        setTimeout(() => {
            initPhotoTabs();
        }, 0);
    }
}

export default initPhotoTabs;