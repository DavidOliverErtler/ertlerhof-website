// Mobile-Navigation
(function () {
  var toggle = document.querySelector('.nav-toggle');
  if (!toggle) return;

  toggle.addEventListener('click', function () {
    var open = document.body.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  document.querySelectorAll('.nav a').forEach(function (a) {
    a.addEventListener('click', function () {
      document.body.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
})();

// Kontaktformular: Im Entwurf noch ohne Backend
(function () {
  var form = document.querySelector('form[data-demo]');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var note = form.querySelector('.form-result');
    if (note) {
      note.hidden = false;
      note.textContent =
        'Entwurfs-Modus: Das Formular ist noch nicht mit einem Postfach verbunden. ' +
        'Bitte vorerst direkt an office@ertlerhof.at schreiben.';
    }
  });
})();
