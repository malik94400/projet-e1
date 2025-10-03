(function themeInit(){
    const root = document.documentElement;
    const saved = localStorage.getItem('theme');
    if (saved) root.setAttribute('data-theme', saved);

    const btn = document.getElementById('toggle-theme');
    if (btn) {
        btn.addEventListener('click', () => {
            const current = root.getAttribute('data-theme') || 'ocean';
            const next = current === 'ocean' ? 'retro' : 'ocean';
            root.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
        });
    }

    // sync entre onglets
    window.addEventListener('storage', (e) => {
        if (e.key === 'theme' && e.newValue) {
            root.setAttribute('data-theme', e.newValue);
        }
    });
})();