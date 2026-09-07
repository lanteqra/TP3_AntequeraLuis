// effet fade-in/slide-up avec GSAP + ScrollTrigger

document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);

    const elements = gsap.utils.toArray('.js-fade-in');
    if (!elements.length) return;

    const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
        gsap.set(elements, { y: 0, opacity: 1 });
        return;
    }

    elements.forEach((el) => {
        gsap.fromTo(el,
            { y: 60, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 3,
                ease: "elastic.out(1, 0.5)",
                scrollTrigger: {
                    trigger: el,
                    start: "top 80%",
                }
            }
        );
    });
});