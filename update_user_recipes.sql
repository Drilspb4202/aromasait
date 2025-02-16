-- Добавляем недостающие колонки в таблицу user_recipes
ALTER TABLE user_recipes
ADD COLUMN IF NOT EXISTS benefits text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS mood text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS time_of_day text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS category text DEFAULT 'Пользовательский';

-- Обновляем RLS политики
ALTER TABLE user_recipes ENABLE ROW LEVEL SECURITY;

-- Удаляем существующие политики
DROP POLICY IF EXISTS "Users can view their own recipes" ON user_recipes;
DROP POLICY IF EXISTS "Users can insert their own recipes" ON user_recipes;
DROP POLICY IF EXISTS "Users can update their own recipes" ON user_recipes;
DROP POLICY IF EXISTS "Users can delete their own recipes" ON user_recipes;

-- Создаем новые политики
CREATE POLICY "Users can view their own recipes"
ON user_recipes FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own recipes"
ON user_recipes FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own recipes"
ON user_recipes FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own recipes"
ON user_recipes FOR DELETE
TO authenticated
USING (auth.uid() = user_id); 