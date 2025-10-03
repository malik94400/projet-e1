(function () {
    // querySelector rapide
    function qs(sel, parent) {
        return (parent || document).querySelector(sel);
    }

    function qsa(sel, parent) {
        return (parent || document).querySelectorAll(sel);
    }

    // créer un élément vite
    function el(tag, className, html) {
        const d = document.createElement(tag);
        if (className) d.className = className;
        if (html != null) d.innerHTML = html;
        return d;
    }

    // éviter d'injecter du HTML dangereux
    function escapeHtml(s) {
        return String(s)
            .replaceAll("&", "&amp;").replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;").replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    // on met tout sur window.utils (simple)
    window.utils = {qs, qsa, el, escapeHtml};
})();