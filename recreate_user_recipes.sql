-- Удаляем существующую таблицу и связанные объекты
DROP TABLE IF EXISTS user_recipes CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;

-- Создаем таблицу user_recipes заново
CREATE TABLE user_recipes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    oils JSONB NOT NULL,
    effect TEXT,
    mood TEXT[] DEFAULT '{}',
    time_of_day TEXT[] DEFAULT '{}',
    benefits TEXT[] DEFAULT '{}',
    category TEXT DEFAULT 'Пользовательский',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Включаем Row Level Security
ALTER TABLE user_recipes ENABLE ROW LEVEL SECURITY;

-- Создаем политики доступа
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

-- Создаем индексы для оптимизации запросов
CREATE INDEX user_recipes_user_id_idx ON user_recipes(user_id);
CREATE INDEX user_recipes_category_idx ON user_recipes(category);
CREATE INDEX user_recipes_created_at_idx ON user_recipes(created_at DESC);

-- Создаем триггер для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_recipes_updated_at
    BEFORE UPDATE ON user_recipes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 