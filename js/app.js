document.addEventListener("DOMContentLoaded", () => {

  // -------------------------------------------------------
  // PRODUCTIONS FILTER
  // -------------------------------------------------------
  const filterBtns = document.querySelectorAll('.prod-filter-btn');
  const prodRows = document.querySelectorAll('.prod-row');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      let num = 1;

      prodRows.forEach(row => {
        // Split into individual words for exact whole-word matching
        // (prevents 'mix' from accidentally matching inside other role names)
        const roles = (row.dataset.roles || '').split(/\s+/);
        const show = filter === 'all' || roles.includes(filter);
        row.style.display = show ? '' : 'none';
        if (show) {
          row.querySelector('.prod-num').textContent = String(num).padStart(2, '0');
          num++;
        }
      });
    });
  });


  // -------------------------------------------------------
  // CAROUSEL DOTS
  // -------------------------------------------------------
  document.querySelectorAll('.live-carousel').forEach(carousel => {
    const slides = carousel.querySelectorAll('.live-slide');
    if (slides.length <= 1) return;

    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'carousel-dots';
    slides.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dotsContainer.appendChild(dot);
    });
    carousel.appendChild(dotsContainer);

    const dots = dotsContainer.querySelectorAll('.carousel-dot');

    const origObserver = new MutationObserver(() => {
      slides.forEach((slide, i) => {
        dots[i]?.classList.toggle('active', slide.classList.contains('active'));
      });
    });
    slides.forEach(slide => origObserver.observe(slide, { attributes: true, attributeFilter: ['class'] }));
  });


  // -------------------------------------------------------
  // -------------------------------------------------------
  const revealEls = document.querySelectorAll('.reveal, .reveal-grid');

  if ('IntersectionObserver' in window && revealEls.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }


  // -------------------------------------------------------
  // NAV ACTIVE LINK HIGHLIGHT ON SCROLL
  // -------------------------------------------------------
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
  const sections = [...navAnchors].map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);

  if (sections.length && 'IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navAnchors.forEach(a => {
            a.style.color = a.getAttribute('href') === `#${entry.target.id}`
              ? 'var(--brand)'
              : '';
          });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });

    sections.forEach(s => navObserver.observe(s));
  }


  // -------------------------------------------------------
  // FOOTER YEAR
  // -------------------------------------------------------
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }


  // -------------------------------------------------------
  // MOBILE MENU
  // -------------------------------------------------------
  const navToggle = document.querySelector(".nav-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");
  const mobileLinks = document.querySelectorAll(".mobile-link");

  if (navToggle && mobileMenu) {

    const setOpen = (open) => {
      navToggle.setAttribute("aria-expanded", String(open));
      mobileMenu.hidden = !open;
    };

    navToggle.addEventListener("click", () => {
      const isOpen = navToggle.getAttribute("aria-expanded") === "true";
      setOpen(!isOpen);
    });

    mobileLinks.forEach(link => {
      link.addEventListener("click", () => setOpen(false));
    });

  }


  // -------------------------------------------------------
  // HERO CAROUSEL (UPCOMING)
  // -------------------------------------------------------
  const heroSlides = document.querySelectorAll(".upcoming-slide");

  if (heroSlides.length > 1) {

    let index = 0;

    const showSlide = (i) => {
      heroSlides.forEach((slide, idx) => {
        slide.classList.toggle("is-active", idx === i);
      });
    };

    setInterval(() => {
      index = (index + 1) % heroSlides.length;
      showSlide(index);
    }, 3500);

  }


  // -------------------------------------------------------
  // MUSIC PLAYER
  // -------------------------------------------------------
  const musicCards = document.querySelectorAll(".music-card");

  let currentAudio = null;
  let currentButton = null;

  musicCards.forEach(card => {

    const audio = card.querySelector("audio");
    const btn = card.querySelector(".play-btn");

    if (!audio || !btn) return;

    btn.addEventListener("click", () => {

      // Stop previous track
      if (currentAudio && currentAudio !== audio) {
        currentAudio.pause();
        if (currentButton) currentButton.textContent = "Play";
      }

      if (audio.paused) {

        audio.play().catch(() => {
          console.warn("Playback blocked by browser");
        });

        btn.textContent = "Stop";
        currentAudio = audio;
        currentButton = btn;

      } else {

        audio.pause();
        btn.textContent = "Play";
        currentAudio = null;
        currentButton = null;

      }

    });

    audio.addEventListener("ended", () => {
      btn.textContent = "Play";
      if (currentAudio === audio) {
        currentAudio = null;
        currentButton = null;
      }
    });

  });


  // -------------------------------------------------------
  // HELPER: SAFE FETCH (FOR FORMS)
  // -------------------------------------------------------
  const submitForm = async (form, msgEl, successMessage) => {

    const formData = new FormData(form);

    if (msgEl) msgEl.textContent = "Sending...";

    try {

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      let data = null;

      try {
        data = await response.json();
      } catch {
        throw new Error("Invalid server response");
      }

      if (response.ok && data.success) {
        if (msgEl) msgEl.textContent = successMessage;
        form.reset();
      } else {
        if (msgEl) msgEl.textContent = "Something went wrong.";
      }

    } catch (error) {
      if (msgEl) msgEl.textContent = "Connection error.";
    }

  };


  // -------------------------------------------------------
  // NEWSLETTER FORMS
  // -------------------------------------------------------
  const newsletterForms = document.querySelectorAll(".newsletter-form");

  newsletterForms.forEach(form => {

    const msg = form.closest(".newsletter")?.querySelector(".newsletter-msg");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      submitForm(form, msg, "You're in. New music & insights soon.");
    });

  });


  // -------------------------------------------------------
  // COLLAB FORM
  // -------------------------------------------------------
  const collabForm = document.querySelector(".collab-form");

  if (collabForm) {

    const msg = document.querySelector(".collab-msg");
    const btn = collabForm.querySelector('button[type="submit"]');

    collabForm.addEventListener("submit", async (e) => {

      e.preventDefault();

      const name = collabForm.elements["name"]?.value.trim();
      const email = collabForm.elements["email"]?.value.trim();

      if (!name || !email) {
        if (msg) msg.textContent = "Please fill in your name and e-mail.";
        return;
      }

      const originalText = btn.textContent;
      btn.textContent = "Sending...";
      btn.disabled = true;

      await submitForm(collabForm, msg, "Message sent successfully ✅");

      btn.textContent = originalText;
      btn.disabled = false;

    });

  }


  // -------------------------------------------------------
  // LIVE CAROUSELS
  // -------------------------------------------------------
  const liveCarousels = document.querySelectorAll(".live-carousel");

  liveCarousels.forEach(carousel => {

    const slides = carousel.querySelectorAll(".live-slide");
    if (slides.length <= 1) return;

    let index = 0;
    let interval;

    const showSlide = (i) => {
      slides.forEach((slide, idx) => {
        slide.classList.toggle("active", idx === i);
      });
    };

    const start = () => {
      stop();
      interval = setInterval(() => {
        index = (index + 1) % slides.length;
        showSlide(index);
      }, 4000);
    };

    const stop = () => {
      if (interval) clearInterval(interval);
    };

    carousel.addEventListener("mouseenter", stop);
    carousel.addEventListener("mouseleave", start);

    showSlide(index);
    start();

  });

});