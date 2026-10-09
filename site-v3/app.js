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

document.querySelectorAll("[data-accordion] .acc-item button").forEach((button) => {
  button.addEventListener("click", () => {
    const open = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!open));
    document.getElementById(button.getAttribute("aria-controls")).hidden = open;
  });
});

const plans = {
  "launch-pipeline": {
    title: "Launch Excellence, with a pipeline forecast",
    items: ["In-line & Pipeline Forecast", "Market Sizing (Epi-based)", "Competitive Landscape", "Stage-Gate Assessments"],
    tool: "Tool to pair: Cintel for the landscape view."
  },
  "launch-inline": {
    title: "Launch Excellence, measured in market",
    items: ["Sales Force Analytics", "Marketing Analytics", "Reporting Solutions", "Periodic Monitoring"],
    tool: "Tool to pair: IntelliSight so brand teams can ask the launch data directly."
  },
  "access-pipeline": {
    title: "Access Strategy & Landscape, built early",
    items: ["Health Technology Assessment (HTA)", "Budget Impact Analysis (BIA)", "Real-World Data (RWD) Collection", "Value Dossier Development"],
    tool: "Tool to pair: Conversity to rehearse payer and pricing conversations."
  },
  "access-inline": {
    title: "Access protection for an in-line brand",
    items: ["Access & Contracting Analytics", "Patient-Reported Outcomes (PRO) Analysis", "Budget Impact Analysis (BIA)", "Value Dossier Development"],
    tool: "Tool to pair: Conversity for pricing and objection-handling practice."
  },
  "compete-pipeline": {
    title: "Market Intelligence for a development asset",
    items: ["Pipeline & Portfolio Monitoring", "Conference Coverage", "Analyst Coverage", "Opportunity Assessment"],
    tool: "Tool to pair: Cintel for news, events, and analyst commentary."
  },
  "compete-inline": {
    title: "Market Intelligence for an in-line brand",
    items: ["Competitive Landscape", "Periodic Monitoring", "Conference Coverage", "Analyst Coverage"],
    tool: "Tool to pair: Cintel, with periodic monitoring briefings."
  },
  "grow-pipeline": {
    title: "Asset value before the growth plan",
    items: ["Asset Valuation Models", "Business Development & Licensing (BD&L)", "Market Sizing (Epi-based)", "Statistical Forecast Models"],
    tool: "Tool to pair: IntelliSight once in-market data starts to arrive."
  },
  "grow-inline": {
    title: "Commercial Effectiveness for an in-line brand",
    items: ["Sales Force Analytics", "Marketing Analytics", "Patient Analytics", "Modelling Solutions"],
    tool: "Tool to pair: IntelliSight for self-serve commercial questions."
  }
};

const planner = document.querySelector("[data-planner]");
const renderPlan = () => {
  const goal = planner.elements.goal.value;
  const stage = planner.elements.stage.value;
  const plan = plans[goal + "-" + stage];
  document.querySelector("[data-plan-title]").textContent = plan.title;
  const list = document.querySelector("[data-plan-list]");
  list.innerHTML = "";
  plan.items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    list.appendChild(li);
  });
  document.querySelector("[data-plan-tool]").textContent = plan.tool;
};
planner.addEventListener("change", renderPlan);
planner.addEventListener("submit", (event) => event.preventDefault());

const quotes = [
  ["The new brand strategy was supported by analysis done by PharmSight team.", "Associate Director · Top 10 Pharmaceutical Company"],
  ["Impressed with the quick turnaround time without compromising on the quality of the deliverable.", "Senior Insights Manager · Top 3 Pharma"],
  ["Thanks for the well thought out tool.", "Global Pharma Leader"],
  ["I think we have taken a huge step forward in automating our quarterly performance analytics report.", "Top 5 Pharma"]
];
let q = 0;
const showQuote = (index) => {
  q = (index + quotes.length) % quotes.length;
  document.querySelector("[data-q-text]").textContent = quotes[q][0];
  document.querySelector("[data-q-who]").textContent = quotes[q][1];
  document.querySelector("[data-q-status]").textContent = "Quote " + (q + 1) + " of " + quotes.length;
};
document.querySelector("[data-q-prev]").addEventListener("click", () => showQuote(q - 1));
document.querySelector("[data-q-next]").addEventListener("click", () => showQuote(q + 1));

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const counters = document.querySelectorAll("[data-count]");
if (!reduceMotion && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const end = Number(el.dataset.count);
      const suffix = el.dataset.suffix || "";
      const start = end > 1000 ? end - 30 : 0;
      const t0 = performance.now();
      const tick = (now) => {
        const p = Math.min((now - t0) / 1100, 1);
        el.textContent = Math.round(start + (end - start) * p) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach((el) => observer.observe(el));
}

const form = document.querySelector("[data-form]");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const checks = [
    ["name", "f-name-err", (v) => v ? "" : "Enter your name."],
    ["email", "f-email-err", (v) => !v ? "Enter your work email." : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "Enter an email like name@company.com."],
    ["topic", "f-topic-err", (v) => v ? "" : "Choose a topic."]
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
