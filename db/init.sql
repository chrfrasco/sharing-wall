CREATE TABLE IF NOT EXISTS "quote" (
  id       SERIAL PRIMARY KEY,
  body     TEXT NOT NULL,
  fullname TEXT NOT NULL,
  email    TEXT NOT NULL,
  country  TEXT NOT NULL,
  img      TEXT NOT NULL,
  quoteID  TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS "user" (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL,
  "hash" TEXT NOT NULL
);