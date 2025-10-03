(function () {
    const { qs, el, escapeHtml } = window.utils;
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
            // Dans renderUsers(list), remplace l'intérieur de card.innerHTML par :
            card.innerHTML = `
          <h3>${u.name}</h3>
          <div class="user-meta">
            <span>${u.email}</span>
            <span>${u.company ? u.company.name : ""}</span>
          </div>
        
          <!-- Aperçu des 3 tâches max (chargées après) -->
          <ul class="todo-preview" data-user-id="${u.id}">
            <li class="muted">Chargement des tâches…</li>
          </ul>
          
          <!-- métriques: total + % terminées, rempli après via JS -->
          <div class="user-metrics" data-user-id="${u.id}">
            <span class="muted">Calcul en cours…</span>
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
            await prefetchTodosPreviews(allUsers);
            await fillUserMetrics(allUsers);

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



    async function prefetchTodosPreviews(users){
        // on les charge séquentiellement (simple et "safe" pour l'API)
        for (const u of users){
            const holder = document.querySelector(`.todo-preview[data-user-id="${u.id}"]`);
            if (!holder) continue;

            try{
                const todos = await getTodosByUser(u.id);
                // on prend 3 tâches (priorité aux non-terminées si possible)
                const sorted = [...todos].sort((a,b) => Number(a.completed) - Number(b.completed));
                const top3 = sorted.slice(0, 3);

                if (!top3.length){
                    holder.innerHTML = `<li class="muted">Aucune tâche</li>`;
                } else {
                    holder.innerHTML = top3
                        .map(t => `<li>${escapeHtml(t.title)} ${t.completed ? "✅" : "🕓"}</li>`)
                        .join("");
                }
            }catch(e){
                holder.innerHTML = `<li class="muted">Erreur de chargement</li>`;
            }
        }
    }

    // calcule total + % terminées par user et met à jour le DOM
    async function fillUserMetrics(users){
        for (const u of users){
            const holder = document.querySelector(`.user-metrics[data-user-id="${u.id}"]`);
            if (!holder) continue;

            // petit indicateur de chargement
            holder.innerHTML = `<span class="muted">Calcul en cours…</span>`;

            try {
                const todos = await getTodosByUser(u.id);
                const total = todos.length;
                const completed = todos.filter(t => t.completed).length;
                const pct = total ? Math.round((completed / total) * 100) : 0;

                // rendu simple + barre de progression
                holder.innerHTML = `
        <div class="metrics">
          <span><strong>${total}</strong> tâches · <strong>${pct}%</strong> terminées</span>
          <div class="bar"><span style="width:${pct}%"></span></div>
        </div>
      `;
            } catch (e) {
                holder.innerHTML = `<span class="muted">Erreur de calcul</span>`;
            }
        }
    }

    load();
})();