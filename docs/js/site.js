(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function updateHeader() {
    const header = document.querySelector(".ud-header");
    if (!header) {
      return;
    }

    const isSticky = window.scrollY > header.offsetTop;
    const isOverlay = header.dataset.overlay == "true";
    header.classList.toggle("sticky", isSticky);

    const logo = document.querySelector(".header-logo");
    if (logo) {
      const useLightLogo = isOverlay && !isSticky;
      logo.src = useLightLogo
        ? "/images/logo/amerikadansat-white-text-logo.svg"
        : "/images/logo/amerikadansat-black-text-logo.svg";
    }

    const backToTop = document.querySelector(".back-to-top");
    if (backToTop) {
      backToTop.style.display = window.scrollY > 50 ? "flex" : "none";
    }
  }

  function initNavigation() {
    const toggler = document.querySelector("#navbarToggler");
    const collapse = document.querySelector("#navbarCollapse");
    if (!toggler || !collapse) return;

    toggler.addEventListener("click", function () {
      const open = toggler.classList.toggle("navbarTogglerActive");
      collapse.classList.toggle("hidden", !open);
      toggler.setAttribute("aria-expanded", String(open));
    });

    collapse.querySelectorAll("li:not(.submenu-item) a").forEach(function (link) {
      link.addEventListener("click", function () {
        toggler.classList.remove("navbarTogglerActive");
        collapse.classList.add("hidden");
        toggler.setAttribute("aria-expanded", "false");
      });
    });

    document.querySelectorAll(".submenu-item").forEach(function (item) {
      const trigger = item.querySelector("a");
      const submenu = item.querySelector(".submenu");
      if (!trigger || !submenu) return;

      trigger.addEventListener("click", function (event) {
        event.preventDefault();

        if (window.innerWidth < 960) {
          const open = submenu.classList.toggle("hidden");
          trigger.setAttribute("aria-expanded", String(!open));
        }
      });

      submenu.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
          submenu.classList.add("hidden");
          trigger.setAttribute("aria-expanded", "false");
          toggler.classList.remove("navbarTogglerActive");
          collapse.classList.add("hidden");
          toggler.setAttribute("aria-expanded", "false");
        });
      });
    });

    document.addEventListener("click", function (event) {
      if (!collapse.contains(event.target) && !toggler.contains(event.target)) {
        toggler.classList.remove("navbarTogglerActive");
        collapse.classList.add("hidden");
        toggler.setAttribute("aria-expanded", "false");
      }
    });
  }

  function initScrollSpy() {
    const links = Array.from(document.querySelectorAll(".ud-menu-scroll")).filter(
      function (link) {
        return (link.getAttribute("href") || "").startsWith("#");
      },
    );
    if (!links.length) return;

    function updateActiveLink() {
      const scrollPosition = window.scrollY + 85;
      let active = links[0];

      links.forEach(function (link) {
        const target = document.querySelector(link.getAttribute("href"));
        if (target && target.offsetTop <= scrollPosition) {
          active = link;
        }
      });

      links.forEach(function (link) {
        link.classList.toggle("active", link === active);
      });
    }

    updateActiveLink();
    window.addEventListener("scroll", updateActiveLink, { passive: true });
  }

  function initBackToTop() {
    const backToTop = document.querySelector(".back-to-top");
    if (!backToTop) return;

    backToTop.addEventListener("click", function (event) {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  function initCarousel() {
    if (typeof window.Swiper === "undefined") return;
    if (!document.querySelector(".testimonial-carousel")) return;

    new window.Swiper(".testimonial-carousel", {
      slidesPerView: 1,
      spaceBetween: 30,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      breakpoints: {
        640: {
          slidesPerView: 2,
          spaceBetween: 30,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 30,
        },
        1280: {
          slidesPerView: 3,
          spaceBetween: 30,
        },
      },
    });
  }

  function initAnimations() {
    if (reduceMotion || typeof window.WOW === "undefined") return;
    new window.WOW({ offset: 60 }).init();
  }

  document.addEventListener("DOMContentLoaded", function () {
    initNavigation();
    initScrollSpy();
    initBackToTop();
    initCarousel();
    initAnimations();
    updateHeader();
  });

  window.addEventListener("scroll", updateHeader, { passive: true });
})();
