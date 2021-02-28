import { fromFetch } from "rxjs/fetch";
import { query, refreshQuery } from "rx-query";
import "./style.css";

let users$ = query("user", () =>
  fromFetch(
    `https://landro.dev/.netlify/functions/slow?url=https://api.github.com/users?per_page=5`,
    {
      selector: res => res.json()
    }
  )
);

const generateTemplate = data => {
  const content = data.data ? data.data : [];
  const retries = data.retries ? `Retries: ${data.retries}` : "";

  return `
    <h2>Status: ${data.status} ${retries}</h2>
    
    <ul>
      ${content
        .map(
          item =>
            `<li>
              <img src="${item.avatar_url}" width ="50" />${item.login}
            </li>`
        )
        .join("")}
    </ul>
  `;
};

const render = data => {
  document.querySelector(".users").innerHTML = generateTemplate(data);
};

users$.subscribe({
  next: result => render(result),
  complete: () => console.log("done")
});

globalThis.queryActions = {
  refresh() {
    refreshQuery("user");
  },

  broken() {
    let users$ = null;
  }
};
