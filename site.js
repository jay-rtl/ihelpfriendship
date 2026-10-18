(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.mobile-nav');
  const setMenu = (open) => {
    if (!menuButton || !menu) return;
    menu.hidden = !open;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('menu-open', open);
  };
  menuButton?.addEventListener('click', () => setMenu(menu.hidden));
  menu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && menu && !menu.hidden) { setMenu(false); menuButton.focus(); } });
  window.addEventListener('resize', () => { if (innerWidth > 1100) setMenu(false); });

  const status = document.querySelector('.copy-status');
  document.querySelectorAll('[data-copy]').forEach(button => button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(button.dataset.copy);
      if (status) status.textContent = `${button.getAttribute('aria-label').replace('Copy ', '')} copied.`;
      button.textContent = 'Copied';
      setTimeout(() => { button.textContent = 'Copy'; }, 2500);
    } catch {
      if (status) status.textContent = 'Copy failed. Please select and copy the detail shown above.';
    }
  }));

  const lightbox = document.querySelector('.lightbox');
  const triggers = [...document.querySelectorAll('[data-gallery]')];
  if (lightbox && triggers.length) {
    const photos = triggers.map(button => ({src: button.querySelector('img').src, alt: button.querySelector('img').alt, caption: button.querySelector('span').textContent}));
    const image = lightbox.querySelector('img');
    const caption = lightbox.querySelector('figcaption');
    let index = 0;
    let lastFocus;
    let touchX;
    const show = next => { index = (next + photos.length) % photos.length; image.src = photos[index].src; image.alt = photos[index].alt; caption.textContent = photos[index].caption; };
    const close = () => { lightbox.hidden = true; document.body.classList.remove('lightbox-open'); lastFocus?.focus(); };
    triggers.forEach((button, i) => button.addEventListener('click', () => { lastFocus = button; show(i); lightbox.hidden = false; document.body.classList.add('lightbox-open'); lightbox.querySelector('.lightbox-close').focus(); }));
    lightbox.querySelector('.lightbox-close').addEventListener('click', close);
    lightbox.querySelector('.lightbox-prev').addEventListener('click', () => show(index - 1));
    lightbox.querySelector('.lightbox-next').addEventListener('click', () => show(index + 1));
    lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });
    lightbox.addEventListener('touchstart', e => { touchX = e.changedTouches[0].screenX; }, {passive:true});
    lightbox.addEventListener('touchend', e => { if (touchX == null) return; const dx = e.changedTouches[0].screenX - touchX; if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1)); touchX = undefined; }, {passive:true});
    document.addEventListener('keydown', e => {
      if (lightbox.hidden) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') show(index + 1);
      if (e.key === 'ArrowLeft') show(index - 1);
      if (e.key === 'Tab') {
        const controls = [...lightbox.querySelectorAll('button')];
        const first = controls[0], last = controls.at(-1);
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  if (window.gsap && window.ScrollTrigger && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.from('.hero-copy > *', {y: 24, opacity: 0, duration: .75, stagger: .12, ease: 'power2.out'});
    gsap.from('.hero-photo-wrap img', {scale: 1.05, opacity: .65, duration: 1.1, ease: 'power2.out'});
    document.querySelectorAll('.section-heading, .belief-pair article, .program > div:last-child, .program-inner > div:last-child, .board-list > div, .gallery-item').forEach(element => {
      gsap.from(element, {y: 30, opacity: 0, duration: .7, ease: 'power2.out', scrollTrigger: {trigger: element, start: 'top 90%', once: true}});
    });
  }
})();
