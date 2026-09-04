CREATE TABLE meditation_sessions (
  id TEXT PRIMARY KEY NOT NULL,
  title TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  completed_at TEXT,
  created_at TEXT NOT NULL
);
CREATE INDEX idx_meditation_sessions_created_at ON meditation_sessions(created_at);
