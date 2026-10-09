const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const closeMenus = () => {
  document.querySelectorAll(".has-menu > button").forEach((button) => {
    button.setAttribute("aria-expanded", "false");
    document.getElementById(button.getAttribute("aria-controls")).hidden = true;
  });
};
document.querySelectorAll(".has-menu > button").forEach((button) => {
  button.addEventListener("click", () => {
    const open = button.getAttribute("aria-expanded") === "true";
    closeMenus();
    if (!open) {
      button.setAttribute("aria-expanded", "true");
      document.getElementById(button.getAttribute("aria-controls")).hidden = false;
    }
  });
});
document.addEventListener("click", (event) => {
  if (!event.target.closest(".has-menu")) closeMenus();
});
const menuBtn = document.querySelector("[data-menu-btn]");
const primary = document.querySelector("[data-primary]");
menuBtn.addEventListener("click", () => {
  const open = primary.classList.toggle("is-open");
  menuBtn.setAttribute("aria-expanded", String(open));
  document.querySelector("[data-menu-label]").textContent = open ? "Close menu" : "Open menu";
});
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  const openButton = document.querySelector('.has-menu > button[aria-expanded="true"]');
  closeMenus();
  if (openButton) openButton.focus();
  if (primary.classList.contains("is-open")) {
    primary.classList.remove("is-open");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.focus();
  }
});

const goals = {
  size: { src: "Claims and epidemiology data", practice: "Forecasting", product: "IntelliSight", deliverable: "An epidemiology-based market model with in-line and pipeline scenarios.", weeks: "4–6 weeks" },
  access: { src: "Real-world data and HTA precedents", practice: "RWE & HEOR", product: "Conversity", deliverable: "A budget impact model and value dossier outline, with payer objection practice.", weeks: "6–8 weeks" },
  compete: { src: "Pipelines, congresses, and analyst notes", practice: "Competitive Intelligence", product: "Cintel", deliverable: "A competitor landscape with periodic monitoring set up in Cintel.", weeks: "2–3 weeks" },
  launch: { src: "Sales, field, and patient data", practice: "Suites · Launch Excellence", product: "Cintel and IntelliSight", deliverable: "A launch readiness plan covering market size, rivals, and field targeting.", weeks: "6–10 weeks" }
};
const hubs = { us: "Boston, with Gurugram", eu: "Zug, with Gurugram", global: "Gurugram, Boston, and Zug" };
const router = document.querySelector("[data-router]");
const route = document.querySelector("[data-route]");
const renderRoute = () => {
  const g = goals[router.elements.goal.value];
  const set = (key, value) => { document.querySelectorAll(`[data-r="${key}"]`).forEach((el) => (el.textContent = value)); };
  set("src", g.src);
  set("practice", g.practice);
  set("product", g.product);
  set("hub", hubs[router.elements.market.value]);
  set("deliverable", g.deliverable);
  set("weeks", g.weeks);
  if (!reduceMotion) {
    route.querySelectorAll(".node").forEach((node, i) => {
      node.style.animation = "none";
      void node.offsetWidth;
      node.style.animation = `rise 0.35s ease ${i * 0.08}s both`;
    });
  }
};
router.addEventListener("change", renderRoute);
renderRoute();

const meter = document.querySelector("[data-meter]");
const ranges = [...meter.querySelectorAll("input[type=range]")];
const weights = { "s-sales": 0.25, "s-rwd": 0.3, "s-ci": 0.2, "s-epi": 0.25 };
const tips = { "s-sales": "sales and field data", "s-rwd": "real-world data", "s-ci": "competitive intelligence", "s-epi": "epidemiology" };
const gauge = document.querySelector("[data-gauge]");
let statusTimer = null;
const renderMeter = () => {
  let score = 0;
  let weakest = ranges[0];
  ranges.forEach((r) => {
    document.querySelector(`[data-out="${r.id}"]`).textContent = r.value + "%";
    score += Number(r.value) * weights[r.id];
    if (Number(r.value) * weights[r.id] < Number(weakest.value) * weights[weakest.id]) weakest = r;
  });
  score = Math.round(score);
  gauge.setAttribute("stroke-dasharray", `${score} 100`);
  document.querySelector("[data-score]").textContent = score;
  const level = score >= 75 ? "Strong evidence" : score >= 50 ? "Moderate evidence" : "Early evidence";
  document.querySelector("[data-level]").textContent = level;
  const tip = Number(weakest.value) >= 90 ? "Your inputs are well covered. The next step is testing scenarios." : "Adding " + tips[weakest.id] + " would make the strongest difference.";
  document.querySelector("[data-tip]").textContent = tip;
  clearTimeout(statusTimer);
  statusTimer = setTimeout(() => {
    document.querySelector("[data-meter-status]").textContent = "Evidence score " + score + " out of 100, " + level.toLowerCase() + ".";
  }, 400);
};
ranges.forEach((r) => r.addEventListener("input", renderMeter));
renderMeter();

if (!reduceMotion && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const end = Number(el.dataset.count);
      const suffix = el.dataset.suffix || "";
      const t0 = performance.now();
      const step = (now) => {
        const p = Math.min((now - t0) / 1100, 1);
        el.textContent = Math.round(end * p) + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      observer.unobserve(el);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll("[data-count]").forEach((el) => observer.observe(el));
}

const dialog = document.querySelector("[data-dialog]");
let opener = null;
document.querySelectorAll("[data-open-dialog]").forEach((b) => b.addEventListener("click", () => {
  opener = b;
  closeMenus();
  dialog.showModal();
  document.getElementById("f-name").focus();
}));
document.querySelector("[data-close-dialog]").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
dialog.addEventListener("close", () => { if (opener) opener.focus(); });

const form = document.querySelector("[data-form]");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const checks = [
    ["name", "f-name-err", (v) => (v ? "" : "Enter your name.")],
    ["email", "f-email-err", (v) => (!v ? "Enter your work email." : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "Enter an email like name@company.com.")],
    ["role", "f-role-err", (v) => (v ? "" : "Choose your team.")]
  ];
  let first = null;
  checks.forEach(([name, errId, test]) => {
    const input = form.elements[name];
    const err = document.getElementById(errId);
    const message = test(input.value.trim());
    if (message) {
      input.setAttribute("aria-invalid", "true");
      err.textContent = message;
      err.hidden = false;
      if (!first) first = input;
    } else {
      input.removeAttribute("aria-invalid");
      err.hidden = true;
    }
  });
  const alert = document.querySelector("[data-form-alert]");
  const ok = document.querySelector("[data-form-ok]");
  if (first) {
    alert.textContent = "Check the highlighted fields. Nothing was sent.";
    alert.hidden = false;
    ok.hidden = true;
    first.focus();
    return;
  }
  alert.hidden = true;
  ok.hidden = false;
  form.reset();
});
