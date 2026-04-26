document.addEventListener("DOMContentLoaded", () => {

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
