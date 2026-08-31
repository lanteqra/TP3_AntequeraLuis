// chiffres.js — Animation
document.addEventListener('DOMContentLoaded', () => {
    const items = document.querySelectorAll('.chiffres__valeur');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const setFinal = (el) => {
        const target = el.dataset.target;
        const suffix = el.dataset.suffix || '';
        el.textContent = target + suffix;
        el.setAttribute('aria-label', `${target}${suffix}`);
    };

    if (reduceMotion) {
        items.forEach(setFinal);
        return;
    }

    const animateCount = (el) => {
        const target = parseInt(el.dataset.target, 10);
        const suffix = el.dataset.suffix || '';
        const duration = 3000;
        const start = performance.now();

        el.setAttribute('aria-live', 'off');

        const step = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * target);
            el.textContent = current + suffix;

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.setAttribute('aria-label', `${target}${suffix}`);
            }
        };
        requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCount(entry.target);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    items.forEach(el => observer.observe(el));
});