CREATE TABLE IF NOT EXISTS planned_meals (id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,recipe JSONB NOT NULL,meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner')),planned_date DATE NOT NULL,created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL);CREATE INDEX IF NOT EXISTS planned_meals_user_date_idx ON planned_meals(user_id, planned_date);ALTER TABLE planned_meals ENABLE ROW LEVEL SECURITY;CREATE POLICY planned_meals_select ON planned_meals FOR SELECT USING (auth.uid() = user_id);CREATE POLICY planned_meals_insert ON planned_meals FOR INSERT WITH CHECK (auth.uid() = user_id);CREATE POLICY planned_meals_delete ON planned_meals FOR DELETE USING (auth.uid() = user_id);
