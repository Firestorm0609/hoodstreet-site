/* =========================================================
   HOODSTREET — Interactions

========================================================= */

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ---------------------------------------------------------
   TWEAK THESE — links used across the page
--------------------------------------------------------- */

const LINKS = {
  // Point this at the live drop once the collection page exists.
  mint: "https://opensea.io/",
  // The project X account.
  x: "https://x.com/",
  // The live Agent site — stake in, pick a brain, send it to work.
  app: "https://hoodstreet-app.onrender.com"
};

$$("[data-link]").forEach((el) => {
  const key = el.getAttribute("data-link");
  if (key && LINKS[key]) el.setAttribute("href", LINKS[key]);
});

const yearEl = $("#year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

/* ---------------------------------------------------------
   ENTRANCE
--------------------------------------------------------- */

const body = document.body;
const entrance = $("#entrance");
const site = $("#site");
const enterBtn = $("#enterBtn");
const menuBtn = $("#menuBtn");
const mobileMenu = $("#mobileMenu");
const cursorGlow = $("#cursorGlow");

function enter() {
  entrance.classList.add("leave");
  site.classList.add("visible");
  site.setAttribute("aria-hidden", "false");
  body.classList.remove("entrance-active");

  setTimeout(() => {
    entrance.style.display = "none";
  }, 1600);
}

if (enterBtn) enterBtn.addEventListener("click", enter);

document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && entrance && !entrance.classList.contains("leave")) {
    e.preventDefault();
    enter();
  }
});

/* ---------------------------------------------------------
   MOBILE MENU
--------------------------------------------------------- */

function toggleMenu() {
  const isOpen = mobileMenu.classList.toggle("open");
  menuBtn.classList.toggle("active", isOpen);
  menuBtn.setAttribute("aria-expanded", String(isOpen));
  body.style.overflow = isOpen ? "hidden" : "";
}

if (menuBtn) menuBtn.addEventListener("click", toggleMenu);

$$(".mobile-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("open");
    menuBtn.classList.remove("active");
    menuBtn.setAttribute("aria-expanded", "false");
    body.style.overflow = "";
  });
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && mobileMenu && mobileMenu.classList.contains("open")) {
    toggleMenu();
  }
});

/* ---------------------------------------------------------
   SCROLL REVEALS
--------------------------------------------------------- */

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
);

$$(".reveal").forEach((el) => revealObserver.observe(el));

/* ---------------------------------------------------------
   CURSOR GLOW (desktop only)
--------------------------------------------------------- */

if (window.matchMedia("(pointer: fine)").matches && cursorGlow) {
  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  (function animateGlow() {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    cursorGlow.style.left = glowX + "px";
    cursorGlow.style.top = glowY + "px";
    requestAnimationFrame(animateGlow);
  })();
}

/* ---------------------------------------------------------
   NAVBAR SCROLL EFFECT
--------------------------------------------------------- */

const navbar = $(".navbar");

if (navbar) {
  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;

    if (scrollY > 100) {
      navbar.style.background =
        "linear-gradient(180deg, rgba(10,10,10,.98) 0%, rgba(10,10,10,.95) 80%, rgba(10,10,10,.85) 100%)";
    } else {
      navbar.style.background =
        "linear-gradient(180deg, rgba(10,10,10,.95) 0%, rgba(10,10,10,.7) 60%, transparent 100%)";
    }
  }, { passive: true });
}

/* ---------------------------------------------------------
   PARALLAX — hero background text
--------------------------------------------------------- */

const heroBgText = $(".hero-bg-text");

if (heroBgText) {
  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight) {
      heroBgText.style.transform =
        `translate(-50%, calc(-50% + ${scrollY * 0.15}px))`;
    }
  }, { passive: true });
}
