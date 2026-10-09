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
    const keys = { ArrowDown: i + 1, ArrowRight: i + 1, ArrowUp: i - 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 };
    if (!(event.key in keys)) return;
    event.preventDefault();
    selectTab(tabs[(keys[event.key] + tabs.length) % tabs.length]);
  });
});

const practices = ["Analytics", "RWE & HEOR", "Intelligence", "Forecasting", "Suites"];
const angles = [-90, -18, 54, 126, 198].map((d) => (d * Math.PI) / 180);
const weights = {
  launch: { values: [60, 75, 85, 95, 70], text: "Launch: Forecasting and Competitive Intelligence lead, with RWE & HEOR close behind." },
  access: { values: [55, 98, 50, 60, 75], text: "Access: RWE & HEOR leads clearly, supported by an access-focused suite." },
  compete: { values: [50, 40, 98, 65, 55], text: "Compete: Competitive Intelligence leads, with forecasting to size the threat." },
  grow: { values: [95, 50, 60, 70, 80], text: "Grow: Advanced Analytics leads, with Commercial Effectiveness as the suite." }
};
const shape = document.querySelector("[data-radar-shape]");
const table = document.querySelector("[data-radar-table]");
const summary = document.querySelector("[data-radar-summary]");
const renderRadar = (key) => {
  const w = weights[key];
  shape.setAttribute("points", w.values.map((v, i) => {
    const r = (v / 100) * 140;
    return (180 + r * Math.cos(angles[i])).toFixed(1) + "," + (180 + r * Math.sin(angles[i])).toFixed(1);
  }).join(" "));
  table.innerHTML = "";
  practices.forEach((name, i) => {
    const row = document.createElement("tr");
    const th = document.createElement("td");
    const td = document.createElement("td");
    th.textContent = name;
    td.textContent = w.values[i] + " / 100";
    row.append(th, td);
    table.appendChild(row);
  });
  summary.textContent = w.text;
};
document.querySelectorAll("input[name='decision']").forEach((input) => {
  input.addEventListener("change", () => renderRadar(input.value));
});
renderRadar("launch");

const answers = {
  trend: {
    q: "Which region grew fastest this quarter?",
    a: "The North region grew fastest, up 14% on the last quarter, driven mostly by new patient starts.",
    bars: [["North", 92], ["South", 60], ["East", 48], ["West", 66]],
    src: "Based on: sales and patient-start data"
  },
  reach: {
    q: "Are reps reaching the right prescribers?",
    a: "About two in three calls reach high-potential prescribers. The gap is largest in the East, where call plans lag new targeting.",
    bars: [["North", 74], ["South", 70], ["East", 45], ["West", 68]],
    src: "Based on: call activity and prescriber segmentation"
  },
  mix: {
    q: "Which channel drives new patients?",
    a: "Specialist referrals drive the most new patients, with digital programs growing fastest from a smaller base.",
    bars: [["Referral", 88], ["Field", 64], ["Digital", 52], ["Events", 30]],
    src: "Based on: patient starts by first-touch channel"
  }
};
const askButtons = document.querySelectorAll("[data-ask]");
const barsEl = document.querySelector("[data-chat-bars]");
const renderAnswer = (key) => {
  const s = answers[key];
  document.querySelector("[data-chat-q]").textContent = s.q;
  document.querySelector("[data-chat-a]").textContent = s.a;
  document.querySelector("[data-chat-src]").textContent = s.src;
  const max = Math.max(...s.bars.map((b) => b[1]));
  barsEl.innerHTML = "";
  s.bars.forEach(([label, value]) => {
    const col = document.createElement("div");
    if (value === max) col.className = "top";
    const bar = document.createElement("i");
    bar.style.height = (reduceMotion ? value : 0) + "%";
    const name = document.createElement("b");
    name.textContent = label;
    col.append(bar, name);
    barsEl.appendChild(col);
    if (!reduceMotion) requestAnimationFrame(() => requestAnimationFrame(() => { bar.style.height = value + "%"; }));
  });
  const bot = document.querySelector(".msg-bot");
  bot.style.animation = "none";
  void bot.offsetWidth;
  bot.style.animation = "";
};
askButtons.forEach((button) => {
  button.addEventListener("click", () => {
    askButtons.forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
    renderAnswer(button.dataset.ask);
  });
});
renderAnswer("trend");

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
