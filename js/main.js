(function () {
  var toggle = document.querySelector('.menu-toggle');
  var menu = document.getElementById('mobile-menu');
  if (!toggle || !menu) return;

  function open() {
    menu.hidden = false;
    requestAnimationFrame(function () { menu.classList.add('is-open'); });
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
    document.body.classList.add('menu-open');
  }

  function close() {
    menu.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    document.body.classList.remove('menu-open');
    setTimeout(function () {
      if (toggle.getAttribute('aria-expanded') === 'false') menu.hidden = true;
    }, 300);
  }

  toggle.addEventListener('click', function () {
    toggle.getAttribute('aria-expanded') === 'true' ? close() : open();
  });

  menu.addEventListener('click', function (e) {
    if (e.target.closest('a')) close();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      close();
      toggle.focus();
    }
  });

  // Close if the viewport grows past the hamburger breakpoint
  window.matchMedia('(min-width: 1081px)').addEventListener('change', function (mq) {
    if (mq.matches && toggle.getAttribute('aria-expanded') === 'true') close();
  });
})();
