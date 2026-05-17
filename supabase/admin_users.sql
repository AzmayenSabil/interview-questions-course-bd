-- Run this in the Supabase SQL editor (or append to schema.sql and re-run).
-- Creates the admin_users table and inserts the initial admin record.

CREATE TABLE IF NOT EXISTS admin_users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  password_hash TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Lock down all public access; only the service-role key (server-side) can read/write.
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'admin_users' AND policyname = 'no_public_access'
  ) THEN
    CREATE POLICY no_public_access ON admin_users FOR ALL USING (false);
  END IF;
END $$;

-- Insert the initial admin (password: Azmbil1999, hashed with scrypt N=16384 r=8 p=1).
-- Re-running this file is safe — it skips the insert if any row already exists.
INSERT INTO admin_users (password_hash)
SELECT 'b7f088a8c44ccd0eb11db2efd5e467f8:0ebc5d218b9f741ed4cc97c023aaf65c71f45d4ff3a8123c4f42fd75f6dcf9d5dd85af1748dc0d073f173543a89d1a9e95ed888208193a72022a21ea06b6513f'
WHERE NOT EXISTS (SELECT 1 FROM admin_users);
