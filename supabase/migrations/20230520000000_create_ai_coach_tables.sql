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

-- Create ai_coach_sessions table
CREATE TABLE IF NOT EXISTS public.ai_coach_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  ended_at TIMESTAMP WITH TIME ZONE,
  session_summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.ai_coach_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_coach_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_coach_sessions ENABLE ROW LEVEL SECURITY;

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

-- Create policies for ai_coach_sessions
CREATE POLICY "Users can view their own sessions" ON public.ai_coach_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own sessions" ON public.ai_coach_sessions
  FOR ALL USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_ai_coach_messages_user_id ON public.ai_coach_messages(user_id);
CREATE INDEX idx_ai_coach_messages_created_at ON public.ai_coach_messages(created_at);
CREATE INDEX idx_ai_coach_feedback_user_id ON public.ai_coach_feedback(user_id);
CREATE INDEX idx_ai_coach_sessions_user_id ON public.ai_coach_sessions(user_id);

