let baseUrl = "";
if (process.env.NODE_ENV === "production") {
  baseUrl = "http://localhost:3001";
}

export default { getMessage, getQuotes };

function getQuotes() {
  return get("/api/quotes")
    .then(res => res.json())
    .then(({ quotes }) => quotes);
}

function getMessage() {
  return get("/api/message")
    .then(response => response.json())
    .then(({ msg }) => msg);
}

function get(path) {
  return fetch(`${baseUrl}${path}`);
}
