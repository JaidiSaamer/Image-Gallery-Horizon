const galleryItems = [
  {
    title: "Glacier Dawn",
    category: "nature",
    location: "Patagonia",
    keywords: "ice mountain sunrise blue nature",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=82",
  },
  {
    title: "Glass Atrium",
    category: "architecture",
    location: "Copenhagen",
    keywords: "modern building glass light architecture",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=82",
  },
  {
    title: "Coastal Route",
    category: "travel",
    location: "Amalfi Coast",
    keywords: "road coast sea travel cliff",
    image:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=82",
  },
  {
    title: "Market Light",
    category: "people",
    location: "Marrakesh",
    keywords: "portrait market people street warm",
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=82",
  },
  {
    title: "Stone Courtyard",
    category: "architecture",
    location: "Kyoto",
    keywords: "courtyard stone shadows architecture",
    image:
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=82",
  },
  {
    title: "Alpine Mirror",
    category: "nature",
    location: "Dolomites",
    keywords: "lake mountains forest reflection nature",
    image:
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=82",
  },
  {
    title: "Transit Lines",
    category: "travel",
    location: "Tokyo",
    keywords: "train city travel neon night",
    image:
      "https://images.unsplash.com/photo-1505069190533-da1c9af13346?auto=format&fit=crop&w=1200&q=82",
  },
  {
    title: "Studio Pause",
    category: "people",
    location: "New York",
    keywords: "artist portrait studio people creative",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=82",
  },
  {
    title: "Desert Signal",
    category: "travel",
    location: "Wadi Rum",
    keywords: "desert travel sand red landscape",
    image:
      "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=82",
  },
  {
    title: "Rainforest Veil",
    category: "nature",
    location: "Costa Rica",
    keywords: "waterfall forest green mist nature",
    image:
      "https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=1200&q=82",
  },
];

const galleryGrid = document.querySelector("#galleryGrid");
const emptyState = document.querySelector("#emptyState");
const searchInput = document.querySelector("#searchInput");
const filterButtons = [...document.querySelectorAll(".filter-button")];
const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightboxImage");
const lightboxTitle = document.querySelector("#lightboxTitle");
const lightboxMeta = document.querySelector("#lightboxMeta");
const closeLightboxButton = document.querySelector("#closeLightbox");
const prevImageButton = document.querySelector("#prevImage");
const nextImageButton = document.querySelector("#nextImage");

let activeFilter = "all";
let visibleItems = [...galleryItems];
let activeIndex = 0;
let lastFocusedElement = null;

function createCard(item, index) {
  const card = document.createElement("button");
  card.className = "gallery-card";
  card.type = "button";
  card.setAttribute("aria-label", `Open ${item.title}`);
  card.style.animationDelay = `${Math.min(index * 45, 360)}ms`;
  card.dataset.index = String(index);

  card.innerHTML = `
    <img src="${item.image}" alt="${item.title}" loading="lazy" />
    <span class="card-content">
      <span class="card-category">${item.category}</span>
      <strong class="card-title">${item.title}</strong>
      <span class="card-location">${item.location}</span>
    </span>
  `;

  card.addEventListener("click", () => openLightbox(index));
  return card;
}

function renderGallery() {
  const query = searchInput.value.trim().toLowerCase();

  visibleItems = galleryItems.filter((item) => {
    const matchesFilter = activeFilter === "all" || item.category === activeFilter;
    const searchableText = `${item.title} ${item.category} ${item.location} ${item.keywords}`.toLowerCase();
    return matchesFilter && searchableText.includes(query);
  });

  galleryGrid.innerHTML = "";
  visibleItems.forEach((item, index) => galleryGrid.appendChild(createCard(item, index)));
  emptyState.hidden = visibleItems.length > 0;
}

function updateLightboxImage(direction = "next") {
  const item = visibleItems[activeIndex];
  if (!item) return;

  lightboxImage.classList.add("is-switching");

  window.setTimeout(() => {
    lightboxImage.src = item.image;
    lightboxImage.alt = item.title;
    lightboxTitle.textContent = item.title;
    lightboxMeta.textContent = `${item.location} / ${item.category}`;
    lightboxImage.style.transform = direction === "next" ? "translateX(10px) scale(0.985)" : "translateX(-10px) scale(0.985)";

    window.requestAnimationFrame(() => {
      lightboxImage.classList.remove("is-switching");
      lightboxImage.style.transform = "";
    });
  }, 140);
}

function openLightbox(index) {
  if (!visibleItems.length) return;

  activeIndex = index;
  lastFocusedElement = document.activeElement;
  updateLightboxImage();
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  closeLightboxButton.focus();
}

function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";

  if (lastFocusedElement) {
    lastFocusedElement.focus();
  }
}

function showAdjacentImage(step) {
  if (!visibleItems.length) return;

  const direction = step > 0 ? "next" : "prev";
  activeIndex = (activeIndex + step + visibleItems.length) % visibleItems.length;
  updateLightboxImage(direction);
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach((filterButton) => {
      filterButton.classList.toggle("active", filterButton === button);
    });
    renderGallery();
  });
});

searchInput.addEventListener("input", renderGallery);
closeLightboxButton.addEventListener("click", closeLightbox);
prevImageButton.addEventListener("click", () => showAdjacentImage(-1));
nextImageButton.addEventListener("click", () => showAdjacentImage(1));

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (event) => {
  if (!lightbox.classList.contains("open")) return;

  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") showAdjacentImage(-1);
  if (event.key === "ArrowRight") showAdjacentImage(1);
});

renderGallery();
