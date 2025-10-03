(function () {
    const {qs, el, escapeHtml} = window.utils;
    const {getUser, getTodosByUser, createTodo} = window.api;

    const params = new URLSearchParams(window.location.search);
    const userId = params.get("id");

    const userInfoEl = qs("#user-info");
    const todosEl = qs("#todos");
    const todoSearch = qs("#todo-search");
    const form = qs("#todo-form");
    const titleInput = qs("#todo-title");
    const doneInput = qs("#todo-done");
    const formMsg = qs("#form-msg");

    let allTodos = [];

    async function loadUser() {
        if (!userId) {
            userInfoEl.innerHTML = "<p>Pas d'utilisateur (id manquant)</p>";
            return;
        }
        userInfoEl.innerHTML = "<p>Chargement des infos…</p>";
        try {
            const u = await getUser(userId);
            userInfoEl.innerHTML = `
        <strong>${u.name}</strong><br/>
        <span>${u.email}</span><br/>
        <span>${u.company ? u.company.name : ""}</span>
      `;
        } catch (e) {
            userInfoEl.innerHTML = "<p>Impossible de charger l'utilisateur</p>";
        }
    }

    async function loadTodos() {
        todosEl.innerHTML = `<div class="loader" aria-label="Chargement"></div>`;
        try {
            const list = await getTodosByUser(userId);
            allTodos = list;
            renderTodos(allTodos);
        } catch (e) {
            todosEl.innerHTML = "<p>Impossible de charger les tâches</p>";
        }
    }

    function renderTodos(list) {
        todosEl.innerHTML = "";
        if (!list.length) {
            todosEl.innerHTML = "<p>Aucune tâche trouvée.</p>";
            return;
        }
        list.forEach(t => {
            const card = el("article", "user-card");
            const status = t.completed ? "✅ terminée" : "🕓 en cours";
            card.innerHTML = `
        <h3 style="margin-bottom:6px;">${escapeHtml(t.title)}</h3>
        <p class="user-meta">Statut : ${status}</p>
      `;
            todosEl.appendChild(card);
        });
    }

    // filtre local (par titre)
    if (todoSearch) {
        todoSearch.addEventListener("input", () => {
            const q = todoSearch.value.toLowerCase();
            const filtered = allTodos.filter(t => t.title.toLowerCase().includes(q));
            renderTodos(filtered);
        });
    }

    // POST /todos (ajout tâche)
    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const title = titleInput.value.trim();
            const completed = !!(doneInput && doneInput.checked);
            formMsg.classList.add("hidden");

            if (!title) {
                // validation très simple (style débutant)
                formMsg.textContent = "Le titre est obligatoire.";
                formMsg.classList.remove("hidden");
                return;
            }

            // petit feedback visuel
            formMsg.textContent = "Envoi en cours…";
            formMsg.classList.remove("hidden");

            try {
                const created = await createTodo({userId: Number(userId), title, completed});
                // on ajoute en haut de la liste (effet visuel immédiat)
                allTodos = [{...created}, ...allTodos];
                renderTodos(allTodos);

                // reset du formulaire
                form.reset();
                formMsg.textContent = "Tâche ajoutée (simulation API) ✅";
            } catch (e) {
                formMsg.textContent = "Erreur lors de l'ajout de la tâche ❌";
            }
        });
    }

    loadUser();
    loadTodos();
})();