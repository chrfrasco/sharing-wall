export const states = { 
  LOADING: Symbol("LOADING"),
  LOADED: Symbol("LOADED"),
  ERROR: Symbol("ERROR"),
};

export default {
  getQuotes() {
    return get("/api/quotes")
      .then(res => res.json())
      .then(({ quotes }) => quotes);
  },

  getMessage() {
    return get("/api/message")
      .then(r => r.text());
  }
};

function get(path) {
  return fetch(path)
    .catch(err => Promise.reject(err));
}
