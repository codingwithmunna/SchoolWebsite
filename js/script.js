/* ==========================================================================
   Greenwood Valley School — Shared Script
   Handles: mobile nav, sticky header shadow, scroll reveal, stat counters,
   footer year, and contact form validation (used on contact.html only).
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.querySelector(".nav-toggle");
  const mainNav = document.querySelector(".main-nav");

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      const isOpen = mainNav.classList.toggle("is-open");
      navToggle.classList.toggle("is-open", isOpen);
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mainNav.classList.remove("is-open");
        navToggle.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Sticky header shadow on scroll ---------- */
  const header = document.querySelector(".site-header");
  if (header) {
    const onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll("[data-reveal]");
  if (revealEls.length) {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      revealEls.forEach(function (el) { el.classList.add("is-visible"); });
    } else {
      const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

      revealEls.forEach(function (el) { observer.observe(el); });
    }
  }

  /* ---------- Animated stat counters ---------- */
  const statNums = document.querySelectorAll(".stat__num[data-count-to]");
  if (statNums.length && "IntersectionObserver" in window) {
    const animateCount = function (el) {
      const target = parseInt(el.getAttribute("data-count-to"), 10) || 0;
      const suffix = el.getAttribute("data-suffix") || "";
      const duration = 1400;
      const start = performance.now();

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    };

    const statObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          statObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    statNums.forEach(function (el) { statObserver.observe(el); });
  }

  /* ---------- Gallery category filter (gallery.html only) ---------- */
  const tabButtons = document.querySelectorAll(".tab-btn[data-filter]");
  const galleryTiles = document.querySelectorAll(".gallery-tile[data-cat]");
  if (tabButtons.length && galleryTiles.length) {
    tabButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        tabButtons.forEach(function (b) { b.classList.remove("is-active"); });
        btn.classList.add("is-active");
        const filter = btn.getAttribute("data-filter");

        galleryTiles.forEach(function (tile) {
          const show = filter === "all" || tile.getAttribute("data-cat") === filter;
          tile.classList.toggle("is-hidden", !show);
        });
      });
    });
  }

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Contact form validation (only present on contact.html) ---------- */
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      let valid = true;

      contactForm.querySelectorAll("[data-error]").forEach(function (errEl) {
        errEl.textContent = "";
      });

      const name = contactForm.querySelector("#name");
      const email = contactForm.querySelector("#email");
      const message = contactForm.querySelector("#message");

      if (!name.value.trim()) {
        setError(name, "Please enter your name.");
        valid = false;
      }
      if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        setError(email, "Please enter a valid email address.");
        valid = false;
      }
      if (!message.value.trim()) {
        setError(message, "Please write a short message.");
        valid = false;
      }

      const statusEl = document.getElementById("form-status");
      if (valid) {
        statusEl.textContent = "Thank you — your message has been noted. Our office will get back to you soon.";
        statusEl.className = "form-status form-status--success";
        contactForm.reset();
      } else {
        statusEl.textContent = "Please fix the highlighted fields and try again.";
        statusEl.className = "form-status form-status--error";
      }
    });
  }

  function setError(inputEl, msg) {
    const err = inputEl.closest(".field").querySelector("[data-error]");
    if (err) err.textContent = msg;
  }

});
