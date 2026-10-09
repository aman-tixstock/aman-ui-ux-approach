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

function setupTabs(list, keys) {
  const tabs = [...list.querySelectorAll('[role="tab"]')];
  const select = (tab, focus) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
    });
    tab.closest("section").querySelectorAll(".slide").forEach((s) => s.classList.toggle("is-active", !s.hidden));
    if (focus) tab.focus();
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => select(tab, false));
    tab.addEventListener("keydown", (event) => {
      let next = null;
      if (keys.next.includes(event.key)) next = tabs[(i + 1) % tabs.length];
      if (keys.prev.includes(event.key)) next = tabs[(i - 1 + tabs.length) % tabs.length];
      if (event.key === "Home") next = tabs[0];
      if (event.key === "End") next = tabs[tabs.length - 1];
      if (next) {
        event.preventDefault();
        select(next, true);
      }
    });
  });
}
setupTabs(document.querySelector("[data-hero-tabs]"), { next: ["ArrowRight"], prev: ["ArrowLeft"] });
setupTabs(document.querySelector("[data-biz-tabs]"), { next: ["ArrowDown", "ArrowRight"], prev: ["ArrowUp", "ArrowLeft"] });

const rules = [
  { words: ["launch"], practice: "Suites · Launch Excellence", product: "Cintel", steps: ["Size the market with an epidemiology-based model", "Map the competitive landscape before launch", "Plan field force and targeting"] },
  { words: ["market", "size", "forecast", "epidemi", "valuation", "asset", "revenue"], practice: "Forecasting", product: "IntelliSight", steps: ["Build an epidemiology-based market model", "Create in-line and pipeline forecast scenarios", "Run a stage-gate or valuation check"] },
  { words: ["hta", "payer", "access", "value", "dossier", "reimburs", "price", "pricing"], practice: "RWE & HEOR", product: "Conversity", steps: ["Plan the evidence package for HTA", "Model budget impact for payers", "Draft the value dossier and practise objection handling"] },
  { words: ["compet", "rival", "pipeline", "conference", "congress", "planning", "analyst"], practice: "Competitive Intelligence", product: "Cintel", steps: ["Profile competitor pipelines and portfolios", "Set up periodic monitoring", "Cover the next key congress"] },
  { words: ["sales", "field", "target", "marketing", "patient", "data", "kpi", "report"], practice: "Advanced Analytics", product: "IntelliSight", steps: ["Audit the data you already have", "Segment and target accounts", "Build a self-serve performance dashboard"] }
];
const hubFor = (text) => {
  if (/\b(us|usa|america|fda|boston)\b/.test(text)) return "Boston";
  if (/\b(eu|europe|ema|uk|germany|swiss|zug)\b/.test(text)) return "Zug";
  return "Gurugram, with Boston and Zug";
};
const log = document.querySelector("[data-chat-log]");
const chatStatus = document.querySelector("[data-chat-status]");
const chatForm = document.querySelector("[data-chat-form]");
const addMsg = (cls, build) => {
  const li = document.createElement("li");
  li.className = "msg " + cls;
  build(li);
  log.appendChild(li);
  log.scrollTop = log.scrollHeight;
  return li;
};
const answer = (question) => {
  const text = question.toLowerCase();
  addMsg("user", (li) => (li.textContent = question));
  let best = null;
  let hits = 0;
  rules.forEach((rule) => {
    const n = rule.words.filter((w) => text.includes(w)).length;
    if (n > hits) { hits = n; best = rule; }
  });
  const typing = addMsg("bot", (li) => (li.textContent = "Thinking…"));
  setTimeout(() => {
    typing.remove();
    addMsg("bot", (li) => {
      if (!best) {
        li.textContent = "I could not match that to a practice. Try words like market size, HTA, competitors, launch, or sales data, or contact the team below.";
        chatStatus.textContent = "PharmSight replied: no match found.";
        return;
      }
      const intro = document.createElement("p");
      intro.textContent = "Here is a starting plan:";
      intro.style.margin = "0";
      const dl = document.createElement("dl");
      [["Practice", best.practice], ["Product", best.product], ["Hub", hubFor(text)]].forEach(([k, v]) => {
        const dt = document.createElement("dt");
        dt.textContent = k;
        const dd = document.createElement("dd");
        dd.textContent = v;
        dl.append(dt, dd);
      });
      const ul = document.createElement("ul");
      best.steps.forEach((s) => {
        const item = document.createElement("li");
        item.textContent = s;
        ul.appendChild(item);
      });
      const strength = Math.min(55 + hits * 15, 95);
      const label = document.createElement("p");
      label.style.margin = "8px 0 0";
      label.style.fontSize = "0.88rem";
      label.textContent = "Match strength (illustrative): " + strength + "%";
      const meter = document.createElement("div");
      meter.className = "meter";
      meter.setAttribute("aria-hidden", "true");
      const bar = document.createElement("span");
      bar.style.width = strength + "%";
      meter.appendChild(bar);
      li.append(intro, dl, ul, label, meter);
      chatStatus.textContent = "PharmSight replied: " + best.practice + ", paired with " + best.product + ".";
    });
  }, reduceMotion ? 0 : 650);
};
chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = chatForm.elements.q;
  const value = input.value.trim();
  if (!value) { input.focus(); return; }
  answer(value);
  input.value = "";
});
document.querySelectorAll("[data-ask]").forEach((b) => b.addEventListener("click", () => answer(b.dataset.ask)));

const practices = ["Forecasting", "RWE & HEOR", "Competitive Intelligence", "Advanced Analytics", "Suites"];
const colours = ["#c94a17", "#177e89", "#1c1c1c", "#e65e27", "#0f5d66"];
const areas = {
  onc: ["Oncology", [30, 20, 25, 15, 10], ["NSCLC", "Colorectal cancer", "Urothelial cancer"]],
  neu: ["Neurology", [25, 30, 15, 20, 10], ["Multiple sclerosis", "Parkinson’s disease", "Epilepsy", "ALS", "Huntington’s disease"]],
  imm: ["Immunology", [20, 25, 20, 25, 10], ["Rheumatoid arthritis", "IBD / Crohn’s disease", "Lupus (SLE)", "Ankylosing spondylitis"]],
  oth: ["Other areas", [25, 20, 15, 25, 15], ["Haemophilia", "Diabetes", "Women’s health", "Nephrology", "Endocrinology", "Medical devices"]]
};
const donut = document.querySelector("[data-donut]");
const C = 2 * Math.PI * 46;
const circles = practices.map((_, i) => {
  const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  c.setAttribute("cx", "60");
  c.setAttribute("cy", "60");
  c.setAttribute("r", "46");
  c.setAttribute("stroke", colours[i]);
  donut.appendChild(c);
  return c;
});
const renderPulse = () => {
  const [name, mix, indications] = areas[document.querySelector("input[name='ta']:checked").value];
  let offset = 0;
  mix.forEach((v, i) => {
    const len = (v / 100) * C;
    circles[i].setAttribute("stroke-dasharray", `${Math.max(len - 2, 0)} ${C}`);
    circles[i].setAttribute("stroke-dashoffset", String(-offset));
    offset += len;
  });
  const top = mix.indexOf(Math.max(...mix));
  document.querySelector("[data-donut-top]").textContent = mix[top] + "%";
  document.querySelector("[data-donut-label]").textContent = practices[top];
  document.getElementById("donut-title").textContent = "Illustrative practice mix for " + name + ": " + mix.map((v, i) => practices[i] + " " + v + "%").join(", ");
  document.querySelector("[data-pulse-title]").textContent = name;
  const legend = document.querySelector("[data-legend]");
  legend.innerHTML = "";
  mix.forEach((v, i) => {
    const li = document.createElement("li");
    const sw = document.createElement("i");
    sw.style.background = colours[i];
    const b = document.createElement("b");
    b.textContent = v + "%";
    li.append(sw, practices[i], b);
    legend.appendChild(li);
  });
  const chips = document.querySelector("[data-indications]");
  chips.innerHTML = "";
  indications.forEach((t) => {
    const li = document.createElement("li");
    li.textContent = t;
    chips.appendChild(li);
  });
};
document.querySelectorAll("input[name='ta']").forEach((r) => r.addEventListener("change", renderPulse));
renderPulse();

const clocks = [...document.querySelectorAll("[data-tz]")];
const tick = () => clocks.forEach((el) => {
  el.textContent = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: el.dataset.tz }).format(new Date());
});
tick();
setInterval(tick, 30000);

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

const form = document.querySelector("[data-form]");
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
