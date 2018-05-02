import { IS_PRODUCTION } from "./constants";

export const states = {
  LOADING: Symbol("LOADING"),
  LOADED: Symbol("LOADED"),
  ERROR: Symbol("ERROR"),
  NOT_FOUND: Symbol("NOT_FOUND"),
  NOT_STARTED: Symbol("NOT_STARTED")
};

export default {
  getQuote(quoteID) {
    return get(`/api/quote?quoteID=${quoteID}`);
  },

  getQuotes(limit = 20) {
    return get(`/api/quotes?limit=${limit}`);
  },

  getMessage() {
    return get("/api/message");
  },

  postQuote(quote) {
    return post("/api/quote", quote);
  }
};

function get(path) {
  return request(path);
}

function post(path, data) {
  return request(path, {
    body: JSON.stringify(data),
    headers: {
      "content-type": "application/json"
    },
    method: "POST"
  });
}

function request(...args) {
  return fetch(...args)
    .then(logResponse)
    .then(checkOK)
    .then(r => r.json());
}

function logResponse(r) {
  if (!IS_PRODUCTION) {
    console.log(`${r.url}: ${r.status} ${r.statusText}`);
  }
  return r;
}

function checkOK(r) {
  if (200 <= r.status && r.status < 300) {
    return r;
  }

  throw new Error(`${r.status} ${r.statusText}`);
}
