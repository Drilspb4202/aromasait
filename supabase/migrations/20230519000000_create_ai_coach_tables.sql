-- Create ai_coach_messages table
CREATE TABLE IF NOT EXISTS public.ai_coach_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    content TEXT NOT NULL,
    is_user BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create ai_coach_feedback table
CREATE TABLE IF NOT EXISTS public.ai_coach_feedback (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    message_id UUID REFERENCES public.ai_coach_messages(id),
    is_positive BOOLEAN NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create goals table
CREATE TABLE IF NOT EXISTS public.goals (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    title TEXT NOT NULL,
    description TEXT,
    progress INTEGER DEFAULT 0,
    category TEXT CHECK (category IN ('aromatherapy', 'nutrition', 'exercise', 'mindfulness')),
    due_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.ai_coach_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_coach_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;

-- Create policies for ai_coach_messages
CREATE POLICY "Users can view their own messages" ON public.ai_coach_messages
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own messages" ON public.ai_coach_messages
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policies for ai_coach_feedback
CREATE POLICY "Users can view their own feedback" ON public.ai_coach_feedback
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own feedback" ON public.ai_coach_feedback
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policies for goals
CREATE POLICY "Users can view their own goals" ON public.goals
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own goals" ON public.goals
    FOR ALL USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_ai_coach_messages_user_id ON public.ai_coach_messages(user_id);
CREATE INDEX idx_ai_coach_messages_created_at ON public.ai_coach_messages(created_at);
CREATE INDEX idx_ai_coach_feedback_user_id ON public.ai_coach_feedback(user_id);
CREATE INDEX idx_goals_user_id ON public.goals(user_id);
CREATE INDEX idx_goals_category ON public.goals(category);

-- Add trigger for updating goals.updated_at
CREATE OR REPLACE FUNCTION update_goals_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_goals_updated_at
    BEFORE UPDATE ON public.goals
    FOR EACH ROW
    EXECUTE FUNCTION update_goals_updated_at();

