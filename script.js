/* =========================================================
   HOODSTREET — Interactions

   The page has three jobs:
     1. Apply the live links (OpenSea drop, X, the street app).
     2. The enlistment form: click stamps it, then opens the app.
     3. The GTD form: wallet signups for the allowlist stage.
========================================================= */

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ---------------------------------------------------------
   LINKS — where the page sends people
--------------------------------------------------------- */

const LINKS = {
  // The live OpenSea drop.
  mint: "https://opensea.io/collection/hoodstreetnft",
  // The project X account.
  x: "https://x.com/hoodstreetnft",
  // The live Agent site — enlist, pick a brain, send it to work.
  app: "https://app.hstreet.xyz"
};

// GTD signups land on the API (stored in MongoDB; exported as CSV for the
// OpenSea Studio allowlist). Without a configured database it answers 503
// and the form says the list opens shortly.
const GTD_ENDPOINT = "https://api.hstreet.xyz/api/gtd";

$$("[data-link]").forEach((el) => {
  const key = el.getAttribute("data-link");
  if (key && LINKS[key]) el.setAttribute("href", LINKS[key]);
});

const yearEl = $("#year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------------------------------------------------------
   ENLIST — the form stamps itself, then opens the app
--------------------------------------------------------- */

const enlistCard = $("#enlistCard");
const enlistStatus = $("#enlistStatus");

if (enlistCard) {
  enlistCard.addEventListener("click", (event) => {
    // Leave browser gestures alone (new tab, middle click, downloads).
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (event.button !== undefined && event.button !== 0) return;

    event.preventDefault();

    const href = enlistCard.getAttribute("href") || LINKS.app;

    if (reduceMotion || enlistCard.classList.contains("stamped")) {
      window.location.href = href;
      return;
    }

    enlistCard.classList.add("stamped");
    if (enlistStatus) {
      enlistStatus.textContent = "Enlisted — opening the street app.";
    }

    // Let the stamp land before the page changes.
    window.setTimeout(() => {
      window.location.href = href;
    }, 950);
  });
}

/* ---------------------------------------------------------
   GTD FORM — wallet signups for the allowlist stage
--------------------------------------------------------- */

const gtdForm = $("#gtdForm");
const gtdAddress = $("#gtdAddress");
const gtdCompany = $("#gtdCompany");
const gtdSubmit = $("#gtdSubmit");
const gtdStatus = $("#gtdStatus");

function gtdSay(message, isError) {
  if (!gtdStatus) return;
  gtdStatus.textContent = message;
  if (isError) gtdStatus.setAttribute("data-error", "true");
  else gtdStatus.removeAttribute("data-error");
}

if (gtdForm && gtdAddress && gtdSubmit) {
  gtdForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const address = gtdAddress.value.trim();
    if (!/^0x[0-9a-fA-F]{40}$/.test(address)) {
      gtdSay("That doesn't look like a wallet address — it should start with 0x.", true);
      gtdAddress.focus();
      return;
    }

    gtdSubmit.disabled = true;
    gtdSay("Checking the list…", false);

    try {
      const response = await fetch(GTD_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address,
          company: gtdCompany ? gtdCompany.value : ""
        })
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.ok) {
        gtdForm.classList.add("stamped");
        gtdSay(
          data.already
            ? "Already on the list — you're in."
            : "On the list. GTD details land on X first.",
          false
        );
        gtdAddress.disabled = true;
        gtdSubmit.disabled = true;
        return;
      }

      if (response.status === 503) {
        gtdSay("The list opens shortly — try again soon.", false);
      } else {
        gtdSay(data.error || "Something went wrong — try again.", true);
      }
    } catch {
      gtdSay("Network hiccup — try again.", true);
    }

    gtdSubmit.disabled = false;
  });
}

/* ---------------------------------------------------------
   MOBILE MENU
--------------------------------------------------------- */

const body = document.body;
const menuBtn = $("#menuBtn");
const mobileMenu = $("#mobileMenu");

function toggleMenu() {
  const isOpen = mobileMenu.classList.toggle("open");
  menuBtn.classList.toggle("active", isOpen);
  menuBtn.setAttribute("aria-expanded", String(isOpen));
  body.style.overflow = isOpen ? "hidden" : "";
}

if (menuBtn && mobileMenu) {
  menuBtn.addEventListener("click", toggleMenu);

  $$(".mobile-menu a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      menuBtn.classList.remove("active");
      menuBtn.setAttribute("aria-expanded", "false");
      body.style.overflow = "";
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileMenu.classList.contains("open")) {
      toggleMenu();
    }
  });
}

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

const cursorGlow = $("#cursorGlow");

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
