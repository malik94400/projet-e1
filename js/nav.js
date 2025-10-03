(function () {
    const root = document.documentElement;
    const btn = document.getElementById('hamburger');
    const nav = document.getElementById('mainnav');
    if (!btn || !nav) return;

    function setOpen(open) {
        if (open) root.setAttribute('data-nav-open', 'true');
        else root.removeAttribute('data-nav-open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    // Toggle au clic
    btn.addEventListener('click', () => {
        const open = !root.hasAttribute('data-nav-open');
        setOpen(open);
        if (open) nav.querySelector('a,button')?.focus();
    });

    // Fermeture: touche Échap
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') setOpen(false);
    });

    // Fermeture: clic à l’extérieur
    document.addEventListener('click', (e) => {
        const open = root.hasAttribute('data-nav-open');
        if (!open) return;
        const isInside = nav.contains(e.target) || btn.contains(e.target);
        if (!isInside) setOpen(false);
    });

    // Optionnel : fermer au resize desktop
    const mql = window.matchMedia('(min-width: 768px)');
    mql.addEventListener?.('change', (ev) => { if (ev.matches) setOpen(false); });
})();