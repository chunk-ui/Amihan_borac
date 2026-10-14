(function () {
  // Mobile menu
  var btn = document.querySelector('.menu-btn');
  var nav = document.getElementById('site-nav');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Gallery lightbox
  var lb = document.getElementById('lightbox');
  if (lb) {
    var lbImg = lb.querySelector('img');
    var lbCap = lb.querySelector('p');
    document.querySelectorAll('.gallery img').forEach(function (img) {
      img.setAttribute('tabindex', '0');
      var open = function () {
        lbImg.src = img.src;
        lbImg.alt = img.alt;
        lbCap.textContent = img.closest('figure').querySelector('figcaption').textContent;
        lb.classList.add('open');
        lb.querySelector('button').focus();
      };
      img.addEventListener('click', open);
      img.addEventListener('keydown', function (e) { if (e.key === 'Enter') open(); });
    });
    var close = function () { lb.classList.remove('open'); };
    lb.addEventListener('click', function (e) { if (e.target === lb || e.target.tagName === 'BUTTON') close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }

  // Booking / inquiry form
  var form = document.getElementById('booking-form');
  if (form) {
    var params = new URLSearchParams(window.location.search);
    var pkg = params.get('package');
    if (pkg) {
      Array.prototype.forEach.call(form.package.options, function (o) {
        if (o.value === pkg) o.selected = true;
      });
    }
    var today = new Date().toISOString().split('T')[0];
    if (form.date) form.date.min = today;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      form.querySelectorAll('.err').forEach(function (x) { x.textContent = ''; });
      var need = function (name, msg) {
        var f = form[name];
        if (!f.value.trim()) { f.parentNode.querySelector('.err').textContent = msg; ok = false; }
      };
      need('name', 'Please enter your name.');
      need('package', 'Please choose a package or inquiry type.');
      need('date', 'Please choose a preferred travel date.');
      var em = form.email.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
        form.email.parentNode.querySelector('.err').textContent = 'Please enter a valid email address.';
        ok = false;
      }
      if (!ok) return;

      var summary = {
        Name: form.name.value.trim(),
        Email: em,
        Package: form.package.value,
        'Travel date': form.date.value,
        Guests: form.guests.value,
        Message: form.message.value.trim() || 'None'
      };
      var list = document.getElementById('confirm-list');
      list.innerHTML = '';
      Object.keys(summary).forEach(function (k) {
        var li = document.createElement('li');
        li.textContent = k + ': ' + summary[k];
        list.appendChild(li);
      });
      var body = Object.keys(summary).map(function (k) { return k + ': ' + summary[k]; }).join('\n');
      document.getElementById('mail-link').href = 'mailto:hello@amihanescapes.example?subject=' +
        encodeURIComponent('Inquiry: ' + summary.Package) + '&body=' + encodeURIComponent(body);
      var box = document.getElementById('confirm');
      box.classList.add('show');
      box.scrollIntoView({ behavior: 'smooth', block: 'center' });
      form.reset();
    });
  }

  // Simple contact form
  var cf = document.getElementById('contact-form');
  if (cf) {
    cf.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      cf.querySelectorAll('.err').forEach(function (x) { x.textContent = ''; });
      ['name', 'message'].forEach(function (n) {
        if (!cf[n].value.trim()) { cf[n].parentNode.querySelector('.err').textContent = 'This field is required.'; ok = false; }
      });
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cf.email.value.trim())) {
        cf.email.parentNode.querySelector('.err').textContent = 'Please enter a valid email address.'; ok = false;
      }
      if (!ok) return;
      document.getElementById('contact-confirm').classList.add('show');
      cf.reset();
    });
  }
})();
