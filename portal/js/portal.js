(function () {
  function text(path, value) {
    document.querySelectorAll('[data-portal="' + path + '"]').forEach(function (node) {
      node.textContent = value || node.textContent;
    });
  }

  function link(label, href, secondary) {
    var a = document.createElement('a');
    a.className = 'button' + (secondary ? ' secondary' : '');
    a.href = href || '#';
    a.textContent = label || 'Open';
    return a;
  }

  function render(cfg) {
    cfg = cfg || {};
    var runtime = window.MERIT_DEMO_CONFIG || {};
    var runtimeBrand = runtime.branding || {};
    var brand = Object.assign({
      name: runtimeBrand.product_name ? runtimeBrand.product_name + ' Portal' : '',
      tagline: runtimeBrand.tagline || '',
      description: runtimeBrand.description || '',
    }, runtimeBrand, cfg.brand || {});
    text('brand.name', brand.name);
    text('brand.tagline', brand.tagline);
    text('brand.description', brand.description);
    text('footer', cfg.footer || 'MERIT Powered');
    if (brand.name) document.title = brand.name;

    var ctas = document.getElementById('portal-ctas');
    (cfg.ctas || []).forEach(function (cta, idx) {
      var href = cta.href;
      if (/workbench/i.test(cta.label || '')) href = '/play/';
      if (/register/i.test(cta.label || '')) href = runtime.meritstoreRegisterUrl || href;
      ctas.appendChild(link(cta.label, href, idx > 0));
    });

    var cards = document.getElementById('provider-cards');
    (cfg.providers || []).forEach(function (provider) {
      var card = document.createElement('article');
      card.className = 'card';
      var heading = document.createElement('h3');
      var summary = document.createElement('p');
      var anchor = document.createElement('a');
      heading.textContent = provider.name || 'MERIT provider';
      summary.textContent = provider.summary || '';
      var href = provider.href || cfg.appBaseUrl || '#';
      if (/workbench/i.test(provider.name || '')) href = '/play/';
      if (/journal/i.test(provider.name || '')) href = '/journal/';
      if (/ama/i.test(provider.name || '')) href = '/ama/';
      if (/meritsubs|subscription/i.test(provider.name || '')) href = runtime.meritstoreRegisterUrl || href;
      anchor.href = href;
      var statusPath = provider.statusPath || '';
      if (/meritsubs|subscription/i.test(provider.name || '') && runtime.consumer_id) {
        statusPath = '/store/' + runtime.consumer_id + '/register';
      }
      anchor.textContent = statusPath ? 'Open ' + statusPath : 'Open';
      card.append(heading, summary, anchor);
      cards.appendChild(card);
    });

    var notes = document.getElementById('portal-notes');
    (cfg.notes || []).forEach(function (note) {
      var li = document.createElement('li');
      li.textContent = note;
      notes.appendChild(li);
    });

    var contactForm = document.getElementById('contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', function (event) {
        event.preventDefault();
        var name = document.getElementById('contact-name').value.trim() || 'ITM visitor';
        var email = document.getElementById('contact-email').value.trim();
        var message = document.getElementById('contact-message').value.trim() || 'I would like to learn more about ITM.';
        var subject = 'ITM contact request from ' + name;
        var body = [
          'Hello ITM,',
          '',
          message,
          '',
          'Name: ' + name,
          'Reply email: ' + email,
          '',
          'Placeholder ITM phone: +1 (555) 010-4826'
        ].join('\n');
        var status = document.getElementById('contact-status');
        var mailto = 'mailto:hello@itm.example?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
        var copied = navigator.clipboard && navigator.clipboard.writeText
          ? navigator.clipboard.writeText(body)
          : Promise.reject(new Error('clipboard unavailable'));
        copied.then(function () {
          status.hidden = false;
          status.textContent = 'Message copied. You can paste it into a text message. Opening your mail app…';
        }).catch(function () {
          status.hidden = false;
          status.textContent = 'Your mail app is opening. If needed, copy the prepared message from the email body to text it.';
        }).finally(function () {
          window.location.href = mailto;
        });
      });
    }
  }

  fetch('/portal.json', { cache: 'no-store' })
    .then(function (res) { return res.json(); })
    .then(render)
    .catch(function () { render({}); });
})();

