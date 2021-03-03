import { fromFetch } from "rxjs/fetch";
import { query, refreshQuery, resetQueryCache } from "rx-query";
import "./style.css";

let users$;

const loadUsers = queryString => {
  const url =
    queryString === 7
      ? `https://brokenurl777`
      : `https://landro.dev/.netlify/functions/slow?url=https://api.github.com/users?per_page=`;
  users$ = query("user", queryString, qs =>
    fromFetch(url + qs, {
      selector: res => res.json()
    })
  );

  users$.subscribe({
    next: result => render(result),
    complete: () => console.log("done")
  });
};

loadUsers(5);

const generateTemplate = data => {
  const content = data.data ? data.data : [];
  const retries = data.retries ? `Retries: ${data.retries}` : "";

  return `
    <h2>Status: ${data.status} ${retries}</h2>

    ${data.error}
    <ul>
      ${content
        .map(
          ({ avatar_url, login, html_url }) =>
            `<li>
              <img src="${avatar_url}" width ="50" />${login} ${html_url}
            </li>`
        )
        .join("")}
    </ul>
  `;
};

const render = data => {
  document.querySelector(".users").innerHTML = generateTemplate(data);
};

globalThis.queryActions = {
  refresh() {
    refreshQuery("user", 5);
  },

  resetCache() {
    render({ status: "loading" });
    resetQueryCache();
    loadUsers(5);
  },

  loadTwenty() {
    loadUsers(20);
  },

  breakQuery() {
    loadUsers(7);
  }
};
