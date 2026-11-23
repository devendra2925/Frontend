const STATUS = {
  vu: { label: "Vulnerable", level: 1 },
  en: { label: "Endangered", level: 2 },
  cr: { label: "Critically Endangered", level: 3 }
};

const SPECIES = [
  { name: "Javan rhinoceros", sci: "Rhinoceros sondaicus", s: "cr", region: "Ujung Kulon, Indonesia",
    pop: "About 70 to 80", why: "One small population in a single park, vulnerable to disease, storms and poaching." },
  { name: "Vaquita", sci: "Phocoena sinus", s: "cr", region: "Gulf of California, Mexico",
    pop: "Around 10 or fewer", why: "Dies in illegal gillnets set for another fish, the totoaba." },
  { name: "Amur leopard", sci: "Panthera pardus orientalis", s: "cr", region: "Russian Far East and northeast China",
    pop: "Just over 100", why: "Threatened by poaching, forest fires and a shrinking range." },
  { name: "Kakapo", sci: "Strigops habroptilus", s: "cr", region: "Offshore islands, New Zealand",
    pop: "Roughly 250", why: "A flightless parrot hunted by introduced predators. It breeds only every few years." },
  { name: "Sumatran orangutan", sci: "Pongo abelii", s: "cr", region: "Sumatra, Indonesia",
    pop: "Around 14,000", why: "Rainforest is cleared for palm oil, logging and roads." },
  { name: "African forest elephant", sci: "Loxodonta cyclotis", s: "cr", region: "Central and West Africa",
    pop: "Down by more than 80% in three decades", why: "Poached for ivory and squeezed out of its forest home." },
  { name: "Mountain gorilla", sci: "Gorilla beringei beringei", s: "en", region: "Virunga and Bwindi, Central Africa",
    pop: "About 1,000", why: "Numbers are growing thanks to intensive protection, but disease and habitat limits remain." },
  { name: "Blue whale", sci: "Balaenoptera musculus", s: "en", region: "Oceans worldwide",
    pop: "Likely 5,000 to 15,000", why: "Struck by ships, caught in fishing gear and disturbed by ocean noise." },
  { name: "Giant panda", sci: "Ailuropoda melanoleuca", s: "vu", region: "Mountains of central China",
    pop: "About 1,900 in the wild", why: "Roads and farms split its bamboo forest into isolated patches." },
  { name: "Snow leopard", sci: "Panthera uncia", s: "vu", region: "Mountains of Central and South Asia",
    pop: "Around 4,000 to 6,500", why: "Faces poaching, conflict with herders and a warming mountain climate." }
];

const grid = document.getElementById("grid");
const filters = document.getElementById("filters");
const search = document.getElementById("search");
const empty = document.getElementById("empty");
let current = "all";

function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text) n.textContent = text;
  return n;
}

function card(sp) {
  const st = STATUS[sp.s];
  const c = el("article", "card " + sp.s);
  c.append(el("h3", "", sp.name), el("p", "sci", sp.sci));

  const status = el("div", "status");
  const meter = el("span", "meter");
  meter.setAttribute("aria-hidden", "true");
  for (let i = 1; i <= 3; i++) meter.append(el("i", i <= st.level ? "on" : ""));
  status.append(meter, el("span", "", st.label));

  c.append(status, el("p", "pop", sp.pop), el("p", "meta", sp.region), el("p", "why", sp.why));
  return c;
}

function render() {
  const q = search.value.trim().toLowerCase();
  const list = SPECIES.filter(sp =>
    (current === "all" || sp.s === current) &&
    (!q || (sp.name + " " + sp.sci + " " + sp.region).toLowerCase().includes(q))
  );
  grid.replaceChildren(...list.map(card));
  empty.hidden = list.length > 0;
}

function buildFilters() {
  const options = [["all", "All"], ["cr", "Critically Endangered"], ["en", "Endangered"], ["vu", "Vulnerable"]];
  options.forEach(([key, label]) => {
    const count = key === "all" ? SPECIES.length : SPECIES.filter(s => s.s === key).length;
    const b = el("button", "", label + " (" + count + ")");
    b.type = "button";
    b.setAttribute("aria-pressed", key === current);
    b.addEventListener("click", () => {
      current = key;
      filters.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", x === b));
      render();
    });
    filters.append(b);
  });
}

search.addEventListener("input", render);
buildFilters();
render();
