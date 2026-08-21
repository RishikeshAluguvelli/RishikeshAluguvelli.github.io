/* Rishikesh Aluguvelli — portfolio interactions. No dependencies. */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- nav ---------- */
  var nav = document.getElementById("nav");
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");

  window.addEventListener("scroll", function () {
    nav.classList.toggle("scrolled", window.scrollY > 10);
  }, { passive: true });

  toggle.addEventListener("click", function () {
    var open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  links.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });

  /* active section highlight */
  var sections = Array.prototype.slice.call(document.querySelectorAll("section[id]"));
  var navAnchors = Array.prototype.slice.call(links.querySelectorAll("a[href^='#']"));
  var secObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        navAnchors.forEach(function (a) {
          a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id);
        });
      }
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  sections.forEach(function (s) { secObs.observe(s); });

  /* ---------- typing effect ---------- */
  var lines = [
    "import torch  # and make it fast",
    "policy.predict(obs, deterministic=True)",
    "SELECT * FROM episodes ORDER BY relevance LIMIT 10;",
    "vllm serve --speculative-config eagle3 ...",
    "agent.run(episode) -> clips, posts, captions",
    "reward = 2.0 * (prev_dist - dist) - 0.01"
  ];
  var target = document.getElementById("typeTarget");
  if (target && !reduced) {
    var li = 0, ci = 0, deleting = false;
    (function tick() {
      var line = lines[li];
      if (!deleting) {
        ci++;
        target.textContent = line.slice(0, ci);
        if (ci === line.length) { deleting = true; return setTimeout(tick, 2400); }
        return setTimeout(tick, 34 + Math.random() * 40);
      }
      ci -= 3;
      if (ci <= 0) { ci = 0; deleting = false; li = (li + 1) % lines.length; }
      target.textContent = line.slice(0, ci);
      setTimeout(tick, deleting ? 14 : 300);
    })();
  } else if (target) {
    target.textContent = lines[0];
  }

  /* ---------- reveal on scroll ---------- */
  var revealables = document.querySelectorAll(
    ".card, .sec-title, .sec-sub, .stat, .skill-group, .filters"
  );
  revealables.forEach(function (el) { el.classList.add("reveal"); });
  var revObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        en.target.classList.add("in");
        revObs.unobserve(en.target);
      }
    });
  }, { threshold: 0.08 });
  revealables.forEach(function (el) { revObs.observe(el); });

  /* ---------- project filter ---------- */
  var filters = document.querySelectorAll(".filter");
  var cards = document.querySelectorAll(".proj");
  filters.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filters.forEach(function (b) {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");
      var f = btn.dataset.filter;
      cards.forEach(function (c) {
        c.classList.toggle("hidden", f !== "all" && c.dataset.cat !== f);
      });
    });
  });

  /* ---------- lazy video autoplay when visible ---------- */
  var vids = document.querySelectorAll(".proj-media video");
  var vidObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      var v = en.target;
      if (en.isIntersecting) {
        if (!v.dataset.loaded) { v.preload = "auto"; v.dataset.loaded = "1"; }
        if (!reduced) { v.play().catch(function () {}); }
      } else {
        v.pause();
      }
    });
  }, { threshold: 0.25 });
  vids.forEach(function (v) { vidObs.observe(v); });

  /* ---------- email obfuscation ---------- */
  var eb = document.getElementById("emailBtn");
  var er = document.getElementById("emailReveal");
  if (eb) {
    var addr = eb.dataset.u + "@" + eb.dataset.d;
    eb.addEventListener("click", function (ev) {
      ev.preventDefault();
      window.location.href = "mailto:" + addr;
      if (er) { er.textContent = addr; }
    });
  }

  /* ---------- year ---------- */
  var y = document.getElementById("year");
  if (y) { y.textContent = new Date().getFullYear(); }
})();
