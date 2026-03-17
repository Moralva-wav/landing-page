document.addEventListener("DOMContentLoaded", () => {

  // -------------------------------------------------------
  // Añade el año actual automáticamente en el footer
  // -------------------------------------------------------
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }


  // -------------------------------------------------------
  // MENÚ DE NAVEGACIÓN MÓVIL
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

    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => setOpen(false));
    });

  }


  // -------------------------------------------------------
  // CAROUSEL: Sección "Upcoming"
  // -------------------------------------------------------
  const slides = Array.from(document.querySelectorAll(".upcoming-slide"));

  if (slides.length > 0) {

    let idx = 0;

    const showSlide = (i) => {
      slides.forEach((s, index) => {
        s.classList.toggle("is-active", index === i);
      });
    };

    showSlide(idx);

    setInterval(() => {
      idx = (idx + 1) % slides.length;
      showSlide(idx);
    }, 3500);

  }


  // -------------------------------------------------------
  // REPRODUCTOR DE MÚSICA
  // -------------------------------------------------------
  const musicCards = Array.from(document.querySelectorAll(".music-card"));

  let currentAudio = null;
  let currentButton = null;

  musicCards.forEach((card) => {

    const audio = card.querySelector("audio");
    const btn = card.querySelector(".play-btn");

    if (!audio || !btn) return;

    btn.addEventListener("click", () => {

      if (currentAudio && currentAudio !== audio) {
        currentAudio.pause();
        if (currentButton) currentButton.textContent = "Play";
      }

      if (audio.paused) {

        audio.currentTime = 0;
        audio.play();

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
  // FORMULARIOS DE NEWSLETTER
  // -------------------------------------------------------
  const newsletterForms = document.querySelectorAll(".newsletter-form");

  newsletterForms.forEach((form) => {

    const msg = form.parentElement.querySelector(".newsletter-msg");

    form.addEventListener("submit", (e) => {

      e.preventDefault();

      const email = form.elements["email"]?.value.trim();

      if (!email) {
        if (msg) msg.textContent = "Please enter a valid e-mail.";
        return;
      }

      if (msg) msg.textContent = "Thanks for subscribing! ✉️";

      form.reset();

    });

  });


  // -------------------------------------------------------
  // FORMULARIO DE COLABORACIÓN
  // -------------------------------------------------------
  const collabForm = document.querySelector(".collab-form");

  if (collabForm) {

    const collabMsg = document.querySelector(".collab-msg");

    collabForm.addEventListener("submit", (e) => {

      e.preventDefault();

      const name = collabForm.elements["name"]?.value.trim();
      const email = collabForm.elements["email"]?.value.trim();

      if (!name || !email) {

        if (collabMsg) {
          collabMsg.textContent = "Please fill in your name and e-mail.";
        }

        return;
      }

      if (collabMsg) {
        collabMsg.textContent = "Thanks! I’ll get back to you soon.";
      }

      collabForm.reset();

    });

  }


  // -------------------------------------------------------
  // LIVE SECTION CAROUSEL
  // Auto sliding cards for Live Production
  // -------------------------------------------------------

  const liveCarousels = document.querySelectorAll(".live-carousel");

  liveCarousels.forEach((carousel) => {

    const slides = carousel.querySelectorAll(".live-slide");

    let index = 0;
    let interval;

    const showSlide = (i) => {

      slides.forEach((slide, idx) => {
        slide.classList.toggle("active", idx === i);
      });

    };

    const startCarousel = () => {

      interval = setInterval(() => {

        index = (index + 1) % slides.length;

        showSlide(index);

      }, 4000);

    };

    const stopCarousel = () => {

      clearInterval(interval);

    };

    carousel.addEventListener("mouseenter", stopCarousel);
    carousel.addEventListener("mouseleave", startCarousel);

    showSlide(index);
    startCarousel();

  });

});