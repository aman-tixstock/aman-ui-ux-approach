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

const slides = [...document.querySelectorAll(".slide")];
const dots = [...document.querySelectorAll("[data-slide-to]")];
const slideLive = document.querySelector("[data-slide-live]");
let current = 0;
const showSlide = (index) => {
  current = (index + slides.length) % slides.length;
  slides.forEach((s, i) => {
    s.hidden = i !== current;
    s.classList.toggle("is-active", i === current);
  });
  dots.forEach((d, i) => (i === current ? d.setAttribute("aria-current", "true") : d.removeAttribute("aria-current")));
  slideLive.textContent = "Slide " + (current + 1) + " of " + slides.length;
};
document.querySelector("[data-slide-prev]").addEventListener("click", () => showSlide(current - 1));
document.querySelector("[data-slide-next]").addEventListener("click", () => showSlide(current + 1));
dots.forEach((d) => d.addEventListener("click", () => showSlide(Number(d.dataset.slideTo))));
let touchX = null;
const hero = document.querySelector(".hero");
hero.addEventListener("touchstart", (e) => { touchX = e.touches[0].clientX; }, { passive: true });
hero.addEventListener("touchend", (e) => {
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 50) showSlide(current + (dx < 0 ? 1 : -1));
  touchX = null;
});

const inputs = document.querySelectorAll("[data-sim]");
const fmt = new Intl.NumberFormat("en-US");
const renderSim = () => {
  const v = {};
  inputs.forEach((input) => {
    v[input.dataset.sim] = Number(input.value);
    document.querySelector(`[data-out="${input.dataset.sim}"]`).textContent = input.value + "%";
  });
  const pool = 100000;
  const peak = pool * (v.diag / 100) * (v.uptake / 100) * (v.access / 100);
  const curve = [0.12, 0.35, 0.62, 0.85, 1];
  const values = curve.map((c) => Math.round(peak * c));
  const maxY = 40000;
  const xs = [70, 175, 280, 385, 490];
  const pts = values.map((val, i) => [xs[i], 220 - Math.min(val / maxY, 1) * 200]);
  const line = "M" + pts.map((p) => p.join(" ")).join(" L");
  document.querySelector("[data-sim-line]").setAttribute("d", line);
  document.querySelector("[data-sim-area]").setAttribute("d", line + ` L${xs[4]} 220 L${xs[0]} 220 Z`);
  const g = document.querySelector("[data-sim-dots]");
  g.innerHTML = pts.map((p) => `<circle cx="${p[0]}" cy="${p[1]}" r="6"></circle>`).join("");
  const label = peak >= 16000 ? "Upside case" : peak >= 6000 ? "Base case" : "Downside case";
  document.querySelector('[data-kpi="peak"]').textContent = fmt.format(values[4]);
  document.querySelector('[data-kpi="label"]').textContent = label;
  const desc = "Patients by year: " + values.map((val, i) => "year " + (i + 1) + " " + fmt.format(val)).join(", ") + ". " + label + ".";
  document.querySelector("[data-sim-desc]").textContent = desc;
  document.querySelector("[data-sim-live]").textContent = "Year-5 patients " + fmt.format(values[4]) + ", " + label;
};
inputs.forEach((input) => input.addEventListener("input", renderSim));
renderSim();

const mapGroup = document.querySelector("[data-map]");
const land = [
  [60, 60, 230, 170], [150, 175, 230, 290],
  [270, 55, 370, 140], [280, 145, 370, 260],
  [370, 50, 560, 175], [470, 200, 560, 260]
];
let dotsSvg = "";
for (let y = 40; y < 300; y += 14) {
  for (let x = 40; x < 580; x += 14) {
    const inLand = land.some(([x1, y1, x2, y2]) => x >= x1 && x <= x2 && y >= y1 && y <= y2 && ((x * 7 + y * 3) % 5 !== 0));
    if (inLand) dotsSvg += `<circle cx="${x}" cy="${y}" r="3"></circle>`;
  }
}
mapGroup.innerHTML = dotsSvg;

const hubs = {
  gurugram: ["Gurugram", "Headquarters and the largest delivery team — analytics, forecasting, and product engineering."],
  boston: ["Boston", "A US subsidiary and strategic hub, close to American brand, access, and leadership teams."],
  zug: ["Zug", "A European base for clients across the region, launched with Conversity at its centre."]
};
const hubButtons = document.querySelectorAll("[data-hub]");
hubButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const key = button.dataset.hub;
    hubButtons.forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
    document.querySelectorAll("[data-pin]").forEach((p) => p.classList.toggle("is-on", p.dataset.pin === key));
    document.querySelector("[data-hub-title]").textContent = hubs[key][0];
    document.querySelector("[data-hub-text]").textContent = hubs[key][1];
  });
});

const checks = [...document.querySelectorAll("[data-ready]")];
const ring = document.querySelector("[data-ring]");
const tips = [
  "Start with the market size and competitor landscape — they shape everything else.",
  "A good start. Next, line up the evidence plan for HTA and payers.",
  "Solid base. Get the forecast signed off so field sizing can follow.",
  "Halfway there. Close the gaps in evidence or field planning.",
  "Nearly ready. Set up launch tracking so the team sees results early.",
  "Almost there — one item left before launch is fully covered.",
  "Fully covered. PharmSight can stress-test the plan before launch."
];
const renderReady = () => {
  const score = checks.filter((c) => c.checked).length;
  const circ = 527.8;
  ring.style.strokeDashoffset = String(circ - (circ * score) / checks.length);
  document.querySelector("[data-ready-score]").textContent = score;
  document.querySelector("[data-ready-tip]").textContent = tips[score];
};
checks.forEach((c) => c.addEventListener("change", renderReady));
renderReady();

const form = document.querySelector("[data-form]");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const rules = [
    ["name", "f-name-err", (v) => (v ? "" : "Enter your name.")],
    ["email", "f-email-err", (v) => (!v ? "Enter your work email." : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "Enter an email like name@company.com.")],
    ["topic", "f-topic-err", (v) => (v ? "" : "Choose a topic.")]
  ];
  let first = null;
  rules.forEach(([name, errId, test]) => {
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
