/*
# Seed the expense tracker with sample records

1. Data Changes
- Add two example expenses so the tracker opens with a useful initial state.
- The rows are inserted only when matching sample records do not already exist.

2. Security
- No security settings are changed.

3. Important Notes
- This seed is idempotent and will not duplicate the sample records when re-applied.
*/

INSERT INTO public.expenses (title, amount)
SELECT 'Кава', 80
WHERE NOT EXISTS (
  SELECT 1 FROM public.expenses WHERE title = 'Кава' AND amount = 80
);

INSERT INTO public.expenses (title, amount)
SELECT 'Інтернет', 300
WHERE NOT EXISTS (
  SELECT 1 FROM public.expenses WHERE title = 'Інтернет' AND amount = 300
);
