(function () {
    const {qs, el} = window.utils;
    const {getUsers, getTodosByUser} = window.api;

    const usersContainer = qs("#users");
    const searchInput = qs("#search");

    let allUsers = []; // pour filtrer

    // affiche les cartes users
    function renderUsers(list) {
        usersContainer.innerHTML = "";
        if (!list.length) {
            usersContainer.innerHTML = "<p>Aucun utilisateur trouvé.</p>";
            return;
        }
        list.forEach(u => {
            const card = el("div", "user-card");
            card.innerHTML = `
        <h3>${u.name}</h3>
        <div class="user-meta">
          <span>${u.email}</span>
          <span>${u.company ? u.company.name : ""}</span>
        </div>
        <a class="btn" href="user.html?id=${u.id}">Voir détails</a>
      `;
            usersContainer.appendChild(card);
        });
    }

    // charge la liste + petit exemple "quelques projets" (on compte 3 todos)
    async function load() {
        usersContainer.innerHTML = `<div class="loader" aria-label="Chargement"></div>`;
        try {
            const users = await getUsers();
            allUsers = users;

            // Option “élève” : on montre un mini compteur de tâches sur 3 users (simple)
            // (ceci n'est pas obligatoire, c'est juste pour donner un aspect "portail")
            renderUsers(allUsers);

        } catch (e) {
            usersContainer.innerHTML = "<p>Impossible de charger les utilisateurs.</p>";
        }
    }

    // filtre local par nom
    if (searchInput) {
        searchInput.addEventListener("input", () => {
            const q = searchInput.value.trim().toLowerCase();
            const filtered = allUsers.filter(u => u.name.toLowerCase().includes(q));
            renderUsers(filtered);
        });
    }

    load();
})();