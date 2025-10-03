(function () {
    const root = document.documentElement;
    const btn = document.getElementById('hamburger');
    const nav = document.getElementById('mainnav');
    if (!btn || !nav) return;

    const setOpen = (open) => {
        root.toggleAttribute('data-nav-open', open);
        btn.setAttribute('aria-expanded', open);
    };

    btn.addEventListener('click', () => {
        const open = !root.hasAttribute('data-nav-open');
        setOpen(open);
        if (open) nav.querySelector('a,button')?.focus();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') setOpen(false);
    });

    document.addEventListener('click', (e) => {
        if (root.hasAttribute('data-nav-open') && !nav.contains(e.target) && !btn.contains(e.target)) {
            setOpen(false);
        }
    });

    window.matchMedia('(min-width: 768px)').addEventListener('change', (e) => {
        if (e.matches) setOpen(false);
    });
})();