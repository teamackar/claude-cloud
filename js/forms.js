// Form handling. STUB: nothing is sent anywhere yet.
// Each form[data-form] is validated in the browser; on a valid submit the
// stub shows the form's data-stub-message instead of posting. Replace
// submitForm() with the real endpoint (or Shopify's customer form) later.
(function () {
  function submitForm(name, data) {
    // STUB: no network request. Resolve so the UI flow can be exercised.
    return Promise.resolve({ ok: false, stub: true, form: name, data: data });
  }

  document.querySelectorAll('form[data-form]').forEach(function (form) {
    var status = form.querySelector('[data-form-status]');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!status) return;

      if (!form.checkValidity()) {
        var invalid = form.querySelector(':invalid');
        status.textContent = invalid && invalid.type === 'email'
          ? 'Enter an email address, for example name@example.com.'
          : 'Check the highlighted field.';
        if (invalid) invalid.focus();
        return;
      }

      var data = Object.fromEntries(new FormData(form));
      submitForm(form.getAttribute('data-form'), data).then(function (result) {
        status.textContent = result.stub ? status.getAttribute('data-stub-message') : 'Thanks, you are on the list.';
        if (result.ok) form.reset();
      });
    });
  });
})();
