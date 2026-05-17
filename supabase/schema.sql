-- ============================================================
-- Run this in your Supabase SQL editor to set up the schema.
-- ============================================================

-- Topics
CREATE TABLE IF NOT EXISTS topics (
  id              TEXT PRIMARY KEY,
  name            TEXT NOT NULL,
  icon            TEXT NOT NULL DEFAULT '📚',
  display_order   INTEGER NOT NULL DEFAULT 0,
  description     TEXT NOT NULL DEFAULT '',
  keywords        JSONB NOT NULL DEFAULT '[]',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Questions
CREATE TABLE IF NOT EXISTS questions (
  id          TEXT PRIMARY KEY,
  topic_id    TEXT NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  company     TEXT NOT NULL DEFAULT '',
  source_file TEXT NOT NULL DEFAULT '',
  title       TEXT,
  content     TEXT NOT NULL DEFAULT '',
  has_answer  BOOLEAN NOT NULL DEFAULT FALSE,
  difficulty  TEXT NOT NULL DEFAULT 'medium'
                CHECK (difficulty IN ('easy', 'medium', 'hard')),
  oj_url      TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Guides
CREATE TABLE IF NOT EXISTS guides (
  id         TEXT PRIMARY KEY,
  title      TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Guide sections
CREATE TABLE IF NOT EXISTS guide_sections (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_id      TEXT NOT NULL REFERENCES guides(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  body          TEXT NOT NULL DEFAULT '',
  display_order INTEGER NOT NULL DEFAULT 0
);

-- Page views (analytics)
CREATE TABLE IF NOT EXISTS page_views (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ts         BIGINT NOT NULL,
  path       TEXT NOT NULL,
  ref        TEXT NOT NULL DEFAULT '',
  ua         TEXT NOT NULL DEFAULT '',
  sid        TEXT NOT NULL DEFAULT 'unknown',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_questions_topic_id ON questions(topic_id);
CREATE INDEX IF NOT EXISTS idx_page_views_ts      ON page_views(ts DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_sid     ON page_views(sid);
CREATE INDEX IF NOT EXISTS idx_page_views_path    ON page_views(path);

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE topics        ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions     ENABLE ROW LEVEL SECURITY;
ALTER TABLE guides        ENABLE ROW LEVEL SECURITY;
ALTER TABLE guide_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views    ENABLE ROW LEVEL SECURITY;

-- Public read for course content (safe — no user data)
DROP POLICY IF EXISTS "topics_public_read"         ON topics;
DROP POLICY IF EXISTS "questions_public_read"      ON questions;
DROP POLICY IF EXISTS "guides_public_read"         ON guides;
DROP POLICY IF EXISTS "guide_sections_public_read" ON guide_sections;

CREATE POLICY "topics_public_read"         ON topics         FOR SELECT USING (true);
CREATE POLICY "questions_public_read"      ON questions      FOR SELECT USING (true);
CREATE POLICY "guides_public_read"         ON guides         FOR SELECT USING (true);
CREATE POLICY "guide_sections_public_read" ON guide_sections FOR SELECT USING (true);

-- page_views: service role only (bypasses RLS automatically)
-- No anon read/write for analytics data.

-- ============================================================
-- Updated_at trigger helper
-- ============================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER topics_updated_at
  BEFORE UPDATE ON topics
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE TRIGGER questions_updated_at
  BEFORE UPDATE ON questions
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- User profiles (display name — defaults to email initial)
-- ============================================================

CREATE TABLE IF NOT EXISTS profiles (
  id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL DEFAULT '',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "profiles_deny_anon"   ON profiles;
DROP POLICY IF EXISTS "profiles_own_select"  ON profiles;
DROP POLICY IF EXISTS "profiles_own_insert"  ON profiles;
DROP POLICY IF EXISTS "profiles_own_update"  ON profiles;
CREATE POLICY "profiles_own_select" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_own_insert" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_own_update" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE OR REPLACE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- User progress (question completion)
-- ============================================================

CREATE TABLE IF NOT EXISTS user_progress (
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, question_id)
);

ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "user_progress_deny_anon"   ON user_progress;
DROP POLICY IF EXISTS "user_progress_own_select"  ON user_progress;
DROP POLICY IF EXISTS "user_progress_own_insert"  ON user_progress;
DROP POLICY IF EXISTS "user_progress_own_delete"  ON user_progress;
CREATE POLICY "user_progress_own_select" ON user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_progress_own_insert" ON user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_progress_own_delete" ON user_progress FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
