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

    setupBooking(runtime);
  }

  function setupBooking(runtime) {
    var app = document.getElementById('booking-app');
    if (!app) return;
    var apiBase = runtime.meritstoreApiBase || '';
    var registerUrl = runtime.meritstoreRegisterUrl || '/subs/';
    if (!apiBase) {
      app.innerHTML = '<p class="notice">Subscriber registration and calendar booking are not connected yet.</p><a class="button secondary" href="' + registerUrl + '">Start subscriber registration</a>';
      return;
    }
    var tenant = 'itm';
    var from = new Date();
    var to = new Date(Date.now() + 14 * 86400000);
    var url = apiBase + '/v1/tenants/' + tenant + '/availability?from=' + encodeURIComponent(from.toISOString()) + '&to=' + encodeURIComponent(to.toISOString()) + '&duration=90';
    fetch(url, { cache: 'no-store' }).then(function (response) {
      if (!response.ok) throw new Error('availability unavailable');
      return response.json();
    }).then(function (payload) {
      var slots = (payload.availability || []).filter(function (slot) { return slot.status === 'available'; });
      if (!slots.length) throw new Error('no slots');
      app.innerHTML = '<label for="booking-slot">1. Choose an available time</label><select id="booking-slot"><option value="">Select a time</option></select><label for="booking-service">2. Choose your service</label><select id="booking-service"><option value="">Select a service</option></select><p id="booking-status" class="notice" hidden></p><a class="button secondary" href="' + registerUrl + '">Register or sign in to book</a>';
      var slotSelect = document.getElementById('booking-slot');
      slots.forEach(function (slot) {
        var option = document.createElement('option');
        option.value = slot.slot_id;
        option.textContent = new Date(slot.starts_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
        slotSelect.appendChild(option);
      });
      fetch(apiBase + '/v1/tenants/' + tenant + '/offerings?catalog=1', { cache: 'no-store' }).then(function (response) { return response.json(); }).then(function (catalog) {
        (catalog.offerings || []).filter(function (item) { return item.status === 'open' || item.availability === 'open' || item.status === 'consultation_required'; }).forEach(function (item) {
          var option = document.createElement('option');
          option.value = item.offering_id;
          option.textContent = item.title + (item.price_cents ? ' — $' + (item.price_cents / 100).toFixed(2) : ' — consultation pricing');
          document.getElementById('booking-service').appendChild(option);
        });
      });
      document.getElementById('booking-service').addEventListener('change', function () {
        var status = document.getElementById('booking-status');
        if (slotSelect.value && this.value) {
          status.hidden = false;
          status.textContent = 'Time selected. Register or sign in above to place a provider-owned hold and continue to checkout.';
        }
      });
    }).catch(function () {
      app.innerHTML = '<p class="notice">Calendar booking is waiting for the MeritStore ITM provider connection. Subscriber registration will appear here when the tenant is activated.</p><a class="button secondary" href="' + registerUrl + '">Start subscriber registration</a>';
    });
  }

  fetch('/portal.json', { cache: 'no-store' })
    .then(function (res) { return res.json(); })
    .then(render)
    .catch(function () { render({}); });
})();

