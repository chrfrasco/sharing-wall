export const states = {
  LOADING: Symbol("LOADING"),
  LOADED: Symbol("LOADED"),
  ERROR: Symbol("ERROR")
};

export default {
  getQuotes() {
    return get("/api/quotes")
      .then(res => res.json())
      .then(({ quotes }) => quotes);
  },

  getMessage() {
    return get("/api/message").then(r => r.text());
  },

  postQuote(quote) {
    return post("/api/quote", quote).then(r => r.json());
  }
};

function get(path) {
  return fetch(path).then(checkOK);
}

function post(path, data) {
  return fetch(path, {
    body: JSON.stringify(data),
    headers: {
      "content-type": "application/json"
    },
    method: "POST"
  }).then(checkOK);
}

/**
 *
 * @param {Response} r
 */
function checkOK(r) {
  if (r.ok) {
    return r;
  }

  throw new Error("server says: " + r.statusText);
}
