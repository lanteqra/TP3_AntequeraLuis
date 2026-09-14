// slideInOnScroll.js
gsap.registerPlugin(ScrollTrigger);

const elements = gsap.utils.toArray(".js-slide-in");

if (elements.length) {
    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
        gsap.set(elements, { opacity: 1, x: 0, clearProps: "all" });
    } else {
        elements.forEach((el) => {
            const direction = el.dataset.direction === "droite" ? 80 : -80;
            gsap.set(el, { opacity: 0, x: direction });
        });

        ScrollTrigger.batch(elements, {
            start: "top 85%",
            once: true,
            onEnter: (batch) => {
                gsap.to(batch, {
                    opacity: 1,
                    x: 0,
                    duration: 2.5,
                    ease: "power2.out",
                    stagger: 0.15,
                    overwrite: true,
                });
            },
        });
    }
}