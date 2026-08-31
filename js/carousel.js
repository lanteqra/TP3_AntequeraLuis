// carousel.js — Carrousel 
(function () {
    const track = document.getElementById("worlds-track");
    const dotsContainer = document.getElementById("worlds-dots");
    const prevBtn = document.querySelector(".worlds-carousel__control--prev");
    const nextBtn = document.querySelector(".worlds-carousel__control--next");
    const playPauseBtn = document.getElementById("carousel-playpause");
    if (!track || !dotsContainer) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Boucle
    const realSlides = Array.from(track.children);
    const realCount = realSlides.length;

    realSlides.forEach((slide) => {
        const clone = slide.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        clone.querySelectorAll("[tabindex]").forEach((el) => el.setAttribute("tabindex", "-1"));
        track.appendChild(clone);
    });

    const allSlides = Array.from(track.children);
    // dots
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

    // navigation
    let currentIndex = 0;

    function scrollToIndex(index, instant = false) {
    const slide = allSlides[index];
    if (!slide) return;
    
    // Añade un pequeño offset para compensar el gap
    const gap = parseInt(getComputedStyle(track).gap) || 16;
    const slideWidth = slide.offsetWidth + gap;
    const targetScroll = index * slideWidth;
    
    track.scrollTo({
        left: targetScroll,
        behavior: instant || prefersReducedMotion ? "auto" : "smooth"
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

        if (currentIndex >= realCount) {
            const transitionMs = prefersReducedMotion ? 0 : 650;
            window.setTimeout(() => {
                currentIndex = currentIndex % realCount;
                scrollToIndex(currentIndex, true);
            }, transitionMs);
        }
    }

    function getNearestSlideIndex() {
        const trackCenter = track.scrollLeft + track.clientWidth / 2;
        let closest = 0;
        let minDist = Infinity;
        allSlides.forEach((slide, i) => {
            const slideCenter = slide.offsetLeft - track.offsetLeft + slide.offsetWidth / 2;
            const dist = Math.abs(slideCenter - trackCenter);
            if (dist < minDist) {
                minDist = dist;
                closest = i;
            }
        });
        return closest;
    }

    let scrollEndTimer = null;
    track.addEventListener("scroll", () => {
        window.requestAnimationFrame(updateDots);
        clearTimeout(scrollEndTimer);
        scrollEndTimer = setTimeout(() => {
            currentIndex = getNearestSlideIndex() % realCount;
            updateDots();
        }, 150);
    });

    prevBtn?.addEventListener("click", () => goTo(Math.max(currentIndex - 1, 0)));
    nextBtn?.addEventListener("click", () => goTo(currentIndex + 1));

    updateDots();


    // 4) AUTOPLAY — pause au survol/focus + bouton pause manuel (WCAG 2.2.2)

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

    // DÉMARRAGE — on attend que TOUT soit chargé (Tailwind CDN compilé, polices Google Fonts prêtes) avant la première mesure/mouvement.
    
    function init() {
        requestAnimationFrame(() => startAutoplay());
    }

    if (document.readyState === "complete") {
        init();
    } else {
        window.addEventListener("load", init);
    }
})();