/*
  gallery.js — builds the portfolio grid from PHOTOS and runs the lightbox
  (keyboard + swipe). No grouping, no libraries.
*/
(function () {
  "use strict";
  const grid = document.getElementById("grid");
  if (!grid) return; // not on the portfolio page

  PHOTOS.forEach((p, i) => {
    const fig = document.createElement("figure");
    fig.className = "tile";
    fig.tabIndex = 0;
    fig.setAttribute("role", "button");
    fig.setAttribute("aria-label", "Open: " + p.alt);

    const img = document.createElement("img");
    img.src = "images/thumb/" + p.file;
    img.alt = p.alt;
    img.loading = "lazy";
    img.decoding = "async";

    const cap = document.createElement("figcaption");
    cap.className = "tile-cap";
    cap.innerHTML = '<span class="frame">' + p.frame + '</span><span class="place">' + p.place + '</span>';

    fig.appendChild(img);
    fig.appendChild(cap);
    fig.addEventListener("click", () => openLightbox(i));
    fig.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLightbox(i); }
    });
    grid.appendChild(fig);
  });

  /* ---------- lightbox ---------- */
  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lb-img");
  const lbFrame = document.getElementById("lb-frame");
  const lbPlace = document.getElementById("lb-place");
  let current = 0;

  function openLightbox(index) {
    current = index; updateLightbox();
    lb.classList.add("is-open");
    lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    lb.focus();
  }
  function closeLightbox() {
    lb.classList.remove("is-open");
    lb.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
  function updateLightbox() {
    const p = PHOTOS[current];
    lbImg.src = "images/large/" + p.file;
    lbImg.alt = p.alt;
    lbFrame.textContent = p.frame;
    lbPlace.textContent = p.place;
  }
  function step(dir) { current = (current + dir + PHOTOS.length) % PHOTOS.length; updateLightbox(); }

  document.getElementById("lb-close").addEventListener("click", closeLightbox);
  document.getElementById("lb-prev").addEventListener("click", () => step(-1));
  document.getElementById("lb-next").addEventListener("click", () => step(1));
  lb.addEventListener("click", (e) => { if (e.target === lb) closeLightbox(); });
  document.addEventListener("keydown", (e) => {
    if (!lb.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLightbox();
    else if (e.key === "ArrowLeft") step(-1);
    else if (e.key === "ArrowRight") step(1);
  });
  let touchX = null;
  lb.addEventListener("touchstart", (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
    touchX = null;
  }, { passive: true });
})();
