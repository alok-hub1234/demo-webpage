document.addEventListener('DOMContentLoaded', () => {
  const isDesktop = window.matchMedia('(pointer: fine) and (min-width: 1024px)').matches;

  const rightContent = document.getElementById('scrollableRight');
  const LOCK_POSITION_START = 1300;
  const LOCK_POSITION_END = 1600;

  let inScrollZone = false;
  let isSnapping = false;
  let touchStartY = 0;
  let lastRightContentScrollTop = 0;
  
  const lenis = window.lenis;
  
  function disablePageScroll() {
    if (!isDesktop || inScrollZone) return;
    inScrollZone = true;
    document.documentElement.classList.add('no-scroll');
    lenis.stop();
  }

  function enablePageScroll() {
    if (!isDesktop || !inScrollZone) return;
    inScrollZone = false;
    document.documentElement.classList.remove('no-scroll');
    lenis.start();
    //lenis.scrollTo(window.scrollY, { immediate: true });
  }

  function isrightContentNearEnd() {
    return rightContent.scrollTop + rightContent.clientHeight >= rightContent.scrollHeight - 10;
  }

  function isrightContentNearTop() {
    return rightContent.scrollTop <= 10;
  }

  function snapToLockPosition() {
    if (!isDesktop) return;
    isSnapping = true;
    lenis.scrollTo(LOCK_POSITION_START, { duration: 0.5 });
    setTimeout(() => {
      isSnapping = false;
    }, 500);
  }

  lenis.on('scroll', ({ scroll }) => {
    if (!isDesktop || isSnapping) return;

    const isInLockZone = scroll >= LOCK_POSITION_START && scroll < LOCK_POSITION_END;

    if (!inScrollZone && isInLockZone) {
      snapToLockPosition();
      disablePageScroll();
    } else if (inScrollZone && !isInLockZone) {
      enablePageScroll();
    }
  });

  if (isDesktop) {
    rightContent?.addEventListener('scroll', () => {
      if (!inScrollZone) return;
      const currentScrollTop = rightContent.scrollTop;
      const scrollingDown = currentScrollTop > lastRightContentScrollTop;
      lastRightContentScrollTop = currentScrollTop;

      if (scrollingDown && isrightContentNearEnd()) {
        enablePageScroll();
      } else if (!scrollingDown && isrightContentNearTop()) {
        enablePageScroll();
      }
    });

    window.addEventListener('wheel', (e) => {
      if (!inScrollZone) return;
      e.preventDefault();
      rightContent.scrollTop += e.deltaY;

      if ((e.deltaY > 0 && isrightContentNearEnd()) || (e.deltaY < 0 && isrightContentNearTop())) {
        enablePageScroll();
      }
    }, { passive: false });

    window.addEventListener('touchstart', (e) => {
      if (!inScrollZone) return;
      touchStartY = e.touches[0].clientY;
    });

    window.addEventListener('touchmove', (e) => {
      if (!inScrollZone) return;
      e.preventDefault();
      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;
      rightContent.scrollTop += deltaY;
      touchStartY = touchY;

      if ((deltaY > 0 && isrightContentNearEnd()) || (deltaY < 0 && isrightContentNearTop())) {
        enablePageScroll();
      }
    }, { passive: false });
  }
});