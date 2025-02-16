-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create recipes table
CREATE TABLE IF NOT EXISTS public.recipes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    image TEXT,
    prep_time INTEGER,
    cook_time INTEGER,
    difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
    category TEXT,
    ingredients JSONB,
    instructions JSONB,
    nutritional_info JSONB,
    rating FLOAT DEFAULT 0,
    user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create favorite_recipes table for managing user favorites
CREATE TABLE IF NOT EXISTS public.favorite_recipes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    recipe_id UUID REFERENCES public.recipes(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id, recipe_id)
);

-- Create planned_meals table
CREATE TABLE IF NOT EXISTS public.planned_meals (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    recipe JSONB NOT NULL,
    planned_date DATE NOT NULL,
    meal_type TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorite_recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.planned_meals ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view all recipes" ON public.recipes
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own recipes" ON public.recipes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own recipes" ON public.recipes
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own recipes" ON public.recipes
    FOR DELETE USING (auth.uid() = user_id);

-- Policies for favorite_recipes
CREATE POLICY "Users can view their own favorites" ON public.favorite_recipes
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own favorites" ON public.favorite_recipes
    FOR ALL USING (auth.uid() = user_id);

-- Policies for planned_meals
CREATE POLICY "Users can view their own planned meals" 
    ON public.planned_meals
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own planned meals" 
    ON public.planned_meals
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own planned meals" 
    ON public.planned_meals
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own planned meals" 
    ON public.planned_meals
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_recipes_user_id ON public.recipes(user_id);
CREATE INDEX idx_recipes_category ON public.recipes(category);
CREATE INDEX idx_favorite_recipes_user_id ON public.favorite_recipes(user_id);
CREATE INDEX idx_favorite_recipes_recipe_id ON public.favorite_recipes(recipe_id);
CREATE INDEX idx_planned_meals_user_id ON public.planned_meals(user_id);
CREATE INDEX idx_planned_meals_planned_date ON public.planned_meals(planned_date);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_recipes_updated_at
    BEFORE UPDATE ON public.recipes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

