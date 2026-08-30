// carousel.js — Carrousel des mondes du Cosmere
// Fonctionnalités : DaisyUI carousel-center + boucle infinie (clones) + autoplay accessible
(function () {
  const track = document.getElementById("worlds-track");
  const dotsContainer = document.getElementById("worlds-dots");
  const prevBtn = document.querySelector(".worlds-carousel__control--prev");
  const nextBtn = document.querySelector(".worlds-carousel__control--next");
  const playPauseBtn = document.getElementById("carousel-playpause");
  if (!track || !dotsContainer) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------------------------------------------------------------------
  // 1) BOUCLE INFINIE : on clone chaque slide réelle et on colle la copie
  //    à la fin. Les clones sont ignorés par l'accessibilité (aria-hidden).
  // ---------------------------------------------------------------------
  const realSlides = Array.from(track.children);
  const realCount = realSlides.length;

  realSlides.forEach((slide) => {
    const clone = slide.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    clone.querySelectorAll("[tabindex]").forEach((el) => el.setAttribute("tabindex", "-1"));
    track.appendChild(clone);
  });

  const allSlides = Array.from(track.children); // réelles + clones

  // ---------------------------------------------------------------------
  // 2) POINTS INDICATEURS — un point par slide RÉELLE uniquement
  // ---------------------------------------------------------------------
  realSlides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "worlds-carousel__dot";
    dot.setAttribute("role", "tab");
    dot.setAttribute("aria-label", `Aller au monde ${i + 1} sur ${realCount}`);
    dot.addEventListener("click", () => goTo(i));
    dotsContainer.appendChild(dot);
  });
  const dots = Array.from(dotsContainer.children);

  // ---------------------------------------------------------------------
  // 3) NAVIGATION — currentIndex avance toujours vers l'avant, jamais en arrière
  // ---------------------------------------------------------------------
  let currentIndex = 0;

  function scrollToIndex(index, instant = false) {
    const slide = allSlides[index];
    if (!slide) return;
    const target = slide.offsetLeft - track.offsetLeft - (track.clientWidth - slide.offsetWidth) / 2;
    track.scrollTo({
      left: target,
      behavior: instant || prefersReducedMotion ? "auto" : "smooth",
    });
  }

  function updateDots() {
    const active = currentIndex % realCount;
    dots.forEach((dot, i) => {
      dot.classList.toggle("worlds-carousel__dot--active", i === active);
      dot.setAttribute("aria-selected", i === active ? "true" : "false");
    });
  }

  function goTo(index) {
    currentIndex = index;
    scrollToIndex(currentIndex);
    updateDots();

    // Si on entre dans la zone clonée, on rembobine silencieusement
    // une fois la transition visuelle terminée (le clone est identique, invisible).
    if (currentIndex >= realCount) {
      const transitionMs = prefersReducedMotion ? 0 : 650;
      window.setTimeout(() => {
        currentIndex = currentIndex % realCount;
        scrollToIndex(currentIndex, true);
      }, transitionMs);
    }
  }

  prevBtn?.addEventListener("click", () => goTo(Math.max(currentIndex - 1, 0)));
  nextBtn?.addEventListener("click", () => goTo(currentIndex + 1));

  updateDots();

  // ---------------------------------------------------------------------
  // 4) AUTOPLAY — avec pause au survol/focus ET bouton pause manuel (WCAG 2.2.2)
  // ---------------------------------------------------------------------
  let autoplayId = null;
  let isPausedByUser = false;
  const AUTOPLAY_DELAY = 3500;

  function startAutoplay() {
    if (prefersReducedMotion || isPausedByUser) return;
    stopAutoplay();
    autoplayId = setInterval(() => goTo(currentIndex + 1), AUTOPLAY_DELAY);
  }
  function stopAutoplay() {
    if (autoplayId) clearInterval(autoplayId);
    autoplayId = null;
  }

  track.addEventListener("mouseenter", stopAutoplay);
  track.addEventListener("mouseleave", startAutoplay);
  track.addEventListener("focusin", stopAutoplay);
  track.addEventListener("focusout", startAutoplay);

  // Bouton play/pause manuel — prioritaire sur le hover/focus (WCAG 2.2.2 : Pause, Stop, Hide)
  playPauseBtn?.addEventListener("click", () => {
    isPausedByUser = !isPausedByUser;

    if (isPausedByUser) {
      stopAutoplay();
      playPauseBtn.setAttribute("aria-pressed", "true");
      playPauseBtn.setAttribute("aria-label", "Reprendre le défilement automatique");
    } else {
      startAutoplay();
      playPauseBtn.setAttribute("aria-pressed", "false");
      playPauseBtn.setAttribute("aria-label", "Mettre en pause le défilement automatique");
    }

    playPauseBtn.querySelector(".icon-pause")?.classList.toggle("hidden", isPausedByUser);
    playPauseBtn.querySelector(".icon-play")?.classList.toggle("hidden", !isPausedByUser);
  });

  startAutoplay();
})();