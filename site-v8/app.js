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

const rail = document.querySelector("[data-rail]");
const step = () => rail.querySelector(".adv").getBoundingClientRect().width + 20;
document.querySelector("[data-rail-prev]").addEventListener("click", () => rail.scrollBy({ left: -step(), behavior: reduceMotion ? "auto" : "smooth" }));
document.querySelector("[data-rail-next]").addEventListener("click", () => rail.scrollBy({ left: step(), behavior: reduceMotion ? "auto" : "smooth" }));

const stages = [...document.querySelectorAll("[data-stages] .stage")];
stages.forEach((stage) => {
  const button = stage.querySelector("button");
  button.addEventListener("click", () => {
    stages.forEach((s) => {
      const on = s === stage;
      s.classList.toggle("is-open", on);
      const b = s.querySelector("button");
      b.setAttribute("aria-expanded", String(on));
      document.getElementById(b.getAttribute("aria-controls")).hidden = !on;
    });
  });
});

const services = [
  ["Sales Force Analytics", "aa"], ["Marketing Analytics", "aa"], ["Modelling Solutions", "aa"],
  ["Reporting Solutions", "aa"], ["Access & Contracting Analytics", "aa"], ["Patient Analytics", "aa"],
  ["Budget Impact Analysis (BIA)", "rwe"], ["Patient-Reported Outcomes (PRO) Analysis", "rwe"],
  ["Health Technology Assessment (HTA)", "rwe"], ["Real-World Data (RWD) Collection", "rwe"], ["Value Dossier Development", "rwe"],
  ["Competitive Landscape", "ci"], ["Analyst Coverage", "ci"], ["Pipeline & Portfolio Monitoring", "ci"],
  ["Conference Coverage", "ci"], ["Periodic Monitoring", "ci"], ["Opportunity Assessment", "ci"],
  ["In-line & Pipeline Forecast", "fc"], ["Business Development & Licensing (BD&L)", "fc"], ["Stage-Gate Assessments", "fc"],
  ["Market Sizing (Epi-based)", "fc"], ["Statistical Forecast Models", "fc"], ["Asset Valuation Models", "fc"], ["Supply Chain Management", "fc"],
  ["Launch Excellence", "su"], ["Commercial Effectiveness", "su"], ["Market Intelligence", "su"], ["Access Strategy & Landscape", "su"]
];
const practiceNames = { aa: "Advanced Analytics", rwe: "RWE & HEOR", ci: "Competitive Intelligence", fc: "Forecasting", su: "Suites" };
const q = document.querySelector("[data-finder-q]");
const results = document.querySelector("[data-finder-results]");
const count = document.querySelector("[data-finder-count]");
const empty = document.querySelector("[data-finder-empty]");
let countTimer = null;
const renderFinder = () => {
  const term = q.value.trim().toLowerCase();
  const practice = document.querySelector("input[name='practice']:checked").value;
  const matches = services.filter(([name, p]) => (practice === "all" || p === practice) && (!term || name.toLowerCase().includes(term)));
  results.innerHTML = "";
  matches.forEach(([name, p]) => {
    const li = document.createElement("li");
    li.className = "result";
    const strong = document.createElement("strong");
    if (term) {
      const i = name.toLowerCase().indexOf(term);
      strong.append(name.slice(0, i));
      const mark = document.createElement("mark");
      mark.textContent = name.slice(i, i + term.length);
      strong.append(mark, name.slice(i + term.length));
    } else {
      strong.textContent = name;
    }
    const tag = document.createElement("span");
    tag.textContent = practiceNames[p];
    li.append(strong, tag);
    results.appendChild(li);
  });
  empty.hidden = matches.length > 0;
  clearTimeout(countTimer);
  countTimer = setTimeout(() => {
    count.textContent = matches.length + (matches.length === 1 ? " service" : " services");
  }, 300);
};
q.addEventListener("input", renderFinder);
document.querySelectorAll("input[name='practice']").forEach((r) => r.addEventListener("change", renderFinder));
renderFinder();

const briefForm = document.querySelector("[data-brief]");
const briefOut = document.querySelector("[data-brief-out]");
const goals = {
  launch: ["Prepare a launch", ["Size the market with an epidemiology-based model", "Map the competitive landscape for launch", "Build an in-line and pipeline forecast"], "Launch Excellence", "Cintel"],
  access: ["Win or protect access", ["Plan HTA and value evidence", "Model budget impact for payers", "Draft the value dossier"], "Access Strategy & Landscape", "Conversity"],
  compete: ["Read the competition", ["Track pipelines and portfolios", "Cover key conferences", "Summarise analyst views"], "Market Intelligence", "Cintel"],
  grow: ["Grow an in-line brand", ["Analyse field force and targeting", "Measure marketing performance", "Study patient journeys and persistence"], "Commercial Effectiveness", "IntelliSight"]
};
const renderBrief = () => {
  const area = briefForm.elements.area.value;
  const g = goals[briefForm.elements.goal.value];
  const time = briefForm.elements.time.value;
  briefOut.innerHTML = "";
  const h = document.createElement("h3");
  h.textContent = area + ": " + g[0];
  const dl = document.createElement("dl");
  [["Therapy area", area], ["Timeline", time], ["Suggested suite", g[2]], ["Product to pair", g[3]]].forEach(([k, v]) => {
    const dt = document.createElement("dt");
    dt.textContent = k;
    const dd = document.createElement("dd");
    dd.textContent = v;
    dl.append(dt, dd);
  });
  const p = document.createElement("p");
  p.textContent = "First steps:";
  const ul = document.createElement("ul");
  g[1].forEach((s) => {
    const li = document.createElement("li");
    li.textContent = s;
    ul.appendChild(li);
  });
  briefOut.append(h, dl, p, ul);
  document.querySelector("[data-brief-note]").textContent = "";
};
briefForm.addEventListener("change", renderBrief);
renderBrief();
document.querySelector("[data-brief-copy]").addEventListener("click", async () => {
  const note = document.querySelector("[data-brief-note]");
  try {
    await navigator.clipboard.writeText(briefOut.innerText);
    note.textContent = "Brief copied.";
  } catch {
    note.textContent = "Copy is not available here. Select the text to copy it.";
  }
});

if (!reduceMotion && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const end = Number(el.dataset.count);
      const suffix = el.dataset.suffix || "";
      const t0 = performance.now();
      const tick = (now) => {
        const p = Math.min((now - t0) / 1100, 1);
        el.textContent = Math.round(end * p) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll("[data-count]").forEach((el) => observer.observe(el));
}

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
