-- Active: 1706214722476@@127.0.0.1@3306
CREATE TABLE users (
  id TEXT PRIMARY KEY NOT NULL,
  nickname TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  -- role TEXT NOT NULL,
  created_at TEXT DEFAULT (DATETIME()) NOT NULL
);

SELECT * FROM users;

DROP TABLE users;

CREATE TABLE posts (
  id TEXT PRIMARY KEY UNIQUE NOT NULL,
  creator_id TEXT NOT NULL,
  content TEXT NOT NULL,
  likes INTEGER NOT NULL,
  dislikes INTEGER NOT NULL,
  created_at TEXT DEFAULT (DATETIME()) NOT NULL,
  updated_at TEXT DEFAULT (DATETIME()) NOT NULL,
  FOREIGN KEY (creator_id) REFERENCES users (id)
  ON UPDATE CASCADE
  ON DELETE CASCADE
);

CREATE TABLE coments (
  id TEXT PRIMARY KEY UNIQUE NOT NULL,
  creator_id TEXT NOT NULL,
  content TEXT NOT NULL,
  likes INTEGER NOT NULL,
  dislikes INTEGER NOT NULL,
  created_at TEXT DEFAULT (DATETIME()) NOT NULL,
  updated_at TEXT DEFAULT (DATETIME()) NOT NULL,
  FOREIGN KEY (creator_id) REFERENCES users (id)
  ON UPDATE CASCADE
  ON DELETE CASCADE
);

CREATE TABLE likes_dislikes (
  user_id TEXT NOT NULL,
  post_id TEXT NOT NULL,
  like INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users (id)
  ON UPDATE CASCADE
  ON DELETE CASCADE,
  FOREIGN KEY (post_id) REFERENCES posts (id)
  ON UPDATE CASCADE
  ON DELETE CASCADE,
  -- FOREIGN KEY (coments_id) REFERENCES coments (id)
  -- ON UPDATE CASCADE
  -- ON DELETE CASCADE
);

INSERT INTO users (id, nickname, email, password, role)
VALUES
  ('u001', 'João', 'joao@email.com', 'joao123', 'ADMIN'),
  ('u002', 'Bob', 'bob@email.com', 'bob123', 'NORMAL'),
  ('u003', 'Jack', 'jack@email.com', 'jack123', 'NORMAL');

INSERT INTO posts (id, creator_id, content, likes, dislikes )
VALUES
  ('p001', 'u002', 'conteúdo do post1', 0, 0),
  ('p002', 'u003', 'conteúdo do post2', 0, 0),
  ('p003', 'u001', 'conteúdo do post3', 0, 0);
