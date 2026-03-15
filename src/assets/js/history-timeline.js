export function initHistoryTimeline() {
    class HistoryTimeline {
        constructor(container) {
            this.container = container;
            this.marker = container.querySelector('.history__timeline-marker');
            this.blocks = Array.from(container.querySelectorAll('.history__block'));
            this.timelineItem = container.querySelector('.history__timeline');

            if (!this.marker || !this.blocks.length) return;


            this.removeExtraMarkers();

            this.currentBlockIndex = 0;
            this.lastScrollY = window.scrollY;
            this.scrollDirection = 'down';

            this.init();
        }

        removeExtraMarkers() {
            const markersContainer = this.container.querySelector('.history__timeline-event-markers');
            if (markersContainer) {
                markersContainer.remove();
            }
        }

        init() {

            setTimeout(() => {
                this.moveMarkerToBlock(0);
            }, 100);


            this.initScrollListener();


            window.addEventListener('resize', () => {
                this.updateBlockPosition();
            });


            window.addEventListener('load', () => {
                this.updateBlockPosition();
            });
        }

        initScrollListener() {
            let ticking = false;

            window.addEventListener('scroll', () => {

                const currentScrollY = window.scrollY;
                this.scrollDirection = currentScrollY > this.lastScrollY ? 'down' : 'up';
                this.lastScrollY = currentScrollY;

                if (!ticking) {
                    window.requestAnimationFrame(() => {
                        this.checkBlockChange();
                        ticking = false;
                    });
                    ticking = true;
                }
            });
        }

        checkBlockChange() {
            const viewportCenter = window.innerHeight / 2;
            const scrollY = window.scrollY;


            if (scrollY < 50) {
                if (this.currentBlockIndex !== 0) {
                    this.currentBlockIndex = 0;
                    this.moveMarkerToBlock(0);
                }
                return;
            }


            const blockCenters = this.blocks.map(block => {
                const rect = block.getBoundingClientRect();
                return rect.top + rect.height / 2;
            });


            let targetIndex = this.currentBlockIndex;

            if (this.scrollDirection === 'down') {

                for (let i = this.currentBlockIndex + 1; i < blockCenters.length; i++) {
                    if (blockCenters[i] <= viewportCenter + 50) { // небольшой допуск
                        targetIndex = i;
                    } else {
                        break;
                    }
                }
            } else {

                for (let i = this.currentBlockIndex - 1; i >= 0; i--) {
                    if (blockCenters[i] >= viewportCenter - 50) {
                        targetIndex = i;
                    } else {
                        break;
                    }
                }
            }


            if (this.scrollDirection === 'up' && this.currentBlockIndex > 0) {
                const prevBlockCenter = blockCenters[this.currentBlockIndex - 1];
                const currentBlockCenter = blockCenters[this.currentBlockIndex];


                if (Math.abs(prevBlockCenter - viewportCenter) < Math.abs(currentBlockCenter - viewportCenter)) {
                    targetIndex = this.currentBlockIndex - 1;
                }
            }


            if (this.scrollDirection === 'down' && this.currentBlockIndex < this.blocks.length - 1) {
                const nextBlockCenter = blockCenters[this.currentBlockIndex + 1];
                const currentBlockCenter = blockCenters[this.currentBlockIndex];

                if (Math.abs(nextBlockCenter - viewportCenter) < Math.abs(currentBlockCenter - viewportCenter)) {
                    targetIndex = this.currentBlockIndex + 1;
                }
            }


            if (targetIndex !== this.currentBlockIndex && Math.abs(targetIndex - this.currentBlockIndex) <= 1) {
                this.currentBlockIndex = targetIndex;
                this.moveMarkerToBlock(this.currentBlockIndex);
            }
        }

        getBlockCenterY(block) {
            const timelineRect = this.timelineItem.getBoundingClientRect();
            const blockRect = block.getBoundingClientRect();


            const blockCenterY = blockRect.top + blockRect.height / 2 - timelineRect.top;


            const minY = 14;
            const maxY = timelineRect.height - 14;

            return Math.max(minY, Math.min(maxY, blockCenterY));
        }

        moveMarkerToBlock(index) {
            if (index < 0 || index >= this.blocks.length) return;

            const targetBlock = this.blocks[index];
            const y = this.getBlockCenterY(targetBlock);

            this.marker.style.top = `${y}px`;


            this.blocks.forEach((block, i) => {
                if (i === index) {
                    block.classList.add('history__block--active');
                } else {
                    block.classList.remove('history__block--active');
                }
            });
        }

        updateBlockPosition() {
            if (this.currentBlockIndex !== undefined) {
                this.moveMarkerToBlock(this.currentBlockIndex);
            }
        }
    }

    const containers = document.querySelectorAll('.history');
    const instances = [];

    containers.forEach(container => {
        instances.push(new HistoryTimeline(container));
    });

    return instances;
}


if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initHistoryTimeline();
        });
    } else {
        setTimeout(() => {
            initHistoryTimeline();
        }, 0);
    }
}

export default initHistoryTimeline;