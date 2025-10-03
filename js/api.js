(function(){
    const BASE = "https://jsonplaceholder.typicode.com";

    async function fetchJson(url, options){
        // petit try/catch pour éviter de crasher
        try{
            const res = await fetch(url, options);
            if(!res.ok) throw new Error("HTTP " + res.status);
            return await res.json();
        }catch(err){
            console.error("API error:", err);
            throw err; // on relance pour que l'appelant gère l'erreur
        }
    }

    // GET /users
    function getUsers(){
        return fetchJson(`${BASE}/users`);
    }

    // GET /users/:id
    function getUser(id){
        return fetchJson(`${BASE}/users/${id}`);
    }

    // GET /todos?userId=ID
    function getTodosByUser(userId){
        return fetchJson(`${BASE}/todos?userId=${userId}`);
    }

    // POST /todos (titre + userId + completed)
    function createTodo({ userId, title, completed }){
        return fetchJson(`${BASE}/todos`, {
            method: "POST",
            headers: { "Content-Type": "application/json; charset=UTF-8" },
            body: JSON.stringify({ userId, title, completed: !!completed })
        });
    }

    // export global
    window.api = { getUsers, getUser, getTodosByUser, createTodo };
})();