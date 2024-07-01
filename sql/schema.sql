CREATE TABLE IF NOT EXISTS notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  status_id INTEGER,
  notebook_id INTEGER,
  content TEXT NOT NULL,
  title TEXT NOT NULL,
  created_at TEXT NOT NULL,
  modified_at TEXT NOT NULL,
  published_at TEXT,
  event_id TEXT
);

CREATE TABLE IF NOT EXISTS tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  color TEXT,
  icon TEXT,
  created_at TEXT NOT NULL,
  UNIQUE (name)
);

CREATE TABLE IF NOT EXISTS note_tags (
  note_id INTEGER,
  tag_id INTEGER,
  PRIMARY KEY (note_id, tag_id),
  FOREIGN KEY (note_id) REFERENCES notes (id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS notebooks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  created_at TEXT NOT NULL,
  UNIQUE (name)
);

CREATE TABLE IF NOT EXISTS trash (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  note_id INTEGER,
  content TEXT NOT NULL,
  title TEXT NOT NULL,
  created_at TEXT NOT NULL,
  trashed_at TEXT NOT NULL,
  tags TEXT, -- Field to store tags
  FOREIGN KEY (note_id) REFERENCES notes (id) ON DELETE CASCADE
);

CREATE VIRTUAL TABLE IF NOT EXISTS notes_fts USING fts5 (
  content,
  notebook_id UNINDEXED,
  created_at UNINDEXED,
  modified_at UNINDEXED
);

CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT);

CREATE INDEX IF NOT EXISTS idx_notes_created_at ON notes (created_at);

CREATE INDEX IF NOT EXISTS idx_notes_modified_at ON notes (modified_at);

CREATE INDEX IF NOT EXISTS idx_tags_name ON tags (name);

CREATE INDEX IF NOT EXISTS idx_tags_created_at ON tags (created_at);

CREATE INDEX IF NOT EXISTS idx_settings_key ON settings (key);
