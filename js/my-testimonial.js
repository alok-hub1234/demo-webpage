document.addEventListener('DOMContentLoaded', () => {
const isDesktop = window.matchMedia('(pointer: fine) and (min-width: 1024px)').matches;

  const rightContent2 = document.getElementById('scrollableRight2');
  const tsm_lockElement = document.getElementById('tsm-lock-zone');
  const tsm_navbar = document.querySelector('.navbar.fixed-top');

  let LOCK_POSITION_START_2;
  let LOCK_POSITION_END_2;

  // Function to calculate lock positions
  function tsm_updateLockPositions() {
    const tsm_rect = tsm_lockElement.getBoundingClientRect();
    const tsm_navbarHeight = (tsm_navbar && istsmNavbarVisible()) ? tsm_navbar.offsetHeight : 0;

    const tsm_extraPadding = 32; // or 10
	  LOCK_POSITION_START_2 = tsm_rect.top + window.scrollY - tsm_navbarHeight - tsm_extraPadding;
    LOCK_POSITION_END_2 = LOCK_POSITION_START_2 + tsm_rect.height;
  }

  // Function to check if navbar is visible (e.g., has a class like 'show' or similar)
  function istsmNavbarVisible() {
    // Adjust this logic to fit your actual navbar appearance logic
    return tsm_navbar.classList.contains('show') || window.scrollY > 100; // Example threshold
  }

  // Initial calculation
  tsm_updateLockPositions();
  
  /*const isDesktop = window.matchMedia('(pointer: fine) and (min-width: 1024px)').matches;

  const rightContent2 = document.getElementById('scrollableRight2');
  const LOCK_POSITION_START_2 = 2300;
  const LOCK_POSITION_END_2 = 2600;
*/
  let inScrollZone2 = false;
  let isSnapping2 = false;
  let touchStartY2 = 0;
  let lastRightContentScrollTop2 = 0;
  
  const lenis2 = window.lenis;
  
  function disablePageScroll2() {
    if (!isDesktop || inScrollZone2) return;
    inScrollZone2 = true;
    document.documentElement.classList.add('no-scroll');
    lenis2.stop();
  }

  function enablePageScroll2() {
    if (!isDesktop || !inScrollZone2) return;
    inScrollZone2 = false;
    document.documentElement.classList.remove('no-scroll');
    lenis2.start();
    //lenis2.scrollTo(window.scrollY, { immediate: true });
  }

  function isRightContent2NearEnd() {
    return rightContent2.scrollTop + rightContent2.clientHeight >= rightContent2.scrollHeight - 10;
  }

  function isRightContent2NearTop() {
    return rightContent2.scrollTop <= 10;
  }

  function snapToLockPosition2() {
    if (!isDesktop) return;
    isSnapping2 = true;
    lenis2.scrollTo(LOCK_POSITION_START_2, { duration: 0.5 });
    setTimeout(() => {
      isSnapping2 = false;
    }, 500);
  }

  lenis2.on('scroll', ({ scroll }) => {
    if (!isDesktop || isSnapping2) return;
   tsm_updateLockPositions();
    
    const isInLockZone2 = scroll >= LOCK_POSITION_START_2 && scroll < LOCK_POSITION_END_2;

    if (!inScrollZone2 && isInLockZone2) {
      snapToLockPosition2();
      disablePageScroll2();
    } else if (inScrollZone2 && !isInLockZone2) {
      enablePageScroll2();
    }
  });

  if (isDesktop) {
    rightContent2?.addEventListener('scroll', () => {
      if (!inScrollZone2) return;
      const currentScrollTop = rightContent2.scrollTop;
      const scrollingDown = currentScrollTop > lastRightContentScrollTop2;
      lastRightContentScrollTop2 = currentScrollTop;

      if (scrollingDown && isRightContent2NearEnd()) {
        enablePageScroll2();
      } else if (!scrollingDown && isRightContent2NearTop()) {
        enablePageScroll2();
      }
    });

    window.addEventListener('wheel', (e) => {
      if (!inScrollZone2) return;
      e.preventDefault();
      rightContent2.scrollTop += e.deltaY;

      if ((e.deltaY > 0 && isRightContent2NearEnd()) || (e.deltaY < 0 && isRightContent2NearTop())) {
        enablePageScroll2();
      }
    }, { passive: false });

    window.addEventListener('touchstart', (e) => {
      if (!inScrollZone2) return;
      touchStartY2 = e.touches[0].clientY;
    });

    window.addEventListener('touchmove', (e) => {
      if (!inScrollZone2) return;
      e.preventDefault();
      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY2 - touchY;
      rightContent2.scrollTop += deltaY;
      touchStartY2 = touchY;

      if ((deltaY > 0 && isRightContent2NearEnd()) || (deltaY < 0 && isRightContent2NearTop())) {
        enablePageScroll2();
      }
    }, { passive: false });
  }

});
