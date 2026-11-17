/* Small, dependency-free interactions for the portfolio. */
(function () {
  // Mobile menu
  var btn = document.querySelector('.menu');
  var nav = document.getElementById('nav');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') { nav.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }
    });
  }

  // Footer year
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  // Reveal on scroll (content stays visible if this cannot run)
  var items = document.querySelectorAll('.rv');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!('IntersectionObserver' in window) || reduce) {
    items.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  }

  // Highlight current section in the nav
  var links = document.querySelectorAll('nav a[href^="#"]:not(.cta)');
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (a) { a.classList.toggle('on', a.getAttribute('href') === '#' + en.target.id); });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    links.forEach(function (a) { var s = document.querySelector(a.getAttribute('href')); if (s) spy.observe(s); });
  }

  // Contact form -> Formspree (endpoint is the form's action attribute)
  var form = document.getElementById('contact-form');
  if (form && window.fetch) {
    var status = document.getElementById('form-status');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      status.className = 'status';
      if (!form.checkValidity()) {
        status.textContent = 'Please fill in your name, a valid email address and a message.';
        status.className = 'status err';
        form.reportValidity();
        return;
      }
      var submit = form.querySelector('button[type="submit"]');
      submit.disabled = true; status.textContent = 'Sending…';
      fetch(form.action, { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' } })
        .then(function (r) {
          if (!r.ok) throw new Error('bad response');
          form.reset(); status.textContent = 'Thank you, your message has been sent.'; status.className = 'status ok';
        })
        .catch(function () {
          status.innerHTML = 'Sorry, that did not send. Please email <a href="mailto:olatjla01@gmail.com">olatjla01@gmail.com</a> instead.';
          status.className = 'status err';
        })
        .then(function () { submit.disabled = false; });
    });
  }
})();
