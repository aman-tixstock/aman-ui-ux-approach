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

const messages = [
  "Evidence a payer can trust.",
  "Forecasts a leadership team can defend.",
  "A competitor read before the conference ends.",
  "Launch plans built from the market up.",
  "AI tools that stay with the team."
];
let rot = 0;
let rotTimer = null;
const rotText = document.querySelector("[data-rot-text]");
const rotCount = document.querySelector("[data-rot-count]");
const rotLive = document.querySelector("[data-rot-live]");
const showMessage = (index, announce) => {
  rot = (index + messages.length) % messages.length;
  rotText.textContent = messages[rot];
  rotCount.textContent = rot + 1 + " / " + messages.length;
  if (announce) rotLive.textContent = "Message " + (rot + 1) + " of " + messages.length + ": " + messages[rot];
};
const stopRotation = () => {
  clearInterval(rotTimer);
  rotTimer = null;
};
const startRotation = () => {
  if (rotTimer || reduceMotion) return;
  rotTimer = setInterval(() => showMessage(rot + 1, false), 5000);
};
document.querySelector("[data-rot-prev]").addEventListener("click", () => { stopRotation(); showMessage(rot - 1, true); });
document.querySelector("[data-rot-next]").addEventListener("click", () => { stopRotation(); showMessage(rot + 1, true); });
const rotator = document.querySelector(".rotator");
rotator.addEventListener("focusin", stopRotation);
rotator.addEventListener("focusout", startRotation);
if (reduceMotion) document.documentElement.classList.add("motion-paused");
else startRotation();

const tabs = [...document.querySelectorAll("[data-tablist] [role='tab']")];
const selectTab = (tab) => {
  tabs.forEach((t) => {
    const selected = t === tab;
    t.setAttribute("aria-selected", String(selected));
    t.tabIndex = selected ? 0 : -1;
    document.getElementById(t.getAttribute("aria-controls")).hidden = !selected;
  });
  tab.focus();
};
tabs.forEach((tab, i) => {
  tab.addEventListener("click", () => selectTab(tab));
  tab.addEventListener("keydown", (event) => {
    const keys = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 };
    if (!(event.key in keys)) return;
    event.preventDefault();
    selectTab(tabs[(keys[event.key] + tabs.length) % tabs.length]);
  });
});

const tlItems = [...document.querySelectorAll(".tl-item")];
const tlImg = document.querySelector("[data-tl-img]");
const tlTag = document.querySelector("[data-tl-tag]");
const activate = (item) => {
  if (item.classList.contains("is-active")) return;
  tlItems.forEach((i) => i.classList.toggle("is-active", i === item));
  tlImg.style.opacity = "0";
  setTimeout(() => {
    tlImg.src = item.dataset.img;
    tlTag.textContent = item.dataset.tag;
    tlImg.style.opacity = "1";
  }, reduceMotion ? 0 : 200);
};
if ("IntersectionObserver" in window) {
  const tlObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => { if (entry.isIntersecting) activate(entry.target); });
  }, { rootMargin: "-45% 0px -45% 0px" });
  tlItems.forEach((item) => tlObserver.observe(item));
}
tlItems.forEach((item) => item.addEventListener("focusin", () => activate(item)));
document.querySelectorAll(".tl-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const open = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!open));
    button.firstChild.textContent = open ? "View details " : "Hide details ";
    document.getElementById(button.getAttribute("aria-controls")).hidden = open;
  });
});

const scripts = {
  share: {
    q: "Why did our share drop in Q3?",
    steps: [["Sources", "Sales, call activity, and formulary data"], ["Method", "Driver decomposition by region and segment"], ["Finding", "Most of the dip sits in two regions after a formulary change"]],
    strength: ["High", 82],
    tool: "Product: IntelliSight · Practice: Advanced Analytics"
  },
  launch: {
    q: "How big is the market at launch?",
    steps: [["Sources", "Epidemiology, treatment rates, and analogue launches"], ["Method", "Patient-based market sizing with uptake curves"], ["Finding", "A base, upside, and downside range tied to diagnosis rates"]],
    strength: ["Medium", 64],
    tool: "Practice: Forecasting · Suite: Launch Excellence"
  },
  rival: {
    q: "What is the rival filing next?",
    steps: [["Sources", "Trial registries, conference abstracts, and analyst notes"], ["Method", "Pipeline tracking with filing-date estimates"], ["Finding", "Two readouts likely to shape the next filing window"]],
    strength: ["Medium", 58],
    tool: "Product: Cintel · Practice: Competitive Intelligence"
  },
  payer: {
    q: "Will payers accept our price?",
    steps: [["Sources", "HTA precedents, budget data, and PRO evidence"], ["Method", "Budget impact model with value dossier gaps"], ["Finding", "Price holds if the PRO evidence closes one key gap"]],
    strength: ["Medium", 70],
    tool: "Product: Conversity · Practice: RWE & HEOR"
  }
};
const prompts = document.querySelectorAll("[data-prompt]");
prompts.forEach((button) => {
  button.addEventListener("click", () => {
    prompts.forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
    const s = scripts[button.dataset.prompt];
    document.querySelector("[data-term-q]").textContent = s.q;
    const list = document.querySelector("[data-term-steps]");
    list.innerHTML = "";
    s.steps.forEach(([label, text]) => {
      const li = document.createElement("li");
      const span = document.createElement("span");
      span.textContent = label;
      li.append(span, text);
      list.appendChild(li);
    });
    document.querySelector("[data-term-meter-label]").textContent = s.strength[0];
    document.querySelector("[data-term-meter]").style.width = s.strength[1] + "%";
    document.querySelector("[data-term-tool]").textContent = s.tool;
  });
});

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

if (!reduceMotion && "IntersectionObserver" in window) {
  const countObserver = new IntersectionObserver((entries) => {
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
      countObserver.unobserve(el);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll("[data-count]").forEach((el) => countObserver.observe(el));
}

const form = document.querySelector("[data-form]");
document.querySelectorAll("[data-topic]").forEach((link) => {
  link.addEventListener("click", () => { form.elements.topic.value = link.dataset.topic; });
});
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const checks = [
    ["name", "f-name-err", (v) => (v ? "" : "Enter your name.")],
    ["email", "f-email-err", (v) => (!v ? "Enter your work email." : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "Enter an email like name@company.com.")],
    ["topic", "f-topic-err", (v) => (v ? "" : "Choose a topic.")]
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
