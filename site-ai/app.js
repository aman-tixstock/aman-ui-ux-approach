const details = {
  sales: {
    title: "Sales & field activity",
    body: "Field activity, prescriptions, and account performance are read with the brand plan, not as a standalone dashboard. The usual next step is a field-focus view inside Advanced Analytics."
  },
  rwd: {
    title: "Real-world data",
    body: "Collected real-world data is used for patient-reported outcomes, budget impact, and the value dossier. It supports an access narrative. It is not a substitute for a clinical study."
  },
  pipeline: {
    title: "Pipeline & portfolio",
    body: "Pipeline and portfolio monitoring sits with competitive intelligence and the in-line forecast, so a portfolio conversation uses one set of facts."
  },
  conference: {
    title: "Conference coverage",
    body: "On-site or remote conference coverage is turned into a competitive view: what changed, who said it, and whether it moves the landscape."
  },
  market: {
    title: "Epidemiology & market size",
    body: "Epidemiology-based market sizing feeds the forecast and the launch suite, so patient potential and commercial potential are not estimated twice."
  },
  contracts: {
    title: "Access & contracts",
    body: "Contracting and access analytics show where price, pull-through, and policy are helping or holding a brand."
  },
  launch: {
    title: "Launch plan",
    body: "Launch Excellence pulls forecasting, market sizing, and competitive landscape into one plan a cross-functional team can use."
  },
  access: {
    title: "Access narrative",
    body: "The access story is assembled from budget impact, outcomes, health technology assessment, and the value dossier."
  },
  landscape: {
    title: "Competitive view",
    body: "Landscape, analyst coverage, pipeline monitoring, and conference notes are kept in one competitive picture, including inside Cintel."
  },
  forecast: {
    title: "Forecast the team trusts",
    body: "In-line and pipeline forecasts, statistical models, and stage-gate views are reconciled so finance, brand, and supply are not running three numbers."
  },
  field: {
    title: "Field focus",
    body: "Sales force analytics points the field at the accounts and messages that match the current forecast and access position."
  },
  value: {
    title: "Asset value",
    body: "Business development, licensing, and asset valuation models use the same epidemiology and competitive base as the forecast."
  }
};

const answers = {
  launch: {
    title: "Where is this launch exposed?",
    body: "Start with the in-line and pipeline forecast, then test it against epidemiology and the competitive landscape. The suite for this question is Launch Excellence: one view of uptake, access risk, and the claims the field can defend.",
    meta: "Practices: Forecasting · Market sizing · Competitive landscape · Launch Excellence"
  },
  access: {
    title: "What has to be true for access?",
    body: "The access narrative needs a budget impact analysis, patient-reported outcomes, and a value dossier that say the same thing. Health technology assessment is included when the market requires it.",
    meta: "Practices: RWE & HEOR · Access & Contracting Analytics · Access Strategy & Landscape"
  },
  signal: {
    title: "What moved at the last congress?",
    body: "Conference coverage is read against the existing landscape and pipeline monitor. The output is what changed, and whether the forecast or the field message should change with it.",
    meta: "Practices: Conference Coverage · Pipeline & Portfolio Monitoring · Cintel"
  },
  field: {
    title: "Where should the field spend time?",
    body: "Sales force analytics is read with marketing performance and the current access position, so effort follows the accounts that can still move.",
    meta: "Practices: Sales Force Analytics · Marketing Analytics · Commercial Effectiveness"
  }
};

function selectNode(key) {
  document.querySelectorAll("[data-node]").forEach((button) => {
    const on = button.getAttribute("data-node") === key;
    button.classList.toggle("is-selected", on);
    button.setAttribute("aria-pressed", String(on));
  });
  const item = details[key];
  document.querySelector("[data-detail-title]").textContent = item.title;
  document.querySelector("[data-detail-body]").textContent = item.body;
}

document.querySelectorAll("[data-node]").forEach((button) => {
  button.addEventListener("click", () => selectNode(button.getAttribute("data-node")));
});

function selectAsk(key) {
  document.querySelectorAll("[data-ask]").forEach((button) => {
    const on = button.getAttribute("data-ask") === key;
    button.classList.toggle("is-selected", on);
    button.setAttribute("aria-pressed", String(on));
  });
  const item = answers[key];
  document.querySelector("[data-ask-title]").textContent = item.title;
  document.querySelector("[data-ask-body]").textContent = item.body;
  document.querySelector("[data-ask-meta]").textContent = item.meta;
}

document.querySelectorAll("[data-ask]").forEach((button) => {
  button.addEventListener("click", () => selectAsk(button.getAttribute("data-ask")));
});

const tabs = [...document.querySelectorAll('[role="tab"]')];
function activateTab(tab) {
  tabs.forEach((item) => {
    const selected = item === tab;
    item.setAttribute("aria-selected", String(selected));
    item.tabIndex = selected ? 0 : -1;
    const panel = document.getElementById(item.getAttribute("aria-controls"));
    panel.hidden = !selected;
  });
  tab.focus();
}
tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => activateTab(tab));
  tab.addEventListener("keydown", (event) => {
    const next = event.key === "ArrowRight" ? tabs[(index + 1) % tabs.length]
      : event.key === "ArrowLeft" ? tabs[(index - 1 + tabs.length) % tabs.length]
      : event.key === "Home" ? tabs[0]
      : event.key === "End" ? tabs[tabs.length - 1]
      : null;
    if (next) {
      event.preventDefault();
      activateTab(next);
    }
  });
});

document.querySelectorAll(".menu-link").forEach((button) => {
  button.addEventListener("click", () => {
    const panel = document.getElementById(button.getAttribute("aria-controls"));
    const open = panel.hasAttribute("hidden");
    document.querySelectorAll(".menu-panel").forEach((item) => item.setAttribute("hidden", ""));
    document.querySelectorAll(".menu-link").forEach((item) => item.setAttribute("aria-expanded", "false"));
    if (open) {
      panel.removeAttribute("hidden");
      button.setAttribute("aria-expanded", "true");
    }
  });
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".menu-item")) {
    document.querySelectorAll(".menu-panel").forEach((item) => item.setAttribute("hidden", ""));
    document.querySelectorAll(".menu-link").forEach((item) => item.setAttribute("aria-expanded", "false"));
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    document.querySelectorAll(".menu-panel").forEach((item) => item.setAttribute("hidden", ""));
    document.querySelectorAll(".menu-link").forEach((item) => item.setAttribute("aria-expanded", "false"));
    const nav = document.querySelector("[data-nav]");
    if (nav.classList.contains("is-open")) {
      nav.classList.remove("is-open");
      document.querySelector("[data-menu-btn]").setAttribute("aria-expanded", "false");
    }
  }
});

document.querySelector("[data-menu-btn]").addEventListener("click", (event) => {
  const nav = document.querySelector("[data-nav]");
  const open = nav.classList.toggle("is-open");
  event.currentTarget.setAttribute("aria-expanded", String(open));
  event.currentTarget.querySelector(".sr-only").textContent = open ? "Close menu" : "Open menu";
});

const form = document.querySelector("[data-form]");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const fields = [
    ["name", "Enter your name."],
    ["email", "Enter a work email, including @."],
    ["need", "Choose what you need."],
    ["note", "Add a short note."]
  ];
  let firstInvalid = null;
  fields.forEach(([name]) => {
    const input = form.elements[name];
    const error = document.getElementById(name + "-error");
    input.removeAttribute("aria-invalid");
    error.hidden = true;
    error.textContent = "";
  });
  fields.forEach(([name, message]) => {
    const input = form.elements[name];
    const error = document.getElementById(name + "-error");
    const value = input.value.trim();
    const badEmail = name === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    if (!value || badEmail) {
      input.setAttribute("aria-invalid", "true");
      error.hidden = false;
      error.textContent = badEmail ? "Enter an email in the form name@company.com." : message;
      if (!firstInvalid) firstInvalid = input;
    }
  });
  const summary = document.querySelector("[data-form-error]");
  const ok = document.querySelector("[data-form-ok]");
  ok.hidden = true;
  if (firstInvalid) {
    summary.hidden = false;
    summary.textContent = "Check the highlighted fields. Nothing was sent.";
    firstInvalid.focus();
    return;
  }
  summary.hidden = true;
  ok.hidden = false;
  form.reset();
});
