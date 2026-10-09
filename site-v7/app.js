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

function wireTabs(listSelector, keys) {
  const tabs = [...document.querySelectorAll(listSelector + " [role='tab']")];
  const select = (tab) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
    });
    tab.focus();
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => select(tab));
    tab.addEventListener("keydown", (event) => {
      const map = { ArrowDown: i + 1, ArrowRight: i + 1, ArrowUp: i - 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 };
      if (!(event.key in map)) return;
      event.preventDefault();
      select(tabs[(map[event.key] + tabs.length) % tabs.length]);
    });
  });
}
wireTabs("[data-life-tabs]");
wireTabs("[data-therapy-tabs]");

const areaNames = { oncology: "Oncology", neurology: "Neurology", immunology: "Immunology", other: "Other markets" };
const plans = {
  "launch-pipeline": ["Launch Excellence, with a pipeline forecast", ["In-line & Pipeline Forecast", "Market Sizing (Epi-based)", "Competitive Landscape", "Stage-Gate Assessments"], "Pair with Cintel for the landscape view."],
  "launch-inline": ["Launch Excellence, measured in market", ["Sales Force Analytics", "Marketing Analytics", "Reporting Solutions", "Periodic Monitoring"], "Pair with IntelliSight so brand teams can ask the launch data directly."],
  "access-pipeline": ["Access Strategy & Landscape, built early", ["Health Technology Assessment (HTA)", "Budget Impact Analysis (BIA)", "Real-World Data (RWD) Collection", "Value Dossier Development"], "Pair with Conversity to rehearse payer conversations."],
  "access-inline": ["Access protection for an in-line brand", ["Access & Contracting Analytics", "Patient-Reported Outcomes (PRO) Analysis", "Budget Impact Analysis (BIA)", "Value Dossier Development"], "Pair with Conversity for pricing and objection handling."],
  "compete-pipeline": ["Market Intelligence for a development asset", ["Pipeline & Portfolio Monitoring", "Conference Coverage", "Analyst Coverage", "Opportunity Assessment"], "Pair with Cintel for news, events, and analyst commentary."],
  "compete-inline": ["Market Intelligence for an in-line brand", ["Competitive Landscape", "Periodic Monitoring", "Conference Coverage", "Analyst Coverage"], "Pair with Cintel and periodic monitoring briefings."],
  "grow-pipeline": ["Asset value before the growth plan", ["Asset Valuation Models", "Business Development & Licensing (BD&L)", "Market Sizing (Epi-based)", "Statistical Forecast Models"], "Pair with IntelliSight once in-market data starts to arrive."],
  "grow-inline": ["Commercial Effectiveness for an in-line brand", ["Sales Force Analytics", "Marketing Analytics", "Patient Analytics", "Modelling Solutions"], "Pair with IntelliSight for self-serve commercial questions."]
};
const form = document.querySelector("[data-finder]");
const renderFinder = () => {
  const area = form.elements.area.value;
  const goal = form.elements.goal.value;
  const stage = form.elements.stage.value;
  const plan = plans[goal + "-" + stage];
  document.querySelector("[data-finder-kicker]").textContent = areaNames[area] + " · " + goal[0].toUpperCase() + goal.slice(1) + " · " + (stage === "pipeline" ? "In development" : "On the market");
  document.querySelector("[data-finder-title]").textContent = plan[0];
  const list = document.querySelector("[data-finder-list]");
  list.innerHTML = "";
  plan[1].forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    list.appendChild(li);
  });
  document.querySelector("[data-finder-tool]").textContent = plan[2];
};
form.addEventListener("change", renderFinder);

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
  document.querySelectorAll("[data-count]").forEach((el) => observer.observe(el));
}

const contact = document.querySelector("[data-form]");
contact.addEventListener("submit", (event) => {
  event.preventDefault();
  const rules = [
    ["name", "f-name-err", (v) => (v ? "" : "Enter your name.")],
    ["email", "f-email-err", (v) => (!v ? "Enter your work email." : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "Enter an email like name@company.com.")],
    ["topic", "f-topic-err", (v) => (v ? "" : "Choose a topic.")]
  ];
  let first = null;
  rules.forEach(([name, errId, test]) => {
    const input = contact.elements[name];
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
  contact.reset();
});
