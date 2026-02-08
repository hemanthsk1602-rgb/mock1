/* ============================================
   NEXUSPAY — Interactive Features
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- 1. Dark Mode Toggle ---- */
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    const saved = localStorage.getItem('nexuspay-theme');
    if (saved) {
      document.documentElement.setAttribute('data-theme', saved);
      updateThemeIcon(saved);
    }

    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('nexuspay-theme', next);
      updateThemeIcon(next);
    });
  }

  function updateThemeIcon(theme) {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    btn.innerHTML = theme === 'dark'
      ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>'
      : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  }

  /* ---- 2. Animated Statistics Counter ---- */
  const counters = document.querySelectorAll('[data-count]');
  let countersAnimated = false;

  function animateCounters() {
    if (countersAnimated) return;
    counters.forEach(counter => {
      const rect = counter.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        countersAnimated = true;
        const target = parseInt(counter.getAttribute('data-count'), 10);
        const suffix = counter.getAttribute('data-suffix') || '';
        const prefix = counter.getAttribute('data-prefix') || '';
        const duration = 2000;
        const startTime = performance.now();

        function update(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.floor(eased * target);
          counter.textContent = prefix + current.toLocaleString() + suffix;
          if (progress < 1) {
            requestAnimationFrame(update);
          } else {
            counter.textContent = prefix + target.toLocaleString() + suffix;
          }
        }
        requestAnimationFrame(update);
      }
    });
  }

  if (counters.length) {
    window.addEventListener('scroll', animateCounters, { passive: true });
    animateCounters();
  }

  /* ---- 3. Scroll Fade-In Animations ---- */
  const fadeElements = document.querySelectorAll('.fade-in');

  function handleFadeIn() {
    fadeElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 60) {
        el.classList.add('visible');
      }
    });
  }

  if (fadeElements.length) {
    window.addEventListener('scroll', handleFadeIn, { passive: true });
    handleFadeIn();
  }

  /* ---- 4. Payment Calculator ---- */
  const calcForm = document.getElementById('payment-calc');
  if (calcForm) {
    const amountInput = calcForm.querySelector('#calc-amount');
    const fromCurrency = calcForm.querySelector('#calc-from');
    const toCurrency = calcForm.querySelector('#calc-to');
    const calcBtn = calcForm.querySelector('#calc-btn');
    const resultDisplay = calcForm.querySelector('.result-display');

    const rates = {
      USD: 1, EUR: 0.92, GBP: 0.79, JPY: 149.50, INR: 83.12,
      AUD: 1.53, CAD: 1.36, CHF: 0.88, CNY: 7.24, SGD: 1.34,
      AED: 3.67, BRL: 4.97, KRW: 1327.50, MXN: 17.15, ZAR: 18.90
    };

    function calculatePayment() {
      const amount = parseFloat(amountInput.value);
      if (isNaN(amount) || amount <= 0) {
        resultDisplay.innerHTML = '<p class="result-label">Enter a valid amount</p>';
        return;
      }
      const from = fromCurrency.value;
      const to = toCurrency.value;
      const inUSD = amount / rates[from];
      const converted = inUSD * rates[to];
      const fee = converted * 0.015;
      const total = converted + fee;

      resultDisplay.innerHTML = `
        <p class="result-label">Converted Amount</p>
        <p class="result-value">${to} ${converted.toFixed(2)}</p>
        <p class="result-detail">Transaction Fee (1.5%): ${to} ${fee.toFixed(2)}</p>
        <p class="result-detail"><strong>Total: ${to} ${total.toFixed(2)}</strong></p>
        <p class="result-detail" style="margin-top:0.5rem;font-size:0.7rem;color:var(--color-text-muted)">Rate: 1 ${from} = ${(rates[to] / rates[from]).toFixed(4)} ${to}</p>
      `;
    }

    calcBtn.addEventListener('click', (e) => {
      e.preventDefault();
      calculatePayment();
    });
  }

  /* ---- 5. Currency Converter ---- */
  const converterForm = document.getElementById('currency-converter');
  if (converterForm) {
    const convAmount = converterForm.querySelector('#conv-amount');
    const convFrom = converterForm.querySelector('#conv-from');
    const convTo = converterForm.querySelector('#conv-to');
    const convBtn = converterForm.querySelector('#conv-btn');
    const convSwap = converterForm.querySelector('#conv-swap');
    const convResult = converterForm.querySelector('.result-display');

    const rates = {
      USD: 1, EUR: 0.92, GBP: 0.79, JPY: 149.50, INR: 83.12,
      AUD: 1.53, CAD: 1.36, CHF: 0.88, CNY: 7.24, SGD: 1.34,
      AED: 3.67, BRL: 4.97, KRW: 1327.50, MXN: 17.15, ZAR: 18.90
    };

    function convertCurrency() {
      const amount = parseFloat(convAmount.value);
      if (isNaN(amount) || amount <= 0) {
        convResult.innerHTML = '<p class="result-label">Enter a valid amount</p>';
        return;
      }
      const from = convFrom.value;
      const to = convTo.value;
      const inUSD = amount / rates[from];
      const converted = inUSD * rates[to];
      const rate = rates[to] / rates[from];

      convResult.innerHTML = `
        <p class="result-label">Conversion Result</p>
        <p class="result-value">${to} ${converted.toFixed(2)}</p>
        <p class="result-detail">1 ${from} = ${rate.toFixed(4)} ${to}</p>
        <p class="result-detail">1 ${to} = ${(1 / rate).toFixed(4)} ${from}</p>
      `;
    }

    convBtn.addEventListener('click', (e) => {
      e.preventDefault();
      convertCurrency();
    });

    if (convSwap) {
      convSwap.addEventListener('click', () => {
        const temp = convFrom.value;
        convFrom.value = convTo.value;
        convTo.value = temp;
      });
    }
  }

  /* ---- 6. Transaction Simulation ---- */
  const simBtn = document.getElementById('sim-start');
  if (simBtn) {
    simBtn.addEventListener('click', runSimulation);
  }

  function runSimulation() {
    const visual = document.getElementById('sim-icon');
    const status = document.getElementById('sim-status');
    const detail = document.getElementById('sim-detail');
    const steps = document.querySelectorAll('.sim-step');
    const btn = document.getElementById('sim-start');

    if (!visual || !status || !btn) return;

    btn.disabled = true;
    btn.textContent = 'Processing...';

    // Reset
    visual.className = 'sim-visual processing';
    visual.innerHTML = '&#9889;';
    status.textContent = 'Processing Payment';
    detail.textContent = 'Verifying transaction details...';
    steps.forEach(s => { s.className = 'sim-step'; });

    const stepsData = [
      { text: 'Initializing secure connection...', delay: 600 },
      { text: 'Verifying identity & credentials...', delay: 1200 },
      { text: 'Running fraud detection scan...', delay: 1800 },
      { text: 'Processing blockchain confirmation...', delay: 2500 },
      { text: 'Finalizing transfer...', delay: 3200 }
    ];

    stepsData.forEach((s, i) => {
      setTimeout(() => {
        if (i > 0 && steps[i - 1]) steps[i - 1].classList.remove('active');
        if (i > 0 && steps[i - 1]) steps[i - 1].classList.add('completed');
        if (steps[i]) steps[i].classList.add('active');
        detail.textContent = s.text;
      }, s.delay);
    });

    // Random success / failure
    const isSuccess = Math.random() > 0.15;

    setTimeout(() => {
      steps.forEach(s => { s.classList.remove('active'); s.classList.add('completed'); });

      if (isSuccess) {
        visual.className = 'sim-visual success';
        visual.innerHTML = '&#10003;';
        status.textContent = 'Payment Successful';
        detail.textContent = 'Transaction ID: NXP-' + Math.random().toString(36).substring(2, 10).toUpperCase();
      } else {
        visual.className = 'sim-visual failed';
        visual.innerHTML = '&#10007;';
        status.textContent = 'Payment Declined';
        detail.textContent = 'Fraud detection flagged unusual activity. Please verify and retry.';
      }

      btn.disabled = false;
      btn.textContent = 'Simulate Payment';
    }, 4000);
  }

  /* ---- 7. Contact Form Validation ---- */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      // Reset errors
      contactForm.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));

      // Name
      const name = contactForm.querySelector('#contact-name');
      if (name && name.value.trim().length < 2) {
        name.closest('.form-group').classList.add('error');
        valid = false;
      }

      // Email
      const email = contactForm.querySelector('#contact-email');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (email && !emailRegex.test(email.value.trim())) {
        email.closest('.form-group').classList.add('error');
        valid = false;
      }

      // Subject
      const subject = contactForm.querySelector('#contact-subject');
      if (subject && subject.value.trim().length < 3) {
        subject.closest('.form-group').classList.add('error');
        valid = false;
      }

      // Message
      const message = contactForm.querySelector('#contact-message');
      if (message && message.value.trim().length < 10) {
        message.closest('.form-group').classList.add('error');
        valid = false;
      }

      if (valid) {
        contactForm.style.display = 'none';
        const success = document.getElementById('form-success');
        if (success) success.classList.add('visible');
      }
    });
  }

  /* ---- 8. FAQ Accordion ---- */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all
      faqItems.forEach(other => {
        other.classList.remove('open');
        const otherAnswer = other.querySelector('.faq-answer');
        if (otherAnswer) otherAnswer.style.maxHeight = '0';
      });

      // Toggle current
      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* ---- 9. Fraud Detection Demo ---- */
  const fraudBtn = document.getElementById('fraud-toggle');
  if (fraudBtn) {
    const scenarios = [
      {
        score: 12, level: 'low', label: 'Low Risk',
        factors: [
          { name: 'IP Geolocation', status: 'safe', detail: 'Matches billing country' },
          { name: 'Device Fingerprint', status: 'safe', detail: 'Recognized device' },
          { name: 'Transaction Amount', status: 'safe', detail: 'Within normal range' },
          { name: 'Velocity Check', status: 'safe', detail: '2 transactions / 24h' }
        ]
      },
      {
        score: 54, level: 'medium', label: 'Medium Risk',
        factors: [
          { name: 'IP Geolocation', status: 'warn', detail: 'Different from billing country' },
          { name: 'Device Fingerprint', status: 'safe', detail: 'Recognized device' },
          { name: 'Transaction Amount', status: 'warn', detail: 'Above average spend' },
          { name: 'Velocity Check', status: 'safe', detail: '5 transactions / 24h' }
        ]
      },
      {
        score: 87, level: 'high', label: 'High Risk',
        factors: [
          { name: 'IP Geolocation', status: 'danger', detail: 'Known VPN / proxy detected' },
          { name: 'Device Fingerprint', status: 'danger', detail: 'Unrecognized device' },
          { name: 'Transaction Amount', status: 'warn', detail: 'Significantly above average' },
          { name: 'Velocity Check', status: 'danger', detail: '23 transactions / 24h' }
        ]
      }
    ];

    let scenarioIndex = 0;

    fraudBtn.addEventListener('click', () => {
      const scenario = scenarios[scenarioIndex];
      scenarioIndex = (scenarioIndex + 1) % scenarios.length;

      const scoreEl = document.getElementById('risk-score-value');
      const labelEl = document.getElementById('risk-label');
      const meterFill = document.getElementById('risk-meter-fill');
      const factorsEl = document.getElementById('risk-factors');

      if (scoreEl) {
        scoreEl.textContent = scenario.score;
        scoreEl.className = 'risk-score-value ' + scenario.level;
      }
      if (labelEl) labelEl.textContent = scenario.label;
      if (meterFill) meterFill.className = 'risk-meter-fill ' + scenario.level;
      if (factorsEl) {
        factorsEl.innerHTML = scenario.factors.map(f => `
          <div class="risk-factor">
            <span>${f.name}</span>
            <span style="color:var(--color-text-muted);font-size:0.75rem">${f.detail}</span>
            <span class="risk-factor-status ${f.status}"></span>
          </div>
        `).join('');
      }
    });
  }

  /* ---- Mobile menu a11y ---- */
  const navToggle = document.getElementById('nav-toggle');
  const navLabel = document.querySelector('.nav-toggle-label');
  if (navToggle && navLabel) {
    navToggle.addEventListener('change', () => {
      const expanded = navToggle.checked;
      navLabel.setAttribute('aria-expanded', expanded.toString());
    });
  }

});
