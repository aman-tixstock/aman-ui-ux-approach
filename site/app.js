const slides = [
  {
    kicker: "Commercial operations",
    title: "Tailored solutions for global bio-pharmaceutical companies",
    body: "By optimizing commercial performance, improving operational efficiencies, and providing deep market insights, we help you navigate the complexities of the bio-pharma industry.",
    link: "#solutions",
    label: "Explore solutions"
  },
  {
    kicker: "RWE & HEOR",
    title: "Evidence that can stand in an access conversation",
    body: "Budget impact, patient-reported outcomes, health technology assessment, real-world data collection, and value dossiers — built with the therapy in the room.",
    link: "#solutions",
    label: "See the evidence work"
  },
  {
    kicker: "The toolkit",
    title: "Four products sitting next to the consulting",
    body: "Cintel, Conversity, IntelliSight, and PharmLens. Same pharma context as the services, built to be used.",
    link: "#products",
    label: "See the products"
  },
  {
    kicker: "The practice",
    title: "75+ consultants. 100% retention. 500+ projects.",
    body: "Technology, business, and therapy-area depth on one team, across the product lifecycle for pharma and biotech.",
    link: "#approach",
    label: "How we work"
  }
];

const products = [
  {
    name: "Cintel",
    body: "Curated news, events, analyst insights, and historical sales data — a working view of the pharma landscape.",
    img: "../assets/immersive/product1.png",
    alt: "Cintel dashboard on a laptop"
  },
  {
    name: "Conversity",
    body: "AI-powered negotiation and sales training. Role-plays for pricing, objection handling, and access conversations.",
    img: "../assets/immersive/conversity.png",
    alt: "Conversity training screen on a laptop"
  },
  {
    name: "IntelliSight",
    body: "A conversational analytics interface. Ask questions of complex data and reach a decision faster.",
    img: "../assets/immersive/product2.png",
    alt: "IntelliSight analytics playground on a laptop"
  },
  {
    name: "PharmLens",
    body: "Part of the proprietary AI toolkit with IntelliSight and Cintel — a dedicated lens on the market. PharmSight has not published a product screen for PharmLens yet, so this frame is a stand-in.",
    img: "../assets/immersive/product3.png",
    alt: "Abstract analytics visual used as a stand-in for PharmLens"
  }
];

const quotes = [
  ["The new brand strategy was supported by analysis done by PharmSight team", "Associate Director · Top 10 Pharmaceutical Company"],
  ["Impressed with the quick turnaround time without compromising on the quality of the deliverable", "Senior Insights Manager · Top 3 Pharma"],
  ["Thanks for a great Job. I feel like our market models are now much more closer to reality", "Forecasting · US-based bio-pharma"],
  ["I think we have taken a huge step forward in automating our quarterly performance analytics report", "Top 5 Pharma"]
];

function dots(container, count, onPick) {
  container.innerHTML = "";
  const buttons = [];
  for (let i = 0; i < count; i += 1) {
    const b = document.createElement("button");
    b.type = "button";
    b.setAttribute("aria-label", "Slide " + (i + 1));
    b.addEventListener("click", () => onPick(i));
    container.appendChild(b);
    buttons.push(b);
  }
  return buttons;
}

function mark(buttons, index) {
  buttons.forEach((b, i) => b.classList.toggle("is-active", i === index));
}

const heroSlides = [...document.querySelectorAll("[data-slide]")];
const heroDots = dots(document.querySelector("[data-hero-dots]"), slides.length, (i) => showHero(i, true));
let heroIndex = 0;
let heroTimer;

function showHero(index, user) {
  heroSlides[heroIndex].classList.remove("is-active");
  const leaving = heroSlides[heroIndex].querySelector("video");
  if (leaving) leaving.pause();
  heroIndex = (index + slides.length) % slides.length;
  heroSlides[heroIndex].classList.add("is-active");
  const video = heroSlides[heroIndex].querySelector("video");
  if (video) video.play().catch(() => {});
  const data = slides[heroIndex];
  document.querySelector("[data-hero-kicker]").textContent = data.kicker;
  document.querySelector("[data-hero-title]").textContent = data.title;
  document.querySelector("[data-hero-body]").textContent = data.body;
  const link = document.querySelector("[data-hero-link]");
  link.href = data.link;
  link.textContent = data.label;
  mark(heroDots, heroIndex);
  if (user) restartHero();
}

function restartHero() {
  clearInterval(heroTimer);
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  heroTimer = setInterval(() => showHero(heroIndex + 1), 7000);
}

document.querySelector("[data-hero-prev]").addEventListener("click", () => showHero(heroIndex - 1, true));
document.querySelector("[data-hero-next]").addEventListener("click", () => showHero(heroIndex + 1, true));
const hero = document.querySelector("[data-hero]");
hero.addEventListener("mouseenter", () => clearInterval(heroTimer));
hero.addEventListener("mouseleave", restartHero);
showHero(0);
restartHero();

function rail(name) {
  const el = document.querySelector('[data-rail="' + name + '"]');
  const step = () => el.querySelector("article").getBoundingClientRect().width + 18;
  document.querySelector('[data-prev="' + name + '"]').addEventListener("click", () => {
    el.scrollBy({ left: -step(), behavior: "smooth" });
  });
  document.querySelector('[data-next="' + name + '"]').addEventListener("click", () => {
    el.scrollBy({ left: step(), behavior: "smooth" });
  });
}
rail("solutions");

const productDots = dots(document.querySelector("[data-product-dots]"), products.length, showProduct);
let productIndex = 0;
function showProduct(index) {
  productIndex = (index + products.length) % products.length;
  const item = products[productIndex];
  document.querySelector("[data-product-img]").src = item.img;
  document.querySelector("[data-product-img]").alt = item.alt;
  document.querySelector("[data-product-name]").textContent = item.name;
  document.querySelector("[data-product-body]").textContent = item.body;
  document.querySelector("[data-product-index]").textContent = String(productIndex + 1).padStart(2, "0") + " / 04";
  mark(productDots, productIndex);
}
document.querySelector('[data-prev="products"]').addEventListener("click", () => showProduct(productIndex - 1));
document.querySelector('[data-next="products"]').addEventListener("click", () => showProduct(productIndex + 1));
showProduct(0);

const quoteDots = dots(document.querySelector("[data-quote-dots]"), quotes.length, showQuote);
let quoteIndex = 0;
function showQuote(index) {
  quoteIndex = (index + quotes.length) % quotes.length;
  document.querySelector("[data-quote-text]").textContent = quotes[quoteIndex][0];
  document.querySelector("[data-quote-who]").textContent = quotes[quoteIndex][1];
  mark(quoteDots, quoteIndex);
}
document.querySelector("[data-quote-prev]").addEventListener("click", () => showQuote(quoteIndex - 1));
document.querySelector("[data-quote-next]").addEventListener("click", () => showQuote(quoteIndex + 1));
showQuote(0);
setInterval(() => {
  if (!document.querySelector("#clients").matches(":hover")) showQuote(quoteIndex + 1);
}, 8000);

const film = document.querySelector("[data-film]");
const play = document.querySelector("[data-play]");
film.muted = true;
film.play().catch(() => {});
play.addEventListener("click", () => {
  const sounding = play.classList.toggle("is-on");
  film.muted = !sounding;
  if (film.paused) film.play();
  play.setAttribute("aria-pressed", String(sounding));
  play.querySelector("span").textContent = sounding ? "Mute film" : "Play film with sound";
});

document.querySelector("[data-nav-toggle]").addEventListener("click", (event) => {
  const open = document.querySelector("[data-menu]").classList.toggle("is-open");
  event.currentTarget.setAttribute("aria-expanded", String(open));
});

document.querySelectorAll(".drop-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const panel = button.nextElementSibling;
    const open = panel.hasAttribute("hidden");
    document.querySelectorAll(".drop-panel").forEach((p) => p.setAttribute("hidden", ""));
    document.querySelectorAll(".drop-btn").forEach((b) => b.setAttribute("aria-expanded", "false"));
    if (open) {
      panel.removeAttribute("hidden");
      button.setAttribute("aria-expanded", "true");
    }
  });
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".drop")) {
    document.querySelectorAll(".drop-panel").forEach((p) => p.setAttribute("hidden", ""));
    document.querySelectorAll(".drop-btn").forEach((b) => b.setAttribute("aria-expanded", "false"));
  }
});

const nav = document.querySelector("[data-nav]");
const onScroll = () => nav.classList.toggle("is-solid", window.scrollY > 40);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

document.querySelector("[data-form]").addEventListener("submit", (event) => {
  event.preventDefault();
  const note = document.querySelector("[data-form-note]");
  note.hidden = false;
  event.currentTarget.reset();
});

let touchX = 0;
hero.addEventListener("touchstart", (event) => { touchX = event.changedTouches[0].clientX; }, { passive: true });
hero.addEventListener("touchend", (event) => {
  const delta = event.changedTouches[0].clientX - touchX;
  if (Math.abs(delta) > 40) showHero(heroIndex + (delta < 0 ? 1 : -1), true);
}, { passive: true });
