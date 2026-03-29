CREATE TABLE boards (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL
);

CREATE TABLE lists (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  board_id INTEGER REFERENCES boards(id) ON DELETE CASCADE,
  position INTEGER
);

CREATE TABLE cards (
  id SERIAL PRIMARY KEY,
  title TEXT,
  description TEXT,
  list_id INTEGER REFERENCES lists(id) ON DELETE CASCADE,
  position INTEGER
);