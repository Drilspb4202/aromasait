-- Удаляем существующую таблицу и связанные объекты
DROP TABLE IF EXISTS recipes CASCADE;

-- Создаем таблицу для предустановленных рецептов
CREATE TABLE recipes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    oils JSONB NOT NULL,
    effect TEXT,
    mood TEXT[] DEFAULT '{}',
    time_of_day TEXT[] DEFAULT '{}',
    benefits TEXT[] DEFAULT '{}',
    category TEXT DEFAULT 'Рекомендованные',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Включаем Row Level Security
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

-- Создаем политику для чтения всеми пользователями
CREATE POLICY "Anyone can view recipes"
ON recipes FOR SELECT
TO authenticated
USING (true);

-- Создаем политику для администраторов (если понадобится в будущем)
CREATE POLICY "Only admins can modify recipes"
ON recipes
USING (auth.uid() IN (SELECT user_id FROM admin_users))
WITH CHECK (auth.uid() IN (SELECT user_id FROM admin_users));

-- Создаем индексы для оптимизации запросов
CREATE INDEX recipes_category_idx ON recipes(category);
CREATE INDEX recipes_created_at_idx ON recipes(created_at DESC);
CREATE INDEX recipes_mood_idx ON recipes USING GIN (mood);
CREATE INDEX recipes_time_of_day_idx ON recipes USING GIN (time_of_day);

-- Создаем триггер для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_recipes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_recipes_updated_at
    BEFORE UPDATE ON recipes
    FOR EACH ROW
    EXECUTE FUNCTION update_recipes_updated_at();

-- Вставляем предустановленные рецепты
INSERT INTO recipes (name, oils, effect, mood, time_of_day, benefits, category) VALUES
-- Утренние рецепты
(
  'Энергия рассвета',
  '[{"name":"Лимон","amount":3,"color":"#FFD700","description":"Освежающий цитрусовый аромат","icon":"🍋"},{"name":"Розмарин","amount":2,"color":"#90EE90","description":"Травяной, бодрящий аромат","icon":"🌿"},{"name":"Мята","amount":1,"color":"#98FF98","description":"Свежий, прохладный аромат","icon":"🌱"}]'::jsonb,
  'Бодрящий аромат для энергичного начала дня',
  ARRAY['бодрость', 'энергия', 'концентрация'],
  ARRAY['morning'],
  ARRAY['тонизирующий', 'освежающий', 'стимулирующий'],
  'Рекомендованные'
),
(
  'Утренняя медитация',
  '[{"name":"Лаванда","amount":2,"color":"#E6E6FA","description":"Успокаивающий цветочный аромат","icon":"💜"},{"name":"Бергамот","amount":2,"color":"#98FB98","description":"Цитрусовый, освежающий аромат","icon":"🍊"}]'::jsonb,
  'Гармоничное сочетание для спокойного утра',
  ARRAY['спокойствие', 'гармония'],
  ARRAY['morning'],
  ARRAY['успокаивающий', 'балансирующий'],
  'Рекомендованные'
),

-- Дневные рецепты
(
  'Рабочий настрой',
  '[{"name":"Розмарин","amount":2,"color":"#90EE90","description":"Травяной, бодрящий аромат","icon":"🌿"},{"name":"Лимон","amount":2,"color":"#FFD700","description":"Освежающий цитрусовый аромат","icon":"🍋"},{"name":"Базилик","amount":1,"color":"#32CD32","description":"Пряный, освежающий аромат","icon":"🌿"}]'::jsonb,
  'Повышает концентрацию и работоспособность',
  ARRAY['концентрация', 'продуктивность'],
  ARRAY['afternoon'],
  ARRAY['стимулирующий', 'тонизирующий'],
  'Рекомендованные'
),
(
  'Творческий полет',
  '[{"name":"Бергамот","amount":2,"color":"#98FB98","description":"Цитрусовый, освежающий аромат","icon":"🍊"},{"name":"Иланг-иланг","amount":1,"color":"#DDA0DD","description":"Экзотический цветочный аромат","icon":"🌺"}]'::jsonb,
  'Вдохновляющий аромат для творческой работы',
  ARRAY['вдохновение', 'радость'],
  ARRAY['afternoon'],
  ARRAY['вдохновляющий', 'поднимающий настроение'],
  'Рекомендованные'
),

-- Вечерние рецепты
(
  'Вечерняя гармония',
  '[{"name":"Лаванда","amount":2,"color":"#E6E6FA","description":"Успокаивающий цветочный аромат","icon":"💜"},{"name":"Ромашка","amount":2,"color":"#FFFF00","description":"Нежный травяной аромат","icon":"🌼"}]'::jsonb,
  'Помогает расслабиться после рабочего дня',
  ARRAY['спокойствие', 'расслабление'],
  ARRAY['evening'],
  ARRAY['расслабляющий', 'успокаивающий'],
  'Рекомендованные'
),
(
  'Романтический вечер',
  '[{"name":"Иланг-иланг","amount":2,"color":"#DDA0DD","description":"Экзотический цветочный аромат","icon":"🌺"},{"name":"Жасмин","amount":1,"color":"#FFF0F5","description":"Чувственный цветочный аромат","icon":"🌸"},{"name":"Роза","amount":1,"color":"#FF69B4","description":"Глубокий цветочный аромат","icon":"🌹"}]'::jsonb,
  'Создает романтическую атмосферу',
  ARRAY['романтика', 'чувственность'],
  ARRAY['evening'],
  ARRAY['чувственный', 'гармонизирующий'],
  'Рекомендованные'
),

-- Ночные рецепты
(
  'Сладкие сны',
  '[{"name":"Лаванда","amount":3,"color":"#E6E6FA","description":"Успокаивающий цветочный аромат","icon":"💜"},{"name":"Ромашка","amount":2,"color":"#FFFF00","description":"Нежный травяной аромат","icon":"🌼"},{"name":"Ваниль","amount":1,"color":"#F5DEB3","description":"Теплый, сладкий аромат","icon":"🍶"}]'::jsonb,
  'Способствует глубокому и спокойному сну',
  ARRAY['спокойствие', 'умиротворение'],
  ARRAY['night'],
  ARRAY['успокаивающий', 'расслабляющий'],
  'Рекомендованные'
),
(
  'Ночная медитация',
  '[{"name":"Сандал","amount":2,"color":"#DEB887","description":"Древесный, землистый аромат","icon":"🌳"},{"name":"Ладан","amount":2,"color":"#CD853F","description":"Глубокий, духовный аромат","icon":"✨"}]'::jsonb,
  'Помогает достичь глубокой медитации',
  ARRAY['медитация', 'духовность'],
  ARRAY['night'],
  ARRAY['медитативный', 'заземляющий'],
  'Рекомендованные'
),

-- Рецепты по настроению
(
  'Цитрусовая радость',
  '[{"name":"Апельсин","amount":3,"color":"#FFA500","description":"Сладкий цитрусовый аромат","icon":"🍊"},{"name":"Грейпфрут","amount":2,"color":"#FF6347","description":"Свежий цитрусовый аромат","icon":"🍊"},{"name":"Лимон","amount":1,"color":"#FFD700","description":"Освежающий цитрусовый аромат","icon":"🍋"}]'::jsonb,
  'Поднимает настроение и заряжает позитивом',
  ARRAY['радость', 'бодрость'],
  ARRAY['morning', 'afternoon'],
  ARRAY['антидепрессивный', 'тонизирующий'],
  'По настроению'
),
(
  'Лесное спокойствие',
  '[{"name":"Кедр","amount":2,"color":"#8B4513","description":"Древесный, землистый аромат","icon":"🌲"},{"name":"Пихта","amount":2,"color":"#228B22","description":"Хвойный, свежий аромат","icon":"🌲"},{"name":"Можжевельник","amount":1,"color":"#006400","description":"Терпкий, лесной аромат","icon":"🌿"}]'::jsonb,
  'Создает атмосферу леса и умиротворения',
  ARRAY['спокойствие', 'гармония'],
  ARRAY['afternoon', 'evening'],
  ARRAY['успокаивающий', 'заземляющий'],
  'По настроению'
); 