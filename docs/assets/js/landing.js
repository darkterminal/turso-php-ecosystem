(function () {
  var root = document.documentElement;
  var toggle = document.getElementById('theme-toggle');
  var navToggle = document.getElementById('nav-toggle');
  var mobile = document.getElementById('mobile-panel');

  function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    try { localStorage.setItem('ecosystem-theme', theme); } catch (e) {}
    if (toggle) toggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  }

  if (toggle) {
    toggle.addEventListener('click', function () {
      setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });
  }

  if (navToggle && mobile) {
    navToggle.addEventListener('click', function () {
      var open = mobile.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    mobile.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        mobile.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
})();
