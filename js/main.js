/* ============================================================
   main.js — Raul Medeiros personal website
   Vanilla JS only. No jQuery, no frameworks.
   ============================================================ */

(function () {
  'use strict';

  /* ── 1. Nav scroll state ─────────────────────────────────── */
  var nav = document.getElementById('nav');

  function updateNav() {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav(); // run once on load

  /* ── 2. Mobile menu ──────────────────────────────────────── */
  var toggle   = document.getElementById('nav-toggle');
  var navLinks = document.getElementById('nav-links');

  toggle.addEventListener('click', function () {
    var isOpen = navLinks.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close menu when any nav link is clicked
  navLinks.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ── 3. Active nav link (IntersectionObserver) ───────────── */
  var sections = document.querySelectorAll('section[id], header[id]');
  var allNavLinks = document.querySelectorAll('.nav-link');

  var sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var id = '#' + entry.target.id;
        allNavLinks.forEach(function (link) {
          link.classList.toggle('active', link.getAttribute('href') === id);
        });
      }
    });
  }, {
    rootMargin: '-40% 0px -55% 0px'
  });

  sections.forEach(function (section) {
    sectionObserver.observe(section);
  });

  /* ── 4. Skill bars (IntersectionObserver) ────────────────── */
  var skillsList = document.querySelector('.skills-list');

  if (skillsList) {
    var skillsObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.skill-fill').forEach(function (bar) {
            bar.style.width = bar.dataset.width;
          });
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.3
    });

    skillsObserver.observe(skillsList);
  }

  /* ── 5. Smooth scroll for anchor links ───────────────────── */
  var NAV_OFFSET = 64; // matches --nav-h

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href === '#') return;

      var target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      var top = target.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;

      window.scrollTo({
        top: top,
        behavior: 'smooth'
      });
    });
  });

  /* ── 6. Contact form ─────────────────────────────────────── */
  var contactForm = document.getElementById('contact-form');
  var formStatus  = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var submitBtn  = contactForm.querySelector('button[type="submit"]');
      var btnText    = submitBtn.querySelector('.btn-text');
      var btnLoading = submitBtn.querySelector('.btn-loading');

      // Disable button and show loading state
      submitBtn.disabled          = true;
      btnText.style.display       = 'none';
      btnLoading.style.display    = 'inline';
      btnLoading.removeAttribute('aria-hidden');

      // Clear previous status
      formStatus.textContent  = '';
      formStatus.className    = '';

      var data = new URLSearchParams({
        contactName:    contactForm.contactName.value,
        contactEmail:   contactForm.contactEmail.value,
        contactSubject: contactForm.contactSubject.value,
        contactMessage: contactForm.contactMessage.value
      });

      fetch('inc/sendEmail.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: data
      })
        .then(function (response) {
          return response.text();
        })
        .then(function (text) {
          if (text.trim() === 'OK') {
            formStatus.textContent = 'Your message was sent successfully. I\'ll get back to you soon!';
            formStatus.className   = 'success';
            contactForm.reset();
          } else {
            formStatus.innerHTML = text || 'Something went wrong. Please try again.';
            formStatus.className = 'error';
          }
        })
        .catch(function () {
          formStatus.textContent = 'Network error. Please check your connection and try again.';
          formStatus.className   = 'error';
        })
        .finally(function () {
          submitBtn.disabled       = false;
          btnText.style.display    = '';
          btnLoading.style.display = 'none';
          btnLoading.setAttribute('aria-hidden', 'true');
        });
    });
  }

  /* ── Back-to-top button ──────────────────────────────────── */
  var backToTop = document.getElementById('back-to-top');

  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

})();
