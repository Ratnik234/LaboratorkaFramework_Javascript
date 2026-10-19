/*
# Create expenses table for the shared expense tracker

1. New Tables
- `expenses`
- `id` (uuid, primary key): unique expense identifier.
- `title` (text): human-readable expense name.
- `amount` (numeric): positive amount in Ukrainian hryvnia.
- `created_at` (timestamptz): creation time used for newest-first ordering.

2. Security
- Row Level Security is enabled.
- The app has no sign-in screen, so anon and authenticated roles receive CRUD access to this intentionally shared tracker data.

3. Important Notes
- Amounts are constrained to positive values.
- This migration is idempotent and safe to re-run.
*/

CREATE TABLE IF NOT EXISTS public.expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL CHECK (char_length(btrim(title)) BETWEEN 1 AND 120),
  amount numeric(12, 2) NOT NULL CHECK (amount > 0),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Shared expenses are readable" ON public.expenses;
CREATE POLICY "Shared expenses are readable"
  ON public.expenses FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Shared expenses are insertable" ON public.expenses;
CREATE POLICY "Shared expenses are insertable"
  ON public.expenses FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Shared expenses are updatable" ON public.expenses;
CREATE POLICY "Shared expenses are updatable"
  ON public.expenses FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Shared expenses are deletable" ON public.expenses;
CREATE POLICY "Shared expenses are deletable"
  ON public.expenses FOR DELETE
  TO anon, authenticated
  USING (true);
